import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface Ad {
  id: string;
  title: string;
  image: string;
  link: string;
  duration: number;
  position: 'top' | 'sidebar' | 'bottom';
  active: boolean;
  revenue: number;
  clicks: number;
}

interface AdDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (ad: Ad) => void;
  ad: Ad | null;
}

export const AdDialog = ({ open, onOpenChange, onSave, ad }: AdDialogProps) => {
  const [formData, setFormData] = useState<Ad>({
    id: '',
    title: '',
    image: '',
    link: '',
    duration: 5,
    position: 'top',
    active: true,
    revenue: 0,
    clicks: 0,
  });

  useEffect(() => {
    if (ad) {
      setFormData(ad);
    } else {
      setFormData({
        id: '',
        title: '',
        image: '',
        link: '',
        duration: 5,
        position: 'top',
        active: true,
        revenue: 0,
        clicks: 0,
      });
    }
  }, [ad, open]);

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{ad ? 'Edit Ad' : 'Add Ad'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="link">Link</Label>
            <Input
              id="link"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (seconds)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Select value={formData.position} onValueChange={(value: 'top' | 'sidebar' | 'bottom') => setFormData({ ...formData, position: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top">Top</SelectItem>
                  <SelectItem value="sidebar">Sidebar</SelectItem>
                  <SelectItem value="bottom">Bottom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
            />
            <Label htmlFor="active">Active</Label>
          </div>
          <Button onClick={handleSubmit} className="w-full">Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
