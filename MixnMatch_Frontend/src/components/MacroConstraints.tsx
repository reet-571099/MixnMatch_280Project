import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lock, Unlock } from "lucide-react";
import { motion } from "framer-motion";

export interface MacroConstraint {
  value: number;
  locked: boolean;
  min: number;
  max: number;
}

export interface MacroConstraints {
  calories: MacroConstraint;
  protein: MacroConstraint;
  carbs: MacroConstraint;
  fats: MacroConstraint;
  time: MacroConstraint;
}

interface MacroConstraintsProps {
  constraints: MacroConstraints;
  onChange: (constraints: MacroConstraints) => void;
  disabled?: boolean;
}

export const MacroConstraintsPanel = ({ constraints, onChange, disabled }: MacroConstraintsProps) => {
  const updateConstraint = (
    key: keyof MacroConstraints,
    updates: Partial<MacroConstraint>
  ) => {
    onChange({
      ...constraints,
      [key]: { ...constraints[key], ...updates },
    });
  };

  const constraintConfigs = [
    { key: "calories" as const, label: "Calories", unit: "kcal", step: 50, color: "text-orange-600" },
    { key: "protein" as const, label: "Protein", unit: "g", step: 5, color: "text-blue-600" },
    { key: "carbs" as const, label: "Carbs", unit: "g", step: 5, color: "text-green-600" },
    { key: "fats" as const, label: "Fats", unit: "g", step: 5, color: "text-yellow-600" },
    { key: "time" as const, label: "Max Time", unit: "min", step: 5, color: "text-purple-600" },
  ];

  return (
    <motion.div
      className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
    >
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm text-foreground">Nutritional Constraints</h4>
        <p className="text-xs text-muted-foreground">
          🔒 = hard limit • 🔓 = flexible
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {constraintConfigs.map(({ key, label, unit, step, color }) => {
          const constraint = constraints[key];
          return (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor={key} className={`text-xs font-medium ${color}`}>
                  {label}
                </Label>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => updateConstraint(key, { locked: !constraint.locked })}
                  disabled={disabled}
                  title={constraint.locked ? "Hard limit" : "Flexible target"}
                >
                  {constraint.locked ? (
                    <Lock className="h-3 w-3" />
                  ) : (
                    <Unlock className="h-3 w-3 text-muted-foreground" />
                  )}
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Slider
                  id={key}
                  value={[constraint.value]}
                  onValueChange={([v]) => updateConstraint(key, { value: v })}
                  min={constraint.min}
                  max={constraint.max}
                  step={step}
                  disabled={disabled}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={constraint.value}
                  onChange={(e) => {
                    const v = parseInt(e.target.value) || constraint.min;
                    updateConstraint(key, {
                      value: Math.min(Math.max(v, constraint.min), constraint.max),
                    });
                  }}
                  min={constraint.min}
                  max={constraint.max}
                  step={step}
                  disabled={disabled}
                  className="w-16 h-8 text-xs"
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                {constraint.min}–{constraint.max} {unit}
              </p>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
