import { useState } from 'react';
import { useGetAllGalleryItems } from '../../hooks/useQueries';
import { useAddGalleryItem, useDeleteGalleryItem, useUpdateGalleryItemOrder } from '../../hooks/useEditMutations';
import DragReorderList from '../DragReorderList';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Upload } from 'lucide-react';
import { ExternalBlob } from '../../backend';
import type { GalleryItem } from '../../backend';
import { toast } from 'sonner';
import { getUserFriendlyErrorMessage } from '../../utils/authzError';

export default function GalleryEditor() {
  const { data: galleryItems } = useGetAllGalleryItems();
  const addItem = useAddGalleryItem();
  const deleteItem = useDeleteGalleryItem();
  const updateOrder = useUpdateGalleryItemOrder();

  const [newCaption, setNewCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const sortedItems = galleryItems ? [...galleryItems].sort((a, b) => Number(a.order) - Number(b.order)) : [];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAdd = async () => {
    if (!selectedFile || !newCaption.trim()) {
      toast.error('Please select an image and add a caption');
      return;
    }

    try {
      const bytes = new Uint8Array(await selectedFile.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      const id = `gallery-${Date.now()}`;
      const order = BigInt(sortedItems.length);

      await addItem.mutateAsync({ id, image: blob, caption: newCaption.trim(), order });
      
      setNewCaption('');
      setSelectedFile(null);
      setUploadProgress(0);
      toast.success('Photo added successfully!');
    } catch (error) {
      console.error('Error adding gallery item:', error);
      toast.error(getUserFriendlyErrorMessage(error));
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this photo?')) {
      try {
        await deleteItem.mutateAsync(id);
        toast.success('Photo deleted');
      } catch (error) {
        console.error('Error deleting gallery item:', error);
        toast.error(getUserFriendlyErrorMessage(error));
      }
    }
  };

  const handleReorder = async (reorderedItems: GalleryItem[]) => {
    try {
      for (let i = 0; i < reorderedItems.length; i++) {
        if (Number(reorderedItems[i].order) !== i) {
          await updateOrder.mutateAsync({ id: reorderedItems[i].id, newOrder: BigInt(i) });
        }
      }
      toast.success('Gallery reordered successfully!');
    } catch (error) {
      console.error('Error reordering items:', error);
      toast.error(getUserFriendlyErrorMessage(error));
    }
  };

  return (
    <div className="space-y-8">
      {/* Add New Item */}
      <div className="bg-card rounded-xl p-6 border border-border/50">
        <h3 className="text-xl font-semibold text-foreground mb-4">Add New Photo</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="image">Image</Label>
            <div className="mt-2">
              <label className="flex items-center gap-2 px-4 py-3 bg-accent/50 hover:bg-accent rounded-lg cursor-pointer transition-colors">
                <Upload className="w-5 h-5" />
                <span>{selectedFile ? selectedFile.name : 'Choose image...'}</span>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <Label htmlFor="caption">Caption</Label>
            <Textarea
              id="caption"
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
              placeholder="Enter a caption for this photo..."
              className="mt-2"
              rows={3}
            />
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
            disabled={!selectedFile || !newCaption.trim() || addItem.isPending}
            className="w-full rose-gold-gradient text-white py-3 rounded-xl font-medium hover:shadow-romantic transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            {addItem.isPending ? 'Adding...' : 'Add Photo'}
          </button>
        </div>
      </div>

      {/* Existing Items */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-4">Gallery Items ({sortedItems.length})</h3>
        {sortedItems.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No photos yet. Add your first photo above!</p>
        ) : (
          <DragReorderList
            items={sortedItems}
            onReorder={handleReorder}
            getItemId={(item) => item.id}
            renderItem={(item) => (
              <div className="flex items-start gap-4">
                <img
                  src={item.image.getDirectURL()}
                  alt={item.caption}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="text-foreground font-medium mb-1">{item.caption}</p>
                  <p className="text-sm text-muted-foreground">Order: {Number(item.order)}</p>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deleteItem.isPending}
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
