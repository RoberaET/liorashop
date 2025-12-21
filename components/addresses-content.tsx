"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, MapPin, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useStore } from "@/lib/store"
import { useMounted } from "@/hooks/use-mounted"
import type { Address } from "@/lib/types"
import { useAuth } from "@/lib/auth-context"

export function AddressesContent() {
    const router = useRouter()
    const { user, isLoading } = useAuth()
    const addresses = useStore((state) => state.addresses)
    const addAddress = useStore((state) => state.addAddress)
    const removeAddress = useStore((state) => state.removeAddress)
    const mounted = useMounted()
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const [newAddress, setNewAddress] = useState<Address>({
        fullName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "Ethiopia",
        phone: "",
    })

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login")
        }
    }, [user, isLoading, router])

    if (isLoading) {
        return <div className="min-h-[50vh] flex items-center justify-center">Loading...</div>
    }

    if (!user) {
        return null
    }

    const handleAddAddress = (e: React.FormEvent) => {
        e.preventDefault()
        addAddress(newAddress)
        setNewAddress({
            fullName: "",
            email: "",
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "Ethiopia",
            phone: "",
        })
        setIsDialogOpen(false)
    }

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/account">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-serif font-bold">Addresses</h1>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                Add New
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add New Address</DialogTitle>
                                <DialogDescription>
                                    Add a new shipping address to your account.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleAddAddress} className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input
                                        id="fullName"
                                        value={newAddress.fullName}
                                        onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={newAddress.email}
                                        onChange={(e) => setNewAddress({ ...newAddress, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="street">Street Address</Label>
                                    <Input
                                        id="street"
                                        value={newAddress.street}
                                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="city">City</Label>
                                        <Input
                                            id="city"
                                            value={newAddress.city}
                                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="state">State</Label>
                                        <Input
                                            id="state"
                                            value={newAddress.state}
                                            onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="zipCode">Zip Code</Label>
                                        <Input
                                            id="zipCode"
                                            value={newAddress.zipCode}
                                            onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                            id="phone"
                                            value={newAddress.phone}
                                            onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit">Save Address</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {addresses.length === 0 ? (
                    <div className="text-center py-16 border rounded-lg bg-muted/20">
                        <MapPin className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                        <h2 className="text-xl font-medium mb-2">No addresses saved</h2>
                        <p className="text-muted-foreground">Add an address to speed up checkout.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                        {addresses.map((address, index) => (
                            <Card key={index}>
                                <CardHeader>
                                    <CardTitle className="flex justify-between items-start">
                                        <span>{address.fullName}</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive h-8 w-8"
                                            onClick={() => removeAddress(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Remove address</span>
                                        </Button>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <address className="not-italic text-sm text-muted-foreground space-y-1">
                                        <p>{address.street}</p>
                                        <p>{address.city}, {address.state} {address.zipCode}</p>
                                        <p>{address.country}</p>
                                        <p className="mt-2">{address.phone}</p>
                                        <p>{address.email}</p>
                                    </address>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
