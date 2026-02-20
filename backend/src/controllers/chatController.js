const chatModel = require('../models/chat');
const patientModel = require('../models/patient');
const aiService = require('../services/aiService');

async function getHistory(req, res) {
  try {
    const { patientId } = req.params;
    const patient = await patientModel.findByUserIdAndId(req.user.id, patientId);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    const messages = await chatModel.findByPatientId(patientId);
    res.json({ messages });
  } catch (err) {
    console.error('Get chat history error:', err);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
}

async function sendMessage(req, res) {
  try {
    const { patientId, message } = req.body;
    const patient = await patientModel.findByUserIdAndId(req.user.id, patientId);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Store user message
    await chatModel.create(patientId, req.user.id, 'user', message);

    // Build patient context for AI
    const patientContext = {
      name: patient.name,
      medical_notes: patient.medicalNotes || undefined,
    };

    // Get AI response
    const reply = await aiService.generateReply(message, patientContext);

    // Store AI response
    await chatModel.create(patientId, req.user.id, 'assistant', reply);

    res.json({ reply });
  } catch (err) {
    console.error('Send chat message error:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
}

module.exports = { getHistory, sendMessage };
