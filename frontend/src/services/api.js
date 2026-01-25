const API_URL = import.meta.env.VITE_API_URL;

export const checkBackend = async () => {
  const res = await fetch(`${API_URL}/api/health`);
  return res.json();
};