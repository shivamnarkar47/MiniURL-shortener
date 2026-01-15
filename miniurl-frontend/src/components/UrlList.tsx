import { useUrlShortener } from '../hooks/useUrlShortener'
import { UrlItem } from './UrlItem'
import { Skeleton } from './ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import { AlertCircle, Link2, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function UrlList() {
  const { recentUrlsQuery } = useUrlShortener()

  if (recentUrlsQuery.isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2 mb-6">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Recent Links</h3>
        </div>
        {[...Array(3)].map((_, i) => (
          <Skeleton 
            key={i} 
            className="h-24 w-full rounded-xl bg-muted/50" 
          />
        ))}
      </motion.div>
    )
  }

  if (recentUrlsQuery.isError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Alert variant="destructive" className="border-destructive/50 bg-destructive/5">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>
            Unable to load recent URLs. Please check your connection and try again.
          </AlertDescription>
        </Alert>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-6">
        <div className="relative">
          <Link2 className="h-5 w-5 text-muted-foreground" />
          <motion.div
            className="absolute inset-0 text-primary"
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Link2 className="h-5 w-5" />
          </motion.div>
        </div>
        <h3 className="text-lg font-semibold">Recent Links</h3>
        {recentUrlsQuery.data && recentUrlsQuery.data.length > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-auto text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary"
          >
            {recentUrlsQuery.data.length}
          </motion.span>
        )}
      </div>
      
      <AnimatePresence mode="popLayout">
        {recentUrlsQuery.data?.length ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {recentUrlsQuery.data.map((url, index) => (
              <motion.div
                key={url.short_code}
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                layout
              >
                <UrlItem url={url} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center py-12"
          >
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Link2 className="h-8 w-8 text-muted-foreground/50" />
            </motion.div>
            <p className="text-muted-foreground font-medium">No links yet</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Shorten your first URL above to get started
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
