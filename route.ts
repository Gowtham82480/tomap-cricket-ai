import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: any[] } = await req.json();
  const role = req.headers.get('x-role') || 'student';

  // Get the last user message
  const lastMessage = messages[messages.length - 1]?.content || '';

  // Generate mock response based on role and user input
  const mockResponse = generateMockResponse(role, lastMessage);

  // Stream the response
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // Send the full response at once for simplicity
      const escapedResponse = mockResponse.replace(/"/g, '\\"');
      const data = `0:"${escapedResponse}"\n`;
      controller.enqueue(encoder.encode(data));
      
      // Send finish message
      controller.enqueue(encoder.encode('e:[]\n'));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

function generateMockResponse(role: string, userInput: string): string {
  const lowerInput = userInput.toLowerCase();

  if (role === 'student') {
    if (lowerInput.includes('improve') || lowerInput.includes('weak')) {
      return 'Based on typical areas, I recommend focusing on your fielding consistency and fitness conditioning. Try practicing catching drills for 30 minutes daily and running sprint intervals 3 times a week. Start with short sprints of 30 meters with 15-second rest periods. Track your progress weekly!';
    }
    if (lowerInput.includes('bowling') || lowerInput.includes('ball')) {
      return 'For bowling improvement, focus on your run-up consistency and follow-through. Practice your bowling action for 20 minutes daily, starting slowly to perfect your technique before increasing pace. Record your bowling on video to analyze your action. Work on line and length accuracy before worrying about variations.';
    }
    if (lowerInput.includes('batting') || lowerInput.includes('bat')) {
      return 'Great question! For batting practice, focus on watching the ball carefully and playing along the ground initially. Practice with a cricket coach 2-3 times weekly. Work on your stance, grip, and footwork. Start practicing against slower bowls to build confidence, then gradually increase pace.';
    }
    if (lowerInput.includes('tip') || lowerInput.includes('today')) {
      return 'Today\'s coaching tip: Always warm up properly before training! Spend 10 minutes doing dynamic stretches and light jogging. This prevents injuries and prepares your muscles for intense activity. Follow this with skill-specific warm-ups. Never skip this step!';
    }
    if (lowerInput.includes('drill')) {
      return 'Here are effective drills for you: 1) Catch practice - 50 catches daily from various angles. 2) Batting net session - 45 minutes focusing on one shot. 3) Run-up practice - bowling action without the ball for 20 reps. 4) Agility ladder work - 3 sets of 30 seconds.';
    }
    return 'That\'s a great question! I\'d recommend focusing on the fundamentals of cricket - good stance, footwork, and balance. Practice consistently, at least 3-4 times a week. Work with your coach on technique and gradually increase intensity. Remember, improvement takes time and dedication!';
  }

  if (role === 'parent') {
    if (lowerInput.includes('progress') || lowerInput.includes('perform')) {
      return 'Your child is making good progress! They show promise in bowling with strong technique. Main areas to focus on are fitness conditioning and fielding consistency. Encourage regular practice at least 3-4 times weekly. Support their training schedule and ensure they get adequate rest and nutrition.';
    }
    if (lowerInput.includes('strength') || lowerInput.includes('good')) {
      return 'Your child\'s main strengths are bowling accuracy and cricket awareness. They demonstrate good understanding of the game and commitment to practice. Continue encouraging them and celebrate their achievements. Consider professional coaching 2-3 times weekly to accelerate development.';
    }
    if (lowerInput.includes('improve') || lowerInput.includes('weak')) {
      return 'Areas needing improvement include fitness levels and fielding skills. Encourage them to do cardiovascular training like running or cycling 2-3 times weekly. Fielding practice should include catching drills and reaction exercises. Ensure they\'re getting adequate sleep (8-9 hours) for proper recovery.';
    }
    if (lowerInput.includes('age') || lowerInput.includes('development')) {
      return 'At their current age, it\'s important to focus on building fundamentals and maintaining interest in the sport. Training should be age-appropriate - not too intense but consistent. Balance cricket with academics and other activities. This is a great time to develop love for the game!';
    }
    return 'Great question! Supporting your child\'s cricket journey is wonderful. Ensure they train consistently, maintain good fitness, eat healthily, and get enough rest. Attend their matches when possible for motivation. Consider cricket coaching for skill development. Most importantly, keep it fun!';
  }

  if (role === 'coach') {
    if (lowerInput.includes('skill') || lowerInput.includes('focus')) {
      return 'Key skill development areas: 1) Batting - Focus on technique and shot selection under pressure. 2) Bowling - Work on accuracy and variations. 3) Fielding - Practice positioning and decision-making. 4) Fitness - Build strength and conditioning. Create periodized training programs targeting each area over 12-week cycles.';
    }
    if (lowerInput.includes('training') || lowerInput.includes('plan')) {
      return 'Effective training plan structure: Weekly schedule should include 3-4 skill sessions (90 mins each), 2 fitness sessions (60 mins), and 1 match practice. Periodize training into phases: foundation building (4 weeks), skill refinement (4 weeks), competition prep (4 weeks). Monitor progress with metrics and adjust accordingly.';
    }
    if (lowerInput.includes('strategy') || lowerInput.includes('game')) {
      return 'Strategic approach depends on player strengths. If strong bowlers, build bowling depth. Emphasize aggressive batting strategies early on. In fielding, position players based on strengths and opponent patterns. Develop match situations in practice. Create contingency plans for different match scenarios.';
    }
    if (lowerInput.includes('analyze') || lowerInput.includes('performance')) {
      return 'Performance analysis framework: Track key metrics - batting average, bowling economy, fielding efficiency. Use video analysis for technique assessment. Conduct post-match reviews identifying strengths and improvement areas. Set measurable goals monthly. Regular feedback sessions with players. Adjust coaching strategies based on data.';
    }
    return 'As a coach, focus on holistic player development. Combine technical skill training with tactical understanding and physical fitness. Create a supportive environment that encourages learning from failures. Set clear performance benchmarks. Regular communication with players about their progress and goals is essential for development.';
  }

  return 'I\'m here to help with cricket coaching and player development. Ask me about training plans, technique tips, performance analysis, or any cricket-related questions!';
}

function getSystemPrompt(role: string): string {
  const rolePrompts: Record<string, string> = {
    student: `You are ToMapp, an AI cricket coaching assistant for students. You provide personalized coaching tips, training routines, and performance improvement advice. Be encouraging, specific about cricket techniques, and ask follow-up questions to understand the student's skill level and goals. Focus on batting, bowling, fielding, and fitness. Keep responses concise and actionable.`,
    
    parent: `You are ToMapp, an AI cricket coaching advisor for parents. You provide insights about their child's cricket progress, answer questions about training, help parents understand cricket development stages, and suggest ways parents can support their child's cricket journey. Be supportive, informative, and focus on overall development. Keep responses clear and easy to understand for non-experts.`,
    
    coach: `You are ToMapp, an AI cricket coaching strategy assistant for coaches. You help with training plan suggestions, performance analysis, team strategy discussions, player development strategies, and cricket-specific techniques. Provide detailed, professional coaching insights. Discuss batting techniques, bowling strategies, fielding positions, fitness regimens, and team tactics. Be knowledgeable and technical.`,
  };

  return rolePrompts[role] || rolePrompts['student'];
}
