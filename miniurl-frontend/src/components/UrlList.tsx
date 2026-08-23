import { useUrlShortener } from '../hooks/useUrlShortener'
import { UrlItem } from './UrlItem'
import { Skeleton } from './ui/skeleton'

export function UrlList() {
  const { recentUrlsQuery } = useUrlShortener()

  if (recentUrlsQuery.isLoading) {
    return (
      <section aria-label="Recent links" className="space-y-4">
        <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Recent
        </h2>
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg bg-muted" />
        ))}
      </section>
    )
  }

  return (
    <section aria-label="Recent links">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Recent
        </h2>
        {recentUrlsQuery.data && recentUrlsQuery.data.length > 0 && (
          <span className="text-xs text-muted-foreground tabular-nums">
            {recentUrlsQuery.data.length}
          </span>
        )}
      </div>

      {recentUrlsQuery.isError ? (
        <p className="py-8 text-center text-sm text-muted-foreground border border-border rounded-lg bg-card">
          Couldn't load recent links. Is the backend running?
        </p>
      ) : recentUrlsQuery.data?.length ? (
        <ul className="space-y-2">
          {recentUrlsQuery.data.map((url) => (
            <li key={url.short_code}>
              <UrlItem url={url} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-10 text-center text-sm text-muted-foreground">
          Nothing here yet. Shorten your first link above.
        </p>
      )}
    </section>
  )
}
