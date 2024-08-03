import { NETWORKS } from "@/app/utils/config";
import { createClient } from "@libsql/client";
import { join } from "path";

export async function dbClient(network: NETWORKS = "mainnet") {
  const dbPath = join(process.cwd(), "src/db", `${network}.db`);
  const db = createClient({
    url: `file:${dbPath}`,
  });

  const create = await db.execute(`
    CREATE TABLE IF NOT EXISTS blocks (
        blockNr     INTEGER     PRIMARY KEY,
        baseFee     REAL,
        txCount     INTEGER,
        min         REAL,
        max         REAL,
        avg         REAL,
        median      REAL,
        ethPrice    REAL,
        gasLimit    REAL,
        gasUsed     REAL,
        date        TEXT,
        timestamp   INTEGER
    )`);

  return db;
}

export async function getLatestBlock(network: NETWORKS = "mainnet") {
  const db = await dbClient(network);
  const { rows: blocks } = await db.execute(
    "SELECT * FROM blocks ORDER BY blockNr DESC LIMIT 1"
  );
  return blocks[0];
}

export async function getAverage(network: NETWORKS = "mainnet") {
  const db = await dbClient(network);
  const { rows } = await db.execute(`
    SELECT 
      strftime('%Y-%m-%dT%H:00:00+00:00', datetime(timestamp, 'unixepoch')) AS period,
      AVG(baseFee) AS baseFee,
      AVG(gasLimit) AS gasLimit,
      AVG(gasUsed) AS gasUsed,
      AVG(min) AS min,
      AVG(median) AS median,
      AVG(ethPrice) AS ethPrice
    FROM 
      blocks
    WHERE 
      timestamp >= (strftime('%s', 'now') - 604800)
    GROUP BY 
      strftime('%Y-%m-%dT%H', datetime(timestamp, 'unixepoch'))
    ORDER BY 
      strftime('%Y-%m-%dT%H', datetime(timestamp, 'unixepoch')) DESC;
  `);

  return rows
}
