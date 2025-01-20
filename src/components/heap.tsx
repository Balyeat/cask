import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MemoryBlockAnalyzer } from "./memory-block-analyzer"
import { MemoryBlockCreator } from "./memory-block-creator"


export default function Heap() {
    const [bitsPerRow, setBitsPerRow] = useState("32")

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="w-full max-w-xs space-y-2">
        <Label>Bits per Row</Label>
        <Input
          type="number"
          value={bitsPerRow}
          onChange={(e) => setBitsPerRow(e.target.value)}
        />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <MemoryBlockAnalyzer bitsPerRow={parseInt(bitsPerRow) || 32} />
        <MemoryBlockCreator bitsPerRow={parseInt(bitsPerRow) || 32} />
      </div>
    </div>
  )
}