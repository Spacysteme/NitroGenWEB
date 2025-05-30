"use client"

import { useState, useEffect } from "react"

interface DecryptedTextProps {
  text: string
  className?: string
  speed?: number
}

export function DecryptedText({ text, className = "", speed = 50 }: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDecrypting, setIsDecrypting] = useState(true)

  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?"

  useEffect(() => {
    if (!isDecrypting) return

    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        // Generate random characters for positions not yet revealed
        let newText = ""
        for (let i = 0; i < text.length; i++) {
          if (i < currentIndex) {
            newText += text[i]
          } else if (i === currentIndex) {
            // Randomly decide if we should reveal this character
            if (Math.random() > 0.5) {
              // Increased probability for faster reveal
              newText += text[i]
              setCurrentIndex(currentIndex + 1)
            } else {
              newText += characters[Math.floor(Math.random() * characters.length)]
            }
          } else {
            newText += characters[Math.floor(Math.random() * characters.length)]
          }
        }
        setDisplayText(newText)
      } else {
        setDisplayText(text)
        setIsDecrypting(false)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [currentIndex, text, speed, isDecrypting, characters])

  useEffect(() => {
    // Reset animation when text changes
    setCurrentIndex(0)
    setIsDecrypting(true)
    setDisplayText("")
  }, [text])

  return <span className={className}>{displayText}</span>
}
