import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CacheAddressCalculator from './components/cache-address-calculator'
import { MemoryBlockAnalyzer } from './components/memory-block-analyzer'
import Heap from './components/heap'
import VPNPPNCalculator from './components/vpn-ppn-calculator'
import { on } from 'events'
import CacheCalculator from './components/cache-calculator'
import NumberConverter from './components/number-converter'

function ComponentSwitcher() {
  const [selectedComponent, setSelectedComponent] = useState(0);

  const possibleComponents = [
    <CacheAddressCalculator />,
    <MemoryBlockAnalyzer bitsPerRow={32} />,
    <Heap />,
    <VPNPPNCalculator />,
    <CacheCalculator />
  ];

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedComponent(Number(event.target.value));
  };

  return (
    <div>
      <select name="component" id="component" onChange={handleChange}>
        <option value="0">Cache Address Calculator</option>
        <option value="1">Memory Block Analyzer</option>
        <option value="2">Heap</option>
        <option value="3">VPN PPN Calculator</option>
        <option value="4">Direct Mapped</option>
      </select>
      {possibleComponents[selectedComponent]}
    </div>
  );
}

export default function App() {
  return (
    <div>
      <ComponentSwitcher />
      <NumberConverter />
    </div>
  );
}
