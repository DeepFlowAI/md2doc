import { useMemo, useState } from 'react'
import { useAppStore } from '../store'
import { renderMarkdown } from '../utils/markdown'
import { generatePreviewCSS } from '../utils/styles'
import { exportToWord, exportToPDF } from '../utils/export'
import { Eye, Minus, Plus, Download } from 'lucide-react'

export default function Preview() {
  const { markdown, currentTemplate, zoom, setZoom } = useAppStore()
  const s = currentTemplate.styles
  const [exporting, setExporting] = useState<string | null>(null)

  const html = useMemo(() => renderMarkdown(markdown), [markdown])
  const css = useMemo(() => generatePreviewCSS(s), [s])

  const handleExportWord = async () => {
    setExporting('word')
    try {
      await exportToWord(markdown, s)
    } catch (e) {
      alert('导出 Word 失败：' + (e as Error).message)
    } finally {
      setExporting(null)
    }
  }

  const handleExportPDF = async () => {
    setExporting('pdf')
    try {
      await exportToPDF(markdown, s)
    } catch (e) {
      alert('导出 PDF 失败：' + (e as Error).message)
    } finally {
      setExporting(null)
    }
  }

  return (
    <div className="flex flex-col h-full min-w-0 overflow-hidden bg-gray-100">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Eye size={16} className="text-gray-500" />
          实时预览
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-gray-100 rounded-md px-1 py-0.5">
            <button onClick={() => setZoom(zoom - 10)} className="p-1 rounded hover:bg-gray-200 text-gray-600 transition-colors">
              <Minus size={14} />
            </button>
            <span className="text-xs text-gray-600 w-10 text-center font-medium">{zoom}%</span>
            <button onClick={() => setZoom(zoom + 10)} className="p-1 rounded hover:bg-gray-200 text-gray-600 transition-colors">
              <Plus size={14} />
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleExportWord}
              disabled={exporting !== null}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md shadow-sm transition-colors disabled:opacity-50"
              title="导出 Word"
            >
              <Download size={14} />
              {exporting === 'word' ? '导出中...' : 'Word'}
            </button>
            <button
              onClick={handleExportPDF}
              disabled={exporting !== null}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md shadow-sm transition-colors disabled:opacity-50"
              title="导出 PDF"
            >
              <Download size={14} />
              {exporting === 'pdf' ? '导出中...' : 'PDF'}
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 min-w-0 overflow-auto p-6 min-h-0">
        <div className="flex justify-center min-h-full">
          <div
            className="bg-white shadow-lg"
            style={{
              width: `${210 * (zoom / 100)}mm`,
              maxWidth: '100%',
              minHeight: `${297 * (zoom / 100)}mm`,
            }}
          >
            <style>{css}</style>
            <div
              className="preview-content"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
