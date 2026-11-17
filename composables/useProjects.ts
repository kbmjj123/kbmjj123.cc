// Case-study loading for /projects index and /projects/[slug] detail.
// Case studies live in the `projects` Nuxt Content collection.

function parseMeta(raw: Record<string, any>): Record<string, any> {
  const meta = typeof raw.meta === 'string' ? JSON.parse(raw.meta) : (raw.meta || {})
  return meta
}

export interface CaseStudyLink {
  label: string
  url: string
}

export interface CaseStudyItem {
  slug: string
  title: string
  description: string
  project: string
  status: string
  value: string
  screenshot: string
  links: CaseStudyLink[]
  tags: string[]
  body: any
  date: string
}

export function useCaseStudies() {
  const { data: raw, pending } = useAsyncData('case-studies', async () => {
    try {
      const items = await queryCollection('projects').all()
      return JSON.parse(JSON.stringify(items || [])) as Record<string, any>[]
    } catch (e) {
      console.error('Failed to load case studies:', e)
      return [] as Record<string, any>[]
    }
  })

  const caseStudies = computed<CaseStudyItem[]>(() => {
    if (!raw.value) return []
    return (raw.value || []).map((p) => {
      const meta = parseMeta(p)
      return {
        slug: (p.path || '').replace('/projects/', ''),
        title: p.title || '',
        description: p.description || '',
        project: meta.project || '',
        status: meta.status || 'ready',
        value: meta.value || '',
        screenshot: meta.screenshot || '',
        links: Array.isArray(meta.links) ? meta.links : [],
        tags: Array.isArray(meta.tags) ? meta.tags : [],
        body: p.body || null,
        date: meta.date || '',
      }
    })
  })

  return { caseStudies, pending }
}

export function useCaseStudy(slug: string) {
  const { data: raw, pending } = useAsyncData(`case-study-${slug}`, () =>
    queryCollection('projects').path(`/projects/${slug}`).first()
  )

  const study = computed<CaseStudyItem | null>(() => {
    const p: any = raw.value
    if (!p) return null
    const meta = parseMeta(p)
    return {
      slug: (p.path || '').replace('/projects/', ''),
      title: p.title || '',
      description: p.description || '',
      project: meta.project || '',
      status: meta.status || 'ready',
      value: meta.value || '',
      screenshot: meta.screenshot || '',
      links: Array.isArray(meta.links) ? meta.links : [],
      tags: Array.isArray(meta.tags) ? meta.tags : [],
      body: p.body || null,
      date: meta.date || '',
    }
  })

  return { study, pending }
}
