const config = require('../config');

const baseUrl = config.aiService.url.replace(/\/$/, '');

/**
 * Calls the AI service to generate a response.
 * @param {string} message - User message
 * @param {object} patientContext - Optional patient context (name, medical notes)
 * @returns {Promise<string>} - AI-generated reply
 */
async function generateReply(message, patientContext = {}) {
  const url = `${baseUrl}/generate`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, patient_context: patientContext }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return 'I apologize, but the AI service is temporarily unavailable. Please try again later.';
    }
    const data = await response.json();
    return data.reply || 'I apologize, but I could not generate a response at this time.';
  } catch (err) {
    clearTimeout(timeout);
    console.error('AI service error:', err);
    if (err.name === 'AbortError') {
      return 'I apologize, but the request took too long. Please try again with a shorter message.';
    }
    return 'I apologize, but I am unable to connect to the AI service right now. Please try again later.';
  }
}

module.exports = { generateReply };
