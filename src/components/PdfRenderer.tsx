'use client';

import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useResizeDetector } from 'react-resize-detector';
import { useState } from 'react';
import { useToast } from './ui/use-toast';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface PdfRendererProps {
  url: string;
}

// Worker to Load Pdfs
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PdfRenderer = ({ url }: PdfRendererProps) => {
  const { toast } = useToast();
  const { width, ref } = useResizeDetector();

  const [numPage, setNumPage] = useState<number>();
  const [currPage, setCurrPage] = useState<number>(1);

  return (
    // Feature Bar
    <div className='w-full bg-white rounded-md shadow flex flex-col items-center'>
      <div className='h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2'>
        <div className='flex items-center gap-1.5'>
          {/* Prev PDF Button */}
          <Button
            disabled={currPage <= 1}
            onClick={() => {
              setCurrPage((prev) => (prev - 1 > 1 ? prev - 1 : 1));
            }}
            variant={'ghost'}
            aria-label='previous page'>
            <ChevronDown className='h-4 w-4' />
          </Button>
          {/* PDF Page Searcher */}
          <div className='flex items-center gap-1.5'>
            {/* TODO: Setup Logic For page Search input */}
            <Input className='w-12 h-8' />
            <p className='text-zinc-700 text-sm space-x-1'>
              <span>/</span>
              <span>{numPage || 'X'}</span>
            </p>
          </div>
          {/* Next PDF Button */}
          <Button
            disabled={numPage === undefined || currPage === numPage}
            onClick={() => {
              setCurrPage((prev) =>
                prev + 1 > numPage! ? numPage! : prev + 1,
              );
            }}
            variant={'ghost'}
            aria-label='previous page'>
            <ChevronUp className='h-4 w-4' />
          </Button>
        </div>
      </div>

      {/* PDF Renderer */}
      <div className='flex-1 w-full max-h-screen'>
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
            file={url}
            className={'max-h-full'}>
            <Page
              width={width || 1}
              pageNumber={currPage}
            />
          </Document>
        </div>
      </div>
    </div>
  );
};
export default PdfRenderer;
