import { useEffect, useRef, useState } from 'react'

export default function useChartSize() {
  const containerRef = useRef(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ width, height })
    })
    observer.observe(el)

    return () => observer.disconnect()
  }, [])

  return [containerRef, size]
}
