"use client"

import { useState, useRef } from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Github, MessageSquare, Menu, Pause } from "lucide-react"
import { DecryptedText } from "@/components/decrypted-text"
import Aurora from "@/components/aurora"

export default function Home() {
  const [activeTab, setActiveTab] = useState("generator")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([])
  const [validCodes, setValidCodes] = useState<string[]>([])
  const [scannedCount, setScannedCount] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const generatorInterval = useRef<NodeJS.Timeout | null>(null)

  const generateCode = (length = 16) => {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let result = ""
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    return result
  }

  const startGenerator = () => {
    if (isGenerating) return

    setIsGenerating(true)
    setActiveTab("generator")
    setGeneratedCodes([])
    setScannedCount(0)

    generatorInterval.current = setInterval(() => {
      const code = generateCode()
      const isValid = Math.floor(Math.random() * 1050) === 1

      setScannedCount((prev) => prev + 1)
      setGeneratedCodes((prev) => {
        const newCodes = [
          `${isValid ? "[🎉] Valid Nitro code found! --> https://discord.gift/" : "[❌] Invalid code: https://discord.gift/"}${code}`,
          ...prev,
        ]
        return newCodes.slice(0, 100) // Keep only the last 100 codes
      })

      if (isValid) {
        setValidCodes((prev) => [`https://discord.gift/${code}`, ...prev])
      }
    }, 200)
  }

  const pauseGenerator = () => {
    if (generatorInterval.current) {
      clearInterval(generatorInterval.current)
      generatorInterval.current = null
    }
    setIsGenerating(false)
  }

  return (
    <main className="flex min-h-screen bg-black text-green-500 font-mono relative">
      {/* Aurora Background */}
      <div className="fixed inset-0 z-0">
        <Aurora colorStops={["#003300", "#00ff00", "#006600"]} blend={0.6} amplitude={1.2} speed={0.3} />
      </div>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-black bg-opacity-90 border-r border-green-900 transition-transform duration-300 z-20 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} w-[200px]`}
      >
        <div className="p-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-green-500 hover:bg-green-950 mb-6"
            onClick={() => setSidebarOpen(false)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          <div className="flex flex-col gap-4">
            <Button
              variant="outline"
              className={`border-green-500 text-green-500 hover:bg-green-950 justify-start ${activeTab === "generator" ? "bg-green-950" : ""}`}
              onClick={() => {
                setActiveTab("generator")
                setSidebarOpen(false)
              }}
            >
              GENERATOR
            </Button>
            <Button
              variant="outline"
              className={`border-green-500 text-green-500 hover:bg-green-950 justify-start ${activeTab === "valid" ? "bg-green-950" : ""}`}
              onClick={() => {
                setActiveTab("valid")
                setSidebarOpen(false)
              }}
            >
              VALID CODES
            </Button>
            <Button
              variant="outline"
              className={`border-green-500 text-green-500 hover:bg-green-950 justify-start ${activeTab === "infos" ? "bg-green-950" : ""}`}
              onClick={() => {
                setActiveTab("infos")
                setSidebarOpen(false)
              }}
            >
              INFOS
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-10" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Header with Menu Button */}
      <div className="absolute top-4 left-4 z-30">
        <Button
          variant="ghost"
          size="icon"
          className="text-green-500 hover:bg-green-950"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 flex flex-col items-center z-10 relative">
        <div className="w-full max-w-4xl">
          {/* ASCII Banner */}
          <div className="mb-8 text-center">
            <pre className="text-green-500 text-xs sm:text-sm md:text-base leading-tight bg-black bg-opacity-70 p-4 rounded-lg">
              {` ███▄    █  ██▓▄▄▄█████▓ ██▀███   ▒█████       ▄████ ▓█████  ███▄    █ 
 ██ ▀█   █ ▓██▒▓  ██▒ ▓▒▓██ ▒ ██▒▒██▒  ██▒    ██▒ ▀█▒▓█   ▀  ██ ▀█   █ 
▓██  ▀█ ██▒▒██▒▒ ▓██░ ▒░▓██ ░▄█ ▒▒██░  ██▒   ▒██░▄▄▄░▒███   ▓██  ▀█ ██▒
▓██▒  ▐▌██▒░██░░ ▓██▓ ░ ▒██▀▀█▄  ▒██   ██░   ░▓█  ██▓▒▓█  ▄ ▓██▒  ▐▌██▒
▒██░   ▓██░░██░  ▒██▒ ░ ░██▓ ▒██▒░ ████▓▒░   ░▒▓███▀▒░▒████▒▒██░   ▓██░
░ ▒░   ▒ ▒ ░▓    ▒ ░░   ░ ▒▓ ░▒▓░░ ▒░▒░▒░     ░▒   ▒ ░░ ▒░ ░░ ▒░   ▒ ▒ 
░ ░░   ░ ▒░ ▒ ░    ░      ░▒ ░ ▒░  ░ ▒ ▒░      ░   ░  ░ ░  ░░ ░░   ░ ▒░
   ░   ░ ░  ▒ ░  ░        ░░   ░ ░ ░ ░ ▒     ░ ░   ░    ░      ░   ░ ░ 
         ░  ░              ░         ░ ░           ░    ░  ░         ░ `}
            </pre>
            <div className="text-green-400 mt-4 bg-black bg-opacity-70 inline-block px-4 py-2 rounded-lg">
              <DecryptedText text="Nitro generator v2 - by Spacy131" className="text-green-400" speed={20} />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="generator" className="mt-0">
              {isGenerating ? (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <Button
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 text-lg flex items-center gap-2"
                      onClick={pauseGenerator}
                    >
                      <Pause className="h-5 w-5" />
                      PAUSE
                    </Button>
                  </div>
                  <div className="bg-black bg-opacity-80 border border-green-900 p-4 h-[300px] overflow-y-auto flex flex-col-reverse">
                    <div className="fixed bottom-4 right-4">🔍 Codes scanned: {scannedCount}</div>
                    {generatedCodes.map((code, index) => (
                      <div key={index} className={code.includes("[🎉]") ? "text-green-400" : "text-green-600"}>
                        {code}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex justify-center mt-8">
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-black font-bold py-3 px-8 text-lg"
                    onClick={startGenerator}
                  >
                    START GEN
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="valid" className="mt-0">
              <div className="bg-black bg-opacity-80 border border-green-900 p-4 h-[300px] overflow-y-auto">
                {validCodes.length > 0 ? (
                  validCodes.map((code, index) => (
                    <div key={index} className="text-green-400 mb-1">
                      {code}
                    </div>
                  ))
                ) : (
                  <div className="text-center text-green-600 mt-8">No valid codes found yet.</div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="infos" className="mt-0">
              <div className="bg-black bg-opacity-80 border border-green-900 p-4 h-[300px] overflow-y-auto">
                <div className="text-center">
                  <h2 className="text-xl mb-4">Nitro Generator v2</h2>
                  <p className="mb-2">Creator: Spacy131</p>
                  <p className="mb-6">Version: v2</p>

                  <div className="flex justify-center gap-4 mt-8">
                    <a href="https://discord.gg/XD8M2AGrNA" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-950 flex gap-2">
                        <MessageSquare size={18} />
                        Discord
                      </Button>
                    </a>
                    <a href="https://github.com/Spacysteme/NitroGenWEB" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-950 flex gap-2">
                        <Github size={18} />
                        GitHub
                      </Button>
                    </a>
                  </div>

                  <div className="mt-12 p-4 border border-green-900 text-sm">
                    <p className="text-yellow-500">⚠️ WARNING: Do not leave the software on for too long!</p>
                    <p className="text-yellow-500">Risk of unnecessary addictions.</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}
