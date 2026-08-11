declare module 'react-helmet' {
  import { ReactNode, ComponentType } from 'react'

  interface HelmetProps {
    base?: Record<string, unknown>
    bodyAttributes?: Record<string, unknown>
    htmlAttributes?: Record<string, unknown>
    link?: Array<Record<string, unknown>>
    meta?: Array<Record<string, unknown>>
    noscript?: Array<Record<string, unknown>>
    script?: Array<Record<string, unknown>>
    style?: Array<Record<string, unknown>>
    title?: string
    titleTemplate?: string
    onChangeClientState?: (state: unknown, tags: unknown) => void
    children?: ReactNode
  }

  export class Helmet extends ComponentType<HelmetProps> {}
  export function HelmetProvider({ children }: { children: ReactNode }): JSX.Element
  export default Helmet
}