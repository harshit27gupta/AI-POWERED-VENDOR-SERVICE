import React, { useEffect, useRef, useState } from 'react'
import { getCurrentUser } from '../lib/api.js'
import { useNavigate } from 'react-router-dom'
import { getSocket, sendUserMessage, startConversation } from '../lib/socket.js'

export default function ChatWidget({ vendorId }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [conversationId] = useState(() => `c_${Date.now()}`)
  const [userId, setUserId] = useState('')
  const listRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      const user = await getCurrentUser()
      if (user?.id) setUserId(user.id)
    })()
  }, [])

  useEffect(() => {
    const s = getSocket()
    const onReady = () => {}
    const onUser = ({ message }) => {
      setMessages(prev => [...prev, { role: 'user', content: message }])
    }
    const onAssistant = ({ message }) => {
      setMessages(prev => [...prev, { role: 'assistant', content: message }])
    }
    const onAgreementReady = ({ agreement }) => {
      if (agreement) {
        setMessages(prev => [...prev, { role: 'system', content: `[Agreement ready] ${agreement.summary || ''}` }])
        setPendingAgreement(agreement)
      }
    }
    s.on('chat:ready', onReady)
    s.on('chat:user_message', onUser)
    s.on('chat:assistant_message', onAssistant)
    s.on('chat:agreement_ready', onAgreementReady)
    if (vendorId) startConversation({ conversationId, vendorId, userId })
    return () => {
      s.off('chat:ready', onReady)
      s.off('chat:user_message', onUser)
      s.off('chat:assistant_message', onAssistant)
      s.off('chat:agreement_ready', onAgreementReady)
    }
  }, [conversationId, vendorId, userId])

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages])

  const send = () => {
    const text = input.trim()
    if (!text) return
    sendUserMessage({ conversationId, vendorId, message: text })
    setInput('')
  }

  const [pendingAgreement, setPendingAgreement] = useState(null)
  const agree = () => {
    if (!pendingAgreement) return
    const s = getSocket()
    s.emit('chat:client_agree', { conversationId, vendorId, clientId: userId, agreement: pendingAgreement })
    setMessages(prev => [...prev, { role: 'system', content: 'You agreed to the proposal.' }])
    // Route to summary page with local chat history
    const history = messages.concat([{ role: 'system', content: JSON.stringify(pendingAgreement) }])
    navigate('/chat-summary', { state: { conversationId, history } })
  }

  return (
    <div className="border border-[var(--border)] rounded-lg p-3 bg-[var(--card)]">
      <div className="text-sm font-semibold mb-2">Chat with AI Rep</div>
      <div ref={listRef} className="h-64 overflow-y-auto bg-slate-900/20 dark:bg-slate-900/20 rounded p-2 space-y-2">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <div className={m.role === 'user' ? 'inline-block bg-purple-600 text-white px-3 py-2 rounded-xl' : 'inline-block bg-slate-700 text-white px-3 py-2 rounded-xl'}>
              {m.content}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' ? send() : null} className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="Type a message" />
        <button onClick={send} className="px-3 py-2 rounded bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold">Send</button>
      </div>
      {pendingAgreement && (
        <div className="mt-2 flex items-center justify-between bg-yellow-500/10 border border-yellow-500/30 rounded p-2 text-sm">
          <div>Agreement proposed. Summary: {pendingAgreement.summary || 'N/A'}</div>
          <button onClick={agree} className="px-2 py-1 rounded bg-yellow-600 text-white">Agree</button>
        </div>
      )}
    </div>
  )
}


