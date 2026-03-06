import { useAppStore } from '../store'
import { FileText, GraduationCap, Code, Palette, ChevronDown, ChevronRight } from 'lucide-react'
import { presetTemplates, getCustomTemplate } from '../templates'
import { useState } from 'react'
import { useI18n } from '../i18n'

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
  const { t } = useI18n()

  const templateNameMap: Record<string, string> = {
    default: t.templates.default,
    academic: t.templates.academic,
    tech: t.templates.tech,
    custom: t.templates.custom,
  }

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Template Selection */}
      <div className="p-4 border-b border-gray-200">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{t.stylePanel.templateSelection}</div>
        <div className="grid grid-cols-2 gap-2">
          {templates.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => setCurrentTemplate(tpl.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                currentTemplate.id === tpl.id
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {iconMap[tpl.icon]}
              {templateNameMap[tpl.id] || tpl.name}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Config Area */}
      <div className="flex-1 overflow-y-auto">
        <Section title={t.stylePanel.bodyStyle}>
          <Field label={t.stylePanel.font}>
            <SmallSelect value={s.fontFamily} onChange={(v) => updateStyles({ fontFamily: v })}>
              <option value='"Microsoft YaHei", "微软雅黑", sans-serif'>{t.stylePanel.fontMsYahei}</option>
              <option value='"Times New Roman", "SimSun", "宋体", serif'>{t.stylePanel.fontTimesNewRoman}</option>
              <option value='"Arial", "Helvetica Neue", Helvetica, sans-serif'>{t.stylePanel.fontArial}</option>
              <option value='-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'>{t.stylePanel.fontSystemSansSerif}</option>
              <option value='"SimSun", "宋体", serif'>{t.stylePanel.fontSimsun}</option>
            </SmallSelect>
          </Field>
          <Field label={t.stylePanel.fontSize}>
            <SmallInput type="number" value={s.fontSize} onChange={(e) => updateStyles({ fontSize: Number(e.target.value) })} className="w-16" min={8} max={24} />
            <span className="text-xs text-gray-400">pt</span>
          </Field>
          <Field label={t.stylePanel.color}>
            <ColorInput value={s.fontColor} onChange={(v) => updateStyles({ fontColor: v })} />
          </Field>
          <Field label={t.stylePanel.lineHeight}>
            <SmallInput type="number" value={s.lineHeight} onChange={(e) => updateStyles({ lineHeight: Number(e.target.value) })} className="w-16" min={1} max={3} step={0.1} />
          </Field>
          <Field label={t.stylePanel.paragraphSpacing}>
            <SmallInput type="number" value={s.paragraphSpacing} onChange={(e) => updateStyles({ paragraphSpacing: Number(e.target.value) })} className="w-16" min={0} max={36} step={1} />
            <span className="text-xs text-gray-400">pt</span>
          </Field>
        </Section>

        {(['h1', 'h2', 'h3', 'h4'] as const).map((level) => {
          const hs = s[level]
          return (
            <Section key={level} title={`${level.toUpperCase()} ${t.stylePanel.heading}`} defaultOpen={level === 'h1'}>
              <Field label={t.stylePanel.fontSize}>
                <SmallInput type="number" value={hs.fontSize} onChange={(e) => updateHeadingStyle(level, { fontSize: Number(e.target.value) })} className="w-16" min={10} max={36} />
                <span className="text-xs text-gray-400">pt</span>
              </Field>
              <Field label={t.stylePanel.weight}>
                <SmallSelect value={hs.bold ? 'bold' : 'normal'} onChange={(v) => updateHeadingStyle(level, { bold: v === 'bold' })}>
                  <option value="bold">{t.stylePanel.bold}</option>
                  <option value="normal">{t.stylePanel.normal}</option>
                </SmallSelect>
              </Field>
              <Field label={t.stylePanel.color}>
                <ColorInput value={hs.color} onChange={(v) => updateHeadingStyle(level, { color: v })} />
              </Field>
              <Field label={t.stylePanel.align}>
                <SmallSelect value={hs.align} onChange={(v) => updateHeadingStyle(level, { align: v })}>
                  <option value="left">{t.stylePanel.left}</option>
                  <option value="center">{t.stylePanel.center}</option>
                  <option value="right">{t.stylePanel.right}</option>
                </SmallSelect>
              </Field>
              <Field label={t.stylePanel.marginTop}>
                <SmallInput type="number" value={hs.marginTop} onChange={(e) => updateHeadingStyle(level, { marginTop: Number(e.target.value) })} className="w-16" min={0} max={36} step={1} />
                <span className="text-xs text-gray-400">pt</span>
              </Field>
              <Field label={t.stylePanel.marginBottom}>
                <SmallInput type="number" value={hs.marginBottom} onChange={(e) => updateHeadingStyle(level, { marginBottom: Number(e.target.value) })} className="w-16" min={0} max={36} step={1} />
                <span className="text-xs text-gray-400">pt</span>
              </Field>
            </Section>
          )
        })}

        <Section title={t.stylePanel.tableStyle} defaultOpen={false}>
          <Field label={t.stylePanel.borderColor}>
            <ColorInput value={s.table.borderColor} onChange={(v) => updateTableStyle({ borderColor: v })} />
          </Field>
          <Field label={t.stylePanel.borderMode}>
            <SmallSelect value={s.table.borderMode} onChange={(v) => updateTableStyle({ borderMode: v })}>
              <option value="all">{t.stylePanel.allBorders}</option>
              <option value="horizontal">{t.stylePanel.horizontalOnly}</option>
            </SmallSelect>
          </Field>
          <Field label={t.stylePanel.headerBg}>
            <ColorInput value={s.table.headerBg === 'transparent' ? '#ffffff' : s.table.headerBg} onChange={(v) => updateTableStyle({ headerBg: v })} />
          </Field>
          <Field label={t.stylePanel.headerBold}>
            <SmallSelect value={s.table.headerBold ? 'yes' : 'no'} onChange={(v) => updateTableStyle({ headerBold: v === 'yes' })}>
              <option value="yes">{t.stylePanel.yes}</option>
              <option value="no">{t.stylePanel.no}</option>
            </SmallSelect>
          </Field>
          <Field label={t.stylePanel.headerColor}>
            <ColorInput value={s.table.headerColor} onChange={(v) => updateTableStyle({ headerColor: v })} />
          </Field>
        </Section>

        <Section title={t.stylePanel.codeBlock} defaultOpen={false}>
          <Field label={t.stylePanel.codeFont}>
            <SmallSelect value={s.code.fontFamily} onChange={(v) => updateCodeStyle({ fontFamily: v })}>
              <option value='Consolas, Monaco, "Courier New", monospace'>Consolas</option>
              <option value='Monaco, Consolas, monospace'>Monaco</option>
              <option value='"Fira Code", Consolas, monospace'>Fira Code</option>
            </SmallSelect>
          </Field>
          <Field label={t.stylePanel.fontSize}>
            <SmallInput type="number" value={s.code.fontSize} onChange={(e) => updateCodeStyle({ fontSize: Number(e.target.value) })} className="w-16" min={8} max={18} />
            <span className="text-xs text-gray-400">pt</span>
          </Field>
          <Field label={t.stylePanel.codeBgColor}>
            <ColorInput value={s.code.bgColor} onChange={(v) => updateCodeStyle({ bgColor: v })} />
          </Field>
          <Field label={t.stylePanel.codeBorder}>
            <SmallSelect value={s.code.border ? 'yes' : 'no'} onChange={(v) => updateCodeStyle({ border: v === 'yes' })}>
              <option value="yes">{t.stylePanel.withBorder}</option>
              <option value="no">{t.stylePanel.noBorder}</option>
            </SmallSelect>
          </Field>
        </Section>

        <Section title={t.stylePanel.separator} defaultOpen={false}>
          <Field label={t.stylePanel.separatorType}>
            <SmallSelect value={s.separator.lineType} onChange={(v) => updateSeparatorStyle({ lineType: v })}>
              <option value="solid">{t.stylePanel.solid}</option>
              <option value="dashed">{t.stylePanel.dashed}</option>
              <option value="dotted">{t.stylePanel.dotted}</option>
            </SmallSelect>
          </Field>
          <Field label={t.stylePanel.color}>
            <ColorInput value={s.separator.color} onChange={(v) => updateSeparatorStyle({ color: v })} />
          </Field>
          <Field label={t.stylePanel.thickness}>
            <SmallInput type="number" value={s.separator.thickness} onChange={(e) => updateSeparatorStyle({ thickness: Number(e.target.value) })} className="w-16" min={1} max={5} />
            <span className="text-xs text-gray-400">px</span>
          </Field>
        </Section>

        <Section title={t.stylePanel.page} defaultOpen={false}>
          <Field label={t.stylePanel.pageMargin}>
            <SmallInput type="number" value={s.pageMargin} onChange={(e) => updateStyles({ pageMargin: Number(e.target.value) })} className="w-16" min={10} max={40} step={0.1} />
            <span className="text-xs text-gray-400">mm</span>
          </Field>
          <Field label={t.stylePanel.themeColor}>
            <ColorInput value={s.themeColor} onChange={(v) => updateStyles({ themeColor: v })} />
          </Field>
        </Section>
      </div>
    </div>
  )
}
