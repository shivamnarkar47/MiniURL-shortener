import { useUrlShortener } from '../hooks/useUrlShortener'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card } from './ui/card'
import { Loader2, Link2, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { useState, useRef, useEffect } from 'react'
import { API_BASE_URL } from '@/api/urlShortner'
import { motion, AnimatePresence } from 'framer-motion'

export function ShortenForm() {
  const { shortenMutation } = useUrlShortener()
  const [url, setUrl] = useState('')
  const [focused, setFocused] = useState(false)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!url.trim()) {
      toast("Error", {
        description: 'Please enter a valid URL',
        style: { background: 'oklch(0.577 0.245 27.325)', color: 'white' }
      })
      return
    }

    try {
      new URL(url)
    } catch {
      toast("Error", {
        description: 'Please enter a valid URL (include https://)',
        style: { background: 'oklch(0.577 0.245 27.325)', color: 'white' }
      })
      return
    }

    shortenMutation.mutate(url, {
      onSuccess: (data) => {
        setUrl('')
        toast("Link Created!", {
          description: (
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Link2 className="h-4 w-4 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium">Your shortened link:</span>
                <a 
                  href={`${API_BASE_URL}/${data.short_code}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-semibold"
                >
                  {data.short_code}
                </a>
              </div>
            </div>
          ),
        })
      },
      onError: () => {
        toast('Error', {
          description: 'Failed to shorten URL. Please try again.',
          style: { background: 'oklch(0.577 0.245 27.325)', color: 'white' }
        })
      }
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className={`
        relative overflow-hidden transition-all duration-500
        ${focused ? 'shadow-2xl shadow-primary/10 border-primary/30' : 'shadow-xl shadow-black/5'}
      `}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />
        
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
        
        <div className="relative p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
              <motion.span 
                className="inline-block"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Link2 className="h-7 w-7 text-primary" />
              </motion.span>
              Shorten Your Link
            </h2>
            <p className="text-muted-foreground">
              Paste your long URL below to create a compact, shareable link
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative group">
              <motion.div 
                className="absolute inset-0 bg-primary/20 rounded-lg blur-xl group-focus-within:bg-primary/30 transition-all duration-500"
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <div className="relative">
                <Input
                  ref={inputRef}
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="https://example.com/very/long/url..."
                  disabled={shortenMutation.isPending}
                  className="h-14 text-lg pr-14 transition-all duration-300 bg-background/80 backdrop-blur-sm"
                />
                {url && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  </motion.div>
                )}
              </div>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Button 
                type="submit" 
                disabled={shortenMutation.isPending}
                className="w-full h-14 text-lg font-semibold relative overflow-hidden group"
              >
                <motion.span 
                  className="relative z-10 flex items-center justify-center gap-2"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                >
                  {shortenMutation.isPending ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Shortening...
                    </>
                  ) : (
                    <>
                      Shorten URL
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </motion.span>
                
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ type: "tween", duration: 0.3 }}
                />
              </Button>
            </motion.div>
          </form>
          
          <AnimatePresence>
            {shortenMutation.isPending && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center justify-center gap-3 text-sm text-muted-foreground pt-2"
              >
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Creating your short link...</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  )
}
