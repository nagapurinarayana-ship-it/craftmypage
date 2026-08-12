import { useCallback, useState } from 'react'

export function useHistory<T>(initial: T, limit = 50) {
  const [state, setState] = useState<T>(initial)
  const [past, setPast] = useState<T[]>([])
  const [future, setFuture] = useState<T[]>([])

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setState((prev) => {
        const resolved = typeof next === 'function' ? (next as (p: T) => T)(prev) : next
        setPast((current) => [...current.slice(-(limit - 1)), prev])
        setFuture([])
        return resolved
      })
    },
    [limit]
  )

  const undo = useCallback(() => {
    setState((current) => {
      if (past.length === 0) return current
      const previous = past[past.length - 1]
      setPast((items) => items.slice(0, -1))
      setFuture((items) => [...items, current])
      return previous
    })
  }, [past])

  const redo = useCallback(() => {
    setState((current) => {
      if (future.length === 0) return current
      const next = future[future.length - 1]
      setFuture((items) => items.slice(0, -1))
      setPast((items) => [...items, current])
      return next
    })
  }, [future])

  return {
    state,
    set,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
  }
}
