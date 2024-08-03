import { NETWORKS } from "@/app/utils/config";
import { createClient as supabaseClient } from "@supabase/supabase-js";
import { dbClient } from "./db";
import dayjs from "dayjs";
import dotenv from "dotenv";

dotenv.config();

run();

async function run() {
  await migrate("mainnet");
  await migrate("optimism");
}

async function migrate(network: NETWORKS = "mainnet") {
  console.log("Init Sqlite db..");
  const sqliteDb = await dbClient(network);

  const { rows: blocks } = await sqliteDb.execute("SELECT * FROM blocks");
  console.log("Existing Blocks", blocks.length);

  console.log("Init Supabase client..");
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    throw new Error("SUPABASE_URL or SUPABASE_KEY env variables are not set.");
  }
  const db = supabaseClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  const { data, error } = await db
    .from(network)
    .select("*")
    .limit(100000)
    .order("blockNr", { ascending: false });

  if (error) {
    console.error("Error:", error);
    throw new Error(error.message);
  }

  console.log("Data Format", data[0]);
  const map = data.map((row) => ({
    sql: "INSERT INTO blocks VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    args: [
      row.blockNr,
      row.baseFee,
      row.txCount,
      row.min,
      row.max,
      row.avg,
      row.median,
      row.ethPrice,
      row.gasLimit,
      row.gasUsed,
      row.created_at,
      dayjs(row.created_at).unix(),
    ],
  }));

  console.log("Batch Insert", map.length);
  const result = await sqliteDb.batch(map, "write");
  // console.log("Batch Result", result);
}
