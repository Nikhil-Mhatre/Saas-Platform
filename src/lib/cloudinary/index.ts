import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';

cloudinary.config({
  cloud_name: 'dshdka5xi',
  api_key: '963588231158355',
  api_secret: 'I6BP2wIGTuXo8eZmuSiQPN7EAGc',
  secure: true,
});

export const UploadFileToStorage = async (
  buffer: Uint8Array,
  fileName: string,
): Promise<(UploadApiResponse | undefined) | UploadApiErrorResponse> =>
  new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: 'image',
          chunk_size: 4000000,
          filename_override: fileName,
        },
        async (error, result) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(result);
        },
      )
      .end(buffer);
  });
