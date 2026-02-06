// utils / auth.js;
// utils/auth.js
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

export const getUserRole = () => {
  // If you store role in localStorage, retrieve it
  return localStorage.getItem('userRole') || null;
};

export const isStudent = () => {
  return getUserRole() === 'student';
};