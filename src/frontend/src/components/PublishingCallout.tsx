import { useState } from 'react';
import { Info, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';

export default function PublishingCallout() {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'fallback'>('idle');
  const [showFallback, setShowFallback] = useState(false);

  const publishRequestMessage = 
    "My draft looks correct. Please show me the publish button so I can publish my Valentine's Day website.";

  const handleCopyMessage = async () => {
    try {
      // Attempt to use the Clipboard API
      await navigator.clipboard.writeText(publishRequestMessage);
      setCopyStatus('success');
      setTimeout(() => setCopyStatus('idle'), 3000);
    } catch (err) {
      // Fallback: show the message in a textarea for manual copy
      console.warn('Clipboard API unavailable, showing fallback:', err);
      setCopyStatus('fallback');
      setShowFallback(true);
    }
  };

  return (
    <Alert className="mb-8 border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5 shadow-romantic">
      <Info className="h-5 w-5 text-primary" />
      <AlertTitle className="text-lg font-heading text-primary mb-2">
        How to Publish Your Website
      </AlertTitle>
      <AlertDescription className="space-y-3">
        <p className="text-foreground/90 leading-relaxed">
          <strong>Important:</strong> Changes you make in this editor are saved as drafts. 
          To publish your Valentine's Day website and make it live, you need to request a publish 
          action outside this editor (via the chat interface with the platform).
        </p>
        
        <div className="pt-2">
          <Button
            onClick={handleCopyMessage}
            variant="default"
            size="default"
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
            disabled={copyStatus === 'success'}
          >
            {copyStatus === 'success' ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Message Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy Publish Request Message
              </>
            )}
          </Button>
          
          {copyStatus === 'success' && (
            <p className="text-sm text-primary mt-2 animate-fadeIn">
              ✓ Message copied to clipboard. Paste it in the chat to request the publish button.
            </p>
          )}
        </div>

        {showFallback && copyStatus === 'fallback' && (
          <div className="mt-4 space-y-2 animate-fadeIn">
            <p className="text-sm text-muted-foreground">
              Clipboard access unavailable. Please manually copy the message below:
            </p>
            <Textarea
              readOnly
              value={publishRequestMessage}
              className="resize-none font-mono text-sm"
              rows={3}
              onClick={(e) => e.currentTarget.select()}
            />
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}
