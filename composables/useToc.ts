import type { Ref } from 'vue'

export interface TocItem {
  id: string
  text: string
  level: number
}

const KEY = 'page-toc'

export function useToc() {
  const toc = useState<TocItem[]>(KEY, () => [])

  function setToc(items: TocItem[]) {
    toc.value = items
  }

  function clearToc() {
    toc.value = []
  }

  return {
    toc,
    setToc,
    clearToc,
  }
}
