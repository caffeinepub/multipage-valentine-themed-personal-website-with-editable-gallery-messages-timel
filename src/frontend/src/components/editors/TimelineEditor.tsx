import { useState } from 'react';
import { useGetDraftTimelineMilestones } from '../../hooks/useQueries';
import { useAddTimelineMilestone, useDeleteTimelineMilestone, useUpdateTimelineMilestoneOrder } from '../../hooks/useEditMutations';
import DragReorderList from '../DragReorderList';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Upload, X } from 'lucide-react';
import { ExternalBlob } from '../../backend';
import type { TimelineMilestone } from '../../backend';
import { toast } from 'sonner';
import { getUserFriendlyErrorMessage } from '../../utils/authzError';

export default function TimelineEditor() {
  const { data: milestones } = useGetDraftTimelineMilestones();
  const addMilestone = useAddTimelineMilestone();
  const deleteMilestone = useDeleteTimelineMilestone();
  const updateOrder = useUpdateTimelineMilestoneOrder();

  const [newDate, setNewDate] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const sortedMilestones = milestones ? [...milestones].sort((a, b) => Number(a.order) - Number(b.order)) : [];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAdd = async () => {
    if (!newDate || !newTitle.trim() || !newDescription.trim()) {
      toast.error('Please fill in date, title, and description');
      return;
    }

    try {
      let photoBlob: ExternalBlob | null = null;
      if (selectedFile) {
        const bytes = new Uint8Array(await selectedFile.arrayBuffer());
        photoBlob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
      }

      const id = `milestone-${Date.now()}`;
      const dateTimestamp = BigInt(new Date(newDate).getTime() * 1000000); // Convert to nanoseconds
      const order = BigInt(sortedMilestones.length);

      await addMilestone.mutateAsync({
        id,
        date: dateTimestamp,
        title: newTitle.trim(),
        description: newDescription.trim(),
        photo: photoBlob,
        order
      });

      setNewDate('');
      setNewTitle('');
      setNewDescription('');
      setSelectedFile(null);
      setUploadProgress(0);
      toast.success('Milestone added successfully!');
    } catch (error) {
      console.error('Error adding milestone:', error);
      toast.error(getUserFriendlyErrorMessage(error));
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this milestone?')) {
      try {
        await deleteMilestone.mutateAsync(id);
        toast.success('Milestone deleted');
      } catch (error) {
        console.error('Error deleting milestone:', error);
        toast.error(getUserFriendlyErrorMessage(error));
      }
    }
  };

  const handleReorder = async (reorderedItems: TimelineMilestone[]) => {
    try {
      for (let i = 0; i < reorderedItems.length; i++) {
        if (Number(reorderedItems[i].order) !== i) {
          await updateOrder.mutateAsync({ id: reorderedItems[i].id, newOrder: BigInt(i) });
        }
      }
      toast.success('Timeline reordered successfully!');
    } catch (error) {
      console.error('Error reordering milestones:', error);
      toast.error(getUserFriendlyErrorMessage(error));
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-8">
      {/* Add New Milestone */}
      <div className="bg-card rounded-xl p-6 border border-border/50">
        <h3 className="text-xl font-semibold text-foreground mb-4">Add New Milestone</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Milestone title..."
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Describe this milestone..."
              className="mt-2"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="photo">Photo (Optional)</Label>
            <div className="mt-2 flex items-center gap-2">
              <label className="flex items-center gap-2 px-4 py-3 bg-accent/50 hover:bg-accent rounded-lg cursor-pointer transition-colors flex-1">
                <Upload className="w-5 h-5" />
                <span className="truncate">{selectedFile ? selectedFile.name : 'Choose photo...'}</span>
                <input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
              {selectedFile && (
                <button
                  onClick={() => setSelectedFile(null)}
                  className="p-3 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="rose-gold-gradient h-2 rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          <button
            onClick={handleAdd}
            disabled={!newDate || !newTitle.trim() || !newDescription.trim() || addMilestone.isPending}
            className="w-full rose-gold-gradient text-white py-3 rounded-xl font-medium hover:shadow-romantic transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            {addMilestone.isPending ? 'Adding...' : 'Add Milestone'}
          </button>
        </div>
      </div>

      {/* Existing Milestones */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-4">Timeline Milestones ({sortedMilestones.length})</h3>
        {sortedMilestones.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No milestones yet. Add your first milestone above!</p>
        ) : (
          <DragReorderList
            items={sortedMilestones}
            onReorder={handleReorder}
            getItemId={(item) => item.id}
            renderItem={(milestone) => (
              <div className="flex items-start gap-4">
                {milestone.photo && (
                  <img
                    src={milestone.photo.getDirectURL()}
                    alt={milestone.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <p className="text-sm text-primary font-medium">{formatDate(milestone.date)}</p>
                  <p className="text-foreground font-semibold text-lg mt-1">{milestone.title}</p>
                  <p className="text-muted-foreground text-sm mt-1">{milestone.description}</p>
                  <p className="text-muted-foreground text-xs mt-2">Order: {Number(milestone.order)}</p>
                </div>
                <button
                  onClick={() => handleDelete(milestone.id)}
                  disabled={deleteMilestone.isPending}
                  className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            )}
          />
        )}
      </div>
    </div>
  );
}
