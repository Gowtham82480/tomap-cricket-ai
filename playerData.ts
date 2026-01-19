export interface PlayerSkills {
  batting: number
  bowling: number
  fielding: number
  fitness: number
}

export interface PlayerData {
  studentName: string
  name: string
  age: number
  skills: PlayerSkills
}

export interface Insight {
  type: 'strength' | 'weakness'
  skill: string
  suggestion: string
}

export const playerData = {
  name: 'Arjun Kumar',
  studentName: 'Arjun',
  age: 16,
  skills: {
    batting: 6,
    bowling: 8,
    fielding: 5,
    fitness: 4,
  } as PlayerSkills,
} as PlayerData

export function getPlayerData(): PlayerData {
  return playerData
}

// Rule-based AI logic for insights
export function generateInsights(skills: PlayerSkills): Insight[] {
  const insights: Insight[] = []

  const skillEntries = Object.entries(skills) as [keyof PlayerSkills, number][]

  skillEntries.forEach(([skill, score]) => {
    if (score < 6) {
      insights.push({
        type: 'weakness',
        skill: skill.charAt(0).toUpperCase() + skill.slice(1),
        suggestion: getWeaknessSuggestion(skill),
      })
    } else if (score >= 7) {
      insights.push({
        type: 'strength',
        skill: skill.charAt(0).toUpperCase() + skill.slice(1),
        suggestion: getStrengthSuggestion(skill),
      })
    }
  })

  return insights
}

function getWeaknessSuggestion(skill: string): string {
  const suggestions: Record<string, string> = {
    batting: 'Focus on timing and throw-down drills. Practice against different bowling styles daily.',
    bowling: 'Work on bowling accuracy and speed. Practice yorkers and slower deliveries.',
    fielding: 'Practice catching and throwing drills daily. Focus on footwork and positioning.',
    fitness: 'Increase cardio training to improve stamina. Include strength training 3-4 times per week.',
  }
  return suggestions[skill] || 'Practice this skill more frequently.'
}

function getStrengthSuggestion(skill: string): string {
  const suggestions: Record<string, string> = {
    batting: 'Your batting is strong! Focus on maintaining consistency and adapting to different conditions.',
    bowling: 'Excellent bowling skills! Keep perfecting your variations and maintain your performance.',
    fielding: 'Great fielding ability! Continue to stay sharp and help teammates improve.',
    fitness: 'Excellent fitness level! Maintain your training routine and focus on nutrition.',
  }
  return suggestions[skill] || 'Keep up the great work with this skill!'
}

// Get improvement areas
export function getImprovementAreas(skills: PlayerSkills): string[] {
  return Object.entries(skills)
    .filter(([, score]) => score < 6)
    .map(([skill]) => skill.charAt(0).toUpperCase() + skill.slice(1))
}

// Get strengths
export function getStrengths(skills: PlayerSkills): string[] {
  return Object.entries(skills)
    .filter(([, score]) => score >= 7)
    .map(([skill]) => skill.charAt(0).toUpperCase() + skill.slice(1))
}

// Monthly progress simulation
export function getMonthlyProgress(): Record<string, number> {
  return {
    'Week 1': 5.5,
    'Week 2': 5.8,
    'Week 3': 6.0,
    'Week 4': 6.2,
  }
}
