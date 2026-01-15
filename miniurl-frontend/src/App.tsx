import { ShortenForm } from './components/ShortenForm'
import { UrlList } from './components/UrlList'
import { Toaster } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeToggle } from './components/ThemeToggle'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function App() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && theme === 'dark'

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={isDark ? 'dark' : 'light'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0"
          style={{
            background: isDark
              ? "radial-gradient(ellipse at top, oklch(0.18 0.008 145) 0%, oklch(0.12 0.005 145) 50%, oklch(0.08 0.003 145) 100%)"
              : "radial-gradient(ellipse at top, oklch(0.96 0.005 145) 0%, oklch(0.99 0.002 145) 50%, oklch(1 0 0) 100%)"
          }}
        />
      </AnimatePresence>

      <motion.div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        animate={{
          opacity: isDark ? 0.6 : 1
        }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl"
          animate={{
            background: isDark
              ? "oklch(0.55 0.18 145 / 20%)"
              : "oklch(0.55 0.18 145 / 15%)"
          }}
          transition={{ duration: 0.5 }}
        />
        <motion.div
          className="absolute top-1/2 -left-40 w-96 h-96 rounded-full blur-3xl"
          animate={{
            background: isDark
              ? "oklch(0.6 0.12 75 / 10%)"
              : "oklch(0.6 0.12 75 / 8%)"
          }}
          transition={{ duration: 0.5 }}
        />
        <motion.div
          className="absolute -bottom-40 right-1/3 w-72 h-72 rounded-full blur-3xl"
          animate={{
            background: isDark
              ? "oklch(0.45 0.15 175 / 10%)"
              : "oklch(0.45 0.15 175 / 8%)"
          }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>
      
      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="pt-8 pb-6 px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-3xl mx-auto text-center relative"
          >
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="absolute top-0 right-0"
            >
              <ThemeToggle />
            </motion.div>
            
            <motion.h1 
              className="text-4xl sm:text-5xl font-bold tracking-tight"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                MiniURL
              </span>
            </motion.h1>
            <motion.p 
              className="mt-3 text-lg text-muted-foreground max-w-lg mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Transform long URLs into concise, shareable links in seconds
            </motion.p>
          </motion.div>
        </header>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-8">
          <div className="max-w-3xl mx-auto space-y-10">
            <ShortenForm />
            <UrlList />
          </div>
        </main>

        <footer className="py-6 px-4 sm:px-6 lg:px-8 border-t border-border/40 bg-background/30 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="max-w-3xl mx-auto text-center text-sm text-muted-foreground"
          >
            <span className="font-medium">MiniURL</span> — A sleek URL shortener built with modern web technologies
          </motion.div>
        </footer>
      </div>
      
      <Toaster
        position="bottom-center"
        toastOptions={{
          className: "bg-background border border-border shadow-lg",
          duration: 3000,
        }}
      />
    </div>
  )
}
