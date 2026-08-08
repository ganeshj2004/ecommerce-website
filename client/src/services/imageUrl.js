/**
 * Resolves an image URL to a fully-qualified URL.
 * - If the URL starts with "http", "blob:", or "data:" → returned as-is
 * - If the URL starts with "/" (local /uploads/...) → prepends the backend server origin
 */
const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const resolveImageUrl = (url) => {
  if (!url) return 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80';
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('blob:') ||
    url.startsWith('data:')
  ) {
    return url;
  }
  if (url.startsWith('/')) {
    return `${BACKEND_URL}${url}`;
  }
  return url;
};

export default resolveImageUrl;
