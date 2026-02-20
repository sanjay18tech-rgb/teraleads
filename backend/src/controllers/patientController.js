const patientModel = require('../models/patient');

async function create(req, res) {
  try {
    const patient = await patientModel.create(req.user.id, req.body);
    res.status(201).json(patient);
  } catch (err) {
    console.error('Create patient error:', err);
    res.status(500).json({ error: 'Failed to create patient' });
  }
}

async function list(req, res) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 100);
    const result = await patientModel.findByUserId(req.user.id, page, limit);
    res.json(result);
  } catch (err) {
    console.error('List patients error:', err);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
}

async function getById(req, res) {
  try {
    const patient = await patientModel.findByUserIdAndId(req.user.id, req.params.id);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json(patient);
  } catch (err) {
    console.error('Get patient error:', err);
    res.status(500).json({ error: 'Failed to fetch patient' });
  }
}

async function update(req, res) {
  try {
    const patient = await patientModel.update(req.params.id, req.user.id, req.body);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json(patient);
  } catch (err) {
    console.error('Update patient error:', err);
    res.status(500).json({ error: 'Failed to update patient' });
  }
}

async function remove(req, res) {
  try {
    const deleted = await patientModel.remove(req.params.id, req.user.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error('Delete patient error:', err);
    res.status(500).json({ error: 'Failed to delete patient' });
  }
}

module.exports = {
  create,
  list,
  getById,
  update,
  remove,
};
