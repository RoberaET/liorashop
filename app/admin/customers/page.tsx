"use client"

import { useState, useEffect } from "react"
// import { db } from "@/lib/db"
import { getAllUsersAction, deleteUserAction, adminResetUserPasswordAction } from "@/app/actions/admin"
import { RegisteredUser } from "@/lib/types"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, User as UserIcon, Mail, Calendar, Trash2 } from "lucide-react"

export default function AdminCustomersPage() {
    const [users, setUsers] = useState<RegisteredUser[]>([])
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        // Load users from Server Action
        const loadUsers = async () => {
            const result = await getAllUsersAction()
            if (result.users) {
                setUsers(result.users)
            }
        }
        loadUsers()
    }, [])

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const formatDate = (date: Date | string) => {
        if (!date) return "N/A"
        return new Date(date).toLocaleDateString()
    }

    const handleDeleteUser = async (userId: string) => {
        if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            const result = await deleteUserAction(userId)
            if (result.success) {
                setUsers(users.filter(u => u.id !== userId))
            } else {
                alert("Failed to delete user")
            }
        }
    }

    const [resetResult, setResetResult] = useState<{ password: string, userId: string } | null>(null)

    const handleResetPassword = async (userId: string) => {
        if (confirm("Are you sure you want to reset this user's password?")) {
            const result = await adminResetUserPasswordAction(userId)
            if (result.success && result.tempPassword) {
                setResetResult({ password: result.tempPassword, userId })
            } else {
                alert("Failed to reset password")
            }
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Customers</h1>
                    <p className="text-slate-600">Manage your customer base</p>
                </div>
            </div>

            {/* Reset Password Success Dialog using standard Alert Dialog or simple conditional rendering */}
            {resetResult && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full space-y-4">
                        <h3 className="text-lg font-bold text-slate-900">Password Reset Successful</h3>
                        <p className="text-slate-600 text-sm">
                            The temporary password for the user is:
                        </p>
                        <div className="p-3 bg-slate-100 rounded text-center font-mono text-lg font-bold select-all border border-slate-200 text-slate-900">
                            {resetResult.password}
                        </div>
                        <p className="text-xs text-slate-500">
                            Copy this password and send it to the user. They will be asked to change it upon login.
                        </p>
                        <Button className="w-full bg-slate-900 text-white hover:bg-slate-800" onClick={() => setResetResult(null)}>
                            Close
                        </Button>
                    </div>
                </div>
            )}

            <Card className="border-slate-200 bg-white shadow-sm overflow-x-auto">
                <CardHeader className="bg-white border-b border-slate-100">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-slate-900">All Users ({users.length})</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
                            <Input
                                placeholder="Search user..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8 border-slate-300 text-slate-900 placeholder:text-slate-600 focus:border-slate-500 bg-slate-50"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow className="border-slate-200 hover:bg-slate-50">
                                <TableHead className="text-slate-900 font-extrabold">User</TableHead>
                                <TableHead className="hidden md:table-cell text-slate-900 font-extrabold">Role</TableHead>
                                <TableHead className="hidden md:table-cell text-slate-900 font-extrabold">Joined</TableHead>
                                <TableHead className="hidden md:table-cell text-slate-900 font-extrabold">Addresses</TableHead>
                                <TableHead className="text-slate-900 font-extrabold">Status</TableHead>
                                <TableHead className="text-slate-900 font-extrabold">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id} className="border-slate-100 hover:bg-slate-50 transition-colors">
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold flex items-center gap-2 text-purple-700">
                                                <UserIcon className="h-3 w-3 text-slate-500" /> {user.name}
                                            </span>
                                            <span className="text-xs text-slate-500 flex items-center gap-2">
                                                <Mail className="h-3 w-3" /> {user.email}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <Badge variant={user.role === 'admin' ? "default" : "secondary"} className={user.role === 'admin' ? "bg-purple-900 hover:bg-purple-800" : "bg-blue-100 text-blue-800 hover:bg-blue-200"}>
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-amber-800 font-semibold text-sm">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-3 w-3" />
                                            {formatDate(user.createdAt)}
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-orange-700 font-bold">
                                        {user.addresses?.length || 0} Saved
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="text-emerald-700 border-emerald-200 bg-emerald-50">
                                            Active
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {user.role !== 'admin' && (
                                                <>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 font-medium"
                                                        onClick={() => handleResetPassword(user.id)}
                                                    >
                                                        Reset Password
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        className="bg-red-500 hover:bg-red-600"
                                                        onClick={() => handleDeleteUser(user.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredUsers.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                                        No users found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
