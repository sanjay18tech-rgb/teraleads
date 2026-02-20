import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPatients, deletePatient } from '../services/api';
import PatientList from '../components/PatientList';
import PatientForm from '../components/PatientForm';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { Plus, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [deletingPatient, setDeletingPatient] = useState(null);

  const limit = 10;

  async function loadPatients(p = 1) {
    setLoading(true);
    setError('');
    try {
      const data = await getPatients(p, limit);
      setPatients(data.patients);
      setTotal(data.total);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPatients(page);
  }, [page]);

  function handleCreateSuccess() {
    setShowForm(false);
    loadPatients(page);
  }

  function handleUpdateSuccess() {
    setEditingPatient(null);
    loadPatients(page);
  }

  function handleEdit(patient) {
    setEditingPatient(patient);
  }

  async function handleDeleteConfirm(patient) {
    try {
      await deletePatient(patient.id);
      setDeletingPatient(null);
      loadPatients(patients.length === 1 && page > 1 ? page - 1 : page);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-dental-800">Patients</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-dental-600 hover:bg-dental-700 text-white rounded-lg font-medium transition"
        >
          <Plus size={20} />
          Add Patient
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 text-red-700 px-4 py-3 rounded-lg">{error}</div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-10 h-10 text-dental-600 animate-spin" />
        </div>
      ) : (
        <PatientList
          patients={patients}
          onEdit={handleEdit}
          onDelete={(p) => setDeletingPatient(p)}
        />
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-dental-600">
            Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1 border border-dental-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dental-50 transition"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1 border border-dental-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dental-50 transition"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <PatientForm
          onClose={() => setShowForm(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {editingPatient && (
        <PatientForm
          patient={editingPatient}
          onClose={() => setEditingPatient(null)}
          onSuccess={handleUpdateSuccess}
        />
      )}

      {deletingPatient && (
        <DeleteConfirmModal
          patient={deletingPatient}
          onClose={() => setDeletingPatient(null)}
          onConfirm={() => handleDeleteConfirm(deletingPatient)}
        />
      )}
    </div>
  );
}
