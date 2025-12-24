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
import { Pencil, Trash2 } from "lucide-react"
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

    // Add Product State
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [newImages, setNewImages] = useState<string[]>(["", "", ""])
    const [newProduct, setNewProduct] = useState<Partial<Product>>({
        name: "",
        category: "",
        price: 0,
        stock: 0,
        description: "",
    })

    const loadProducts = () => {
        setProducts(db.getAllProducts())
        setIsLoading(false)
    }

    useEffect(() => {
        loadProducts()
    }, [])

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 800 * 1024) { // 800KB limit
                toast({
                    title: "File too large",
                    description: "Image must be less than 800KB to save in browser.",
                    variant: "destructive"
                })
                e.target.value = "" // Reset input
                return
            }

            const reader = new FileReader()
            reader.onloadend = () => {
                const base64 = reader.result as string
                const updatedImages = [...newImages]
                updatedImages[index] = base64
                setNewImages(updatedImages)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault()

        if (!newProduct.name || !newProduct.price || !newProduct.category) {
            toast({
                title: "Missing Fields",
                description: "Name, Category, and Price are required.",
                variant: "destructive"
            })
            return
        }

        // Validate 3 images
        if (newImages.some(img => !img)) {
            toast({
                title: "Missing Images",
                description: "You must upload exactly 3 images for the product.",
                variant: "destructive"
            })
            return
        }

        try {
            db.addProduct({
                name: newProduct.name,
                category: newProduct.category,
                price: Number(newProduct.price),
                stock: Number(newProduct.stock),
                description: newProduct.description || "",
                image: newImages[0], // Main image
                images: newImages, // All 3 images
                // inStock is handled automatically by addProduct based on stock > 0
                // reviews/rating initialized by default
            } as any)

            loadProducts()
            setIsAddOpen(false)
            setNewProduct({
                name: "",
                category: "",
                price: 0,
                stock: 0,
                description: "",
            })
            setNewImages(["", "", ""]) // Reset images

            toast({
                title: "Product Created",
                description: `${newProduct.name} has been added to the catalog.`
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create product.",
                variant: "destructive"
            })
        }
    }

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

    const handleDelete = (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
            try {
                db.deleteProduct(id)
                loadProducts()
                toast({
                    title: "Product Deleted",
                    description: `${name} has been removed from the catalog.`
                })
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to delete product.",
                    variant: "destructive"
                })
            }
        }
    }

    if (isLoading) return <div className="p-8 text-center text-slate-500">Loading products...</div>

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Products</h2>
                <p className="text-slate-600">Manage your product catalog.</p>
            </div>

            {/* Add Product Dialog */}
            <div className="flex justify-end">
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                            <Pencil className="h-4 w-4" /> Add Product
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] bg-white text-slate-900">
                        <DialogHeader>
                            <DialogTitle>Add New Product</DialogTitle>
                            <DialogDescription>
                                Create a new product. Click create when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="new-name" className="text-right">Name</Label>
                                <Input
                                    id="new-name"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                    className="col-span-3"
                                    placeholder="Product Name"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="new-category" className="text-right">Category</Label>
                                <Input
                                    id="new-category"
                                    value={newProduct.category}
                                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                    className="col-span-3"
                                    placeholder="Category (e.g. Perfume)"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="new-price" className="text-right">Price</Label>
                                <Input
                                    id="new-price"
                                    type="number"
                                    value={newProduct.price}
                                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="new-stock" className="text-right">Stock</Label>
                                <Input
                                    id="new-stock"
                                    type="number"
                                    value={newProduct.stock}
                                    onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label className="text-right pt-2">Images (3 Required)</Label>
                                <div className="col-span-3 space-y-3">
                                    {[0, 1, 2].map((index) => (
                                        <div key={index} className="flex items-center gap-4">
                                            <div className="flex-1">
                                                <Label htmlFor={`new-image-${index}`} className="text-xs text-slate-500 mb-1 block">
                                                    Image {index + 1} {index === 0 && "(Main)"}
                                                </Label>
                                                <Input
                                                    id={`new-image-${index}`}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleImageUpload(e, index)}
                                                    className="w-full"
                                                />
                                            </div>
                                            {newImages[index] ? (
                                                <div className="relative h-12 w-12 border rounded overflow-hidden flex-shrink-0">
                                                    <Image
                                                        src={newImages[index]}
                                                        alt={`Preview ${index + 1}`}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="h-12 w-12 border border-dashed rounded flex items-center justify-center bg-slate-50 text-slate-300">
                                                    <span className="text-xs">Empty</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="new-desc" className="text-right">Description</Label>
                                <Input
                                    id="new-desc"
                                    value={newProduct.description}
                                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                    className="col-span-3"
                                    placeholder="Short description"
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                    Create Product
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
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
                                    <div className="flex justify-end gap-2">
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

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="hover:bg-red-50 text-red-600"
                                            onClick={() => handleDelete(product.id, product.name)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
