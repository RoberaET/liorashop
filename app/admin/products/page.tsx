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
                <h2 className="text-3xl font-bold tracking-tight text-indigo-950">Products</h2>
                <p className="text-slate-600">Manage your product catalog.</p>
            </div>

            <div className="border border-slate-200 rounded-md bg-white">
                <Table>
                    <TableHeader>
                        <TableRow className="border-slate-200 hover:bg-slate-50">
                            <TableHead className="w-[80px] text-indigo-900 font-bold">Image</TableHead>
                            <TableHead className="text-indigo-900 font-bold">Name</TableHead>
                            <TableHead className="text-indigo-900 font-bold">Category</TableHead>
                            <TableHead className="text-indigo-900 font-bold">Price</TableHead>
                            <TableHead className="text-indigo-900 font-bold">Stock</TableHead>
                            <TableHead className="text-indigo-900 font-bold">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product: any) => (
                            <TableRow key={product.id} className="border-slate-200 hover:bg-slate-50">
                                <TableCell>
                                    <div className="relative h-12 w-12 rounded-md overflow-hidden border border-slate-200">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className="font-semibold text-blue-900">{product.name}</TableCell>
                                <TableCell className="capitalize text-slate-700">{product.category}</TableCell>
                                <TableCell className="text-emerald-700 font-bold">{formatPrice(product.price)}</TableCell>
                                <TableCell>
                                    <span className={product.stock === 0 ? "text-red-600 font-bold" : "text-amber-800 font-medium"}>
                                        {product.stock}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Badge className={product.stock > 0 ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"}>
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
