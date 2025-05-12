import { Card } from './ui/card'
import { formatDate } from '../lib/utils'
import { CopyButton } from './CopyButton'
import { Button } from './ui/button'
import { ExternalLink } from 'lucide-react'
import { API_BASE_URL } from '@/api/urlShortner'

interface UrlItemProps {
  url: {
    original_url: string
    short_code: string
    created_at?: string
  }
}

export function UrlItem({ url }: UrlItemProps) {
  const shortUrl = `${API_BASE_URL}/${url.short_code}`

  return (
    <Card className="p-4 hover:bg-accent/50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="grid gap-1">
          <div className="flex items-center gap-2">
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:underline"
            >
              /{url.short_code}
            </a>
            <CopyButton text={shortUrl} />
          </div>
          <a
            href={url.original_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground line-clamp-1 hover:underline"
          >
            {url.original_url}
          </a>
          {url.created_at && (
            <p className="text-xs text-muted-foreground">
              {formatDate(url.created_at)}
            </p>
          )}
        </div>
        <Button variant="outline" size="sm" asChild>
          <a href={shortUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            Visit
          </a>
        </Button>
      </div>
    </Card>
  )
}
