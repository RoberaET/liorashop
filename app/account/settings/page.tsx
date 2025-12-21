import { SettingsContent } from "@/components/settings-content"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function SettingsPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <SettingsContent />
            <Footer />
        </div>
    )
}
