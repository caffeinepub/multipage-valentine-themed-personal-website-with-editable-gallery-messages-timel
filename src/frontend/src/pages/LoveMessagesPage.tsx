import { useGetPublishedLoveMessages } from '../hooks/useQueries';
import MessageEnvelopeCard from '../components/MessageEnvelopeCard';
import { Heart, Mail, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoveMessagesPage() {
  const { data: messages, isLoading, isPublished, isError } = useGetPublishedLoveMessages();

  const sortedMessages = messages
    ? [...messages].sort((a, b) => Number(a.order) - Number(b.order))
    : [];

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Heart className="w-12 h-12 text-primary fill-primary animate-heartbeat" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12 animate-fadeIn">
        <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="font-script text-4xl md:text-5xl text-primary mb-4">Love Messages</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Open each envelope to discover heartfelt messages written just for you
        </p>
      </div>

      {isError && (
        <div className="max-w-2xl mx-auto mb-8">
          <Alert className="border-destructive/30 bg-destructive/5">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive">
              Unable to load messages. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {!isError && (!isPublished || sortedMessages.length === 0) ? (
        <div className="text-center py-16">
          <Mail className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground">
            {!isPublished 
              ? 'No published content yet. The site owner needs to publish their content first.' 
              : 'No messages published yet.'}
          </p>
        </div>
      ) : !isError && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {sortedMessages.map((message) => (
            <MessageEnvelopeCard key={message.id} message={message} />
          ))}
        </div>
      )}
    </div>
  );
}
