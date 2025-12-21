"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ProductImageGalleryProps {
    images: string[]
    name: string
    discount: number
}

export function ProductImageGallery({ images, name, discount }: ProductImageGalleryProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    // Ensure we have at least one image
    const displayImages = images.length > 0 ? images : ["/placeholder.svg"]

    return (
        <div className="relative aspect-square rounded-lg overflow-hidden bg-muted group">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 h-full w-full"
                >
                    <Image
                        src={displayImages[currentImageIndex] || "/placeholder.svg"}
                        alt={`${name} - Image ${currentImageIndex + 1}`}
                        fill
                        className="object-cover product-main-image"
                        priority
                    />
                </motion.div>
            </AnimatePresence>

            {/* Discount Badge */}
            {discount > 0 && (
                <Badge variant="destructive" className="absolute top-4 left-4 text-sm z-10">
                    -{discount}%
                </Badge>
            )}

            {/* Navigation Buttons - Only show if more than 1 image */}
            {displayImages.length > 1 && (
                <>
                    <Button
                        variant="secondary"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity rounded-full shadow-md z-10"
                        onClick={prevImage}
                        aria-label="Previous image"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="secondary"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity rounded-full shadow-md z-10"
                        onClick={nextImage}
                        aria-label="Next image"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>

                    {/* Dots Indicator */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                        {displayImages.map((_, index) => (
                            <button
                                key={index}
                                className={`h-2 w-2 rounded-full transition-all ${index === currentImageIndex
                                    ? "bg-white w-4"
                                    : "bg-white/50 hover:bg-white/75"
                                    }`}
                                onClick={() => setCurrentImageIndex(index)}
                                aria-label={`Go to image ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
