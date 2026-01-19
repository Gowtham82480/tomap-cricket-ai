import { PlayerData } from './playerData'

type Role = 'student' | 'parent' | 'coach'

const strengthSkills = (data: PlayerData) => {
  return Object.entries(data.skills)
    .filter(([_, score]) => score >= 7)
    .map(([skill]) => skill)
}

const weaknessSkills = (data: PlayerData) => {
  return Object.entries(data.skills)
    .filter(([_, score]) => score < 6)
    .map(([skill]) => skill)
}

const improvementTips: Record<string, string> = {
  batting:
    'Focus on timing and throw-down drills. Practice against different bowling styles and work on footwork.',
  bowling:
    'Maintain a consistent run-up and work on yorkers and short balls. Practice variations like spin.',
  fielding:
    'Practice catching and throwing drills daily. Work on anticipation and quick movements.',
  fitness:
    'Increase cardio training to improve stamina. Do interval training and functional fitness exercises.',
}

const dailyTips = [
  'Start your practice with a 10-minute warm-up to prevent injuries.',
  'Stay hydrated throughout the day - drink 8-10 glasses of water.',
  'Practice for at least 1-2 hours focusing on weak areas.',
  'Record and review your batting videos to identify mistakes.',
  'Practice with a partner to simulate match conditions.',
  'Get 8 hours of sleep for better recovery and focus.',
  'Do strength training at least 3 times a week.',
  'Practice meditation for 10 minutes to improve focus.',
]

export function generateChatResponse(
  userMessage: string,
  role: Role,
  playerData: PlayerData,
): string {
  const lowerMessage = userMessage.toLowerCase()

  // Common responses
  if (
    lowerMessage.includes('hi') ||
    lowerMessage.includes('hello') ||
    lowerMessage.includes('hey')
  ) {
    return `Hi! I'm here to help. ${role === 'student' ? 'Tell me what skills you want to improve or ask for training tips.' : role === 'parent' ? 'I can help you understand your child\'s progress and training focus.' : 'Let me help you analyze performance and create training plans.'}`
  }

  if (lowerMessage.includes('thanks') || lowerMessage.includes('thank you')) {
    return 'You\'re welcome! Feel free to ask me anything else about cricket training and improvement.'
  }

  // Student-specific responses
  if (role === 'student') {
    if (
      lowerMessage.includes('improve') ||
      lowerMessage.includes('weak') ||
      lowerMessage.includes('need work')
    ) {
      const weaknesses = weaknessSkills(playerData)
      if (weaknesses.length === 0) {
        return `Great job! Your skills are well balanced. Keep working on maintaining your ${strengthSkills(playerData).join(' and ')}.`
      }
      return `You need to focus on: ${weaknesses.join(', ')}. ${weaknesses.map((skill) => improvementTips[skill]).join(' ')}`
    }

    if (
      lowerMessage.includes('tip') ||
      lowerMessage.includes('advice') ||
      lowerMessage.includes('suggestion')
    ) {
      const randomTip = dailyTips[Math.floor(Math.random() * dailyTips.length)]
      return `Here's a tip for today: ${randomTip}`
    }

    if (lowerMessage.includes('strength') || lowerMessage.includes('good')) {
      const strengths = strengthSkills(playerData)
      if (strengths.length === 0) {
        return 'Keep practicing consistently. Your skills will improve with dedication.'
      }
      return `Your strengths are: ${strengths.join(', ')}. These are great areas - keep working on them!`
    }

    if (lowerMessage.includes('drill') || lowerMessage.includes('practice')) {
      const weaknesses = weaknessSkills(playerData)
      if (weaknesses.length === 0) {
        return 'Focus on practicing against different bowling styles and working on variations to take your game to the next level.'
      }
      const skill = weaknesses[0]
      return `For your ${skill} practice: ${improvementTips[skill]} Practice for 1-2 hours daily and track your progress.`
    }

    if (
      lowerMessage.includes('score') ||
      lowerMessage.includes('performance') ||
      lowerMessage.includes('how am i')
    ) {
      return `Your current scores: Batting ${playerData.skills.batting}/10, Bowling ${playerData.skills.bowling}/10, Fielding ${playerData.skills.fielding}/10, Fitness ${playerData.skills.fitness}/10. Keep practicing and you'll improve!`
    }

    return "That's a great question! Remember, consistent practice and focus on your weak areas will help you improve. What specific area would you like to work on?"
  }

  // Parent-specific responses
  if (role === 'parent') {
    if (
      lowerMessage.includes('perform') ||
      lowerMessage.includes('how is') ||
      lowerMessage.includes('progress')
    ) {
      const strengths = strengthSkills(playerData)
      const weaknesses = weaknessSkills(playerData)
      return `${playerData.studentName} is doing well overall. Strengths: ${strengths.length > 0 ? strengths.join(', ') : 'balanced'}, Areas to improve: ${weaknesses.length > 0 ? weaknesses.join(', ') : 'all well balanced'}. I recommend continuing current training.`
    }

    if (lowerMessage.includes('concern') || lowerMessage.includes('worry')) {
      const weaknesses = weaknessSkills(playerData)
      if (weaknesses.length === 0) {
        return `No concerns! ${playerData.studentName} is performing well across all areas. Keep supporting their training.`
      }
      return `Focus areas: ${weaknesses.join(', ')}. Encourage daily practice and ensure proper recovery. These will improve with consistent effort.`
    }

    if (lowerMessage.includes('strength')) {
      const strengths = strengthSkills(playerData)
      return `${playerData.studentName}'s strengths are: ${strengths.length > 0 ? strengths.join(', ') : 'developing well'}. Encourage them to continue building on these while improving other areas.`
    }

    if (lowerMessage.includes('focus') || lowerMessage.includes('training')) {
      const weaknesses = weaknessSkills(playerData)
      return `Training should focus on: ${weaknesses.length > 0 ? weaknesses.join(' and ') : 'consistency and advanced techniques'}. Ensure the coach includes skill-specific drills in practice sessions.`
    }

    if (lowerMessage.includes('what should')) {
      return `You should: 1) Ensure ${playerData.studentName} practices 1-2 hours daily 2) Support with proper nutrition and hydration 3) Encourage rest and recovery 4) Attend coaching sessions regularly.`
    }

    return "That's important to know. I recommend staying in touch with the coach for detailed progress updates and setting realistic improvement targets."
  }

  // Coach-specific responses
  if (role === 'coach') {
    if (lowerMessage.includes('gap') || lowerMessage.includes('skill')) {
      const weaknesses = weaknessSkills(playerData)
      if (weaknesses.length === 0) {
        return `All skills are well developed. Focus on advanced techniques and competitive match strategies.`
      }
      return `Key gaps to address: ${weaknesses.join(', ')}. Allocate specific drill time for each weakness in weekly training schedules.`
    }

    if (lowerMessage.includes('plan') || lowerMessage.includes('focus')) {
      const weaknesses = weaknessSkills(playerData)
      const strengths = strengthSkills(playerData)
      return `Weekly Plan: 40% on ${weaknesses.length > 0 ? weaknesses[0] : 'all-round skills'}, 30% on strengthening ${strengths[0] || 'strong areas'}, 30% on fitness and strategy. Include match simulations.`
    }

    if (lowerMessage.includes('analyze') || lowerMessage.includes('performance')) {
      return `Analysis: ${playerData.studentName} shows promise. ${strengthSkills(playerData).length > 0 ? `Strengths in ${strengthSkills(playerData).join(' and ')}. ` : ''}Focus coaching on ${weaknessSkills(playerData).join(' and ')}. Recommend intensive drills and regular performance reviews.`
    }

    if (lowerMessage.includes('session') || lowerMessage.includes('practice')) {
      const weaknesses = weaknessSkills(playerData)
      return `Session structure: 15min warm-up, 40min focused drills on ${weaknesses.length > 0 ? weaknesses[0] : 'technique'}, 20min match simulation, 10min cool-down and review. Track improvements weekly.`
    }

    if (lowerMessage.includes('strategy') || lowerMessage.includes('improve')) {
      return `Strategic approach: 1) Identify technical gaps 2) Create targeted drill plans 3) Monitor weekly progress 4) Adjust intensity based on performance 5) Build match-ready confidence. Regular video reviews help.`
    }

    return 'Good point. Consider implementing skill-specific training modules and regular performance assessments to track player development.'
  }

  // Default fallback
  return "I'm here to help! Could you ask more specifically about skills, training, or performance? I'll provide the best guidance based on your role."
}
