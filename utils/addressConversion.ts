export function hexToBinary(hex: string): string {
  return Number.parseInt(hex.replace("0x", ""), 16).toString(2).padStart(32, "0")
}

export function extractBits(binary: string, start: number, length: number): string {
  return binary.slice(start, start + length).padStart(length, "0")
}

export function formatHexAddress(address: string): string {
  return "0x" + Number.parseInt(address.replace("0x", ""), 16).toString(16)
}

export function binaryToHex(binary: string): string {
  return "0x" + Number.parseInt(binary, 2).toString(16)
}

