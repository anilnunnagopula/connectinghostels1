// utils/auth.js
export const isAuthenticated = () => {
  const user = localStorage.getItem('user');
  return !!user;
};

export const getUserRole = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return user?.role || null;
  } catch {
    return null;
  }
};

export const isStudent = () => {
  return getUserRole() === 'student';
};
