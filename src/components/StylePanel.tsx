import { useAppStore } from '../store'
import { FileText, GraduationCap, Code, Palette, ChevronDown, ChevronRight } from 'lucide-react'
import { presetTemplates, getCustomTemplate } from '../templates'
import { useState } from 'react'

const iconMap: Record<string, React.ReactNode> = {
  'file-text': <FileText size={16} />,
  'graduation-cap': <GraduationCap size={16} />,
  'code': <Code size={16} />,
  'palette': <Palette size={16} />,
}

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:bg-gray-50"
      >
        {title}
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>
      {open && <div className="px-4 pb-3 space-y-2.5">{children}</div>}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <label className="text-xs text-gray-600 whitespace-nowrap shrink-0">{label}</label>
      <div className="flex items-center gap-1.5">{children}</div>
    </div>
  )
}

function SmallInput({ type = 'text', value, onChange, className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      className={`h-7 px-2 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:border-teal-500 ${className}`}
      {...props}
    />
  )
}

function SmallSelect({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-7 px-1 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:border-teal-500"
    >
      {children}
    </select>
  )
}

function ColorInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-1">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-7 h-7 p-0.5 border border-gray-300 rounded cursor-pointer"
      />
    </div>
  )
}

export default function StylePanel() {
  const { currentTemplate, setCurrentTemplate, updateStyles, updateHeadingStyle, updateTableStyle, updateCodeStyle, updateSeparatorStyle } = useAppStore()
  const s = currentTemplate.styles
  const templates = [...presetTemplates, getCustomTemplate()]

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Template Selection */}
      <div className="p-4 border-b border-gray-200">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">模板选择</div>
        <div className="grid grid-cols-2 gap-2">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => setCurrentTemplate(t.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                currentTemplate.id === t.id
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {iconMap[t.icon]}
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Config Area */}
      <div className="flex-1 overflow-y-auto">
        <Section title="正文样式">
          <Field label="字体">
            <SmallSelect value={s.fontFamily} onChange={(v) => updateStyles({ fontFamily: v })}>
              <option value='"Microsoft YaHei", "微软雅黑", sans-serif'>微软雅黑</option>
              <option value='"Times New Roman", "SimSun", "宋体", serif'>Times New Roman</option>
              <option value='-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'>系统无衬线</option>
              <option value='"SimSun", "宋体", serif'>宋体</option>
            </SmallSelect>
          </Field>
          <Field label="字号">
            <SmallInput type="number" value={s.fontSize} onChange={(e) => updateStyles({ fontSize: Number(e.target.value) })} className="w-16" min={8} max={24} />
            <span className="text-xs text-gray-400">pt</span>
          </Field>
          <Field label="颜色">
            <ColorInput value={s.fontColor} onChange={(v) => updateStyles({ fontColor: v })} />
          </Field>
          <Field label="行高">
            <SmallInput type="number" value={s.lineHeight} onChange={(e) => updateStyles({ lineHeight: Number(e.target.value) })} className="w-16" min={1} max={3} step={0.1} />
          </Field>
          <Field label="段落间距">
            <SmallInput type="number" value={s.paragraphSpacing} onChange={(e) => updateStyles({ paragraphSpacing: Number(e.target.value) })} className="w-16" min={0} max={36} step={1} />
            <span className="text-xs text-gray-400">pt</span>
          </Field>
        </Section>

        {(['h1', 'h2', 'h3', 'h4'] as const).map((level) => {
          const labels = { h1: 'H1 标题', h2: 'H2 标题', h3: 'H3 标题', h4: 'H4 标题' }
          const hs = s[level]
          return (
            <Section key={level} title={labels[level]} defaultOpen={level === 'h1'}>
              <Field label="字号">
                <SmallInput type="number" value={hs.fontSize} onChange={(e) => updateHeadingStyle(level, { fontSize: Number(e.target.value) })} className="w-16" min={10} max={36} />
                <span className="text-xs text-gray-400">pt</span>
              </Field>
              <Field label="粗细">
                <SmallSelect value={hs.bold ? 'bold' : 'normal'} onChange={(v) => updateHeadingStyle(level, { bold: v === 'bold' })}>
                  <option value="bold">加粗</option>
                  <option value="normal">正常</option>
                </SmallSelect>
              </Field>
              <Field label="颜色">
                <ColorInput value={hs.color} onChange={(v) => updateHeadingStyle(level, { color: v })} />
              </Field>
              <Field label="对齐">
                <SmallSelect value={hs.align} onChange={(v) => updateHeadingStyle(level, { align: v })}>
                  <option value="left">左对齐</option>
                  <option value="center">居中</option>
                  <option value="right">右对齐</option>
                </SmallSelect>
              </Field>
              <Field label="上间距">
                <SmallInput type="number" value={hs.marginTop} onChange={(e) => updateHeadingStyle(level, { marginTop: Number(e.target.value) })} className="w-16" min={0} max={36} step={1} />
                <span className="text-xs text-gray-400">pt</span>
              </Field>
              <Field label="下间距">
                <SmallInput type="number" value={hs.marginBottom} onChange={(e) => updateHeadingStyle(level, { marginBottom: Number(e.target.value) })} className="w-16" min={0} max={36} step={1} />
                <span className="text-xs text-gray-400">pt</span>
              </Field>
            </Section>
          )
        })}

        <Section title="表格样式" defaultOpen={false}>
          <Field label="边框颜色">
            <ColorInput value={s.table.borderColor} onChange={(v) => updateTableStyle({ borderColor: v })} />
          </Field>
          <Field label="边框模式">
            <SmallSelect value={s.table.borderMode} onChange={(v) => updateTableStyle({ borderMode: v })}>
              <option value="all">全部边框</option>
              <option value="horizontal">仅横线</option>
            </SmallSelect>
          </Field>
          <Field label="表头背景">
            <ColorInput value={s.table.headerBg === 'transparent' ? '#ffffff' : s.table.headerBg} onChange={(v) => updateTableStyle({ headerBg: v })} />
          </Field>
          <Field label="表头加粗">
            <SmallSelect value={s.table.headerBold ? 'yes' : 'no'} onChange={(v) => updateTableStyle({ headerBold: v === 'yes' })}>
              <option value="yes">是</option>
              <option value="no">否</option>
            </SmallSelect>
          </Field>
          <Field label="表头颜色">
            <ColorInput value={s.table.headerColor} onChange={(v) => updateTableStyle({ headerColor: v })} />
          </Field>
        </Section>

        <Section title="代码块" defaultOpen={false}>
          <Field label="字体">
            <SmallSelect value={s.code.fontFamily} onChange={(v) => updateCodeStyle({ fontFamily: v })}>
              <option value='Consolas, Monaco, "Courier New", monospace'>Consolas</option>
              <option value='Monaco, Consolas, monospace'>Monaco</option>
              <option value='"Fira Code", Consolas, monospace'>Fira Code</option>
            </SmallSelect>
          </Field>
          <Field label="字号">
            <SmallInput type="number" value={s.code.fontSize} onChange={(e) => updateCodeStyle({ fontSize: Number(e.target.value) })} className="w-16" min={8} max={18} />
            <span className="text-xs text-gray-400">pt</span>
          </Field>
          <Field label="背景色">
            <ColorInput value={s.code.bgColor} onChange={(v) => updateCodeStyle({ bgColor: v })} />
          </Field>
          <Field label="边框">
            <SmallSelect value={s.code.border ? 'yes' : 'no'} onChange={(v) => updateCodeStyle({ border: v === 'yes' })}>
              <option value="yes">有边框</option>
              <option value="no">无边框</option>
            </SmallSelect>
          </Field>
        </Section>

        <Section title="分隔线" defaultOpen={false}>
          <Field label="类型">
            <SmallSelect value={s.separator.lineType} onChange={(v) => updateSeparatorStyle({ lineType: v })}>
              <option value="solid">实线</option>
              <option value="dashed">虚线</option>
              <option value="dotted">点线</option>
            </SmallSelect>
          </Field>
          <Field label="颜色">
            <ColorInput value={s.separator.color} onChange={(v) => updateSeparatorStyle({ color: v })} />
          </Field>
          <Field label="粗细">
            <SmallInput type="number" value={s.separator.thickness} onChange={(e) => updateSeparatorStyle({ thickness: Number(e.target.value) })} className="w-16" min={1} max={5} />
            <span className="text-xs text-gray-400">px</span>
          </Field>
        </Section>

        <Section title="页面" defaultOpen={false}>
          <Field label="页边距">
            <SmallInput type="number" value={s.pageMargin} onChange={(e) => updateStyles({ pageMargin: Number(e.target.value) })} className="w-16" min={10} max={40} step={0.1} />
            <span className="text-xs text-gray-400">mm</span>
          </Field>
          <Field label="主题色">
            <ColorInput value={s.themeColor} onChange={(v) => updateStyles({ themeColor: v })} />
          </Field>
        </Section>
      </div>
    </div>
  )
}
