/**
 * Firebase Storage Service
 * 
 * Handles image uploads and management using Firebase Storage.
 * Replaces Cloudinary with Firebase Storage.
 */

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll
} from 'firebase/storage';
import { storage } from '../../config/firebase';

// ==================== Types ====================

export interface UploadOptions {
  folder: 'products' | 'categories';
  itemId: string;
  file: File;
  customName?: string;
}

export interface UploadResult {
  url: string;
  path: string;
  name: string;
}

// ==================== Helper Functions ====================

/**
 * Generate a unique filename
 */
const generateFileName = (originalName: string): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 9);
  const extension = originalName.split('.').pop();
  return `${timestamp}-${randomString}.${extension}`;
};

/**
 * Compress and optimize image before upload
 */
const optimizeImage = async (file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.85): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Draw image with optional smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

// ==================== Upload Functions ====================

/**
 * Upload an image to Firebase Storage
 */
export const uploadImage = async (options: UploadOptions): Promise<UploadResult> => {
  const { folder, itemId, file, customName } = options;

  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  // Validate file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File size must be less than 10MB');
  }

  try {
    // Optimize image before upload
    const optimizedBlob = await optimizeImage(file);

    // Generate filename
    const fileName = customName || generateFileName(file.name);
    const filePath = `${folder}/${itemId}/${fileName}`;

    // Create storage reference
    const storageRef = ref(storage, filePath);

    // Upload file with metadata
    const metadata = {
      contentType: 'image/jpeg',
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString()
      }
    };

    const snapshot = await uploadBytes(storageRef, optimizedBlob, metadata);

    // Get download URL
    const url = await getDownloadURL(snapshot.ref);

    return {
      url,
      path: filePath,
      name: fileName
    };
  } catch (error: any) {
    console.error('Upload error:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

/**
 * Upload multiple images
 */
export const uploadMultipleImages = async (
  folder: 'products' | 'categories',
  itemId: string,
  files: File[]
): Promise<UploadResult[]> => {
  const uploadPromises = files.map(file =>
    uploadImage({ folder, itemId, file })
  );

  return await Promise.all(uploadPromises);
};

/**
 * Delete an image from Firebase Storage
 */
export const deleteImage = async (imagePath: string): Promise<void> => {
  try {
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
  } catch (error: any) {
    console.error('Delete error:', error);
    throw new Error(`Failed to delete image: ${error.message}`);
  }
};

/**
 * Delete all images for a specific item
 */
export const deleteAllItemImages = async (
  folder: 'products' | 'categories',
  itemId: string
): Promise<void> => {
  try {
    const folderRef = ref(storage, `${folder}/${itemId}`);
    const listResult = await listAll(folderRef);

    // Delete all files in the folder
    const deletePromises = listResult.items.map(item => deleteObject(item));
    await Promise.all(deletePromises);
  } catch (error: any) {
    console.error('Delete folder error:', error);
    throw new Error(`Failed to delete folder images: ${error.message}`);
  }
};

/**
 * Extract storage path from Firebase Storage URL
 */
export const getPathFromUrl = (url: string): string | null => {
  try {
    // Firebase Storage URL format:
    // https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{path}?alt=media&token={token}
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(/\/o\/(.+)$/);
    if (pathMatch) {
      return decodeURIComponent(pathMatch[1]);
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Delete image by URL
 */
export const deleteImageByUrl = async (url: string): Promise<void> => {
  const path = getPathFromUrl(url);
  if (!path) {
    throw new Error('Invalid Firebase Storage URL');
  }
  await deleteImage(path);
};

/**
 * Replace an existing image (delete old, upload new)
 */
export const replaceImage = async (
  oldUrl: string,
  options: UploadOptions
): Promise<UploadResult> => {
  // Upload new image first
  const newImage = await uploadImage(options);

  // Delete old image (don't fail if old image doesn't exist)
  try {
    await deleteImageByUrl(oldUrl);
  } catch (error) {
    console.warn('Failed to delete old image:', error);
  }

  return newImage;
};

/**
 * Crop and upload image from canvas (used with react-easy-crop)
 */
export const cropAndUploadImage = async (
  imageSrc: string,
  croppedAreaPixels: { x: number; y: number; width: number; height: number },
  options: Omit<UploadOptions, 'file'>
): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;

    image.onload = async () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            reject(new Error('Failed to create blob'));
            return;
          }

          // Convert blob to file
          const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });

          try {
            const result = await uploadImage({ ...options, file });
            resolve(result);
          } catch (error) {
            reject(error);
          }
        },
        'image/jpeg',
        0.9
      );
    };

    image.onerror = () => reject(new Error('Failed to load image'));
  });
};

/**
 * Get all images for a specific item
 */
export const getItemImages = async (
  folder: 'products' | 'categories',
  itemId: string
): Promise<string[]> => {
  try {
    const folderRef = ref(storage, `${folder}/${itemId}`);
    const listResult = await listAll(folderRef);

    const urlPromises = listResult.items.map(item => getDownloadURL(item));
    return await Promise.all(urlPromises);
  } catch (error: any) {
    console.error('Get images error:', error);
    return [];
  }
};

/**
 * Validate image dimensions
 */
export const validateImageDimensions = async (
  file: File,
  minWidth: number,
  minHeight: number,
  maxWidth: number,
  maxHeight: number
): Promise<{ valid: boolean; message?: string }> => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        if (img.width < minWidth || img.height < minHeight) {
          resolve({
            valid: false,
            message: `Image dimensions must be at least ${minWidth}x${minHeight}px`
          });
        } else if (img.width > maxWidth || img.height > maxHeight) {
          resolve({
            valid: false,
            message: `Image dimensions must not exceed ${maxWidth}x${maxHeight}px`
          });
        } else {
          resolve({ valid: true });
        }
      };

      img.onerror = () => {
        resolve({ valid: false, message: 'Failed to load image' });
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      resolve({ valid: false, message: 'Failed to read file' });
    };

    reader.readAsDataURL(file);
  });
};
