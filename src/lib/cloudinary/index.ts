import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { ApiError } from '../utils/Api-Error';

const cloudinaryConfig = cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUDNAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
  secure: true,
});

export async function getSignature() {
  const timestamp = Math.round(new Date().getTime() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder: 'next' },
    cloudinaryConfig.api_secret as string,
  );

  return { timestamp, signature };
}

export async function uploadToCloudinary(file: File) {
  const { timestamp, signature } = await getSignature();
  const formData = new FormData();
  formData.append('file', file);
  formData.append(
    'api_key',
    process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY as string,
  );
  formData.append('signature', signature);
  formData.append('timestamp', String(timestamp));
  formData.append('folder', 'next');

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUDNAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      },
    );

    if (!response.ok) {
      throw new ApiError(response.status, response.statusText);
    }
    const data: UploadApiResponse = await response.json();
    return data;
  } catch (error: any) {
    throw new ApiError(
      501,
      error?.message || 'Failed to Upload File on Cloudinary',
    );
  }
}

export async function deleteFileFromCloudinary(fileId: string) {
  const data = await cloudinary.uploader
    .destroy(fileId)
    .then(() => true)
    .catch(() => false);

  return data;
}

export async function getFileFromCloudinary(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new ApiError(response.status, response.statusText);
    }
    const blob = await response.blob();
    return blob;
  } catch (error: any) {
    throw new ApiError(
      501,
      error?.message || 'Failed to Retrieve File from Cloudinary',
    );
  }
}
