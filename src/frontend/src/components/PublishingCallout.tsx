import { Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function PublishingCallout() {
  return (
    <Alert className="mb-8 border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5 shadow-romantic">
      <Info className="h-5 w-5 text-primary" />
      <AlertTitle className="text-lg font-heading text-primary mb-2">
        Draft Mode
      </AlertTitle>
      <AlertDescription className="space-y-2">
        <p className="text-foreground/90 leading-relaxed">
          Changes you make in this editor are saved as drafts. Use the <strong>Publish Now</strong> button below 
          to make your Valentine's Day website live and visible to everyone.
        </p>
      </AlertDescription>
    </Alert>
  );
}
