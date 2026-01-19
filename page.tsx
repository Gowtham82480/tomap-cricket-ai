'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import ChatInterface from '@/components/ChatInterface'

type Role = 'student' | 'parent' | 'coach'

export default function Home() {
  const [selectedRole, setSelectedRole] = useState<Role>('student')

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      
      {/* Role Selector */}
      <div className="bg-card border-b border-border px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-medium text-muted-foreground mb-3">Select your role:</p>
          <div className="flex gap-2">
            {(['student', 'parent', 'coach'] as const).map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                  selectedRole === role
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ChatInterface role={selectedRole} />
    </main>
  )
}
