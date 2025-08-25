export interface CallSession {
  callId: string
  userId: string
  agentId: string
  status: 'initiated' | 'active' | 'completed' | 'failed'
  serverDuration: number
  clientDuration: number
  creditsReserved: number
  creditsUsed: number
  creditsRemaining: number
  userCredits: number
  cost: number
  isActive: boolean
}

export class CallSessionManager {
  private callId: string | null = null
  private userId: string | null = null
  private heartbeatInterval: NodeJS.Timeout | null = null
  private clientTimer: NodeJS.Timeout | null = null
  private clientDuration: number = 0
  private onStatusUpdate: ((session: CallSession) => void) | null = null
  private onCallEnded: ((session: CallSession) => void) | null = null
  private onError: ((error: string) => void) | null = null

  constructor(
    userId: string,
    onStatusUpdate?: (session: CallSession) => void,
    onCallEnded?: (session: CallSession) => void,
    onError?: (error: string) => void
  ) {
    this.userId = userId
    this.onStatusUpdate = onStatusUpdate || null
    this.onCallEnded = onCallEnded || null
    this.onError = onError || null
  }

  async startCall(agentId: string): Promise<CallSession> {
    try {
      const response = await fetch('/api/calls/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId,
          agentId
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to start call')
      }

      const data = await response.json()
      this.callId = data.callId

      // Start client-side timer
      this.startClientTimer()

      // Start heartbeat
      this.startHeartbeat()

      // Get initial status
      const session = await this.getStatus()
      return session

    } catch (error: any) {
      this.handleError(error.message)
      throw error
    }
  }

  private startClientTimer() {
    this.clientDuration = 0
    this.clientTimer = setInterval(() => {
      this.clientDuration++
    }, 1000)
  }

  private startHeartbeat() {
    if (!this.callId || !this.userId) return

    this.heartbeatInterval = setInterval(async () => {
      try {
        const response = await fetch('/api/calls/heartbeat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            callId: this.callId,
            userId: this.userId
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          
          if (error.callEnded) {
            // Call was ended due to insufficient credits
            await this.endCall()
            return
          }
          
          throw new Error(error.error || 'Heartbeat failed')
        }

        // Update status after successful heartbeat
        const session = await this.getStatus()
        if (this.onStatusUpdate) {
          this.onStatusUpdate(session)
        }

      } catch (error: any) {
        console.error('Heartbeat error:', error)
        // Don't throw here, just log - we want to keep trying
      }
    }, 30000) // 30 seconds
  }

  async getStatus(): Promise<CallSession> {
    if (!this.callId || !this.userId) {
      throw new Error('No active call session')
    }

    try {
      const response = await fetch(`/api/calls/status?callId=${this.callId}&userId=${this.userId}`)
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to get call status')
      }

      const data = await response.json()
      
      // Combine server and client data
      const session: CallSession = {
        ...data,
        clientDuration: this.clientDuration
      }

      return session

    } catch (error: any) {
      this.handleError(error.message)
      throw error
    }
  }

  async endCall(): Promise<CallSession> {
    if (!this.callId || !this.userId) {
      throw new Error('No active call session')
    }

    try {
      // Stop timers
      this.stopTimers()

      const response = await fetch('/api/calls/end', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          callId: this.callId,
          userId: this.userId,
          clientDuration: this.clientDuration
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to end call')
      }

      const data = await response.json()
      
      // Get final status
      const session = await this.getStatus()
      
      // Clear session
      this.callId = null
      
      if (this.onCallEnded) {
        this.onCallEnded(session)
      }

      return session

    } catch (error: any) {
      this.handleError(error.message)
      throw error
    }
  }

  private stopTimers() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
    
    if (this.clientTimer) {
      clearInterval(this.clientTimer)
      this.clientTimer = null
    }
  }

  private handleError(error: string) {
    if (this.onError) {
      this.onError(error)
    }
    console.error('CallSessionManager error:', error)
  }

  destroy() {
    this.stopTimers()
    this.callId = null
    this.userId = null
  }

  // Getter for current session info
  get currentSession() {
    return {
      callId: this.callId,
      userId: this.userId,
      clientDuration: this.clientDuration
    }
  }
}
