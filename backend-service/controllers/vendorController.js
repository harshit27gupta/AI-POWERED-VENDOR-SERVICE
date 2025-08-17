const Vendor = require('../models/Vendor');
const bcrypt = require('bcryptjs');

// POST /api/vendors/register
exports.registerVendor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      services,
      location,
      availability,
      priceRange,
    } = req.body;

    // Check if vendor already exists
    const vendorExists = await Vendor.findOne({ email });
    if (vendorExists) {
      return res.status(400).json({ message: 'Vendor already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new vendor
    const newVendor = await Vendor.create({
      name,
      email,
      password: hashedPassword,
      services,        // e.g. ['plumbing', 'photography']
      location,        // e.g. 'Delhi'
      availability,    // e.g. '9AM-6PM'
      priceRange,      // e.g. '₹1000 - ₹5000'
    });

    return res.status(201).json({
      message: 'Vendor registered successfully',
      vendor: {
        id: newVendor._id,
        name: newVendor.name,
        email: newVendor.email,
        services: newVendor.services,
      },
    });
  } catch (error) {
    console.error('Error in registerVendor:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};
