'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Send, Lightbulb } from 'lucide-react'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
}

type Role = 'student' | 'parent' | 'coach'

const roleGreetings: Record<Role, string> = {
  student: "Hi! I'm your cricket coaching AI assistant. I can help you improve your skills, answer questions about drills, and give you tips. What would you like to know?",
  parent: "Hello! I'm the ToMapp cricket coaching AI. I can help you understand your child's progress, strengths, and areas for improvement. What would you like to know?",
  coach: "Welcome Coach! I'm here to help you analyze player performance, suggest training focus areas, and provide coaching strategies. How can I assist you today?",
}

const suggestedQuestions: Record<Role, string[]> = {
  student: [
    "What should I improve?",
    "Give me today's tip",
    "How can I improve my bowling?",
    "What drills should I practice?",
  ],
  parent: [
    'How is my child performing?',
    'What are the strengths?',
    'What needs improvement?',
    'What should we focus on?',
  ],
  coach: [
    'What are the skill gaps?',
    'What should be the focus?',
    'Create a practice plan',
    'Analyze the performance',
  ],
}

export default function ChatInterface({ role }: { role: Role }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      content: roleGreetings[role],
      role: 'assistant',
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setShowSuggestions(false)
    setIsLoading(true)

    try {
      console.log('[v0] Sending message:', input)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-role': role,
        },
        body: JSON.stringify({
          messages: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      console.log('[v0] Response received, reading stream...')
      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')

      let aiResponse = ''
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        console.log('[v0] Received chunk:', chunk)

        // Parse the streaming format
        const lines = chunk.split('\n').filter((line) => line.trim())
        for (const line of lines) {
          if (line.startsWith('0:"')) {
            // Extract text from "0:"text"" format
            const match = line.match(/0:"(.*)"/);
            if (match) {
              aiResponse += match[1].replace(/\\"/g, '"');
            }
          }
        }
      }

      console.log('[v0] Final AI response:', aiResponse)

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse || 'I apologize, but I could not generate a response. Please try again.',
        role: 'assistant',
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error('[v0] Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
  }

  return (
    <div className="flex-1 flex flex-col p-4 max-w-4xl w-full mx-auto">
      {/* Chat Messages Area */}
      <Card className="flex-1 flex flex-col mb-4 bg-card border border-border overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-muted text-foreground rounded-bl-none border border-border'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted text-foreground px-4 py-3 rounded-lg rounded-bl-none border border-border">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {showSuggestions && messages.length <= 1 && (
          <div className="px-6 pb-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-3 flex items-center gap-2">
              <Lightbulb size={14} />
              Try asking:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {suggestedQuestions[role].map((question, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  className="text-xs justify-start h-auto py-2 px-3 bg-transparent"
                  onClick={() => handleSuggestedQuestion(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Input Area */}
      <div className="flex gap-2">
        <Input
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSendMessage()
            }
          }}
          className="flex-1"
          disabled={isLoading}
        />
        <Button
          onClick={handleSendMessage}
          disabled={!input.trim() || isLoading}
          className="bg-primary hover:bg-primary/90"
        >
          <Send size={18} />
        </Button>
      </div>
    </div>
  )
}
