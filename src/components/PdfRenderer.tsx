'use client';

import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useResizeDetector } from 'react-resize-detector';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils/cn';
import { useToast } from './ui/use-toast';
import { Button } from './ui/button';
import { Input } from './ui/input';
import ToolTip from './ToolTip';

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

  const CustomPageValidator = z.object({
    page: z
      .string()
      .refine((num) => Number(num) > 0 && Number(num) <= numPage!),
  });

  type TCustomPageValidator = z.infer<typeof CustomPageValidator>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TCustomPageValidator>({
    defaultValues: {
      page: '1',
    },
    resolver: zodResolver(CustomPageValidator),
  });

  const handlePageSubmit = ({ page }: TCustomPageValidator) => {
    setCurrPage(Number(page));
    setValue('page', String(page));
  };

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
            <ToolTip toolTipContent='Search Page'>
              <Input
                autoComplete='off'
                {...register('page')}
                className={cn(
                  'w-12 h-8',
                  errors.page && 'focus-visible:ring-red-500',
                )}
                // This will Work Only when Press Enter
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit(handlePageSubmit)();
                  }
                }}
              />
            </ToolTip>
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
