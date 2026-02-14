import { useState, useEffect } from 'react';
import { useGetFinalDedication } from '../../hooks/useQueries';
import { useSetFinalDedication } from '../../hooks/useEditMutations';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';
import { toast } from 'sonner';

export default function DedicationEditor() {
  const { data: dedication } = useGetFinalDedication();
  const setDedication = useSetFinalDedication();

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
      await setDedication.mutateAsync({
        title: title.trim(),
        message: message.trim()
      });
      toast.success('Dedication saved successfully!');
    } catch (error) {
      console.error('Error saving dedication:', error);
      toast.error('Failed to save dedication');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-card rounded-xl p-6 border border-border/50">
        <h3 className="text-xl font-semibold text-foreground mb-4">Final Dedication</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Final Dedication"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your heartfelt dedication message..."
              className="mt-2"
              rows={12}
            />
          </div>

          <button
            onClick={handleSave}
            disabled={!title.trim() || !message.trim() || setDedication.isPending}
            className="w-full rose-gold-gradient text-white py-3 rounded-xl font-medium hover:shadow-romantic transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {setDedication.isPending ? 'Saving...' : 'Save Dedication'}
          </button>
        </div>
      </div>
    </div>
  );
}
