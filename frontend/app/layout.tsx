import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OrderFlow — Customer Order Management',
  description: 'Manage and track customer orders efficiently with OrderFlow dashboard.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <nav className="navbar">
          <div className="navbar-logo">
            OrderFlow
          </div>
        </nav>
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}
