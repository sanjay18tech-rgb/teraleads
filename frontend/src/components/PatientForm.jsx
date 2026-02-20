import { useState, useEffect } from 'react';
import { createPatient, updatePatient } from '../services/api';
import { X } from 'lucide-react';

export default function PatientForm({ patient, onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isEdit = !!patient;

  useEffect(() => {
    if (patient) {
      setName(patient.name || '');
      setEmail(patient.email || '');
      setPhone(patient.phone || '');
      setDateOfBirth(patient.dateOfBirth || '');
      setMedicalNotes(patient.medicalNotes || '');
    }
  }, [patient]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = { name, email: email || undefined, phone: phone || undefined, dateOfBirth: dateOfBirth || undefined, medicalNotes: medicalNotes || undefined };
      if (isEdit) {
        await updatePatient(patient.id, data);
      } else {
        await createPatient(data);
      }
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-dental-100">
          <h2 className="text-lg font-semibold text-dental-800">
            {isEdit ? 'Edit Patient' : 'Add Patient'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-dental-600 hover:bg-dental-100 rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}
          <div>
            <label className="block text-sm font-medium text-dental-700 mb-1">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-dental-200 rounded-lg focus:ring-2 focus:ring-dental-500 focus:border-dental-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dental-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-dental-200 rounded-lg focus:ring-2 focus:ring-dental-500 focus:border-dental-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dental-700 mb-1">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border border-dental-200 rounded-lg focus:ring-2 focus:ring-dental-500 focus:border-dental-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dental-700 mb-1">Date of Birth</label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full px-4 py-2 border border-dental-200 rounded-lg focus:ring-2 focus:ring-dental-500 focus:border-dental-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dental-700 mb-1">Medical Notes</label>
            <textarea
              value={medicalNotes}
              onChange={(e) => setMedicalNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-dental-200 rounded-lg focus:ring-2 focus:ring-dental-500 focus:border-dental-500 outline-none"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-dental-200 rounded-lg text-dental-700 hover:bg-dental-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 px-4 bg-dental-600 hover:bg-dental-700 text-white rounded-lg font-medium transition disabled:opacity-60"
            >
              {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
