import { useMemo, useState, useEffect, useRef, useCallback } from 'react'
import { useAppStore } from '../store'
import { renderMarkdown } from '../utils/markdown'
import { generatePreviewCSS } from '../utils/styles'
import { exportToWord, exportToPDF } from '../utils/export'
import { Eye, Minus, Plus, Download } from 'lucide-react'
import { useI18n } from '../i18n'
import mermaid from 'mermaid'

mermaid.initialize({ startOnLoad: false, theme: 'default', securityLevel: 'loose' })

export default function Preview() {
  const { markdown, currentTemplate, zoom, setZoom } = useAppStore()
  const s = currentTemplate.styles
  const [exporting, setExporting] = useState<string | null>(null)
  const { t } = useI18n()
  const previewRef = useRef<HTMLDivElement>(null)

  const html = useMemo(() => renderMarkdown(markdown), [markdown])
  const css = useMemo(() => generatePreviewCSS(s), [s])

  const mermaidCacheRef = useRef<Map<string, string>>(new Map())

  const renderMermaidDiagrams = useCallback(async (container: HTMLElement) => {
    const nodes = container.querySelectorAll<HTMLElement>('.mermaid')
    if (nodes.length === 0) return
    const cache = mermaidCacheRef.current
    for (const node of nodes) {
      if (node.querySelector('svg')) continue
      const code = node.textContent?.trim() || ''
      if (!code) continue
      if (cache.has(code)) {
        node.innerHTML = cache.get(code)!
        continue
      }
      const id = `mermaid-${Math.random().toString(36).slice(2, 10)}`
      try {
        const { svg } = await mermaid.render(id, code)
        cache.set(code, svg)
        node.innerHTML = svg
      } catch {
        node.innerHTML = `<pre class="mermaid-error" style="color:#e53e3e;font-size:12px;padding:8px;">[Mermaid] Render error</pre>`
      }
    }
  }, [])

  useEffect(() => {
    if (previewRef.current) {
      renderMermaidDiagrams(previewRef.current)
    }
  }, [html, css, renderMermaidDiagrams])

  const handleExportWord = async () => {
    setExporting('word')
    try {
      await exportToWord(markdown, s)
    } catch (e) {
      alert(t.preview.exportWordFail + (e as Error).message)
    } finally {
      setExporting(null)
    }
  }

  const handleExportPDF = async () => {
    setExporting('pdf')
    try {
      await exportToPDF(markdown, s)
    } catch (e) {
      alert(t.preview.exportPDFFail + (e as Error).message)
    } finally {
      setExporting(null)
    }
  }

  return (
    <div className="flex flex-col h-full min-w-0 overflow-hidden bg-gray-100">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Eye size={16} className="text-gray-500" />
          {t.preview.title}
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
              title={t.preview.exportWord}
            >
              <Download size={14} />
              {exporting === 'word' ? t.preview.exporting : 'Word'}
            </button>
            <button
              onClick={handleExportPDF}
              disabled={exporting !== null}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md shadow-sm transition-colors disabled:opacity-50"
              title={t.preview.exportPDF}
            >
              <Download size={14} />
              {exporting === 'pdf' ? t.preview.exporting : 'PDF'}
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 min-w-0 overflow-auto p-2 min-h-0">
        <div className="flex justify-center min-h-full pt-2">
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
              ref={previewRef}
              className="preview-content"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
