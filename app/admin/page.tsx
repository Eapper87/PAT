'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { Agent, User, Call } from '@/lib/supabase'
import Link from 'next/link'

export default function AdminPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [calls, setCalls] = useState<Call[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'agents' | 'users' | 'calls' | 'analytics'>('agents')
  const [newAgent, setNewAgent] = useState({
    name: '',
    role: 'worker' as 'receptionist' | 'worker',
    voice_id: '',
    persona: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch agents
      const { data: agentsData } = await supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false })

      if (agentsData) setAgents(agentsData)

      // Fetch users
      const { data: usersData } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (usersData) setUsers(usersData)

      // Fetch calls
      const { data: callsData } = await supabase
        .from('calls')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (callsData) setCalls(callsData)

    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const addAgent = async () => {
    if (!newAgent.name || !newAgent.voice_id || !newAgent.persona) return

    try {
      const { data, error } = await supabase
        .from('agents')
        .insert([
          {
            ...newAgent,
            availability: true
          }
        ])
        .select()
        .single()

      if (error) throw error

      setAgents(prev => [data, ...prev])
      setNewAgent({ name: '', role: 'worker', voice_id: '', persona: '' })
    } catch (error) {
      console.error('Error adding agent:', error)
    }
  }

  const toggleAgentAvailability = async (agentId: string, currentAvailability: boolean) => {
    try {
      const { error } = await supabase
        .from('agents')
        .update({ availability: !currentAvailability })
        .eq('id', agentId)

      if (error) throw error

      setAgents(prev => prev.map(agent => 
        agent.id === agentId 
          ? { ...agent, availability: !currentAvailability }
          : agent
      ))
    } catch (error) {
      console.error('Error updating agent:', error)
    }
  }

  const deleteAgent = async (agentId: string) => {
    try {
      const { error } = await supabase
        .from('agents')
        .delete()
        .eq('id', agentId)

      if (error) throw error

      setAgents(prev => prev.filter(agent => agent.id !== agentId))
    } catch (error) {
      console.error('Error deleting agent:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-neon-pink text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <Link href="/" className="text-2xl font-cyber font-bold neon-text">
          ProposalAI
        </Link>
        <div className="text-white">
          <span className="text-gray-400">Admin Panel</span>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-8 bg-dark-700 p-1 rounded-lg">
        {[
          { id: 'agents', label: 'AI Agents', icon: '🤖' },
          { id: 'users', label: 'Users', icon: '👥' },
          { id: 'calls', label: 'Calls', icon: '📞' },
          { id: 'analytics', label: 'Analytics', icon: '📊' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-neon-pink text-dark-900'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Agents Tab */}
      {activeTab === 'agents' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Add New Agent */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Add New AI Agent</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Agent Name"
                value={newAgent.name}
                onChange={(e) => setNewAgent(prev => ({ ...prev, name: e.target.value }))}
                className="px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
              />
              <select
                value={newAgent.role}
                onChange={(e) => setNewAgent(prev => ({ ...prev, role: e.target.value as any }))}
                className="px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white"
              >
                <option value="receptionist">Receptionist</option>
                <option value="worker">Worker</option>
              </select>
              <input
                type="text"
                placeholder="Voice ID"
                value={newAgent.voice_id}
                onChange={(e) => setNewAgent(prev => ({ ...prev, voice_id: e.target.value }))}
                className="px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
              />
              <input
                type="text"
                placeholder="Persona Description"
                value={newAgent.persona}
                onChange={(e) => setNewAgent(prev => ({ ...prev, persona: e.target.value }))}
                className="px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
              />
            </div>
            <button
              onClick={addAgent}
              className="mt-4 cyber-button"
            >
              Add Agent
            </button>
          </div>

          {/* Agents List */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-semibold text-white mb-4">AI Agents ({agents.length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left p-2 text-gray-400">Name</th>
                    <th className="text-left p-2 text-gray-400">Role</th>
                    <th className="text-left p-2 text-gray-400">Voice</th>
                    <th className="text-left p-2 text-gray-400">Status</th>
                    <th className="text-left p-2 text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {agents.map((agent) => (
                    <tr key={agent.id} className="border-b border-gray-700">
                      <td className="p-2 text-white">{agent.name}</td>
                      <td className="p-2 text-neon-blue capitalize">{agent.role}</td>
                      <td className="p-2 text-gray-300">{agent.voice_id}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          agent.availability 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {agent.availability ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td className="p-2">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => toggleAgentAvailability(agent.id, agent.availability)}
                            className={`px-3 py-1 rounded text-xs ${
                              agent.availability
                                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                            }`}
                          >
                            {agent.availability ? 'Disable' : 'Enable'}
                          </button>
                          <button
                            onClick={() => deleteAgent(agent.id)}
                            className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/30"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Users ({users.length})</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left p-2 text-gray-400">Email</th>
                  <th className="text-left p-2 text-gray-400">Role</th>
                  <th className="text-left p-2 text-gray-400">Credits</th>
                  <th className="text-left p-2 text-gray-400">Subscription</th>
                  <th className="text-left p-2 text-gray-400">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-700">
                    <td className="p-2 text-white">{user.email}</td>
                    <td className="p-2 text-neon-blue capitalize">{user.role}</td>
                    <td className="p-2 text-neon-green">{user.credits}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.subscription_status === 'active' 
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {user.subscription_status}
                      </span>
                    </td>
                    <td className="p-2 text-gray-300">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Calls Tab */}
      {activeTab === 'calls' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Recent Calls ({calls.length})</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left p-2 text-gray-400">User</th>
                  <th className="text-left p-2 text-gray-400">Agent</th>
                  <th className="text-left p-2 text-gray-400">Duration</th>
                  <th className="text-left p-2 text-gray-400">Cost</th>
                  <th className="text-left p-2 text-gray-400">Status</th>
                  <th className="text-left p-2 text-gray-400">Date</th>
                </tr>
              </thead>
              <tbody>
                {calls.map((call) => (
                  <tr key={call.id} className="border-b border-gray-700">
                    <td className="p-2 text-white">{call.user_id.slice(0, 8)}...</td>
                    <td className="p-2 text-neon-blue">{call.agent_id}</td>
                    <td className="p-2 text-gray-300">{call.duration}s</td>
                    <td className="p-2 text-neon-green">{call.cost} credits</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        call.status === 'completed' 
                          ? 'bg-green-500/20 text-green-400'
                          : call.status === 'active'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {call.status}
                      </span>
                    </td>
                    <td className="p-2 text-gray-300">
                      {new Date(call.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-neon-pink">{users.length}</div>
              <div className="text-gray-400 text-sm">Total Users</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-neon-blue">{agents.length}</div>
              <div className="text-gray-400 text-sm">AI Agents</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-neon-green">{calls.length}</div>
              <div className="text-gray-400 text-sm">Total Calls</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-neon-purple">
                {calls.reduce((sum, call) => sum + call.duration, 0)}
              </div>
              <div className="text-gray-400 text-sm">Total Minutes</div>
            </div>
          </div>

          {/* Revenue Chart Placeholder */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Revenue Overview</h3>
            <div className="h-64 bg-dark-700 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="text-4xl mb-2">📈</div>
                <p>Revenue charts coming soon...</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

