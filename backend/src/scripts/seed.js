const { pool } = require('../config/database');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

async function seed() {
  const client = await pool.connect();
  try {
    const email = 'demo@teraleads.com';
    const password = await bcrypt.hash('demo123', 10);

    await client.query(
      `INSERT INTO users (id, email, password_hash)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO NOTHING
       RETURNING id`,
      [uuidv4(), email, password]
    );

    const userResult = await client.query('SELECT id FROM users WHERE email = $1', [email]);
    const userId = userResult.rows[0]?.id;

    if (userId) {
      const countResult = await client.query(
        'SELECT COUNT(*)::int FROM patients WHERE user_id = $1',
        [userId]
      );
      if (countResult.rows[0].count === 0) {
        await client.query(
          `INSERT INTO patients (id, user_id, name, email, phone, date_of_birth, medical_notes)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            uuidv4(),
            userId,
            'John Doe',
            'john@example.com',
            '555-123-4567',
            '1990-05-15',
            'Regular checkups, no allergies',
          ]
        );
      }
      console.log('Seed completed. Demo user: demo@teraleads.com / demo123');
    }
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
