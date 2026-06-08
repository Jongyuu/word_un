import * as fs from 'fs'
import * as path from 'path'

interface BuildStats {
  totalSize: number
  jsSize: number
  cssSize: number
  htmlSize: number
  fileCount: number
}

async function checkPerformance() {
  console.log('⚡ Word Universe - 性能检查\n')

  const distPath = path.join(process.cwd(), 'dist')

  // 检查 dist 目录是否存在
  if (!fs.existsSync(distPath)) {
    console.log('❌ dist 目录不存在')
    console.log('请先运行: npm run build\n')
    return
  }

  console.log('📊 构建产物分析\n')

  // 统计文件大小
  const stats: BuildStats = {
    totalSize: 0,
    jsSize: 0,
    cssSize: 0,
    htmlSize: 0,
    fileCount: 0
  }

  function getFilesRecursively(dir: string): string[] {
    const files: string[] = []
    const items = fs.readdirSync(dir)

    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        files.push(...getFilesRecursively(fullPath))
      } else {
        files.push(fullPath)
      }
    }

    return files
  }

  const files = getFilesRecursively(distPath)

  for (const file of files) {
    const stat = fs.statSync(file)
    const size = stat.size
    stats.totalSize += size
    stats.fileCount++

    const ext = path.extname(file)
    if (ext === '.js') stats.jsSize += size
    else if (ext === '.css') stats.cssSize += size
    else if (ext === '.html') stats.htmlSize += size
  }

  // 格式化文件大小
  function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  console.log('📦 文件大小统计:')
  console.log(`  总大小: ${formatSize(stats.totalSize)}`)
  console.log(`  JS: ${formatSize(stats.jsSize)} (${((stats.jsSize / stats.totalSize) * 100).toFixed(1)}%)`)
  console.log(`  CSS: ${formatSize(stats.cssSize)} (${((stats.cssSize / stats.totalSize) * 100).toFixed(1)}%)`)
  console.log(`  HTML: ${formatSize(stats.htmlSize)} (${((stats.htmlSize / stats.totalSize) * 100).toFixed(1)}%)`)
  console.log(`  文件数量: ${stats.fileCount}`)

  console.log('\n' + '='.repeat(50))

  // 性能建议
  console.log('\n💡 性能建议:\n')

  const jsSizeMB = stats.jsSize / (1024 * 1024)
  const cssSizeMB = stats.cssSize / (1024 * 1024)

  if (jsSizeMB > 1) {
    console.log('⚠️  JS 文件较大 (>1MB)，建议：')
    console.log('   - 检查是否有未使用的依赖')
    console.log('   - 考虑代码分割和懒加载')
    console.log('   - 使用动态导入减少初始加载')
  } else {
    console.log('✅ JS 文件大小合理')
  }

  if (cssSizeMB > 0.1) {
    console.log('⚠️  CSS 文件较大 (>100KB)，建议：')
    console.log('   - 检查是否有未使用的样式')
    console.log('   - 考虑使用 PurgeCSS 移除无用样式')
  } else {
    console.log('✅ CSS 文件大小合理')
  }

  console.log('\n' + '='.repeat(50))

  // 最大文件检查
  console.log('\n📈 最大的文件 (Top 5):\n')

  const filesWithSize = files.map(file => ({
    path: path.relative(distPath, file),
    size: fs.statSync(file).size
  })).sort((a, b) => b.size - a.size)

  filesWithSize.slice(0, 5).forEach((file, index) => {
    console.log(`  ${index + 1}. ${file.path} - ${formatSize(file.size)}`)
  })

  console.log('\n✨ 性能检查完成！\n')
}

checkPerformance()
