import { AlertTriangle } from 'lucide-react';

export default function DeleteConfirmModal({ patient, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-dental-800">Delete Patient</h3>
            <p className="mt-1 text-dental-600">
              Are you sure you want to delete <strong>{patient?.name}</strong>? This will also
              remove all chat history for this patient.
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 py-2 px-4 border border-dental-200 rounded-lg text-dental-700 hover:bg-dental-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
