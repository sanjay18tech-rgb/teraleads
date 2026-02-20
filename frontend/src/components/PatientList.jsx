import { Link } from 'react-router-dom';
import { Pencil, Trash2, MessageCircle } from 'lucide-react';

export default function PatientList({ patients, onEdit, onDelete }) {
  if (patients.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow border border-dental-100 p-12 text-center text-dental-600">
        <p>No patients yet. Add your first patient to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow border border-dental-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-dental-50 border-b border-dental-100">
            <tr>
              <th className="text-left py-3 px-4 text-sm font-medium text-dental-700">Name</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-dental-700 hidden sm:table-cell">Email</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-dental-700 hidden md:table-cell">Phone</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-dental-700 hidden lg:table-cell">Updated</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-dental-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dental-100">
            {patients.map((patient) => (
              <tr key={patient.id} className="hover:bg-dental-50/50 transition">
                <td className="py-3 px-4 font-medium text-dental-800">{patient.name}</td>
                <td className="py-3 px-4 text-dental-600 hidden sm:table-cell truncate max-w-[200px]">
                  {patient.email || '—'}
                </td>
                <td className="py-3 px-4 text-dental-600 hidden md:table-cell">
                  {patient.phone || '—'}
                </td>
                <td className="py-3 px-4 text-dental-600 text-sm hidden lg:table-cell">
                  {patient.updatedAt
                    ? new Date(patient.updatedAt).toLocaleDateString()
                    : '—'}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/chat/${patient.id}`}
                      className="p-2 text-dental-600 hover:bg-dental-100 rounded-lg transition"
                      title="Chat"
                    >
                      <MessageCircle size={18} />
                    </Link>
                    <button
                      onClick={() => onEdit(patient)}
                      className="p-2 text-dental-600 hover:bg-dental-100 rounded-lg transition"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(patient)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
