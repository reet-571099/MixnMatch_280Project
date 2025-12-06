import type { BackendConstraints } from './ragClient';

// MacroConstraints type from ChatInterface
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

// Mapping of frontend dietary chip values to backend dietary strings
const DIETARY_CHIP_MAP: Record<string, string> = {
  vegan: 'Vegan',
  glutenfree: 'Gluten-Free',
  keto: 'Keto',
  halal: 'Halal',
  dairyfree: 'Dairy-Free',
};

/**
 * Map frontend dietary chips to backend dietary preference strings
 * @param chips - Array of dietary chip values from frontend (e.g., ['vegan', 'glutenfree'])
 * @returns Array of formatted dietary strings (e.g., ['Vegan', 'Gluten-Free'])
 */
function mapChipsToDietary(chips: string[]): string[] {
  return chips
    .map(chip => DIETARY_CHIP_MAP[chip])
    .filter(Boolean); // Remove any undefined values
}

/**
 * Map frontend MacroConstraints to backend constraint format
 *
 * Strategy:
 * - Locked constraints: Create narrow range around target value (±50 kcal, ±5g for macros)
 * - Unlocked constraints: Use full min/max range from slider
 *
 * @param constraints - Frontend macro constraints object
 * @param selectedChips - Array of selected dietary chip values
 * @returns Backend constraints object
 */
export function mapConstraintsToBackend(
  constraints: MacroConstraints,
  selectedChips: string[]
): BackendConstraints {
  const backendConstraints: BackendConstraints = {};

  // Map calories constraint
  if (constraints.calories) {
    if (constraints.calories.locked) {
      // Locked: narrow range around target value (±50 kcal)
      backendConstraints.calories = {
        min: Math.max(constraints.calories.min, constraints.calories.value - 50),
        max: Math.min(constraints.calories.max, constraints.calories.value + 50),
      };
    } else {
      // Unlocked: use full range as soft preference
      backendConstraints.calories = {
        min: constraints.calories.min,
        max: constraints.calories.max,
      };
    }
  }

  // Map protein constraint
  if (constraints.protein) {
    if (constraints.protein.locked) {
      // Locked: narrow range around target value (±5g)
      backendConstraints.protein = {
        min: Math.max(constraints.protein.min, constraints.protein.value - 5),
        max: Math.min(constraints.protein.max, constraints.protein.value + 5),
      };
    } else {
      // Unlocked: use full range as soft preference
      backendConstraints.protein = {
        min: constraints.protein.min,
        max: constraints.protein.max,
      };
    }
  }

  // Map carbs constraint
  if (constraints.carbs) {
    if (constraints.carbs.locked) {
      // Locked: narrow range around target value (±5g)
      backendConstraints.carbs = {
        min: Math.max(constraints.carbs.min, constraints.carbs.value - 5),
        max: Math.min(constraints.carbs.max, constraints.carbs.value + 5),
      };
    } else {
      // Unlocked: use full range as soft preference
      backendConstraints.carbs = {
        min: constraints.carbs.min,
        max: constraints.carbs.max,
      };
    }
  }

  // Map fats constraint
  if (constraints.fats) {
    if (constraints.fats.locked) {
      // Locked: narrow range around target value (±5g)
      backendConstraints.fats = {
        min: Math.max(constraints.fats.min, constraints.fats.value - 5),
        max: Math.min(constraints.fats.max, constraints.fats.value + 5),
      };
    } else {
      // Unlocked: use full range as soft preference
      backendConstraints.fats = {
        min: constraints.fats.min,
        max: constraints.fats.max,
      };
    }
  }

  // Map time constraint (always use the value as max time)
  if (constraints.time) {
    backendConstraints.maxTime = constraints.time.value;
  }

  // Map dietary chips to dietary preferences
  if (selectedChips.length > 0) {
    backendConstraints.dietary = mapChipsToDietary(selectedChips);
  }

  // Initialize empty arrays for allergens and dislikes (can be populated later)
  backendConstraints.allergens = [];
  backendConstraints.dislikes = [];

  return backendConstraints;
}
