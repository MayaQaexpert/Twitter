// Simple in-memory user storage
// In production, replace this with a real database (MongoDB, PostgreSQL, etc.)

const users = [];

export const createUser = (email, hashedPassword, name) => {
  const user = {
    id: Date.now().toString(),
    email,
    password: hashedPassword,
    name,
    username: email.split('@')[0].toLowerCase(),
    image: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1d9bf0&color=fff`,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  return user;
};

export const findUserByEmail = (email) => {
  return users.find(user => user.email.toLowerCase() === email.toLowerCase());
};

export const findUserById = (id) => {
  return users.find(user => user.id === id);
};

export const getAllUsers = () => {
  return users;
};
