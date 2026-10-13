import { useState } from 'react';
import { BookOpen } from 'lucide-react';

type EditorialImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
};

export function EditorialImage({ src, alt, width, height, className = '' }: EditorialImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  return (
    <div className={`relative grid place-items-center overflow-hidden ${className}`}>
      {status !== 'loaded' && (
        <span className="absolute inset-0 grid place-items-center bg-muted text-primary" role={status === 'error' ? 'img' : undefined} aria-label={status === 'error' ? alt : undefined} aria-hidden={status === 'loading' ? true : undefined}>
          <BookOpen size={36} strokeWidth={1.5} aria-hidden="true" />
        </span>
      )}
      {status !== 'error' && (
        <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async"
          className={`relative h-full w-full object-contain ${status === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setStatus('loaded')} onError={() => setStatus('error')} />
      )}
    </div>
  );
}