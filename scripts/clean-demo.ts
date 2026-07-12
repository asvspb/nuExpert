import fs from 'fs'
import path from 'path'
import postgres from 'postgres'

const cwd = process.cwd()

console.log('Очистка демо-кода...')

const filesToRemove = [
  'app/pages/demo',
  'app/components/demo',
  'server/api/demo',
  'server/database/demo-schema.ts',
  'shared/schemas/demo.ts',
  'tests/e2e/demo.spec.ts'
]

// 1. Remove files
for (const file of filesToRemove) {
  const fullPath = path.join(cwd, file)
  if (fs.existsSync(fullPath)) {
    fs.rmSync(fullPath, { recursive: true, force: true })
    console.log(`Удалено: ${file}`)
  }
}

// 2. Revert index.vue to minimal Hello World
const indexTemplate = `<template>
  <div class="max-w-4xl mx-auto space-y-6 text-center pt-24">
    <h1 class="text-4xl font-bold">Hello World</h1>
    <p class="text-gray-500">nuExpert framework is ready.</p>
  </div>
</template>
`
fs.writeFileSync(path.join(cwd, 'app/pages/index.vue'), indexTemplate)
console.log('Восстановлен: app/pages/index.vue')

// 3. Drop table from DB directly
let dbUrl = 'postgresql://postgres:postgres@localhost:5435/nuexpert'
const envPath = path.join(cwd, '.env')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  const match = envContent.match(/^DATABASE_URL=(.*)$/m)
  if (match) {
    dbUrl = match[1].trim()
  }
}

try {
  console.log('Удаление таблицы demo_metrics из БД...')
  const sql = postgres(dbUrl)
  await sql`DROP TABLE IF EXISTS demo_metrics`
  await sql.end()
  console.log('Таблица demo_metrics удалена.')
} catch {
  console.error('Не удалось удалить таблицу из БД (убедитесь, что БД запущена).')
}

// 4. Clean up drizzle config
const drizzleConfigPath = path.join(cwd, 'drizzle.config.ts')
if (fs.existsSync(drizzleConfigPath)) {
  let content = fs.readFileSync(drizzleConfigPath, 'utf8')
  content = content.replace("['./server/database/schema.ts', './server/database/demo-schema.ts']", "'./server/database/schema.ts'")
  fs.writeFileSync(drizzleConfigPath, content)
  console.log('Обновлен: drizzle.config.ts')
}

// 5. Clean up migrations
const migrationsPath = path.join(cwd, 'server/database/migrations')
if (fs.existsSync(migrationsPath)) {
  const files = fs.readdirSync(migrationsPath)
  for (const file of files) {
    if (file.includes('demo_metrics')) {
      fs.rmSync(path.join(migrationsPath, file))
      console.log(`Удален файл миграции: ${file}`)
    }
  }
  const metaPath = path.join(migrationsPath, 'meta')
  if (fs.existsSync(metaPath)) {
    const metaFiles = fs.readdirSync(metaPath)
    for (const file of metaFiles) {
      if (file.includes('demo_metrics')) {
        fs.rmSync(path.join(metaPath, file))
      }
    }
    const journalPath = path.join(metaPath, '_journal.json')
    if (fs.existsSync(journalPath)) {
      const journal = JSON.parse(fs.readFileSync(journalPath, 'utf8'))
      journal.entries = journal.entries.filter((e: { tag: string }) => !e.tag.includes('demo_metrics'))
      fs.writeFileSync(journalPath, JSON.stringify(journal, null, 2))
    }
  }
}

// 6. Clean up package.json
const packageJsonPath = path.join(cwd, 'package.json')
if (fs.existsSync(packageJsonPath)) {
  const pkgContent = fs.readFileSync(packageJsonPath, 'utf8')
  // Automatically detect indent (default to 2 spaces)
  const indentMatch = pkgContent.match(/^[ \t]+/m)
  const indent = indentMatch ? indentMatch[0] : 2
  
  const pkg = JSON.parse(pkgContent)
  let changed = false
  if (pkg.scripts && pkg.scripts['clean:demo']) {
    delete pkg.scripts['clean:demo']
    changed = true
    console.log('Удален скрипт clean:demo из package.json')
  }
  
  if (pkg.dependencies) {
    if (pkg.dependencies['@unovis/ts']) { delete pkg.dependencies['@unovis/ts']; changed = true }
    if (pkg.dependencies['@unovis/vue']) { delete pkg.dependencies['@unovis/vue']; changed = true }
  }
  if (pkg.devDependencies) {
    if (pkg.devDependencies['@iconify-json/heroicons']) { delete pkg.devDependencies['@iconify-json/heroicons']; changed = true }
  }
  
  if (changed) {
    fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, indent) + '\\n')
    console.log('Удалены демо-зависимости (@unovis, @iconify-json/heroicons)')
  }
}

// 7. Self-delete
console.log('\\n✅ Очистка завершена! Демо-код полностью удалён.')
console.log('Самоудаление clean-demo.ts...')
fs.rmSync(path.join(cwd, 'scripts/clean-demo.ts'))
try {
  const scriptsDir = path.join(cwd, 'scripts')
  if (fs.readdirSync(scriptsDir).length === 0) {
    fs.rmdirSync(scriptsDir)
    console.log('Удалена пустая директория scripts/')
  }
} catch {
  // ignore if failed or not empty
}
