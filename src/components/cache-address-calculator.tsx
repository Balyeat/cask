import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"

interface CacheParams {
  addressSize: number
  setAssociativity: number
  cacheSize: number
  blockSize: number
}

interface CacheResults {
  totalBlocks: number
  totalSets: number
  offsetBits: number
  indexBits: number
  tagBits: number
}

interface SimulationResult {
  address: string
  hitMiss: "HIT" | "MISS"
  setIndex: number
  state_of_tags: string
}

export default function CacheAddressCalculator() {
  const [params, setParams] = useState<CacheParams>({
    addressSize: 32,
    setAssociativity: 4,
    cacheSize: 64,
    blockSize: 64,
  })
  const [results, setResults] = useState<CacheResults | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [simulationAddresses, setSimulationAddresses] = useState<string>("")
  const [simulationResults, setSimulationResults] = useState<SimulationResult[]>([])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setParams((prev) => ({ ...prev, [name]: parseInt(value) || 0 }))
  }

  const calculateCache = () => {
    const { addressSize, setAssociativity, cacheSize, blockSize } = params

    if (addressSize <= 0 || setAssociativity <= 0 || cacheSize <= 0 || blockSize <= 0) {
      setError("All values must be positive numbers.")
      setResults(null)
      return
    }

    const totalBlocks = (cacheSize * 1024) / blockSize
    const totalSets = totalBlocks / setAssociativity
    const offsetBits = Math.log2(blockSize)
    const indexBits = Math.log2(totalSets)
    const tagBits = addressSize - indexBits - offsetBits

    if (!Number.isInteger(offsetBits) || !Number.isInteger(indexBits) || tagBits < 0) {
      setError("Invalid cache configuration. Please check your inputs.")
      setResults(null)
      return
    }

    setResults({
      totalBlocks,
      totalSets,
      offsetBits,
      indexBits,
      tagBits,
    })
    setError(null)
  }

  const simulateAddresses = () => {
    if (!results) {
      setError("Please calculate cache parameters first.")
      return
    }

    const addresses = simulationAddresses.split('\n').filter(address => address.trim() !== '')
    const newResults: SimulationResult[] = []
    const cache: { [key: number]: Set<string> } = {}

    addresses.forEach(address => {
      const addressInt = parseInt(address, 16)
      const offset = addressInt & ((1 << results.offsetBits) - 1)
      const index = (addressInt >> results.offsetBits) & ((1 << results.indexBits) - 1)
      const tag = (addressInt >> (results.offsetBits + results.indexBits)) & ((1 << results.tagBits) - 1)

      if (!cache[index]) {
        cache[index] = new Set()
      }

      const hitMiss = cache[index].has(tag.toString()) ? "HIT" : "MISS"
      cache[index].add(tag.toString())

      newResults.push({
        address,
        hitMiss,
        setIndex: index,
        state_of_tags: Array.from(cache[index]).join(", "),
      })
    })

    setSimulationResults(newResults)
    setError(null)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Cache Address Calculator</CardTitle>
        <CardDescription>Enter cache parameters to calculate address breakdown and simulate addresses</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="addressSize">Address Size (bits)</Label>
              <Input
                id="addressSize"
                name="addressSize"
                type="number"
                value={params.addressSize}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="setAssociativity">Set Associativity</Label>
              <Input
                id="setAssociativity"
                name="setAssociativity"
                type="number"
                value={params.setAssociativity}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cacheSize">Cache Size (KB)</Label>
              <Input
                id="cacheSize"
                name="cacheSize"
                type="number"
                value={params.cacheSize}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blockSize">Block Size (bytes)</Label>
              <Input
                id="blockSize"
                name="blockSize"
                type="number"
                value={params.blockSize}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <Button onClick={calculateCache} className="w-full">
            Calculate
          </Button>
        </form>

        {error && <div className="mt-4 text-red-500">{error}</div>}

        {results && (
          <div className="mt-6 space-y-2">
            <h3 className="text-lg font-semibold">Results:</h3>
            <p>Total Blocks: {results.totalBlocks}</p>
            <p>Total Sets: {results.totalSets}</p>
            <p>Offset Bits: {results.offsetBits}</p>
            <p>Index Bits: {results.indexBits}</p>
            <p>Tag Bits: {results.tagBits}</p>
            <div className="mt-4">
              <h4 className="font-semibold">Address Breakdown:</h4>
              <div className="flex items-center space-x-1 font-mono text-sm">
                <div
                  className="bg-blue-200 text-blue-800 px-2 py-1"
                  style={{ width: `${(results.tagBits / params.addressSize) * 100}%` }}
                >
                  Tag ({results.tagBits})
                </div>
                <div
                  className="bg-green-200 text-green-800 px-2 py-1"
                  style={{ width: `${(results.indexBits / params.addressSize) * 100}%` }}
                >
                  Index ({results.indexBits})
                </div>
                <div
                  className="bg-yellow-200 text-yellow-800 px-2 py-1"
                  style={{ width: `${(results.offsetBits / params.addressSize) * 100}%` }}
                >
                  Offset ({results.offsetBits})
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Address Simulator</h3>
          <div className="space-y-2">
            <Label htmlFor="simulationAddresses">Enter addresses (one per line)</Label>
            <Textarea
              id="simulationAddresses"
              placeholder="Enter addresses (hex, one per line)"
              value={simulationAddresses}
              onChange={(e) => setSimulationAddresses(e.target.value)}
              rows={5}
            />
            <Button onClick={simulateAddresses} className="w-full">Simulate</Button>
          </div>
          {simulationResults.length > 0 && (
            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>Address</TableHead>
                  <TableHead>Set Index</TableHead>
                  <TableHead>Hit/Miss</TableHead>
                  <TableHead>State of Tags</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {simulationResults.map((result, index) => (
                  <TableRow key={index}>
                    <TableCell>{result.address}</TableCell>
                    <TableCell>{result.setIndex}</TableCell>
                    <TableCell>{result.hitMiss}</TableCell>
                    <TableCell>{result.state_of_tags}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

