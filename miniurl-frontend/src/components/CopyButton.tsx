import { useState } from "react"
import { Button } from "./ui/button"
import {Check,Copy} from "lucide-react"
interface CopyButtonProps {
  text:string
}

export function CopyButton({text}:CopyButtonProps) {
  const [copied,setCopied] = useState(false)

  const handleCopy  = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(()=>setCopied(false),2000)
  }

  return(
  <Button
      variant={'outline'}
      size={'sm'}
      onClick={handleCopy}
      className="h-8 w-8 p-0"
    >
      {copied ? (
      <Check className="h-4 w-4" />
      ):(
      <Copy className="h-4 w-4"/>
      )}
    </Button>
  )
}
