"use client"

import { useEffect, useState } from "react"

interface QRCodeDisplayProps {
  value: string
  size?: number
  imageUrl?: string
}

export function QRCodeDisplay({ value, size = 200, imageUrl }: QRCodeDisplayProps) {
  const [qrCode, setQrCode] = useState<string>("")

  useEffect(() => {
    if (imageUrl) {
      setQrCode(imageUrl)
    } else {
      // Générer le code QR en utilisant l'API QR Code
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`
      setQrCode(qrUrl)
    }
  }, [value, size, imageUrl])

  return (
    <div className="flex items-center justify-center">
      {qrCode && (
        <img
          src={qrCode || "/placeholder.svg"}
          alt="Wallet QR Code"
          className="border-4 border-gray-200 rounded-lg p-2 bg-white"
          style={{ width: size, height: size }}
        />
      )}
    </div>
  )
}
