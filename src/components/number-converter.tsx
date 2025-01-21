import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const MAX_BITS = 32

export default function NumberConverter() {
  const [decimal, setDecimal] = useState<string>("0")
  const [binary, setBinary] = useState<string>("0")
  const [hex, setHex] = useState<string>("0")
  const [isSigned, setIsSigned] = useState<boolean>(false)
  const [isTwosComplement, setIsTwosComplement] = useState<boolean>(false)

  const convertDecimal = (value: string) => {
    let num = Number.parseInt(value)
    if (isNaN(num)) return { binary: "0", hex: "0" }

    if (isSigned && isTwosComplement) {
      if (num < 0) {
        num = (1 << MAX_BITS) + num
      }
    }

    const binary = num.toString(2).padStart(MAX_BITS, "0")
    const hex = num.toString(16).toUpperCase()

    return { binary, hex }
  }

  const convertBinary = (value: string) => {
    let num = Number.parseInt(value, 2)
    if (isNaN(num)) return { decimal: "0", hex: "0" }

    if (isSigned && isTwosComplement && value.startsWith("1")) {
      num = num - (1 << MAX_BITS)
    }

    const decimal = num.toString()
    const hex = num.toString(16).toUpperCase()

    return { decimal, hex }
  }

  const convertHex = (value: string) => {
    let num = Number.parseInt(value, 16)
    if (isNaN(num)) return { decimal: "0", binary: "0" }

    const binary = num.toString(2).padStart(MAX_BITS, "0")
    let decimal = num.toString()

    if (isSigned && isTwosComplement && binary.startsWith("1")) {
      num = num - (1 << MAX_BITS)
      decimal = num.toString()
    }

    return { decimal, binary }
  }

  useEffect(() => {
    const { binary: newBinary, hex: newHex } = convertDecimal(decimal)
    setBinary(newBinary)
    setHex(newHex)
  }, [decimal, isSigned, isTwosComplement])

  useEffect(() => {
    const { decimal: newDecimal, hex: newHex } = convertBinary(binary)
    setDecimal(newDecimal)
    setHex(newHex)
  }, [binary, isSigned, isTwosComplement])

  useEffect(() => {
    const { decimal: newDecimal, binary: newBinary } = convertHex(hex)
    setDecimal(newDecimal)
    setBinary(newBinary)
  }, [hex, isSigned, isTwosComplement])

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Number System Converter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="decimal">Decimal</Label>
          <Input id="decimal" value={decimal} onChange={(e) => setDecimal(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="binary">Binary</Label>
          <Input id="binary" value={binary} onChange={(e) => setBinary(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hex">Hexadecimal</Label>
          <Input id="hex" value={hex} onChange={(e) => setHex(e.target.value)} />
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="signed" checked={isSigned} onCheckedChange={setIsSigned} />
          <Label htmlFor="signed">Signed Numbers</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="twos-complement" checked={isTwosComplement} onCheckedChange={setIsTwosComplement} />
          <Label htmlFor="twos-complement">Two's Complement</Label>
        </div>
      </CardContent>
    </Card>
  )
}

