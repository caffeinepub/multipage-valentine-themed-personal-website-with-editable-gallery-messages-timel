import { ReactNode } from 'react';
import SiteNav from './SiteNav';
import { Heart } from 'lucide-react';

interface SiteLayoutProps {
  children: ReactNode;
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'valentine-site'
  );

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Background pattern */}
      <div 
        className="fixed inset-0 opacity-5 pointer-events-none z-0"
        style={{
          backgroundImage: 'url(/assets/generated/valentine-heart-pattern.dim_1024x1024.png)',
          backgroundSize: '400px 400px',
          backgroundRepeat: 'repeat'
        }}
      />
      
      <SiteNav />
      
      <main className="flex-1 relative z-10">
        {children}
      </main>
      
      <footer className="relative z-10 py-8 px-4 text-center border-t border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2 flex-wrap">
            <span>© {currentYear}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Built with <Heart className="w-4 h-4 text-primary fill-primary animate-heartbeat" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                caffeine.ai
              </a>
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}
