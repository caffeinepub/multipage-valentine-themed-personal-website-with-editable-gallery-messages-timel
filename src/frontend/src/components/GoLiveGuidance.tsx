import { useContentVersion } from '../hooks/useContentVersion';
import { useGetPublishStatus } from '../hooks/useQueries';
import { buildShareUrl } from '../utils/urlParams';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, CheckCircle2, Circle, Globe, Link2 } from 'lucide-react';

export default function GoLiveGuidance() {
  const { activeVersion } = useContentVersion();
  const { data: publishStatus, isLoading } = useGetPublishStatus();
  const shareUrl = buildShareUrl(activeVersion);
  const isPublished = publishStatus?.isPublished ?? false;

  const steps = [
    {
      id: 1,
      title: 'Create Your Content',
      description: 'Add photos, messages, timeline events, and more using the tabs below.',
      completed: true, // Always true if they're viewing this page
    },
    {
      id: 2,
      title: 'Publish Your Changes',
      description: 'Click the "Publish Now" button above to make your content visible to visitors.',
      completed: isPublished,
    },
    {
      id: 3,
      title: 'Share Your Link',
      description: `Copy and share your unique link: ${shareUrl}`,
      completed: isPublished,
    },
  ];

  return (
    <Card className="mb-8 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">How to Make Your Site Live</CardTitle>
          {isPublished && (
            <Badge variant="default" className="ml-auto bg-green-600 hover:bg-green-700">
              <Globe className="w-3 h-3 mr-1" />
              Version {activeVersion} is Live!
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step) => (
            <div key={step.id} className="flex items-start gap-3">
              <div className="mt-0.5">
                {step.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-500" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">
                    {step.id}. {step.title}
                  </span>
                  {step.completed && (
                    <Badge variant="outline" className="text-xs border-green-500 text-green-700 dark:text-green-400">
                      Done
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
              </div>
            </div>
          ))}

          <div className="mt-6 p-4 bg-background/50 rounded-lg border border-border/50">
            <div className="flex items-start gap-2">
              <Link2 className="w-4 h-4 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">Important:</p>
                <p className="text-xs text-muted-foreground">
                  Your share link includes <code className="bg-muted px-1 py-0.5 rounded text-xs">?v={activeVersion}</code> to ensure 
                  visitors see this specific version. Publishing is required before visitors can see any content at this link.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
