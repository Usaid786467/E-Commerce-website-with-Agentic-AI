import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AccountSidebar } from '@/components/account/AccountSidebar'

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/login?callbackUrl=/account')
  }

  return (
    <div className="container-wide section-padding">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading">My Account</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account, orders, and preferences
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <AccountSidebar />
        </aside>
        <main className="lg:col-span-3">{children}</main>
      </div>
    </div>
  )
}
