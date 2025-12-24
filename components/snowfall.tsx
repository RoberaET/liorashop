"use client"

import { useEffect, useRef } from "react"

interface Snowflake {
    x: number
    y: number
    radius: number
    speed: number
    wind: number
    opacity: number
}

export function Snowfall() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let animationFrameId: number
        let snowflakes: Snowflake[] = []

        const resizeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        const createSnowflakes = () => {
            // Reduced density for better mobile performance (was 10000)
            const count = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 15000), 100)
            const flakes: Snowflake[] = []
            for (let i = 0; i < count; i++) {
                flakes.push({
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    radius: Math.random() * 3 + 1,
                    speed: Math.random() * 1 + 0.5,
                    wind: Math.random() * 0.5 - 0.25,
                    opacity: Math.random() * 0.5 + 0.3,
                })
            }
            snowflakes = flakes
        }

        const draw = () => {
            if (!ctx || !canvas) return
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            snowflakes.forEach((flake) => {
                ctx.beginPath()
                ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`
                ctx.fill()

                // Update position
                flake.y += flake.speed
                flake.x += flake.wind

                // Reset if out of bounds
                if (flake.y > canvas.height) {
                    flake.y = -flake.radius
                    flake.x = Math.random() * canvas.width
                }
                if (flake.x > canvas.width) {
                    flake.x = 0
                } else if (flake.x < 0) {
                    flake.x = canvas.width
                }
            })

            animationFrameId = requestAnimationFrame(draw)
        }

        window.addEventListener("resize", () => {
            resizeCanvas()
            createSnowflakes()
        })

        resizeCanvas()
        createSnowflakes()
        draw()

        return () => {
            cancelAnimationFrame(animationFrameId)
            window.removeEventListener("resize", resizeCanvas)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-50 will-change-transform" // Reduced z-index, optimized layer
            aria-hidden="true"
        />
    )
}
