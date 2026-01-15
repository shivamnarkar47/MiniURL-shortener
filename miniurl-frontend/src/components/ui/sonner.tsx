import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import React from "react"

const Toaster = (props: ToasterProps) => {
  const { theme = "system" } = useTheme() as { theme?: "dark" | "light" | "system" }

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
