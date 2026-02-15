import { useState } from 'react';
import { usePublishDraft } from '../hooks/useEditMutations';
import { useGetPublishStatus } from '../hooks/useQueries';
import { useContentVersion } from '../hooks/useContentVersion';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Rocket, CheckCircle, AlertCircle, Clock, Link2, Copy, Globe } from 'lucide-react';
import { getUserFriendlyErrorMessage } from '../utils/authzError';
import { buildShareUrl } from '../utils/urlParams';

export default function PublishControls() {
  const { data: publishStatus, isLoading: statusLoading } = useGetPublishStatus();
  const { activeVersion } = useContentVersion();
  const publishMutation = usePublishDraft();
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const handlePublish = async () => {
    setErrorMessage(null);
    setShowSuccess(false);

    try {
      await publishMutation.mutateAsync();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 10000);
    } catch (error) {
      console.error('Publish error:', error);
      setErrorMessage(getUserFriendlyErrorMessage(error));
    }
  };

  const handleCopyLink = async () => {
    const shareUrl = buildShareUrl(activeVersion);
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatDate = (timestamp?: bigint) => {
    if (!timestamp) return 'Never';
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const shareUrl = buildShareUrl(activeVersion);
  const isPublished = publishStatus?.isPublished ?? false;

  return (
    <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-6 border border-primary/30 mb-8">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Rocket className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Publish Your Site</h2>
            {!statusLoading && (
              <Badge 
                variant={isPublished ? "default" : "outline"}
                className={isPublished ? "bg-green-600 hover:bg-green-700" : "border-amber-500 text-amber-700 dark:text-amber-400"}
              >
                {isPublished ? (
                  <>
                    <Globe className="w-3 h-3 mr-1" />
                    Live
                  </>
                ) : (
                  "Not published yet"
                )}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Publishing version <span className="font-mono font-semibold text-foreground">{activeVersion}</span> will make your changes visible to everyone
          </p>

          {!statusLoading && publishStatus && (
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Last published: {formatDate(publishStatus.lastPublished)}</span>
              </div>
              {publishStatus.draftLastUpdated && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Draft updated: {formatDate(publishStatus.draftLastUpdated)}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
              disabled={publishMutation.isPending}
            >
              {publishMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Publishing...
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4 mr-2" />
                  Publish Now
                </>
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Publish Your Changes?</AlertDialogTitle>
              <AlertDialogDescription>
                This will publish version <span className="font-mono font-semibold">{activeVersion}</span> and make all your draft changes visible to everyone who visits your site. 
                You can always make more changes and publish again later.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handlePublish}>
                Yes, Publish
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Persistent Share Link Section */}
      <div className="bg-background/50 rounded-lg p-4 border border-border/50 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Link2 className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Share Link for Version {activeVersion}:</span>
        </div>
        <div className="flex items-center gap-2">
          <code className="bg-muted px-3 py-2 rounded text-xs flex-1 break-all font-mono">
            {shareUrl}
          </code>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopyLink}
            className="shrink-0"
          >
            {copySuccess ? (
              <>
                <CheckCircle className="w-3 h-3 mr-1" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 mr-1" />
                Copy
              </>
            )}
          </Button>
        </div>
        {!isPublished && (
          <p className="text-xs text-muted-foreground mt-2">
            ⚠️ This version is not published yet. Visitors won't see any content until you publish.
          </p>
        )}
      </div>

      {showSuccess && (
        <Alert className="border-green-500/50 bg-green-50 dark:bg-green-950/20 mb-4">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-500" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            <div className="font-semibold">Successfully published version {activeVersion}! 🎉</div>
            <p className="text-sm mt-1">Your site is now live and visible to everyone.</p>
          </AlertDescription>
        </Alert>
      )}

      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
