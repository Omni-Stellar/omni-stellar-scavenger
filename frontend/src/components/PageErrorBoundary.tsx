import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from '@/components/ui/Button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * Error boundary specifically for lazy-loaded page chunks.
 *
 * When a dynamic `import()` fails (e.g. a network error while loading a route
 * chunk) React throws during rendering. This boundary catches that, shows a
 * user-friendly message, and offers a reload button so the user can retry
 * without losing the whole app.
 */
export class PageErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Log to console so it's visible in CI / dev tools
    console.error('[PageErrorBoundary] Failed to load page chunk:', error, info)
  }

  handleReload = () => {
    // Clear the error state so the Suspense boundary retries the import
    this.setState({ hasError: false, error: null })
    // Also hard-reload the chunk by refreshing — clears stale cached chunk hashes
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center"
        >
          <p className="text-lg font-semibold">Failed to load this page.</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            The page could not be loaded, possibly due to a network error or a new deployment.
            Reloading usually fixes it.
          </p>
          <Button onClick={this.handleReload}>Reload page</Button>
        </div>
      )
    }

    return this.props.children
  }
}
