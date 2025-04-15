import React from 'react';

const ExportBackup = () => {
  const handleExport = async () => {
    try {
      const result = await window.electron.ipcRenderer.invoke('backup:create');
      if (result.success) {
        alert(`Backup exported successfully to:\n${result.path}`);
      } else {
        alert('Backup canceled.');
      }
    } catch (err) {
      console.error('Export error:', err);
      alert('Export failed.');
    }
  };

  return (
    <div>
      <button
        onClick={handleExport}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-200"
      >
        Export Backup
      </button>
    </div>
  );
};

export default ExportBackup;
