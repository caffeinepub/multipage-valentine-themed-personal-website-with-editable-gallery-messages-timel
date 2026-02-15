import { useState } from 'react';
import { useContentVersion } from '../hooks/useContentVersion';
import { useGetVersions } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GitBranch, Check, RefreshCw } from 'lucide-react';

export default function ContentVersionSwitcher() {
  const { activeVersion, setActiveVersion } = useContentVersion();
  const { data: versions = [], isLoading } = useGetVersions();
  const queryClient = useQueryClient();
  const [customVersion, setCustomVersion] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleVersionSwitch = async (version: string) => {
    if (version === activeVersion) {
      setIsOpen(false);
      return;
    }
    
    // Update the active version
    setActiveVersion(version);
    
    // Invalidate and refetch all version-scoped queries atomically
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['draftContent', activeVersion] }),
      queryClient.invalidateQueries({ queryKey: ['publishedContent', activeVersion] }),
      queryClient.invalidateQueries({ queryKey: ['publishStatus', activeVersion] }),
      queryClient.invalidateQueries({ queryKey: ['draftContent', version] }),
      queryClient.invalidateQueries({ queryKey: ['publishedContent', version] }),
      queryClient.invalidateQueries({ queryKey: ['publishStatus', version] }),
    ]);
    
    // Refetch the new version's data
    await Promise.all([
      queryClient.refetchQueries({ queryKey: ['draftContent', version], type: 'active' }),
      queryClient.refetchQueries({ queryKey: ['publishedContent', version], type: 'active' }),
      queryClient.refetchQueries({ queryKey: ['publishStatus', version], type: 'active' }),
    ]);
    
    setIsOpen(false);
  };

  const handleCustomVersionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customVersion.trim()) {
      handleVersionSwitch(customVersion.trim());
      setCustomVersion('');
    }
  };

  // Combine published versions with the active version
  const allVersions = Array.from(new Set([...versions, activeVersion])).sort();

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <GitBranch className="w-4 h-4" />
          <span className="font-mono text-sm">Version: {activeVersion}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <GitBranch className="w-4 h-4" />
              Switch Content Version
            </h4>
            <p className="text-xs text-muted-foreground">
              Select a version to view and edit its content
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Loading versions...
            </div>
          ) : (
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {allVersions.length > 0 ? (
                allVersions.map((version) => (
                  <button
                    key={version}
                    onClick={() => handleVersionSwitch(version)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${
                      version === activeVersion
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent'
                    }`}
                  >
                    <span className="font-mono">{version}</span>
                    {version === activeVersion && <Check className="w-4 h-4" />}
                  </button>
                ))
              ) : (
                <p className="text-sm text-muted-foreground py-2">No published versions found</p>
              )}
            </div>
          )}

          <div className="border-t pt-4">
            <form onSubmit={handleCustomVersionSubmit} className="space-y-2">
              <Label htmlFor="custom-version" className="text-xs">
                Or enter a version name:
              </Label>
              <div className="flex gap-2">
                <Input
                  id="custom-version"
                  value={customVersion}
                  onChange={(e) => setCustomVersion(e.target.value)}
                  placeholder="e.g., 7"
                  className="font-mono text-sm"
                />
                <Button type="submit" size="sm" disabled={!customVersion.trim()}>
                  Switch
                </Button>
              </div>
            </form>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
