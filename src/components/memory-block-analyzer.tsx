import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BitDisplay } from "./bit-display"

interface AnalyzerProps {
  bitsPerRow: number;
}

export function MemoryBlockAnalyzer({ bitsPerRow }: AnalyzerProps) {
  const [hexValue, setHexValue] = useState("")

  const parseHexValue = (hex: string) => {
    const value = parseInt(hex, 16)
    if (isNaN(value)) return null
    return {
      value,
      size: (value >> 3) << 3, // Get size (removing last 3 bits)
      allocated: !!(value & 1), // Get allocated bit
      prevAllocated: !!(value & 2), // Get prev allocated bit
      rows: Math.ceil(((value >> 3) << 3) / (bitsPerRow / 8))
    }
  }

  const blockInfo = parseHexValue(hexValue)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Memory Block Analyzer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Enter hex value (e.g., 0x20)"
          value={hexValue}
          onChange={(e) => setHexValue(e.target.value)}
        />
        
        {blockInfo && (
          <div className="space-y-2">
            <div>Block Size: {blockInfo.size} bytes</div>
            <div>Rows: {blockInfo.rows}</div>
            <div style={{ color: blockInfo.allocated ? 'red' : 'green' }}>
              Status: {blockInfo.allocated ? 'Allocated' : 'Free'}
            </div>
            <div style={{ color: blockInfo.prevAllocated ? 'red' : 'green' }}>
              Previous Block: {blockInfo.prevAllocated ? 'Allocated' : 'Free'}
            </div>
            <BitDisplay 
              value={blockInfo.value}
              bits={bitsPerRow}
              allocated={blockInfo.allocated}
              prevAllocated={blockInfo.prevAllocated}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

