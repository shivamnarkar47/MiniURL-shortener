import { CopyButton } from './CopyButton'
import { ExternalLink, Trash2 } from 'lucide-react'
import { API_BASE_URL } from '@/api/urlShortner'
import { useUrlShortener } from '../hooks/useUrlShortener'
import { toast } from 'sonner'

interface UrlItemProps {
  url: {
    original_url: string
    short_code: string
    created_at?: string
  }
}

export function UrlItem({ url }: UrlItemProps) {
  const { deleteMutation } = useUrlShortener()
  const shortUrl = `${API_BASE_URL}/${url.short_code}`

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    deleteMutation.mutate(url.short_code, {
      onSuccess: () => {
        toast.success(`/${url.short_code} removed`)
      },
      onError: () => {
        toast.error('Could not remove the link. Please try again.')
      },
    })
  }

  return (
    <div
      className={`
        group flex items-center justify-between gap-4
        border border-border bg-card rounded-lg px-4 py-3
        transition-colors hover:border-muted-foreground/30
        ${deleteMutation.isPending && deleteMutation.variables === url.short_code ? 'opacity-50' : ''}
      `}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm font-medium text-primary underline-offset-4 hover:underline truncate"
          >
            /{url.short_code}
          </a>
          <CopyButton text={shortUrl} />
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open short link"
            className="text-muted-foreground/60 hover:text-foreground transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
        <p className="mt-1 text-xs text-muted-foreground truncate">{url.original_url}</p>
      </div>

      <button
        type="button"
        onClick={handleDelete}
        disabled={deleteMutation.isPending}
        aria-label={`Delete ${url.short_code}`}
        className="shrink-0 p-2 rounded-md text-muted-foreground/60 hover:text-destructive hover:bg-destructive/5 transition-colors cursor-pointer disabled:cursor-not-allowed"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}
