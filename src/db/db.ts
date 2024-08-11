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

export async function cleanup(network: NETWORKS = "mainnet") {
  const db = await dbClient(network);
  // const emptyRecords = await db.execute("DELETE FROM blocks WHERE min = 0 AND max = 0 AND avg = 0 AND median = 0;");
  // console.log("DELETE Empty records", network, emptyRecords.rowsAffected);

  // 30 days = 2592000
  // 14 days = 1209600
  // 1 week = 604800
  const result = await db.execute(
    "DELETE FROM blocks WHERE timestamp < (strftime('%s', 'now') - 1209600);"
  );
  console.log("Cleanup", network, result.rowsAffected);
  return true;
}

export async function getLatestBlock(network: NETWORKS = "mainnet") {
  const db = await dbClient(network);
  const { rows: blocks } = await db.execute(
    "SELECT * FROM blocks ORDER BY blockNr DESC LIMIT 1"
  );
  return blocks[0];
}

export async function getHistory(network: NETWORKS = "mainnet", limit: number = 50) {
  const db = await dbClient(network);
  const { rows } = await db.execute(
    `SELECT * FROM blocks ORDER BY blockNr DESC LIMIT ${limit}`
  );
  return rows;
}

export async function getAverage(network: NETWORKS = "mainnet") {
  const db = await dbClient(network);
  const { rows } = await db.execute(`
    SELECT 
      strftime('%Y-%m-%dT%H:00:00+00:00', datetime(timestamp, 'unixepoch')) AS period,
      AVG(baseFee) AS baseFee,
      AVG(gasLimit) AS gasLimit,
      AVG(gasUsed) AS gasUsed,
      AVG(txCount) AS txCount,
      AVG(min) AS min,
      AVG(median) AS median,
      AVG(max) AS max,
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

  return rows;
}
