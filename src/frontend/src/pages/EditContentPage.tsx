import EditGuard from '../components/EditGuard';
import DraftReviewSummary from '../components/DraftReviewSummary';
import PublishingCallout from '../components/PublishingCallout';
import PublishControls from '../components/PublishControls';
import GoLiveGuidance from '../components/GoLiveGuidance';
import ContentVersionSwitcher from '../components/ContentVersionSwitcher';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GalleryEditor from '../components/editors/GalleryEditor';
import LoveMessagesEditor from '../components/editors/LoveMessagesEditor';
import TimelineEditor from '../components/editors/TimelineEditor';
import DedicationEditor from '../components/editors/DedicationEditor';
import InteractiveSurpriseEditor from '../components/editors/InteractiveSurpriseEditor';
import { Edit, AlertCircle } from 'lucide-react';
import { useGetDraftContent } from '../hooks/useQueries';
import { useContentVersion } from '../hooks/useContentVersion';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function EditContentPage() {
  const { data: draftContent, isLoading, isFetched } = useGetDraftContent();
  const { activeVersion } = useContentVersion();
  
  // Only show empty state if we've finished loading and there's truly no content
  const showEmptyState = !isLoading && isFetched && draftContent === null;

  return (
    <EditGuard>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8 animate-fadeIn">
          <Edit className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="font-script text-4xl md:text-5xl text-primary mb-4">Edit Your Site</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Customize your Valentine's Day website with photos, messages, and more
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="mb-6 flex justify-end">
            <ContentVersionSwitcher />
          </div>

          {showEmptyState && (
            <Alert className="mb-6 border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
              <AlertDescription className="text-amber-800 dark:text-amber-200">
                No draft content exists for version <span className="font-mono font-semibold">{activeVersion}</span>. 
                Try switching to a different version using the version switcher above to recover your content, 
                or start creating new content for this version.
              </AlertDescription>
            </Alert>
          )}

          <GoLiveGuidance />
          <PublishingCallout />
          <PublishControls />
          <DraftReviewSummary />

          <Tabs defaultValue="gallery" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="surprise">Surprise</TabsTrigger>
              <TabsTrigger value="dedication">Dedication</TabsTrigger>
            </TabsList>

            <TabsContent value="gallery">
              <GalleryEditor />
            </TabsContent>

            <TabsContent value="messages">
              <LoveMessagesEditor />
            </TabsContent>

            <TabsContent value="timeline">
              <TimelineEditor />
            </TabsContent>

            <TabsContent value="surprise">
              <InteractiveSurpriseEditor />
            </TabsContent>

            <TabsContent value="dedication">
              <DedicationEditor />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </EditGuard>
  );
}
