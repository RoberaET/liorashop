import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { SearchResults } from "@/components/search-results"

export const metadata = {
  title: "Search | LUXE",
  description: "Search our curated collection of fashion, beauty, and lifestyle products.",
}

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<SearchLoading />}>
          <SearchResults />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

function SearchLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-64 bg-muted rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square bg-muted rounded" />
          ))}
        </div>
      </div>
    </div>
  )
}
