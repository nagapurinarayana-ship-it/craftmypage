import React from 'react'

type Props = { children: React.ReactNode }
type State = { hasError: boolean; message: string }

export default class AppErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, message: '' }

  static getDerivedStateFromError(error: unknown): State {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : 'The page could not be loaded.',
    }
  }

  componentDidCatch(error: unknown) {
    // Keep production failures visible without sending document contents anywhere.
    if (import.meta.env.DEV) console.error('CraftMyPage application error', error)
  }

  private reloadPage = () => {
    window.location.reload()
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <main className="min-h-[60vh] flex items-center justify-center px-6 py-16">
        <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm" role="alert">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-xl" aria-hidden="true">!</div>
          <h1 className="mt-5 text-2xl font-bold text-slate-950">This page could not be loaded</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            A temporary browser or deployment issue prevented CraftMyPage from rendering this page. Your locally saved documents are not sent anywhere by this recovery screen.
          </p>
          {this.state.message ? <p className="mt-3 break-words text-xs text-slate-400">{this.state.message}</p> : null}
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button type="button" onClick={this.reloadPage} className="cmp-primary-btn justify-center">Reload page</button>
            <a href="/" className="cmp-secondary-btn justify-center">Go home</a>
          </div>
        </section>
      </main>
    )
  }
}
