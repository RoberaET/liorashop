"use client"

import Image from "next/image"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { formatPrice } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Pencil } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useEffect, useState } from "react"
import { db } from "@/lib/db"
import { Product } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [open, setOpen] = useState(false)
    const { toast } = useToast()

    const loadProducts = () => {
        setProducts(db.getAllProducts())
        setIsLoading(false)
    }

    useEffect(() => {
        loadProducts()
    }, [])

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingProduct) return

        try {
            db.updateProduct(editingProduct.id, {
                price: Number(editingProduct.price),
                stock: Number(editingProduct.stock),
                // inStock is handled by db.updateProduct automatically but purely optional to pass here
            })

            loadProducts()
            setOpen(false)
            setEditingProduct(null)

            toast({
                title: "Product Updated",
                description: `${editingProduct.name} has been updated successfully.`
            })
        } catch (error) {
            console.error(error)
            toast({
                title: "Error",
                description: "Failed to update product.",
                variant: "destructive"
            })
        }
    }

    if (isLoading) return <div className="p-8 text-center text-slate-500">Loading products...</div>

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Products</h2>
                <p className="text-slate-600">Manage your product catalog.</p>
            </div>

            <div className="border border-slate-200 rounded-lg bg-white shadow-sm overflow-x-auto">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow className="border-slate-200 hover:bg-slate-50">
                            <TableHead className="w-[80px] text-slate-900 font-extrabold">Image</TableHead>
                            <TableHead className="text-slate-900 font-extrabold">Name</TableHead>
                            <TableHead className="hidden md:table-cell text-slate-900 font-extrabold">Category</TableHead>
                            <TableHead className="text-slate-900 font-extrabold">Price</TableHead>
                            <TableHead className="hidden md:table-cell text-slate-900 font-extrabold">Stock</TableHead>
                            <TableHead className="text-slate-900 font-extrabold">Status</TableHead>
                            <TableHead className="text-slate-900 font-extrabold text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id} className="border-slate-100 hover:bg-slate-50 transition-colors">
                                <TableCell>
                                    <div className="relative h-12 w-12 rounded-md overflow-hidden border border-slate-200">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                            sizes="48px"
                                            loading="lazy"
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className="font-semibold text-purple-800">
                                    <div className="flex flex-col">
                                        <span>{product.name}</span>
                                        {product.sku && <span className="text-xs text-slate-400 font-mono">{product.sku}</span>}
                                    </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell capitalize text-amber-900 font-medium">{product.category}</TableCell>
                                <TableCell className="text-green-600 font-bold">{formatPrice(product.price)}</TableCell>
                                <TableCell className="hidden md:table-cell">
                                    <span className={product.stock === 0 ? "text-red-700 font-bold" : "text-slate-700 font-medium"}>
                                        {product.stock}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Badge className={product.stock > 0 ? "bg-emerald-700 hover:bg-emerald-800" : "bg-red-700 hover:bg-red-800"}>
                                        {product.stock > 0 ? "Active" : "Out of Stock"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Dialog open={open && editingProduct?.id === product.id} onOpenChange={(isOpen) => {
                                        setOpen(isOpen)
                                        if (isOpen) setEditingProduct({ ...product })
                                        else setEditingProduct(null)
                                    }}>
                                        <DialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="hover:bg-blue-50 text-blue-600">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px] bg-white text-slate-900">
                                            <DialogHeader>
                                                <DialogTitle>Edit Product</DialogTitle>
                                                <DialogDescription>
                                                    Make changes to the product here. Click save when you're done.
                                                </DialogDescription>
                                            </DialogHeader>
                                            {editingProduct && (
                                                <form onSubmit={handleSave} className="grid gap-4 py-4">
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="name" className="text-right">
                                                            Name
                                                        </Label>
                                                        <Input
                                                            id="name"
                                                            value={editingProduct.name}
                                                            onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                                            className="col-span-3 border-slate-300"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="category" className="text-right">
                                                            Category
                                                        </Label>
                                                        <Input
                                                            id="category"
                                                            value={editingProduct.category}
                                                            onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                                                            className="col-span-3 border-slate-300"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="price" className="text-right">
                                                            Price
                                                        </Label>
                                                        <Input
                                                            id="price"
                                                            type="number"
                                                            value={editingProduct.price}
                                                            onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                                                            className="col-span-3 border-slate-300"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="stock" className="text-right">
                                                            Stock
                                                        </Label>
                                                        <Input
                                                            id="stock"
                                                            type="number"
                                                            value={editingProduct.stock}
                                                            onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                                                            className="col-span-3 border-slate-300"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="instock" className="text-right">
                                                            In Stock
                                                        </Label>
                                                        <div className="col-span-3 flex items-center space-x-2">
                                                            <Switch
                                                                id="instock"
                                                                checked={editingProduct.inStock}
                                                                onCheckedChange={(checked) => setEditingProduct({ ...editingProduct, inStock: checked })}
                                                            />
                                                            <span className="text-sm text-slate-500">
                                                                {editingProduct.inStock ? "Product is active" : "Product is unavailable"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Save changes</Button>
                                                    </DialogFooter>
                                                </form>
                                            )}
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
