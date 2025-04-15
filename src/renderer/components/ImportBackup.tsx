import React from 'react';

const ImportBackup = () => {
  const handleImport = async () => {
    try {
      const result = await window.electron.ipcRenderer.invoke('backup:restore');
      if (result.success) {
        alert('Database restored successfully!');
      } else {
        alert('Import canceled.');
      }
    } catch (err) {
      console.error('Import error:', err);
      alert('Import failed.');
    }
  };

  return (
    <div>
      <button
        onClick={handleImport}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition duration-200"
      >
        Import Backup
      </button>
    </div>
  );
};

export default ImportBackup;
