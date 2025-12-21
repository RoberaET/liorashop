// "use client"

import Image from "next/image"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
// import { products } from "@/lib/data"
import { getProductsAction } from "@/app/actions/product"
import { formatPrice } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export default async function AdminProductsPage() {
    const { products } = await getProductsAction()

    if (!products) return <div>Failed to load products</div>
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Products</h2>
                <p className="text-muted-foreground">Manage your product catalog.</p>
            </div>

            <div className="border rounded-md bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product: any) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <div className="relative h-12 w-12 rounded-md overflow-hidden">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell className="capitalize">{product.category}</TableCell>
                                <TableCell>{formatPrice(product.price)}</TableCell>
                                <TableCell>
                                    <span className={product.stock === 0 ? "text-destructive font-medium" : ""}>
                                        {product.stock}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Badge className={product.stock > 0 ? "bg-green-600 hover:bg-green-700" : "bg-destructive hover:bg-destructive"}>
                                        {product.stock > 0 ? "Active" : "Out of Stock"}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
