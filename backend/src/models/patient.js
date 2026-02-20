const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

async function create(userId, data) {
  const { name, email, phone, dateOfBirth, medicalNotes } = data;
  const id = uuidv4();
  const result = await pool.query(
    `INSERT INTO patients (id, user_id, name, email, phone, date_of_birth, medical_notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [id, userId, name, email || null, phone || null, dateOfBirth || null, medicalNotes || null]
  );
  return mapRow(result.rows[0]);
}

async function findByUserId(userId, page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  const countResult = await pool.query(
    'SELECT COUNT(*)::int FROM patients WHERE user_id = $1',
    [userId]
  );
  const total = countResult.rows[0].count;

  const result = await pool.query(
    `SELECT * FROM patients WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );

  const patients = result.rows.map(mapRow);
  const totalPages = Math.ceil(total / limit);

  return { patients, total, page, totalPages };
}

async function findById(id) {
  const result = await pool.query('SELECT * FROM patients WHERE id = $1', [id]);
  return result.rows[0] ? mapRow(result.rows[0]) : null;
}

async function findByUserIdAndId(userId, id) {
  const result = await pool.query(
    'SELECT * FROM patients WHERE id = $1 AND user_id = $2',
    [id, userId]
  );
  return result.rows[0] ? mapRow(result.rows[0]) : null;
}

async function update(id, userId, data) {
  const { name, email, phone, dateOfBirth, medicalNotes } = data;
  const result = await pool.query(
    `UPDATE patients
     SET name = COALESCE($1, name),
         email = COALESCE($2, email),
         phone = COALESCE($3, phone),
         date_of_birth = COALESCE($4, date_of_birth),
         medical_notes = COALESCE($5, medical_notes),
         updated_at = NOW()
     WHERE id = $6 AND user_id = $7
     RETURNING *`,
    [name, email, phone, dateOfBirth, medicalNotes, id, userId]
  );
  return result.rows[0] ? mapRow(result.rows[0]) : null;
}

async function remove(id, userId) {
  const result = await pool.query(
    'DELETE FROM patients WHERE id = $1 AND user_id = $2 RETURNING id',
    [id, userId]
  );
  return result.rowCount > 0;
}

function mapRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    dateOfBirth: row.date_of_birth ? row.date_of_birth.toISOString().split('T')[0] : null,
    medicalNotes: row.medical_notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

module.exports = {
  create,
  findByUserId,
  findById,
  findByUserIdAndId,
  update,
  remove,
};
