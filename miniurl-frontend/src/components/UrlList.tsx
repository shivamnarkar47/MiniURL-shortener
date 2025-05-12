import { useUrlShortener } from '../hooks/useUrlShortener'
import { UrlItem } from './UrlItem'
import { Skeleton } from './ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import { AlertCircle } from 'lucide-react'

export function UrlList() {
  const { recentUrlsQuery } = useUrlShortener()

  if (recentUrlsQuery.isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-[88px] w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (recentUrlsQuery.isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load recent URLs. Please try again later.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Recent URLs</h3>
      {recentUrlsQuery.data?.length ? (
        recentUrlsQuery.data.map((url) => (
          <UrlItem key={url.short_code} url={url} />
        ))
      ) : (
        <p className="text-sm text-muted-foreground">No recent URLs found</p>
      )}
    </div>
  )
}
