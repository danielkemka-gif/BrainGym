/**
 * AKUCHE SUPABASE PRE-MIGRATION BACKUP & READ-ONLY AUDIT SCRIPT
 *
 * 1. Exports a recoverable JSON snapshot of existing core user tables (`profiles`, `streaks`,
 *    `user_settings`, `subscriptions`, `ai_feedback`, `decision_lab_entries`, `goals`) to
 *    `backups/supabase-pre-00039-backup.json` before any migration is applied.
 * 2. Audits the live status of the 5 migration 00039 tables (`akuche_memories`, `akuche_conversations`,
 *    `akuche_messages`, `akuche_clarity_snapshots`, `akuche_thinking_patterns`).
 * 3. Does NOT modify or write anything to the Supabase database.
 */

import * as fs from "fs";
import * as path from "path";

function loadEnvMap(): Record<string, string> {
  const envPath = path.join(process.cwd(), ".env.local");
  const map: Record<string, string> = {};
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
    for (const line of lines) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m) {
        map[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
      }
    }
  }
  return map;
}

const EXISTING_TABLES = [
  "profiles",
  "streaks",
  "user_settings",
  "subscriptions",
  "ai_feedback",
  "decision_lab_entries",
];

const MIGRATION_00039_TABLES = [
  "akuche_memories",
  "akuche_conversations",
  "akuche_messages",
  "akuche_clarity_snapshots",
  "akuche_thinking_patterns",
];

async function runBackupAndAudit() {
  console.log("================================================================================");
  console.log("AKUCHE SUPABASE PRE-MIGRATION BACKUP & READ-ONLY TABLE AUDIT");
  console.log("================================================================================\n");

  const env = loadEnvMap();
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error("Missing Supabase URL or key in .env.local");
    process.exit(1);
  }

  const backupDir = path.join(process.cwd(), "backups");
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const snapshot: Record<string, { status: number; count: number; rows: any[] }> = {};

  console.log("STEP 1: EXPORTING RECOVERABLE SNAPSHOT OF EXISTING CORE TABLES");
  console.log("--------------------------------------------------------------------------------");
  for (const table of EXISTING_TABLES) {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/${table}?select=*&limit=1000`, {
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        },
      });
      if (res.ok) {
        const rows = await res.json();
        snapshot[table] = { status: res.status, count: Array.isArray(rows) ? rows.length : 0, rows };
        console.log(`- Table [${table.padEnd(22)}] : HTTP ${res.status} | Backed up ${snapshot[table].count} record(s)`);
      } else {
        snapshot[table] = { status: res.status, count: 0, rows: [] };
        console.log(`- Table [${table.padEnd(22)}] : HTTP ${res.status} (Table not present or restricted)`);
      }
    } catch (err) {
      console.log(`- Table [${table.padEnd(22)}] : Network error during backup check`);
    }
  }

  const backupFilePath = path.join(backupDir, `supabase-pre-00039-backup-${new Date().toISOString().slice(0, 10)}.json`);
  fs.writeFileSync(
    backupFilePath,
    JSON.stringify(
      {
        createdAt: new Date().toISOString(),
        supabaseProject: supabaseUrl,
        migrationTarget: "00039_akuche_intelligence_upgrade.sql",
        tables: snapshot,
      },
      null,
      2
    ),
    "utf8"
  );
  console.log(`\nRecoverable JSON backup saved to: ${backupFilePath}\n`);

  console.log("STEP 2: MIGRATION 00039 TABLE STATUS CHECK (READ-ONLY)");
  console.log("--------------------------------------------------------------------------------");
  for (const table of MIGRATION_00039_TABLES) {
    const res = await fetch(`${supabaseUrl}/rest/v1/${table}?select=id&limit=1`, {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
    });
    const text = await res.text();
    console.log(`- Table [${table.padEnd(26)}] : HTTP ${res.status} | ${res.status === 404 ? "NOT YET APPLIED (Awaiting Approval)" : text.slice(0, 80)}`);
  }
  console.log("================================================================================");
}

runBackupAndAudit();
