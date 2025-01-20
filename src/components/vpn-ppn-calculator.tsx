import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"

interface Config {
  virtualAddressWidth: string
  pageSize: string
  tlbSets: string
  tlbWays: string
}

interface ParsedConfig {
  virtualAddressWidth: number
  pageSize: number
  tlbSets: number
  tlbWays: number
}

export default function VPNPPNCalculator() {
  const [config, setConfig] = useState<Config>({
    virtualAddressWidth: "12",
    pageSize: "32",
    tlbSets: "4",
    tlbWays: "4",
  })
  const [virtualAddress, setVirtualAddress] = useState("")
  const [result, setResult] = useState<{
    vpn: number
    tlbIndex: number
    tlbTag: string
    offset: number
  } | null>(null)

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setConfig((prev) => ({ ...prev, [name]: value }))
  }

  const calculateVPN = (address: number, parsedConfig: ParsedConfig) => {
    const offsetBits = Math.log2(parsedConfig.pageSize)
    console.log("Offset bits: ", offsetBits)
    return address >> offsetBits
  }

  const calculateTLBIndex = (vpn: number, parsedConfig: ParsedConfig) => {
    const indexBits = Math.log2(parsedConfig.tlbSets)
    return vpn & ((1 << indexBits) - 1)
  }

  const calculateTLBTag = (vpn: number, parsedConfig: ParsedConfig) => {
    const indexBits = Math.log2(parsedConfig.tlbSets)
    return vpn >> indexBits
  }

  const calculateOffset = (address: number, parsedConfig: ParsedConfig) => {
    const offsetBits = Math.log2(parsedConfig.pageSize)
    return address & ((1 << offsetBits) - 1)
  }

  const handleCalculate = () => {
    const address = Number.parseInt(virtualAddress, 2)
    const parsedConfig: ParsedConfig = {
      virtualAddressWidth: Number.parseInt(config.virtualAddressWidth),
      pageSize: Number.parseInt(config.pageSize),
      tlbSets: Number.parseInt(config.tlbSets),
      tlbWays: Number.parseInt(config.tlbWays),
    }

    if (isNaN(address) || address < 0 || address >= 1 << parsedConfig.virtualAddressWidth) {
      alert(`Please enter a valid ${parsedConfig.virtualAddressWidth}-bit binary virtual address.`)
      return
    }

    const vpn = calculateVPN(address, parsedConfig)
    const tlbIndex = calculateTLBIndex(vpn, parsedConfig)
    const tlbTag = calculateTLBTag(vpn, parsedConfig)
    const offset = calculateOffset(address, parsedConfig)

    console.log("VPN: ", vpn)
    setResult({
      vpn,
      tlbIndex,
      tlbTag: tlbTag.toString(16).toUpperCase().padStart(2, "0"),
      offset,
    })
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>VPN to PPN Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="virtualAddressWidth">Virtual Address Width (bits)</Label>
              <Input
                id="virtualAddressWidth"
                name="virtualAddressWidth"
                type="number"
                value={config.virtualAddressWidth || ""}
                onChange={handleConfigChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pageSize">Page Size (bytes)</Label>
              <Input
                id="pageSize"
                name="pageSize"
                type="number"
                value={config.pageSize || ""}
                onChange={handleConfigChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tlbSets">TLB Sets</Label>
              <Input
                id="tlbSets"
                name="tlbSets"
                type="number"
                value={config.tlbSets || ""}
                onChange={handleConfigChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tlbWays">TLB Ways</Label>
              <Input
                id="tlbWays"
                name="tlbWays"
                type="number"
                value={config.tlbWays || ""}
                onChange={handleConfigChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="virtualAddress">Virtual Address (binary)</Label>
            <Input
              id="virtualAddress"
              value={virtualAddress}
              onChange={(e) => setVirtualAddress(e.target.value)}
              placeholder={`Enter ${config.virtualAddressWidth}-bit binary address`}
              maxLength={Number.parseInt(config.virtualAddressWidth)}
            />
          </div>
          <Button onClick={handleCalculate} className="w-full">
            Calculate
          </Button>
        </div>
      </CardContent>
      {result && (
        <CardFooter>
          <div className="w-full space-y-2">
            <p>
              <strong>VPN:</strong> {result.vpn}
            </p>
            <p>
              <strong>TLB Index:</strong> {result.tlbIndex}
            </p>
            <p>
              <strong>TLB Tag (hex):</strong> {result.tlbTag}
            </p>
            <p>
              <strong>Offset:</strong> {result.offset}
            </p>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}

