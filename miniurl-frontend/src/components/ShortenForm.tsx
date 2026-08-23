import { useUrlShortener } from '../hooks/useUrlShortener'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Loader2, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { useState, useRef, useEffect } from 'react'
import { API_BASE_URL } from '@/api/urlShortner'

export function ShortenForm() {
  const { shortenMutation } = useUrlShortener()
  const [url, setUrl] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const showError = (description: string) => {
    toast.error(description)
  }

  const showSuccess = (shortCode: string) => {
    const shortUrl = `${API_BASE_URL}/${shortCode}`
    navigator.clipboard.writeText(shortUrl).catch(() => {})
    toast.success('Link created and copied to clipboard')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!url.trim()) {
      showError('Please enter a URL to shorten.')
      return
    }

    try {
      new URL(url)
    } catch {
      showError('URL must include a valid protocol (e.g., https://)')
      return
    }

    shortenMutation.mutate(url, {
      onSuccess: (data) => {
        setUrl('')
        showSuccess(data.short_code)
      },
      onError: () => {
        showError('Failed to create short link. Please try again.')
      },
    })
  }

  return (
    <section aria-label="Shorten a link" className="space-y-4">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <Input
          ref={inputRef}
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste a long URL"
          disabled={shortenMutation.isPending}
          className="h-12 flex-1 bg-card border-border text-base rounded-lg focus-visible:ring-1"
          autoFocus
        />
        <Button
          type="submit"
          disabled={shortenMutation.isPending}
          className="h-12 px-6 font-medium rounded-lg"
        >
          {shortenMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Shortening
            </>
          ) : (
            <>
              Shorten
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>
      <p className="text-xs text-muted-foreground tracking-wide">
        Press <kbd className="font-sans border border-border rounded px-1.5 py-0.5">/</kbd> to
        focus the input. Links are copied automatically.
      </p>
    </section>
  )
}
