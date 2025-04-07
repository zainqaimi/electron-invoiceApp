import db from '../database/connection.js';

export const User = {
  // Add user (with optional image)
  add: (name, email, imagePath = null) => {
    let imageBlob = null;
    if (imagePath) {
      imageBlob = fs.readFileSync(imagePath); // Read image file
    }
    return db
      .prepare('INSERT INTO users (name, email, image) VALUES (?, ?, ?)')
      .run(name, email, imageBlob);
  },

  // Get all users (with image as Base64)
  getAll: () => {
    const users = db.prepare('SELECT * FROM users').all();
    return users.map(user => ({
      ...user,
      image: user.image ? user.image.toString('base64') : null, // Convert BLOB to Base64
    }));
  },

  // Delete, Update, etc.
};