import { ipcRenderer } from 'electron';

export const useDB = () => {
  const addUser = async (name, email, imageFile) => {
    // Save image temporarily and send path to Electron
    let imagePath = null;
    if (imageFile) {
      imagePath = URL.createObjectURL(imageFile); // Handle file in Electron
    }
    return await ipcRenderer.invoke('users:add', { name, email, imagePath });
  };

  const getUsers = async () => {
    return await ipcRenderer.invoke('users:getAll');
  };

  return { addUser, getUsers };
};