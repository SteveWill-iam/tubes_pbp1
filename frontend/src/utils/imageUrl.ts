/**
 * Converts relative image URLs to full backend URLs
 * @param imagePath - The image path (e.g., "/uploads/image.jpg")
 * @returns Full URL to backend image (e.g., "http://localhost:3000/uploads/image.jpg")
 */
export const getImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return '';
  
  // If it's already a full URL, return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Get the backend base URL (remove /api from the end)
  const apiUrl = (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:3000/api';
  const baseUrl = apiUrl.replace('/api', '');
  
  return `${baseUrl}${imagePath}`;
};
