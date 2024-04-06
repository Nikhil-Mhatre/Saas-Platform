'use client';

import { Loader2 } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useResizeDetector } from 'react-resize-detector';
import { useToast } from './ui/use-toast';

interface PdfRendererProps {
  url: string;
}

// Worker to Load Pdfs
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PdfRenderer = ({ url }: PdfRendererProps) => {
  const { toast } = useToast();
  const { width, ref } = useResizeDetector();

  return (
    <div className='w-full bg-white rounded-md shadow flex flex-col items-center'>
      <div className='h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2'>
        <div className='flex items-center gap-1.5'>Top Bar</div>
      </div>

      <div className='flex-1 w-full max-h-screen'>
        <div ref={ref}>
          <Document
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
            file={url}
            className={'max-h-full'}>
            <Page
              width={width || 1}
              pageNumber={1}
            />
          </Document>
        </div>
      </div>
    </div>
  );
};
export default PdfRenderer;
