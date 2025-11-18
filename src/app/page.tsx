export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold font-heading bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
          E-Commerce Platform
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Enterprise-grade e-commerce platform with AI-powered features
        </p>
        <div className="flex gap-4 justify-center">
          <div className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg font-medium">
            ✅ Next.js 14+ App Router
          </div>
          <div className="px-4 py-2 bg-green-50 text-green-700 rounded-lg font-medium">
            ✅ TypeScript
          </div>
          <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium">
            ✅ Tailwind CSS
          </div>
        </div>
        <div className="text-sm text-muted-foreground pt-4">
          Building enterprise features... 🚀
        </div>
      </div>
    </main>
  )
}
