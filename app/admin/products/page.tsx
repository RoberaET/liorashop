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
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Products</h2>
                <p className="text-slate-600">Manage your product catalog.</p>
            </div>

            <div className="border border-slate-200 rounded-lg bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow className="border-slate-200 hover:bg-slate-50">
                            <TableHead className="w-[80px] text-slate-900 font-extrabold">Image</TableHead>
                            <TableHead className="text-slate-900 font-extrabold">Name</TableHead>
                            <TableHead className="text-slate-900 font-extrabold">Category</TableHead>
                            <TableHead className="text-slate-900 font-extrabold">Price</TableHead>
                            <TableHead className="text-slate-900 font-extrabold">Stock</TableHead>
                            <TableHead className="text-slate-900 font-extrabold">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product: any) => (
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
                                <TableCell className="font-semibold text-purple-800">{product.name}</TableCell>
                                <TableCell className="capitalize text-amber-900 font-medium">{product.category}</TableCell>
                                <TableCell className="text-emerald-800 font-bold">{formatPrice(product.price)}</TableCell>
                                <TableCell>
                                    <span className={product.stock === 0 ? "text-red-700 font-bold" : "text-red-900 font-medium"}>
                                        {product.stock}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Badge className={product.stock > 0 ? "bg-emerald-700 hover:bg-emerald-800" : "bg-red-700 hover:bg-red-800"}>
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
