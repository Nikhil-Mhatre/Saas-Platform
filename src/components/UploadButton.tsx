'use client';

import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import { Cloud, File, Loader2 } from 'lucide-react';
import { trpc } from '@/lib/trpc/TRPC-Client';
import { useRouter } from 'next/navigation';
import { UploadFileToStorage } from '@/lib/cloudinary';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { useToast } from './ui/use-toast';

const UploadDropZone = () => {
  const { toast } = useToast();
  const router = useRouter();

  const { mutate: uploadFileToDB } = trpc.uploadFileToDB.useMutation({
    onSuccess: (file) => {
      router.push(`/dashboard/${file.id}`);
    },
    onError: (error) => {
      toast({
        title: `Failed to Upload File`,
        description: `${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadingProgress, setUploadingProgresss] = useState<number>(0);

  const startSimulateProgress = () => {
    setUploadingProgresss(0);

    const progressInterval = setInterval(() => {
      setUploadingProgresss((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(progressInterval);
          return prevProgress;
        }
        return prevProgress + 15; // Progress Simulation Time
      });
    }, 500);

    return progressInterval;
  };

  return (
    <Dropzone
      multiple={false}
      onDrop={async (acceptedFile) => {
        setIsUploading(true);
        const progressInterval = startSimulateProgress();

        // TODO: File Uploading

        const file = acceptedFile[0] as File;
        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        const isFileUploaded = await UploadFileToStorage(buffer, file.name);

        if (isFileUploaded?.http_code)
          return toast({
            title: `Failed to Upload File`,
            description: `${isFileUploaded.message}`,
            variant: 'destructive',
          });

        uploadFileToDB({
          key: isFileUploaded?.public_id,
          name: isFileUploaded?.original_filename,
          url: isFileUploaded?.secure_url,
        });

        clearInterval(progressInterval);
        setUploadingProgresss(100);
        return null;
      }}>
      {({ getRootProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className='border h-64 m-4 border-dashed border-gray-300 rounded-lg'>
          <div className='flex items-center justify-center h-full w-full'>
            <label
              htmlFor='dropzone-file'
              className='flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100'>
              <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                <Cloud className='h-6 w-6 text-zinc-500 mb-2' />
                <p className='mb-2 text-sm text-zinc-700'>
                  <span className='font-semibold'>Click to upload</span> or drag
                  and drop
                </p>
                <p className='text-xs text-zinc-500'>PDF (up to 4MB)</p>
              </div>

              {acceptedFiles && acceptedFiles[0] ? (
                <div className='max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200'>
                  <div className='px-3 py-2 h-full grid place-items-center'>
                    <File className='h-4 w-4 text-blue-500' />
                  </div>
                  <div className='px-3 py-2 h-full text-sm truncate'>
                    {acceptedFiles[0].name}
                  </div>
                </div>
              ) : null}
              {isUploading ? (
                <div className={'w-full max-w-xs mx-auto mt-4'}>
                  <Progress
                    colorIndicator={
                      uploadingProgress === 100 ? 'bg-green-700' : undefined
                    }
                    value={uploadingProgress}
                    className='h-1 w-full bg-zinc-200'
                  />
                  {uploadingProgress === 100 ? (
                    <div className='flex gap-1 justify-center items-center text-zinc-700 text-center pt-2'>
                      <Loader2 className='h-3 w-3 animate-spin' />
                    </div>
                  ) : null}
                </div>
              ) : null}
            </label>
          </div>
        </div>
      )}
    </Dropzone>
  );
};

const UploadButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) setIsOpen(v);
      }}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>Upload PDF</Button>
      </DialogTrigger>
      <DialogContent>
        <UploadDropZone />
      </DialogContent>
    </Dialog>
  );
};

export default UploadButton;
