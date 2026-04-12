export const getImageUrl = (url: string | undefined | null) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('blob:')) return url;
  
  const backendUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://prof-cv-backend-production.up.railway.app';
  return `${backendUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};
