const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function getToken() {
  return localStorage.getItem('token');
}

function getHeaders() {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export async function register(email, password) {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Registration failed');
  return data;
}

export async function login(email, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
}

export async function getPatients(page = 1, limit = 10) {
  const res = await fetch(
    `${API_URL}/api/patients?page=${page}&limit=${limit}`,
    { headers: getHeaders() }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch patients');
  return data;
}

export async function getPatient(id) {
  const res = await fetch(`${API_URL}/api/patients/${id}`, {
    headers: getHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch patient');
  return data;
}

export async function createPatient(patient) {
  const res = await fetch(`${API_URL}/api/patients`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(patient),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create patient');
  return data;
}

export async function updatePatient(id, patient) {
  const res = await fetch(`${API_URL}/api/patients/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(patient),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update patient');
  return data;
}

export async function deletePatient(id) {
  const res = await fetch(`${API_URL}/api/patients/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to delete patient');
  }
}

export async function getChatHistory(patientId) {
  const res = await fetch(`${API_URL}/api/chat/${patientId}`, {
    headers: getHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch chat history');
  return data;
}

export async function sendChatMessage(patientId, message) {
  const res = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ patientId, message }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to send message');
  return data;
}
