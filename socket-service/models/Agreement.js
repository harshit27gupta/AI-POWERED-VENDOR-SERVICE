import mongoose from 'mongoose'

const agreementSchema = new mongoose.Schema({
  conversationId: { type: String, required: true, index: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', index: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', index: true },
  summary: { type: String },
  budget: { type: String },
  timeline: { type: String },
  scope: { type: String },
  status: { type: String, enum: ['proposed', 'client_agreed', 'vendor_accepted'], default: 'proposed' }
}, { timestamps: true })

const Agreement = mongoose.model('Agreement', agreementSchema)

export default Agreement



