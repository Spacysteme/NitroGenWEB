"use client"

import { useEffect, useRef } from "react"

export function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Aurora parameters
    const particles: {
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      alpha: number
      color: string
    }[] = []

    const particleCount = 100
    const colors = ["#00ff00", "#00cc00", "#009900", "#006600", "#003300"]

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: Math.random() * 0.2 - 0.1,
        vy: Math.random() * 0.2 - 0.1,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    // Animation loop
    const animate = () => {
      // Clear canvas with a very dark background
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw and update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Draw particle
        ctx.beginPath()
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2)
        gradient.addColorStop(0, `${p.color}`)
        gradient.addColorStop(1, "transparent")
        ctx.fillStyle = gradient
        ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2)
        ctx.fill()

        // Update position
        p.x += p.vx
        p.y += p.vy

        // Boundary check
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        // Randomly change direction occasionally
        if (Math.random() < 0.01) {
          p.vx = Math.random() * 0.2 - 0.1
          p.vy = Math.random() * 0.2 - 0.1
        }
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 z-0" />
}
