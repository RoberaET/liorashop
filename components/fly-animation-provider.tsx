"use client"

import React, { createContext, useContext, useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface FlyItem {
    id: string
    imageSrc: string
    startRect: DOMRect
    targetRect: DOMRect
}

interface FlyAnimationContextType {
    triggerFlyAnimation: (startRect: DOMRect, targetRect: DOMRect, imageSrc: string) => void
}

const FlyAnimationContext = createContext<FlyAnimationContextType | undefined>(undefined)

export function FlyAnimationProvider({ children }: { children: React.ReactNode }) {
    const [flyingItems, setFlyingItems] = useState<FlyItem[]>([])
    const idCounter = useRef(0)

    const triggerFlyAnimation = useCallback((startRect: DOMRect, targetRect: DOMRect, imageSrc: string) => {
        const id = `fly-${idCounter.current++}`
        setFlyingItems((prev) => [...prev, { id, startRect, targetRect, imageSrc }])

        // Remove item after animation
        setTimeout(() => {
            setFlyingItems((prev) => prev.filter((item) => item.id !== id))
        }, 1000)
    }, [])

    return (
        <FlyAnimationContext.Provider value={{ triggerFlyAnimation }}>
            {children}
            <AnimatePresence>
                {flyingItems.map((item) => (
                    <motion.img
                        key={item.id}
                        src={item.imageSrc}
                        initial={{
                            position: "fixed",
                            top: item.startRect.top,
                            left: item.startRect.left,
                            width: item.startRect.width,
                            height: item.startRect.height,
                            opacity: 1,
                            zIndex: 9999,
                            borderRadius: "8px",
                            objectFit: "cover"
                        }}
                        animate={{
                            top: item.targetRect.top + item.targetRect.height / 2 - 10, // Center on target
                            left: item.targetRect.left + item.targetRect.width / 2 - 10,
                            width: 20,
                            height: 20,
                            opacity: 0.5,
                            scale: 0.5
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="pointer-events-none shadow-xl"
                    />
                ))}
            </AnimatePresence>
        </FlyAnimationContext.Provider>
    )
}

export const useFlyAnimation = () => {
    const context = useContext(FlyAnimationContext)
    if (!context) {
        throw new Error("useFlyAnimation must be used within a FlyAnimationProvider")
    }
    return context
}
