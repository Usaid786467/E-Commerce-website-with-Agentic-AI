import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Plus, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'

async function getUserAddresses(userId: string) {
  const addresses = await prisma.shippingAddress.findMany({
    where: { userId },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
  })

  return addresses
}

export default async function AddressesPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return null
  }

  const addresses = await getUserAddresses(session.user.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Saved Addresses</h2>
          <p className="text-muted-foreground mt-1">
            Manage your delivery addresses
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-xl mb-2">No saved addresses</h3>
            <p className="text-muted-foreground mb-6">
              Add a delivery address to make checkout faster
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Address
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <Card key={address.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">
                    {address.firstName} {address.lastName}
                  </CardTitle>
                  {address.isDefault && <Badge>Default</Badge>}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm mb-4">
                  <p>{address.addressLine1}</p>
                  {address.addressLine2 && <p>{address.addressLine2}</p>}
                  <p>
                    {address.city}, {address.state} {address.postalCode}
                  </p>
                  <p>{address.country}</p>
                  <p className="pt-2 border-t">{address.phone}</p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-3 w-3 mr-2" />
                    Edit
                  </Button>
                  {!address.isDefault && (
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-3 w-3 mr-2" />
                      Delete
                    </Button>
                  )}
                  {!address.isDefault && (
                    <Button variant="outline" size="sm">
                      Set as Default
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
