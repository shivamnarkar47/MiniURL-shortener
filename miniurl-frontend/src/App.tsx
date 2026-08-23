import { ShortenForm } from './components/ShortenForm'
import { UrlList } from './components/UrlList'
import { Toaster } from 'sonner'
import { ThemeToggle } from './components/ThemeToggle'
import { Heart } from 'lucide-react'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 pt-14 pb-10">
        <div className="max-w-xl mx-auto relative text-center">
          <div className="absolute top-1 right-0">
            <ThemeToggle />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">MiniURL</h1>
          <p className="mt-2 text-sm text-muted-foreground tracking-wide">
            Short links, kept simple.
          </p>
        </div>
      </header>

      <main className="flex-1 px-6 pb-16">
        <div className="max-w-xl mx-auto space-y-12">
          <ShortenForm />
          <UrlList />
        </div>
      </main>

      <footer className="py-8 px-6 border-t border-border/60">
        <div className="max-w-xl mx-auto text-center text-xs text-muted-foreground tracking-wide flex items-center justify-center gap-1">
          <span>
            Made with <Heart className="h-3 w-3 inline-block text-destructive fill-destructive" /> by{' '}
            <a
              href="https://shivamnarkar16.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-foreground transition-colors"
            >
              Shivam Narkar
            </a>
          </span>
        </div>
      </footer>

      <Toaster
        position="bottom-center"
        toastOptions={{
          className: "bg-card border border-border shadow-sm",
          duration: 3000,
        }}
      />
    </div>
  )
}
