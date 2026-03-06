import { create } from 'zustand'
import { Template, TemplateStyles, presetTemplates, getCustomTemplate, saveCustomTemplate } from '../templates'
import { messages } from '../i18n/locales'

interface AppState {
  markdown: string
  setMarkdown: (md: string) => void

  currentSampleKey: 'zh' | 'en' | null
  setSampleMarkdown: (locale: 'zh' | 'en') => void

  currentTemplate: Template
  setCurrentTemplate: (id: string) => void
  updateStyles: (styles: Partial<TemplateStyles>) => void
  updateHeadingStyle: (level: 'h1' | 'h2' | 'h3' | 'h4', updates: Record<string, unknown>) => void
  updateTableStyle: (updates: Record<string, unknown>) => void
  updateCodeStyle: (updates: Record<string, unknown>) => void
  updateSeparatorStyle: (updates: Record<string, unknown>) => void

  zoom: number
  setZoom: (zoom: number) => void
}

const allTemplates = [...presetTemplates, getCustomTemplate()]

function detectInitialLocale(): 'zh' | 'en' {
  const saved = localStorage.getItem('md2doc-locale')
  if (saved === 'zh' || saved === 'en') return saved
  const lang = navigator.language || ''
  return lang.startsWith('zh') ? 'zh' : 'en'
}

const initialLocale = detectInitialLocale()

export const useAppStore = create<AppState>((set, get) => ({
  markdown: messages[initialLocale].sampleMarkdown,
  setMarkdown: (md) => set({ markdown: md, currentSampleKey: null }),

  currentSampleKey: initialLocale,
  setSampleMarkdown: (locale) => {
    const { currentSampleKey, markdown } = get()
    if (currentSampleKey !== null) {
      const currentSample = messages[currentSampleKey].sampleMarkdown
      if (markdown === currentSample || markdown.trim() === '') {
        set({ markdown: messages[locale].sampleMarkdown, currentSampleKey: locale })
        return
      }
    }
    set({ currentSampleKey: null })
  },

  currentTemplate: allTemplates[0],
  setCurrentTemplate: (id) => {
    const all = [...presetTemplates, getCustomTemplate()]
    const found = all.find((t) => t.id === id)
    if (found) set({ currentTemplate: found })
  },

  updateStyles: (updates) => {
    const { currentTemplate } = get()
    const newTemplate = {
      ...currentTemplate,
      styles: { ...currentTemplate.styles, ...updates },
    }
    if (currentTemplate.id === 'custom') {
      saveCustomTemplate(newTemplate)
    }
    set({ currentTemplate: newTemplate })
  },

  updateHeadingStyle: (level, updates) => {
    const { currentTemplate } = get()
    const newTemplate = {
      ...currentTemplate,
      styles: {
        ...currentTemplate.styles,
        [level]: { ...currentTemplate.styles[level], ...updates },
      },
    }
    if (currentTemplate.id === 'custom') {
      saveCustomTemplate(newTemplate)
    }
    set({ currentTemplate: newTemplate })
  },

  updateTableStyle: (updates) => {
    const { currentTemplate } = get()
    const newTemplate = {
      ...currentTemplate,
      styles: {
        ...currentTemplate.styles,
        table: { ...currentTemplate.styles.table, ...updates },
      },
    }
    if (currentTemplate.id === 'custom') {
      saveCustomTemplate(newTemplate)
    }
    set({ currentTemplate: newTemplate })
  },

  updateCodeStyle: (updates) => {
    const { currentTemplate } = get()
    const newTemplate = {
      ...currentTemplate,
      styles: {
        ...currentTemplate.styles,
        code: { ...currentTemplate.styles.code, ...updates },
      },
    }
    if (currentTemplate.id === 'custom') {
      saveCustomTemplate(newTemplate)
    }
    set({ currentTemplate: newTemplate })
  },

  updateSeparatorStyle: (updates) => {
    const { currentTemplate } = get()
    const newTemplate = {
      ...currentTemplate,
      styles: {
        ...currentTemplate.styles,
        separator: { ...currentTemplate.styles.separator, ...updates },
      },
    }
    if (currentTemplate.id === 'custom') {
      saveCustomTemplate(newTemplate)
    }
    set({ currentTemplate: newTemplate })
  },

  zoom: 100,
  setZoom: (zoom) => set({ zoom: Math.max(50, Math.min(200, zoom)) }),
}))
