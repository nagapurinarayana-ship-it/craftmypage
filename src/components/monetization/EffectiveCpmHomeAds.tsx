import { useEffect, useRef } from 'react'

const BANNER_468_SRC = 'https://www.highperformanceformat.com/75b0fc4d7ef9bda7dbda8e3863498abc/invoke.js'
const BANNER_728_SRC = 'https://www.highperformanceformat.com/b5828b9099d859c0a506e4067dd77370/invoke.js'
const BANNER_468_KEY = '75b0fc4d7ef9bda7dbda8e3863498abc'
const BANNER_728_KEY = 'b5828b9099d859c0a506e4067dd77370'

type BannerOptions = {
  key: string
  width: number
  height: number
  src: string
}

type BannerWindow = typeof globalThis & {
  atOptions?: Omit<BannerOptions, 'src'> & { format: string; params: Record<string, unknown> }
}

export default function EffectiveCpmHomeAds() {
  const adRootRef = useRef<HTMLElement | null>(null)
  const banner468Ref = useRef<HTMLDivElement | null>(null)
  const banner728Ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const root = adRootRef.current
    const banner468Container = banner468Ref.current
    const banner728Container = banner728Ref.current
    if (!root || !banner468Container || !banner728Container) return

    let cancelled = false
    let loaded = false
    const bannerWindow = globalThis as BannerWindow
    const scripts: HTMLScriptElement[] = []

    const injectBanner = (container: HTMLDivElement, options: BannerOptions) => {
      if (cancelled) return null
      bannerWindow.atOptions = {
        key: options.key,
        format: 'iframe',
        height: options.height,
        width: options.width,
        params: {},
      }
      const script = document.createElement('script')
      script.src = options.src
      script.async = true
      container.appendChild(script)
      scripts.push(script)
      return script
    }

    const loadAds = async () => {
      if (loaded || cancelled) return
      loaded = true


      // Load the two HighPerformanceFormat banners sequentially so each script
      // reads its own atOptions object instead of racing with the other banner.
      const loadBanner = (container: HTMLDivElement, options: BannerOptions) =>
        new Promise<void>((resolve) => {
          const script = injectBanner(container, options)
          if (!script) return resolve()
          script.addEventListener('load', () => resolve(), { once: true })
          script.addEventListener('error', () => resolve(), { once: true })
        })

      await loadBanner(banner468Container, {
        key: BANNER_468_KEY,
        width: 468,
        height: 60,
        src: BANNER_468_SRC,
      })
      await loadBanner(banner728Container, {
        key: BANNER_728_KEY,
        width: 728,
        height: 90,
        src: BANNER_728_SRC,
      })

      if (bannerWindow.atOptions?.key === BANNER_728_KEY || bannerWindow.atOptions?.key === BANNER_468_KEY) {
        delete bannerWindow.atOptions
      }
    }

    // These are revenue-bearing above-the-fold/page-visible units. Initialize
    // them immediately rather than waiting for viewport intersection so provider
    // scripts can reliably create their ad frames on first render.
    void loadAds()

    return () => {
      cancelled = true
      scripts.forEach((script) => script.remove())
      if (bannerWindow.atOptions?.key === BANNER_728_KEY || bannerWindow.atOptions?.key === BANNER_468_KEY) {
        delete bannerWindow.atOptions
      }
    }
  }, [])

  return (
    <section ref={adRootRef} className="cmp-monetization" aria-label="Advertisements">

      <div className="cmp-ad-block cmp-surface min-h-[120px] p-5 text-center sm:p-6">
        <span className="cmp-ad-label">Advertisement · 468×60</span>
        <div
          ref={banner468Ref}
          className="cmp-ad-banner mx-auto mt-3 min-h-[60px] max-w-full overflow-hidden"
          aria-label="Sponsored advertisement"
        />
      </div>

      <div className="cmp-ad-block cmp-surface min-h-[150px] p-5 text-center sm:p-6">
        <span className="cmp-ad-label">Advertisement · 728×90</span>
        <div
          ref={banner728Ref}
          className="cmp-ad-banner cmp-ad-banner-wide mx-auto mt-3 min-h-[90px] max-w-full overflow-hidden"
          aria-label="Sponsored advertisement"
        />
      </div>

    </section>
  )
}
