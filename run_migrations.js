const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
  host: 'aws-0-eu-west-1.pooler.supabase.com',
  port: 5432,
  user: 'postgres.qxivwyyompzpipfzcufl',
  password: 'Danielmiracle101##',
  database: 'postgres',
  ssl: false,
  statement_timeout: 30000,
});

function splitStatements(sql) {
  const statements = [];
  let current = '';
  let inDollarQuote = false;
  let dollarTag = '';

  for (let i = 0; i < sql.length; i++) {
    const ch = sql[i];
    if (ch === '$') {
      let tag = '$';
      let j = i + 1;
      while (j < sql.length && sql[j] === '$') { tag += '$'; j++; }
      let after = '';
      let k = j;
      while (k < sql.length && /[a-zA-Z_]/.test(sql[k])) { after += sql[k]; k++; }
      const fullTag = tag + after;
      if (!inDollarQuote) {
        inDollarQuote = true;
        dollarTag = fullTag;
        current += fullTag;
        i += fullTag.length - 1;
        continue;
      } else {
        if (fullTag === dollarTag) {
          inDollarQuote = false;
          current += fullTag;
          i += fullTag.length - 1;
          dollarTag = '';
          continue;
        }
      }
    }
    if (ch === ';' && !inDollarQuote) {
      current += ';';
      const trimmed = current.trim();
      const stripped = trimmed.replace(/^--.*$/gm, '').trim();
      if (stripped) {
        statements.push(trimmed);
      }
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim()) {
    const stripped = current.trim().replace(/^--.*$/gm, '').trim();
    if (stripped) {
      statements.push(current.trim());
    }
  }
  return statements;
}

async function runMigration(filePath, name) {
  const sql = fs.readFileSync(filePath, 'utf8');
  const statements = splitStatements(sql);
  let ok = 0, fail = 0;
  for (const stmt of statements) {
    try {
      await client.query(stmt);
      ok++;
    } catch(e) {
      console.log(`  ERR [${name}]:`, e.message.substring(0, 200));
      fail++;
    }
  }
  console.log(`${name}: ${ok} OK, ${fail} FAILED`);
}

async function main() {
  const args = process.argv.slice(2);
  const migrationsDir = path.join(__dirname, 'supabase', 'migrations');

  await client.connect();
  console.log('Connected');

  if (args.length > 0) {
    for (const arg of args) {
      const file = fs.readdirSync(migrationsDir).find(f => f.startsWith(arg));
      if (file) {
        await runMigration(path.join(migrationsDir, file), file.replace('.sql', ''));
      } else {
        console.log(`Migration ${arg} not found`);
      }
    }
  } else {
    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
    for (const file of files) {
      await runMigration(path.join(migrationsDir, file), file.replace('.sql', ''));
    }
  }

  await client.end();
  console.log('Done');
}

main().catch(e => { console.error(e); process.exit(1); });
