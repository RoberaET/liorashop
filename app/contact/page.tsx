
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Instagram, Video, Send, ExternalLink } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Contact Us | LIORA SHOP",
    description: "Get in touch with Liora Shop via Telegram, Phone, or Email.",
}

export default function ContactPage() {
    const contactMethods = [
        {
            title: "Telegram support",
            description: "Chat with our support team directly",
            icon: Send,
            action: "Chat on Telegram",
            href: "https://t.me/Rebika_abebe",
            color: "text-blue-500",
            bg: "bg-blue-50 dark:bg-blue-950/30",
        },
        {
            title: "Instagram",
            description: "Follow us for the latest updates",
            icon: Instagram,
            action: "@liorashop",
            href: "https://instagram.com/liorashop",
            color: "text-pink-600",
            bg: "bg-pink-50 dark:bg-pink-950/30",
        },
        {
            title: "TikTok",
            description: "Watch our product showcases",
            icon: Video,
            action: "@liorashop",
            href: "https://tiktok.com/@liorashop",
            color: "text-purple-600",
            bg: "bg-purple-50 dark:bg-purple-950/30",
        },
        {
            title: "Phone Support",
            description: "Call us for immediate inquiries",
            icon: Phone,
            action: "+251 976 144 230",
            href: "tel:+251976144230",
            color: "text-green-600",
            bg: "bg-green-50 dark:bg-green-950/30",
        },
        {
            title: "Email Us",
            description: "Send us an email anytime",
            icon: Mail,
            action: "liorashop.et@gmail.com",
            href: "mailto:liorashop.et@gmail.com",
            color: "text-amber-600",
            bg: "bg-amber-50 dark:bg-amber-950/30",
        },
        {
            title: "Visit Us",
            description: "Come visit our store",
            icon: MapPin,
            action: "Addis Ababa, Ethiopia",
            href: "#",
            color: "text-red-500",
            bg: "bg-red-50 dark:bg-red-950/30",
        },
    ]

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-background transition-colors duration-300">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-16">
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-slate-900 dark:text-slate-50">
                        Contact Us
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        We'd love to hear from you. Reach out to us through any of these channels and we'll get back to you as soon as possible.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {contactMethods.map((method, index) => (
                        <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-none shadow-sm dark:bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${method.bg} ${method.color} transition-transform group-hover:scale-110`}>
                                    <method.icon className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-xl font-bold">{method.title}</CardTitle>
                                <CardDescription>{method.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button asChild variant="outline" className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                    <Link href={method.href} target={method.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                                        <span className="font-medium">{method.action}</span>
                                        {method.href.startsWith("http") && <ExternalLink className="h-4 w-4 opacity-50" />}
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-20 p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white text-center dark:from-indigo-950 dark:to-slate-900">
                    <h2 className="text-2xl font-bold mb-4">Need help with an order?</h2>
                    <p className="text-slate-300 mb-8 max-w-xl mx-auto">
                        Check our Frequently Asked Questions for quick answers to common questions about shipping, returns, and payments.
                    </p>
                    <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-slate-100 border-none">
                        <Link href="/faq">
                            Visit FAQ Center
                        </Link>
                    </Button>
                </div>
            </main>

            <Footer />
        </div>
    )
}
