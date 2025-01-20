"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { BitDisplay } from "./bit-display"

interface CreatorProps {
  bitsPerRow: number;
}

export function MemoryBlockCreator({ bitsPerRow }: CreatorProps) {
  const [mallocSize, setMallocSize] = useState("")
  const [blockSize, setBlockSize] = useState("")
  const [isAllocated, setIsAllocated] = useState(false)
  const [isPrevAllocated, setIsPrevAllocated] = useState(false)

  // Update block size when malloc size changes
  useEffect(() => {
    if (mallocSize) {
      const size = parseInt(mallocSize)
      if (!isNaN(size)) {
        // Add 8 bytes for header and footer
        const total = size + 8
        // Round up to multiple of 8
        const rounded = Math.ceil(total / 8) * 8
        setBlockSize(rounded.toString())
      }
    }
  }, [mallocSize])

  // Update malloc size when block size changes
  useEffect(() => {
    if (blockSize) {
      const size = parseInt(blockSize)
      if (!isNaN(size)) {
        // Subtract 8 bytes for header and footer
        const malloc = size - 8
        setMallocSize(malloc.toString())
      }
    }
  }, [blockSize])

  const calculateHex = () => {
    if (!blockSize) return ""
    const size = parseInt(blockSize)
    if (isNaN(size)) return ""
    
    let value = size
    if (isAllocated) value |= 1
    if (isPrevAllocated) value |= 2
    
    return "0x" + value.toString(16)
  }

  const hexValue = calculateHex()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Memory Block Creator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Malloc Size (bytes)</Label>
            <Input
              type="number"
              step="8"
              value={mallocSize}
              onChange={(e) => setMallocSize(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Total Block Size (bytes)</Label>
            <Input
              type="number"
              step="8"
              value={blockSize}
              onChange={(e) => setBlockSize(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={isAllocated}
              onCheckedChange={setIsAllocated}
            />
            <Label>Allocated</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={isPrevAllocated}
              onCheckedChange={setIsPrevAllocated}
            />
            <Label>Previous Allocated</Label>
          </div>
        </div>

        {hexValue && (
          <div className="space-y-2">
            <div>Hex Value: {hexValue}</div>
            <BitDisplay 
              value={parseInt(hexValue)}
              bits={bitsPerRow}
              allocated={isAllocated}
              prevAllocated={isPrevAllocated}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

