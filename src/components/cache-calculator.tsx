import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { hexToBinary, extractBits, formatHexAddress, binaryToHex } from "@/../utils/addressConversion"
import { ToggleSwitch } from "@/components/toggle-switch"

interface AddressBreakdown {
  address: string
  tag: string
  setIndex: string
  blockOffset: string
  isHit: boolean
  tagState: string
}

interface CacheSet {
  tags: string[]
}

export default function CacheCalculator() {
  const [cacheSize, setCacheSize] = useState("")
  const [associativity, setAssociativity] = useState("")
  const [addressBits, setAddressBits] = useState("")
  const [blockSize, setBlockSize] = useState("")
  const [address, setAddress] = useState("")
  const [breakdowns, setBreakdowns] = useState<AddressBreakdown[]>([])
  const [bits, setBits] = useState<{
    blockOffset: number
    setIndex: number
    cacheTag: number
  } | null>(null)
  const [cacheSets, setCacheSets] = useState<Map<string, CacheSet>>(new Map())
  const [isNWaySetAssociative, setIsNWaySetAssociative] = useState(true)

  const calculateBits = () => {
    const cacheSizeBytes = Number.parseInt(cacheSize) * 1024
    const blockSizeBytes = Number.parseInt(blockSize)
    const nWay = isNWaySetAssociative ? Number.parseInt(associativity) : 1
    const addrBits = Number.parseInt(addressBits)

    const blockOffsetBits = Math.log2(blockSizeBytes)
    const numberOfSets = cacheSizeBytes / (nWay * blockSizeBytes)
    const setIndexBits = Math.log2(numberOfSets)
    const tagBits = addrBits - blockOffsetBits - setIndexBits

    setBits({
      blockOffset: blockOffsetBits,
      setIndex: setIndexBits,
      cacheTag: tagBits,
    })

    // Reset cache sets for new configuration
    setCacheSets(new Map())
    setBreakdowns([])
  }

  const updateCacheSet = (setIndex: string, tag: string, nWay: number): string[] => {
    const currentSet = cacheSets.get(setIndex) || { tags: [] }
    const updatedSet = { ...currentSet }

    if (isNWaySetAssociative) {
      // Remove tag if it exists (to move it to most recent)
      updatedSet.tags = updatedSet.tags.filter((t) => t !== tag)

      // Add new tag
      updatedSet.tags.push(tag)

      // Remove oldest tag if exceeding n-way
      if (updatedSet.tags.length > nWay) {
        updatedSet.tags.shift() // Remove oldest tag
      }
    } else {
      // Direct-mapped: just replace the tag
      updatedSet.tags = [tag]
    }

    // Update cache sets
    setCacheSets(new Map(cacheSets.set(setIndex, updatedSet)))

    return updatedSet.tags
  }

  const formatTagState = (tags: string[]): string => {
    return [...tags].reverse().join(",")
  }

  const translateAddress = () => {
    if (!bits || !address) return

    const formattedAddress = formatHexAddress(address)
    const binaryAddress = hexToBinary(formattedAddress)
    const nWay = isNWaySetAssociative ? Number.parseInt(associativity) : 1

    const tagBinary = extractBits(binaryAddress, 0, bits.cacheTag)
    const setIndexBinary = extractBits(binaryAddress, bits.cacheTag, bits.setIndex)
    const blockOffsetBinary = extractBits(binaryAddress, bits.cacheTag + bits.setIndex, bits.blockOffset)

    const tag = binaryToHex(tagBinary)
    const setIndex = binaryToHex(setIndexBinary)
    const blockOffset = Number.parseInt(blockOffsetBinary, 2).toString(16)

    // Check if tag exists in set
    const currentSet = cacheSets.get(setIndex)
    const isHit = currentSet?.tags.includes(tag) || false

    // Update cache set and get new state
    const updatedTags = updateCacheSet(setIndex, tag, nWay)

    const newBreakdown = {
      address: formattedAddress,
      tag,
      setIndex,
      blockOffset: "0x" + blockOffset,
      isHit,
      tagState: formatTagState(updatedTags),
    }

    setBreakdowns((prev) => [...prev, newBreakdown])
  }

  const clearCache = () => {
    setCacheSets(new Map())
    setBreakdowns([])
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Cache Address Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ToggleSwitch
          checked={isNWaySetAssociative}
          onCheckedChange={(checked) => {
            setIsNWaySetAssociative(checked)
            clearCache()
          }}
          label={isNWaySetAssociative ? "N-Way Set Associative" : "Direct Mapped"}
        />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Cache Size (KB)</label>
            <Input
              type="number"
              value={cacheSize}
              onChange={(e) => setCacheSize(e.target.value)}
              placeholder="e.g., 32"
            />
          </div>
          {isNWaySetAssociative && (
            <div className="space-y-2">
              <label className="text-sm font-medium">N-Way Set Associative</label>
              <Input
                type="number"
                value={associativity}
                onChange={(e) => setAssociativity(e.target.value)}
                placeholder="e.g., 8"
              />
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium">Address Bits</label>
            <Input
              type="number"
              value={addressBits}
              onChange={(e) => setAddressBits(e.target.value)}
              placeholder="e.g., 32"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Block Size (bytes)</label>
            <Input
              type="number"
              value={blockSize}
              onChange={(e) => setBlockSize(e.target.value)}
              placeholder="e.g., 64"
            />
          </div>
        </div>

        <Button
          onClick={calculateBits}
          className="w-full"
          disabled={!cacheSize || ((!isNWaySetAssociative || associativity) && !addressBits) || !blockSize}
        >
          Calculate Bits
        </Button>
        <Button onClick={clearCache} variant="outline" className="w-full">
          Clear Cache
        </Button>

        {bits && (
          <>
            <div className="mt-4 space-y-2 p-4 bg-muted rounded-lg">
              <p className="font-medium">Bit Allocation:</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Block Offset Bits:</div>
                <div>{bits.blockOffset}</div>
                <div>Set Index Bits:</div>
                <div>{bits.setIndex}</div>
                <div>Cache Tag Bits:</div>
                <div>{bits.cacheTag}</div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Enter Address (hex)</label>
              <div className="flex gap-2">
                <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="e.g., 0x0100004" />
                <Button onClick={translateAddress}>Translate</Button>
              </div>
            </div>

            {breakdowns.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow className="divide-x divide-border">
                    {isNWaySetAssociative ? (
                      <>
                        <TableHead className="w-[200px]">Reference</TableHead>
                        <TableHead className="w-[100px]">Set Index</TableHead>
                        <TableHead className="w-[80px]">Hit/Miss</TableHead>
                        <TableHead className="flex-1">State of Tags</TableHead>
                      </>
                    ) : (
                      <>
                        <TableHead className="w-[200px]">Reference</TableHead>
                        <TableHead className="w-[150px]">Tag</TableHead>
                        <TableHead className="w-[150px]">Set Index</TableHead>
                        <TableHead className="w-[150px]">Block Offset</TableHead>
                        <TableHead className="w-[100px]">Hit/Miss</TableHead>
                      </>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {breakdowns.map((breakdown, i) => (
                    <TableRow key={i} className="divide-x divide-border">
                      {isNWaySetAssociative ? (
                        <>
                          <TableCell className="font-mono">{breakdown.address}</TableCell>
                          <TableCell className="font-mono">{breakdown.setIndex}</TableCell>
                          <TableCell className={breakdown.isHit ? "text-green-500" : "text-red-500"}>
                            {breakdown.isHit ? "hit" : "miss"}
                          </TableCell>
                          <TableCell className="font-mono">{breakdown.tagState}</TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell className="font-mono">{breakdown.address}</TableCell>
                          <TableCell className="font-mono">{breakdown.tag}</TableCell>
                          <TableCell className="font-mono">{breakdown.setIndex}</TableCell>
                          <TableCell className="font-mono">{breakdown.blockOffset}</TableCell>
                          <TableCell className={breakdown.isHit ? "text-green-500" : "text-red-500"}>
                            {breakdown.isHit ? "hit" : "miss"}
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

