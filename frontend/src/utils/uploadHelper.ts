import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

/**
 * Uploads files to the backend and returns the relative URLs for public access.
 * @param files - Array of File objects to upload.
 * @returns Promise resolving to an array of URL strings.
 */
export const uploadImages = async (files: File[]): Promise<string[]> => {
    if (!files || files.length === 0) return [];

    const formData = new FormData();
    files.forEach(file => {
        formData.append('files', file);
    });

    try {
        const response = await axios.post(`${API_URL}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                // Add authentication if required by backend in the future
            },
            withCredentials: true
        });

        // The backend returns { message, files: [{ filename, url }, ...] }
        return response.data.files.map((f: any) => f.url);
    } catch (error) {
        console.error('Error uploading images:', error);
        throw new Error('Failed to upload images');
    }
};
