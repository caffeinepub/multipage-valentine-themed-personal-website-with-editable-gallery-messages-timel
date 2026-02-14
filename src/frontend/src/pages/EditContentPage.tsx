import EditGuard from '../components/EditGuard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GalleryEditor from '../components/editors/GalleryEditor';
import LoveMessagesEditor from '../components/editors/LoveMessagesEditor';
import TimelineEditor from '../components/editors/TimelineEditor';
import DedicationEditor from '../components/editors/DedicationEditor';
import InteractiveSurpriseEditor from '../components/editors/InteractiveSurpriseEditor';
import { Edit } from 'lucide-react';

export default function EditContentPage() {
  return (
    <EditGuard>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8 animate-fadeIn">
          <Edit className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="font-script text-4xl md:text-5xl text-primary mb-4">Edit Content</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Manage and update all your Valentine's website content
          </p>
        </div>

        <Tabs defaultValue="gallery" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="dedication">Dedication</TabsTrigger>
            <TabsTrigger value="surprise">Surprise</TabsTrigger>
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

          <TabsContent value="dedication">
            <DedicationEditor />
          </TabsContent>

          <TabsContent value="surprise">
            <InteractiveSurpriseEditor />
          </TabsContent>
        </Tabs>
      </div>
    </EditGuard>
  );
}
