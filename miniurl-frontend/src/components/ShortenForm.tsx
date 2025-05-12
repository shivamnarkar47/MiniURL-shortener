import { useUrlShortener } from '../hooks/useUrlShortener'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card } from './ui/card'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'
import { API_BASE_URL } from '@/api/urlShortner'
export function ShortenForm() {
  const { shortenMutation } = useUrlShortener()
  const [url, setUrl] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!url) {
      toast("Error",{
        description: 'Please enter a URL',
      })
      return
    }

    shortenMutation.mutate(url, {
      onSuccess: (data) => {
        setUrl('')
        toast("Success",{
          description: (
            <div className="flex items-center gap-2">
              <span>Short URL created:</span>
              <a 
                href={`${API_BASE_URL}/${data.short_code}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-medium hover:underline"
              >
                /{data.short_code}
              </a>
            </div>
          ),
        })
      },
      onError: () => {
        toast('Error',{
          description: 'Failed to shorten URL',
        })
      }
    })
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">URL Shortener</h2>
          <p className="text-sm text-muted-foreground">
            Paste your long URL to shorten it
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">Long URL</Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/very/long/url"
              disabled={shortenMutation.isPending}
            />
          </div>
          
          <Button type="submit" disabled={shortenMutation.isPending} className="w-full">
            {shortenMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Shortening...
              </>
            ) : (
              'Shorten URL'
            )}
          </Button>
        </form>
      </div>
    </Card>
  )
}
