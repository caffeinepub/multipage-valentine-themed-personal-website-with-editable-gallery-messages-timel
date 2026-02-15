import { useState } from 'react';
import { useGetAllLoveMessages } from '../../hooks/useQueries';
import { useAddLoveMessage, useUpdateLoveMessage, useDeleteLoveMessage, useUpdateLoveMessageOrder } from '../../hooks/useEditMutations';
import DragReorderList from '../DragReorderList';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Edit, Save, X } from 'lucide-react';
import type { LoveMessage } from '../../backend';
import { toast } from 'sonner';
import { getUserFriendlyErrorMessage } from '../../utils/authzError';

export default function LoveMessagesEditor() {
  const { data: messages } = useGetAllLoveMessages();
  const addMessage = useAddLoveMessage();
  const updateMessage = useUpdateLoveMessage();
  const deleteMessage = useDeleteLoveMessage();
  const updateOrder = useUpdateLoveMessageOrder();

  const [newTitle, setNewTitle] = useState('');
  const [newPreview, setNewPreview] = useState('');
  const [newFullText, setNewFullText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPreview, setEditPreview] = useState('');
  const [editFullText, setEditFullText] = useState('');

  const sortedMessages = messages ? [...messages].sort((a, b) => Number(a.order) - Number(b.order)) : [];

  const handleAdd = async () => {
    if (!newTitle.trim() || !newPreview.trim() || !newFullText.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const id = `message-${Date.now()}`;
      const order = BigInt(sortedMessages.length);

      await addMessage.mutateAsync({
        id,
        title: newTitle.trim(),
        preview: newPreview.trim(),
        fullText: newFullText.trim(),
        order
      });

      setNewTitle('');
      setNewPreview('');
      setNewFullText('');
      toast.success('Message added successfully!');
    } catch (error) {
      console.error('Error adding message:', error);
      toast.error(getUserFriendlyErrorMessage(error));
    }
  };

  const handleStartEdit = (message: LoveMessage) => {
    setEditingId(message.id);
    setEditTitle(message.title);
    setEditPreview(message.preview);
    setEditFullText(message.fullText);
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editTitle.trim() || !editPreview.trim() || !editFullText.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await updateMessage.mutateAsync({
        id: editingId,
        title: editTitle.trim(),
        preview: editPreview.trim(),
        fullText: editFullText.trim()
      });

      setEditingId(null);
      toast.success('Message updated!');
    } catch (error) {
      console.error('Error updating message:', error);
      toast.error(getUserFriendlyErrorMessage(error));
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      try {
        await deleteMessage.mutateAsync(id);
        toast.success('Message deleted');
      } catch (error) {
        console.error('Error deleting message:', error);
        toast.error(getUserFriendlyErrorMessage(error));
      }
    }
  };

  const handleReorder = async (reorderedMessages: LoveMessage[]) => {
    try {
      for (let i = 0; i < reorderedMessages.length; i++) {
        if (Number(reorderedMessages[i].order) !== i) {
          await updateOrder.mutateAsync({ id: reorderedMessages[i].id, newOrder: BigInt(i) });
        }
      }
      toast.success('Messages reordered successfully!');
    } catch (error) {
      console.error('Error reordering messages:', error);
      toast.error(getUserFriendlyErrorMessage(error));
    }
  };

  return (
    <div className="space-y-8">
      {/* Add New Message */}
      <div className="bg-card rounded-xl p-6 border border-border/50">
        <h3 className="text-xl font-semibold text-foreground mb-4">Add New Message</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Message title..."
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="preview">Preview Text</Label>
            <Textarea
              id="preview"
              value={newPreview}
              onChange={(e) => setNewPreview(e.target.value)}
              placeholder="Short preview text..."
              className="mt-2"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="fullText">Full Message</Label>
            <Textarea
              id="fullText"
              value={newFullText}
              onChange={(e) => setNewFullText(e.target.value)}
              placeholder="Full message text..."
              className="mt-2"
              rows={6}
            />
          </div>

          <button
            onClick={handleAdd}
            disabled={!newTitle.trim() || !newPreview.trim() || !newFullText.trim() || addMessage.isPending}
            className="w-full rose-gold-gradient text-white py-3 rounded-xl font-medium hover:shadow-romantic transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            {addMessage.isPending ? 'Adding...' : 'Add Message'}
          </button>
        </div>
      </div>

      {/* Existing Messages */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-4">Messages ({sortedMessages.length})</h3>
        {sortedMessages.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No messages yet. Add your first message above!</p>
        ) : (
          <DragReorderList
            items={sortedMessages}
            onReorder={handleReorder}
            getItemId={(item) => item.id}
            renderItem={(message) => (
              <div className="flex-1">
                {editingId === message.id ? (
                  <div className="space-y-3">
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Title..."
                    />
                    <Textarea
                      value={editPreview}
                      onChange={(e) => setEditPreview(e.target.value)}
                      placeholder="Preview..."
                      rows={2}
                    />
                    <Textarea
                      value={editFullText}
                      onChange={(e) => setEditFullText(e.target.value)}
                      placeholder="Full text..."
                      rows={4}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveEdit}
                        disabled={updateMessage.isPending}
                        className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {updateMessage.isPending ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={updateMessage.isPending}
                        className="flex-1 bg-muted text-foreground py-2 rounded-lg hover:bg-muted/80 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="text-foreground font-semibold mb-1">{message.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">{message.preview}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStartEdit(message)}
                        disabled={deleteMessage.isPending}
                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(message.id)}
                        disabled={deleteMessage.isPending}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          />
        )}
      </div>
    </div>
  );
}
