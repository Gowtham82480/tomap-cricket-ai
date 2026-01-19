export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <h1 className="text-3xl font-bold text-primary">ToMapp – Cricket Coaching AI</h1>
        <p className="text-sm text-muted-foreground mt-1">AI-powered cricket coaching platform for players, parents, and coaches</p>
      </div>
    </header>
  )
}
