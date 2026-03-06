import { createContext, useContext, useState, useCallback, useEffect, createElement, type ReactNode } from 'react'
import { type Locale, type Messages, messages } from './locales'
import { useAppStore } from '../store'

const STORAGE_KEY = 'md2doc-locale'

function detectLocale(): Locale {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'zh' || saved === 'en') return saved
  const lang = navigator.language || ''
  return lang.startsWith('zh') ? 'zh' : 'en'
}

interface I18nContextValue {
  locale: Locale
  t: Messages
  setLocale: (locale: Locale) => void
}

const I18nContext = createContext<I18nContextValue>(null!)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale)
  const setSampleMarkdown = useAppStore((s) => s.setSampleMarkdown)

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    localStorage.setItem(STORAGE_KEY, l)
    setSampleMarkdown(l)
  }, [setSampleMarkdown])

  useEffect(() => {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en'
  }, [locale])

  return createElement(
    I18nContext.Provider,
    { value: { locale, t: messages[locale], setLocale } },
    children
  )
}

export function useI18n() {
  return useContext(I18nContext)
}
