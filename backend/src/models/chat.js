const { pool } = require('../config/database');

async function findByPatientId(patientId) {
  const result = await pool.query(
    `SELECT id, patient_id, user_id, role, message, created_at
     FROM chat_messages
     WHERE patient_id = $1
     ORDER BY created_at ASC`,
    [patientId]
  );
  return result.rows.map(mapRow);
}

async function create(patientId, userId, role, message) {
  const result = await pool.query(
    `INSERT INTO chat_messages (patient_id, user_id, role, message)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [patientId, userId, role, message]
  );
  return mapRow(result.rows[0]);
}

function mapRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    patientId: row.patient_id,
    userId: row.user_id,
    role: row.role,
    message: row.message,
    createdAt: row.created_at,
  };
}

module.exports = {
  findByPatientId,
  create,
};
