import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CacheAddressCalculator from './components/cache-address-calculator'
import { MemoryBlockAnalyzer } from './components/memory-block-analyzer'
import Heap from './components/heap'
import VPNPPNCalculator from './components/vpn-ppn-calculator'

function App() {

  return (
    // <Heap />
    <VPNPPNCalculator />
  )
}

export default App
