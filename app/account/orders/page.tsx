import { OrdersContent } from "@/components/orders-content"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function OrdersPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <OrdersContent />
            <Footer />
        </div>
    )
}
