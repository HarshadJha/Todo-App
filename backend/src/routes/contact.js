const express = require('express');
const router = express.Router();
const { sendContactConfirmationEmail } = require('../utils/sendEmail');

// ─────────────────────────────────────────────
// @route   POST /api/contact
// @desc    Handle contact form submission
// @access  Public
// ─────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    if (message.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Message must be at least 10 characters.' });
    }

    await sendContactConfirmationEmail(email, name, message);

    res.status(200).json({
      success: true,
      message: 'Message sent successfully! We will get back to you within 24-48 hours.',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ success: false, message: 'Failed to send message. Please try again.' });
  }
});

module.exports = router;