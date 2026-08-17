import { useMemo } from 'react'

const DESKTOP = { key: 'b5828b9099d859c0a506e4067dd77370', width: 728, height: 90 }
const MOBILE = { key: '75b0fc4d7ef9bda7dbda8e3863498abc', width: 468, height: 60 }
const NATIVE_SRC = 'https://pl30815334.effectivecpmnetwork.com/29feded00f4ae2c8a3b2719189977fff/invoke.js'
const NATIVE_ID = 'container-29feded00f4ae2c8a3b2719189977fff'
const POPUNDER_SRC = 'https://pl30815332.effectivecpmnetwork.com/98/cd/4d/98cd4d37b3a5c234c49c85952c033714.js'
const SOCIAL_BAR_SRC = 'https://pl30815335.effectivecpmnetwork.com/e7/87/aa/e787aa4e8d5075169853c0d1fe5fcabc.js'

function bannerDocument(ad: typeof DESKTOP) {
  return `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style></head><body><script>atOptions={key:"${ad.key}",format:"iframe",height:${ad.height},width:${ad.width},params:{}};<\/script><script src="https://www.highperformanceformat.com/${ad.key}/invoke.js"><\/script></body></html>`
}

export default function EffectiveCpmHomeAds() {
  const wide = typeof window !== 'undefined' && window.matchMedia('(min-width: 760px)').matches
  const ad = wide ? DESKTOP : MOBILE
  const srcDoc = useMemo(() => bannerDocument(ad), [ad.key])
  const nativeSrcDoc = useMemo(() => `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;padding:0;overflow:auto;background:transparent}</style></head><body><script async data-cfasync="false" src="${NATIVE_SRC}"><\/script><div id="${NATIVE_ID}"></div></body></html>`, [])
  const remainingSrcDoc = useMemo(() => `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;padding:0;min-height:120px;overflow:hidden;background:transparent}</style></head><body><script src="${POPUNDER_SRC}"><\/script><script src="${SOCIAL_BAR_SRC}"><\/script></body></html>`, [])

  return (
    <section className="cmp-monetization" aria-label="Advertisements">
      <div className="cmp-ad-block cmp-surface min-h-[120px] p-5 text-center sm:p-6">
        <span className="cmp-ad-label">Advertisement · {ad.width}×{ad.height}</span>
        <iframe
          title="Advertisement"
          srcDoc={srcDoc}
          width={ad.width}
          height={ad.height}
          loading="eager"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
          referrerPolicy="no-referrer-when-downgrade"
          className="mx-auto mt-3 block max-w-full overflow-hidden border-0"
          style={{ width: ad.width, height: ad.height }}
        />
      </div>
      <div className="cmp-ad-block cmp-surface min-h-[280px] p-5 text-center sm:p-6">
        <span className="cmp-ad-label">Sponsored recommendations</span>
        <iframe
          title="Sponsored recommendations"
          srcDoc={nativeSrcDoc}
          width="100%"
          height="260"
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
          referrerPolicy="no-referrer-when-downgrade"
          className="mx-auto mt-3 block w-full max-w-3xl border-0"
        />
      </div>
      <div className="cmp-ad-block cmp-surface min-h-[160px] p-5 text-center sm:p-6">
        <span className="cmp-ad-label">More sponsored offers</span>
        <iframe
          title="More sponsored offers"
          srcDoc={remainingSrcDoc}
          width="100%"
          height="140"
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
          referrerPolicy="no-referrer-when-downgrade"
          className="mx-auto mt-3 block w-full max-w-3xl border-0"
          style={{ width: '100%', height: 140 }}
        />
      </div>
    </section>
  )
}
