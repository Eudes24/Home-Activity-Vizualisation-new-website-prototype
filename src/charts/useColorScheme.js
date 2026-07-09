import { useEffect, useState } from 'react'

export default function useColorScheme() {
  const [isDark, setIsDark] = useState(() => matchMedia('(prefers-color-scheme: dark)').matches)

  useEffect(() => {
    const mql = matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e) => setIsDark(e.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return isDark
}

export function chartTheme(isDark) {
  return {
    isDark,
    grid: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',
    tick: isDark ? '#888' : '#999',
    fillArea: isDark ? 'rgba(55,138,221,0.10)' : 'rgba(55,138,221,0.1)',
  }
}
