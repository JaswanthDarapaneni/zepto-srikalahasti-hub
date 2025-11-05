import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useActivityLog } from '@/hooks/useActivityLog';
import { BannerDialog } from '@/components/dialogs/BannerDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import bannersData from '@/data/banners.json';

interface Banner {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  active: boolean;
}

const Banners = () => {
  const [banners, setBanners] = useLocalStorage<Banner[]>('banners', bannersData as Banner[]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [bannerToDelete, setBannerToDelete] = useState<string>('');
  const { logAction } = useActivityLog();

  const handleSave = (banner: Banner) => {
    if (banner.id && banners.find(b => b.id === banner.id)) {
      setBanners(banners.map(b => b.id === banner.id ? banner : b));
      logAction('update', 'banner', banner.id);
    } else {
      const newBanner = { ...banner, id: `banner${Date.now()}` };
      setBanners([...banners, newBanner]);
      logAction('create', 'banner', newBanner.id);
    }
    setDialogOpen(false);
    setSelectedBanner(null);
  };

  const handleEdit = (banner: Banner) => {
    setSelectedBanner(banner);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setBannerToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setBanners(banners.filter(b => b.id !== bannerToDelete));
    logAction('delete', 'banner', bannerToDelete);
    setDeleteDialogOpen(false);
    setBannerToDelete('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Banner Management</h1>
        <Button onClick={() => { setSelectedBanner(null); setDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Banner
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Banners</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banners.map(banner => (
                <TableRow key={banner.id}>
                  <TableCell>
                    <img src={banner.image} alt={banner.title} className="w-20 h-12 object-cover rounded" />
                  </TableCell>
                  <TableCell className="font-medium">{banner.title}</TableCell>
                  <TableCell className="max-w-md truncate">{banner.description}</TableCell>
                  <TableCell>
                    <Badge variant={banner.active ? 'default' : 'secondary'}>
                      {banner.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(banner)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(banner.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <BannerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        banner={selectedBanner}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the banner.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Banners;
