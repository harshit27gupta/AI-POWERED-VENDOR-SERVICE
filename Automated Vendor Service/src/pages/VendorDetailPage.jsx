import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { api } from '../lib/api.js'
import ChatWidget from '../components/ChatWidget.jsx'

export default function VendorDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [vendor, setVendor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    (async () => {
      setLoading(true)
      setError(null)
      try {
        // Prefer vendor passed via navigation state to avoid a failing fetch due to mismatched ids
        const stateVendor = location.state?.vendor
        if (stateVendor) {
          setVendor(stateVendor)
        } else {
          const res = await api.get(`/vendor/${id}`)
          setVendor(res.data?.vendor || res.data || null)
        }
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [id, location.state])

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-500">{error}</div>
  if (!vendor) return <div>Vendor not found</div>

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="md:col-span-2 border border-[var(--border)] rounded-lg p-4 bg-[var(--card)]">
        <h2 className="text-xl font-semibold">{vendor.name}</h2>
        <div className="text-sm text-[var(--muted)]">{vendor.location?.city}, {vendor.location?.state}</div>
        <p className="mt-2">{vendor.profile?.bio}</p>
        <div className="mt-3">
          <div className="font-semibold mb-1">Skills</div>
          <div className="flex gap-2 flex-wrap">
            {(vendor.skills || []).map(s => (
              <span key={s.name} className="border border-[var(--border)] rounded-full px-2 py-0.5 text-xs">{s.name} · {s.yearsOfExperience ?? 0}y</span>
            ))}
          </div>
        </div>
        <div className="mt-3">
          <div className="font-semibold mb-1">Services</div>
          <div className="grid gap-2">
            {(vendor.services || []).map((svc, i) => (
              <div key={i} className="border border-[var(--border)] rounded p-2 text-sm">
                <div className="font-medium">{svc.name}</div>
                <div className="text-[var(--muted)]">₹{svc.minPrice ?? 0} - ₹{svc.maxPrice ?? 0} {svc.currency || 'INR'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="border border-[var(--border)] rounded-lg p-4 h-fit bg-[var(--card)] space-y-3">
        <div className="text-sm">⭐ {vendor.rating?.average ?? 0} ({vendor.rating?.totalReviews ?? 0})</div>
        <div className="mt-2 text-sm">Availability: {vendor.availabilityStatus || 'unknown'}</div>
        <div className="mt-2 text-sm">Response: {vendor.responseTime || 'N/A'}</div>
        <button onClick={() => navigate(`/chatbot?vendorId=${id}`)} className="mt-2 w-full px-4 py-2 rounded bg-brand text-brand-fg">Open Full Chat</button>
        <ChatWidget vendorId={id} />
      </div>
    </div>
  )
}


