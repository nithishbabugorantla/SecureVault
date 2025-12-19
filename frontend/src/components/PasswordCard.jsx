import React from 'react';

function PasswordCard({ entry, onShow, onDelete }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">{entry.appName}</h3>
          <p className="text-sm text-gray-600">Username: {entry.appUsername}</p>
          <p className="text-sm text-gray-600 mt-1">
            Password: <span className="font-mono">{entry.maskedPassword}</span>
          </p>
        </div>
      </div>
      
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onShow(entry.id)}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          👁️ Show Password
        </button>
        <button
          onClick={() => onDelete(entry.id)}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}

export default PasswordCard;
