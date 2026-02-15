import { useState } from 'react';
import { useGetDraftLoveMessages } from '../../hooks/useQueries';
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
  const { data: messages } = useGetDraftLoveMessages();
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

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditPreview('');
    setEditFullText('');
  };

  const handleSaveEdit = async (id: string) => {
    if (!editTitle.trim() || !editPreview.trim() || !editFullText.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await updateMessage.mutateAsync({
        id,
        title: editTitle.trim(),
        preview: editPreview.trim(),
        fullText: editFullText.trim()
      });

      setEditingId(null);
      toast.success('Message updated successfully!');
    } catch (error) {
      console.error('Error updating message:', error);
      toast.error(getUserFriendlyErrorMessage(error));
    }
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

  const handleReorder = async (reorderedItems: LoveMessage[]) => {
    try {
      for (let i = 0; i < reorderedItems.length; i++) {
        if (Number(reorderedItems[i].order) !== i) {
          await updateOrder.mutateAsync({ id: reorderedItems[i].id, newOrder: BigInt(i) });
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
              rows={5}
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
        <h3 className="text-xl font-semibold text-foreground mb-4">Love Messages ({sortedMessages.length})</h3>
        {sortedMessages.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No messages yet. Add your first message above!</p>
        ) : (
          <DragReorderList
            items={sortedMessages}
            onReorder={handleReorder}
            getItemId={(item) => item.id}
            renderItem={(message) => (
              <div className="space-y-3">
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
                        onClick={() => handleSaveEdit(message.id)}
                        disabled={updateMessage.isPending}
                        className="flex-1 bg-primary text-white py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 bg-muted text-foreground py-2 rounded-lg hover:bg-muted/80 transition-colors flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="text-foreground font-semibold text-lg">{message.title}</p>
                      <p className="text-muted-foreground text-sm mt-1">{message.preview}</p>
                      <p className="text-muted-foreground text-xs mt-2">Order: {Number(message.order)}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStartEdit(message)}
                        className="flex-1 bg-accent text-foreground py-2 rounded-lg hover:bg-accent/80 transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(message.id)}
                        disabled={deleteMessage.isPending}
                        className="flex-1 bg-destructive/10 text-destructive py-2 rounded-lg hover:bg-destructive/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          />
        )}
      </div>
    </div>
  );
}
