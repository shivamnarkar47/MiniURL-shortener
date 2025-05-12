import { ShortenForm } from './components/ShortenForm'
import { UrlList } from './components/UrlList'
import { Toaster } from 'sonner'
export default function App() {
  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <ShortenForm />
        <UrlList />
        <Toaster/>
      </div>
    </div>
  )
}
