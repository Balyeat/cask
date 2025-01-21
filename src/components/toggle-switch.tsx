import * as React from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface ToggleSwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label: string
}

export function ToggleSwitch({ checked, onCheckedChange, label }: ToggleSwitchProps) {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="cache-type" checked={checked} onCheckedChange={onCheckedChange} />
      <Label htmlFor="cache-type">{label}</Label>
    </div>
  )
}

