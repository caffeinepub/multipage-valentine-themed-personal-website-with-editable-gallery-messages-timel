import { useState, useEffect } from 'react';
import { useGetDraftFinalDedication } from '../../hooks/useQueries';
import { useSetFinalDedication } from '../../hooks/useEditMutations';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import { getUserFriendlyErrorMessage } from '../../utils/authzError';

export default function DedicationEditor() {
  const { data: dedication, isLoading } = useGetDraftFinalDedication();
  const saveDedication = useSetFinalDedication();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (dedication) {
      setTitle(dedication.title);
      setMessage(dedication.message);
    }
  }, [dedication]);

  const handleSave = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error('Please fill in both title and message');
      return;
    }

    try {
      await saveDedication.mutateAsync({
        title: title.trim(),
        message: message.trim()
      });
      toast.success('Dedication saved successfully!');
    } catch (error) {
      console.error('Error saving dedication:', error);
      toast.error(getUserFriendlyErrorMessage(error));
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl p-6 border border-border/50">
        <h3 className="text-xl font-semibold text-foreground mb-4">Final Dedication</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="dedication-title">Title</Label>
            <Input
              id="dedication-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Dedication title..."
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="dedication-message">Message</Label>
            <Textarea
              id="dedication-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your heartfelt dedication message..."
              className="mt-2"
              rows={10}
            />
          </div>

          <button
            onClick={handleSave}
            disabled={!title.trim() || !message.trim() || saveDedication.isPending}
            className="w-full rose-gold-gradient text-white py-3 rounded-xl font-medium hover:shadow-romantic transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {saveDedication.isPending ? 'Saving...' : 'Save Dedication'}
          </button>
        </div>
      </div>
    </div>
  );
}
