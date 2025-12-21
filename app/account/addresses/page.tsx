"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Plus, Trash2, MapPin } from "lucide-react"
import Link from "next/link"

export default function AddressesPage() {
    const { user, addAddress, removeAddress, isLoading } = useAuth()
    const router = useRouter()
    const [isAdding, setIsAdding] = useState(false)
    const [newAddress, setNewAddress] = useState({
        fullName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        phone: ""
    })

    if (isLoading) return <div>Loading...</div>
    if (!user) {
        router.push("/login")
        return null
    }

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        await addAddress(newAddress)
        setIsAdding(false)
        setNewAddress({
            fullName: "",
            email: "",
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
            phone: ""
        })
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Button variant="ghost" asChild className="mb-6 pl-0 hover:bg-transparent">
                <Link href="/account" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Account
                </Link>
            </Button>

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold">Addresses</h1>
                    <p className="text-muted-foreground">Manage your shipping addresses</p>
                </div>
                {!isAdding && (
                    <Button onClick={() => setIsAdding(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add New
                    </Button>
                )}
            </div>

            {isAdding ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Add New Address</CardTitle>
                        <CardDescription>Enter your shipping details below</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form id="address-form" onSubmit={handleAdd} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input
                                        id="fullName"
                                        required
                                        value={newAddress.fullName}
                                        onChange={e => setNewAddress({ ...newAddress, fullName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        value={newAddress.email}
                                        onChange={e => setNewAddress({ ...newAddress, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        required
                                        value={newAddress.phone}
                                        onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="country">Country</Label>
                                    <Input
                                        id="country"
                                        required
                                        value={newAddress.country}
                                        onChange={e => setNewAddress({ ...newAddress, country: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="street">Street Address</Label>
                                <Input
                                    id="street"
                                    required
                                    value={newAddress.street}
                                    onChange={e => setNewAddress({ ...newAddress, street: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        required
                                        value={newAddress.city}
                                        onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="state">State</Label>
                                    <Input
                                        id="state"
                                        required
                                        value={newAddress.state}
                                        onChange={e => setNewAddress({ ...newAddress, state: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="zipCode">Zip Code</Label>
                                    <Input
                                        id="zipCode"
                                        required
                                        value={newAddress.zipCode}
                                        onChange={e => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                                    />
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
                        <Button type="submit" form="address-form">Save Address</Button>
                    </CardFooter>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {user.addresses && user.addresses.length > 0 ? (
                        user.addresses.map((addr, index) => (
                            <Card key={index} className="relative">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <MapPin className="h-4 w-4" />
                                        {addr.city}, {addr.country}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground space-y-1">
                                    <p className="font-medium text-foreground">{addr.fullName}</p>
                                    <p>{addr.street}</p>
                                    <p>{addr.city}, {addr.state} {addr.zipCode}</p>
                                    <p>{addr.phone}</p>
                                    <p>{addr.email}</p>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="w-full gap-2"
                                        onClick={() => removeAddress(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Remove
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 border rounded-lg bg-muted/20">
                            <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">No addresses saved yet.</p>
                            <Button variant="link" onClick={() => setIsAdding(true)}>
                                Add your first address
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
