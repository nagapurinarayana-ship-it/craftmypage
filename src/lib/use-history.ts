import { useCallback, useRef, useState } from 'react'

export function useHistory<T>(initial: T, limit = 50) {
  const [state, setState] = useState<T>(initial)
  const pastRef = useRef<T[]>([])
  const futureRef = useRef<T[]>([])

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setState((prev) => {
        const resolved = typeof next === 'function' ? (next as (p: T) => T)(prev) : next
        pastRef.current = [...pastRef.current.slice(-(limit - 1)), prev]
        futureRef.current = []
        return resolved
      })
    },
    [limit]
  )

  const undo = useCallback(() => {
    setState((prev) => {
      const previous = pastRef.current.pop()
      if (previous === undefined) return prev
      futureRef.current = [...futureRef.current, prev]
      return previous
    })
  }, [])

  const redo = useCallback(() => {
    setState((prev) => {
      const next = futureRef.current.pop()
      if (next === undefined) return prev
      pastRef.current = [...pastRef.current, prev]
      return next
    })
  }, [])

  const canUndo = pastRef.current.length > 0
  const canRedo = futureRef.current.length > 0

  return { state, set, undo, redo, canUndo, canRedo }
}