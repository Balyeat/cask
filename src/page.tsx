import CacheAddressCalculator from "./cache-address-calculator"

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cache Address Calculator and Simulator</h1>
      <CacheAddressCalculator />
    </main>
  )
}

