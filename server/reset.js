import { initializeDatabase, pool, query } from './db.js'

if (!process.argv.includes('--yes')) {
  console.log('这会删除所有 yougu_* 表并重新写入种子数据。')
  console.log('确认后运行：node server/reset.js --yes')
  await pool.end()
  process.exit(1)
}

const tables = await query(
  `SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE 'yougu_%'`,
)

for (const row of tables.rows) {
  await query(`DROP TABLE IF EXISTS "${row.tablename}" CASCADE`)
}

await initializeDatabase()
console.log(`[db] reset complete, dropped ${tables.rowCount} tables and reseeded`)
await pool.end()
