import { useEffect, useRef } from 'react'

const NATIVE_SRC = 'https://pl30815334.effectivecpmnetwork.com/29feded00f4ae2c8a3b2719189977fff/invoke.js'
const BANNER_SRC = 'https://www.highperformanceformat.com/75b0fc4d7ef9bda7dbda8e3863498abc/invoke.js'
const SMARTLINK = 'https://www.effectivecpmnetwork.com/hcit0ft2?key=3383ae2b2a94f70103f6b28c372f4f72'

export default function EffectiveCpmHomeAds() {
  const nativeRef = useRef<HTMLDivElement | null>(null)
  const bannerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const nativeContainer = nativeRef.current
    const bannerContainer = bannerRef.current
    if (!nativeContainer || !bannerContainer) return

    const nativeScript = document.createElement('script')
    nativeScript.async = true
    nativeScript.dataset.cfasync = 'false'
    nativeScript.src = NATIVE_SRC
    nativeContainer.appendChild(nativeScript)

    const bannerWindow = globalThis as typeof globalThis & {
      atOptions?: {
        key: string
        format: string
        height: number
        width: number
        params: Record<string, unknown>
      }
    }
    bannerWindow.atOptions = {
      key: '75b0fc4d7ef9bda7dbda8e3863498abc',
      format: 'iframe',
      height: 60,
      width: 468,
      params: {},
    }

    const bannerScript = document.createElement('script')
    bannerScript.src = BANNER_SRC
    bannerContainer.appendChild(bannerScript)

    return () => {
      nativeScript.remove()
      bannerScript.remove()
      if (bannerWindow.atOptions?.key === '75b0fc4d7ef9bda7dbda8e3863498abc') {
        delete bannerWindow.atOptions
      }
    }
  }, [])

  return (
    <section className="cmp-monetization" aria-label="Advertisements">
      <div className="cmp-ad-block cmp-surface p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="cmp-eyebrow">Advertisement</span>
            <h2 className="mt-3 text-xl font-bold text-slate-900">Free tools, supported by relevant sponsorships.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Advertising is kept outside the editing workflow so your documents stay the focus.
            </p>
          </div>
          <div ref={nativeRef} className="cmp-ad-native w-full max-w-xl min-w-0" aria-label="Sponsored advertisement" />
        </div>
      </div>

      <div className="cmp-ad-block cmp-surface p-5 text-center sm:p-6">
        <span className="cmp-ad-label">Advertisement</span>
        <div ref={bannerRef} className="cmp-ad-banner mx-auto mt-3 max-w-full overflow-hidden" aria-label="Sponsored advertisement" />
      </div>

      <div className="cmp-ad-block cmp-surface p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="cmp-ad-label">Sponsored</span>
            <p className="mt-1 text-sm text-slate-600">Explore sponsored offers related to productivity and document work.</p>
          </div>
          <a
            href={SMARTLINK}
            target="_blank"
            rel="sponsored noopener noreferrer"
            className="cmp-secondary-btn shrink-0"
          >
            Explore sponsored offers →
          </a>
        </div>
      </div>
    </section>
  )
}
