import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import React from "react"

const Toaster = (props: ToasterProps) => {
  const { theme = "system" } = useTheme() as { theme?: "dark" | "light" | "system" }

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "bg-background border border-border/50 shadow-xl backdrop-blur-lg",
          title: "font-semibold",
          description: "text-muted-foreground",
          actionButton: "bg-primary text-primary-foreground",
          cancelButton: "bg-muted text-muted-foreground",
          success: "border-emerald-500/30 bg-emerald-500/10",
          error: "border-destructive/30 bg-destructive/10",
          warning: "border-amber-500/30 bg-amber-500/10",
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--toast-radius": "0.75rem",
          "--toast-padding": "1rem",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
