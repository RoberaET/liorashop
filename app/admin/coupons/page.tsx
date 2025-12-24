"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/db"
import { Coupon } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Calendar } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function AdminCouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreating, setIsCreating] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        code: "",
        discountType: "percentage" as "percentage" | "fixed",
        discountValue: "",
        startDate: new Date().toISOString().split("T")[0], // YYYY-MM-DD
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // +7 days
    })

    const fetchCoupons = () => {
        const data = db.getAllCoupons()
        setCoupons([...data])
        setIsLoading(false)
    }

    useEffect(() => {
        fetchCoupons()
    }, [])

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault()
        try {
            db.createCoupon({
                code: formData.code.toUpperCase(),
                discountType: formData.discountType,
                discountValue: Number(formData.discountValue),
                startDate: formData.startDate,
                endDate: formData.endDate
            })
            setIsCreating(false)
            setFormData({
                code: "",
                discountType: "percentage",
                discountValue: "",
                startDate: new Date().toISOString().split("T")[0],
                endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            })
            fetchCoupons()
        } catch (error: any) {
            alert(error.message)
        }
    }

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this coupon?")) {
            db.deleteCoupon(id)
            fetchCoupons()
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Coupons</h1>
                    <p className="text-muted-foreground">Manage discount codes and promotions</p>
                </div>
                {!isCreating && (
                    <Button onClick={() => setIsCreating(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Create Coupon
                    </Button>
                )}
            </div>

            {isCreating && (
                <Card>
                    <CardHeader>
                        <CardTitle>Create New Coupon</CardTitle>
                        <CardDescription>Set the code, discount, and validity period.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="code">Coupon Code</Label>
                                    <Input
                                        id="code"
                                        placeholder="e.g., SUMMERSALE"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Type</Label>
                                        <Select
                                            value={formData.discountType}
                                            onValueChange={(val: any) => setFormData({ ...formData, discountType: val })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="percentage">Percentage (%)</SelectItem>
                                                <SelectItem value="fixed">Fixed Amount (ETB)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="value">Value</Label>
                                        <Input
                                            id="value"
                                            type="number"
                                            step={formData.discountType === "percentage" ? "0.01" : "1"}
                                            placeholder={formData.discountType === "percentage" ? "0.10 for 10%" : "100"}
                                            value={formData.discountValue}
                                            onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                                            required
                                        />
                                        {formData.discountType === "percentage" && (
                                            <p className="text-xs text-muted-foreground">Enter 0.15 for 15%</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="start">Start Date</Label>
                                    <Input
                                        id="start"
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="end">End Date</Label>
                                    <Input
                                        id="end"
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
                                <Button type="submit">Create Coupon</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Active Coupons</CardTitle>
                </CardHeader>
                <CardContent>
                    {coupons.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No coupons found. Create one to get started.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Discount</TableHead>
                                    <TableHead>Valid Period</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {coupons.map((coupon) => {
                                    const now = new Date()
                                    const start = new Date(coupon.startDate)
                                    const end = new Date(coupon.endDate)
                                    const isValid = now >= start && now <= end

                                    return (
                                        <TableRow key={coupon.id}>
                                            <TableCell className="font-medium font-mono">{coupon.code}</TableCell>
                                            <TableCell>
                                                {coupon.discountType === "percentage"
                                                    ? `${(coupon.discountValue * 100).toFixed(0)}%`
                                                    : `ETB ${coupon.discountValue}`
                                                }
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {start.toLocaleDateString()} - {end.toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={isValid ? "default" : "destructive"}>
                                                    {isValid ? "Active" : "Expired"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => handleDelete(coupon.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
