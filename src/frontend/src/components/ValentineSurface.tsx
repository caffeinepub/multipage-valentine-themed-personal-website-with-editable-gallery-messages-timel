import { ReactNode } from 'react';

interface ValentineSurfaceProps {
  children: ReactNode;
  className?: string;
}

export default function ValentineSurface({ children, className = '' }: ValentineSurfaceProps) {
  return (
    <div className={`bg-card rounded-2xl shadow-soft border border-border/50 p-6 md:p-8 ${className}`}>
      {children}
    </div>
  );
}
