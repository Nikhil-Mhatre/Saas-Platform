import React, { useState } from 'react';
import { Expand, Loader2 } from 'lucide-react';
import SimpleBar from 'simplebar-react';
import { Document, Page } from 'react-pdf';
import { useResizeDetector } from 'react-resize-detector';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { useToast } from './ui/use-toast';

interface PdfFullscreenProps {
  fileUrl: string;
}

const PdfFullscreen = ({ fileUrl }: PdfFullscreenProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { toast } = useToast();
  const { width, ref } = useResizeDetector();

  const [numPage, setNumPage] = useState<number>();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v);
        }
      }}>
      <DialogTrigger
        onClick={() => {
          setIsOpen(true);
        }}
        asChild>
        <Button
          aria-label='fullscreen'
          className='gap-1.5'
          variant={'ghost'}>
          <Expand className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-7xl w-full'>
        <SimpleBar
          className='max-h-[calc(100vh-10rem)] mt-6'
          autoHide={false}>
          <div ref={ref}>
            <Document
              onLoadSuccess={({ numPages }) => setNumPage(numPages)}
              loading={
                <div className='flex justify-center'>
                  <Loader2 className='my-24 h-12 w-12 animate-spin' />
                </div>
              }
              onError={() => {
                toast({
                  title: `Failed to load PDF `,
                  description: `Please try again later`,
                  variant: 'destructive',
                });
              }}
              file={fileUrl}
              className={'max-h-full'}>
              {new Array(numPage).fill(0).map((_, i) => (
                <Page
                  key={i}
                  width={width || 1}
                  pageNumber={i + 1}
                />
              ))}
            </Document>
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  );
};

export default PdfFullscreen;
