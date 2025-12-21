"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { db } from "@/lib/db"
import { useMounted } from "@/hooks/use-mounted"

export default function AdminCustomersPage() {
    const mounted = useMounted()

    if (!mounted) return null

    const users = db.getAllUsers()

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
                <p className="text-muted-foreground">Manage your store's customers.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Customers</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Address</TableHead>
                                    <TableHead>Password (Hashed)</TableHead>
                                    <TableHead>Role</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            No customers found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.map((user) => {
                                        const addresses = db.getAddresses(user.id)
                                        const mainAddress = addresses[0] // Display the first address found

                                        return (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium">{user.name || "N/A"}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>{mainAddress?.phone || "N/A"}</TableCell>
                                                <TableCell>
                                                    {mainAddress ? (
                                                        <div className="text-sm">
                                                            <p>{mainAddress.street}</p>
                                                            <p>{mainAddress.city}, {mainAddress.country}</p>
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground italic">No address saved</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="font-mono text-xs text-muted-foreground truncate max-w-[150px]" title={user.password}>
                                                    {user.password || "********"}
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                                                        }`}>
                                                        {user.role}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
