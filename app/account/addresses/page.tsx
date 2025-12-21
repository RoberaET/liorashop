import { AddressesContent } from "@/components/addresses-content"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function AddressesPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <AddressesContent />
            <Footer />
        </div>
    )
}
