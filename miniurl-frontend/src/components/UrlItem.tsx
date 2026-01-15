import { Card } from './ui/card'
import { formatDate } from '../lib/utils'
import { CopyButton } from './CopyButton'
import { Button } from './ui/button'
import { ExternalLink, Calendar, Globe } from 'lucide-react'
import { API_BASE_URL } from '@/api/urlShortner'
import { motion } from 'framer-motion'
import { useState } from 'react'

interface UrlItemProps {
  url: {
    original_url: string
    short_code: string
    created_at?: string
  }
}

export function UrlItem({ url }: UrlItemProps) {
  const [isHovered, setIsHovered] = useState(false)
  const shortUrl = `${API_BASE_URL}/${url.short_code}`
  const hostname = url.original_url ? new URL(url.original_url).hostname : ''

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card 
        className={`
          relative overflow-hidden transition-all duration-300
          ${isHovered ? 'border-primary/30 shadow-lg shadow-primary/5' : 'border-border/50'}
        `}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-transparent"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 300 }}
        />
        
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary/50 to-primary/20" />
        
        <div className="relative p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <motion.a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-bold text-primary hover:underline cursor-pointer flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="font-mono bg-primary/10 px-2 py-0.5 rounded">
                    /{url.short_code}
                  </span>
                  <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.a>
                <CopyButton text={shortUrl} />
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0 }}
                  className="text-xs text-muted-foreground"
                >
                  <span className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    {hostname}
                  </span>
                </motion.div>
              </div>
              
              <a
                href={url.original_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground line-clamp-2 hover:text-foreground transition-colors group"
              >
                <span className="opacity-50 mr-2">→</span>
                {url.original_url}
              </a>
              
              {url.created_at && (
                <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground/70">
                  <Calendar className="h-3 w-3" />
                  <span>Created {formatDate(url.created_at)}</span>
                </div>
              )}
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                size="sm" 
                asChild
                className="shrink-0 sm:self-start"
              >
                <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit
                </a>
              </Button>
            </motion.div>
          </div>
        </div>
        
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
          animate={{ opacity: isHovered ? 1 : 0.5 }}
        />
      </Card>
    </motion.div>
  )
}
