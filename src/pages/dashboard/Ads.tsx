import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, DollarSign } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useActivityLog } from '@/hooks/useActivityLog';
import { AdDialog } from '@/components/dialogs/AdDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import adsData from '@/data/ads.json';

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

const Ads = () => {
  const [ads, setAds] = useLocalStorage<Ad[]>('ads', adsData as Ad[]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [adToDelete, setAdToDelete] = useState<string>('');
  const { logAction } = useActivityLog();

  const totalRevenue = ads.reduce((sum, ad) => sum + ad.revenue, 0);

  const handleSave = (ad: Ad) => {
    if (ad.id && ads.find(a => a.id === ad.id)) {
      setAds(ads.map(a => a.id === ad.id ? ad : a));
      logAction('update', 'ad', ad.id);
    } else {
      const newAd = { ...ad, id: `ad${Date.now()}`, revenue: 0, clicks: 0 };
      setAds([...ads, newAd]);
      logAction('create', 'ad', newAd.id);
    }
    setDialogOpen(false);
    setSelectedAd(null);
  };

  const handleEdit = (ad: Ad) => {
    setSelectedAd(ad);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setAdToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setAds(ads.filter(a => a.id !== adToDelete));
    logAction('delete', 'ad', adToDelete);
    setDeleteDialogOpen(false);
    setAdToDelete('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Ads Management</h1>
        <Button onClick={() => { setSelectedAd(null); setDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Ad
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Ads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ads.filter(a => a.active).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ads.reduce((sum, a) => sum + a.clicks, 0)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Ads</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Duration (s)</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ads.map(ad => (
                <TableRow key={ad.id}>
                  <TableCell>
                    <img src={ad.image} alt={ad.title} className="w-20 h-12 object-cover rounded" />
                  </TableCell>
                  <TableCell className="font-medium">{ad.title}</TableCell>
                  <TableCell className="capitalize">{ad.position}</TableCell>
                  <TableCell>{ad.duration}s</TableCell>
                  <TableCell>{ad.clicks}</TableCell>
                  <TableCell>₹{ad.revenue.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={ad.active ? 'default' : 'secondary'}>
                      {ad.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(ad)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(ad.id)}>
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

      <AdDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        ad={selectedAd}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the ad.
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

export default Ads;
