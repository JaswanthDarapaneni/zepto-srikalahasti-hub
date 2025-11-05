import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useActivityLog } from '@/hooks/useActivityLog';
import { OfferDialog } from '@/components/dialogs/OfferDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import offersData from '@/data/offers.json';

interface Offer {
  id: string;
  title: string;
  description: string;
  type: 'product' | 'category' | 'shop' | 'ad';
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrder: number;
  validFrom: string;
  validTo: string;
  active: boolean;
  targetId?: string;
}

const Offers = () => {
  const [offers, setOffers] = useLocalStorage<Offer[]>('offers', offersData as Offer[]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [offerToDelete, setOfferToDelete] = useState<string>('');
  const { logAction } = useActivityLog();

  const handleSave = (offer: Offer) => {
    if (offer.id && offers.find(o => o.id === offer.id)) {
      setOffers(offers.map(o => o.id === offer.id ? offer : o));
      logAction('update', 'offer', offer.id);
    } else {
      const newOffer = { ...offer, id: `offer${Date.now()}` };
      setOffers([...offers, newOffer]);
      logAction('create', 'offer', newOffer.id);
    }
    setDialogOpen(false);
    setSelectedOffer(null);
  };

  const handleEdit = (offer: Offer) => {
    setSelectedOffer(offer);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setOfferToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setOffers(offers.filter(o => o.id !== offerToDelete));
    logAction('delete', 'offer', offerToDelete);
    setDeleteDialogOpen(false);
    setOfferToDelete('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Offers Management</h1>
        <Button onClick={() => { setSelectedOffer(null); setDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Offer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Offers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Min Order</TableHead>
                <TableHead>Valid Period</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {offers.map(offer => (
                <TableRow key={offer.id}>
                  <TableCell className="font-medium">{offer.title}</TableCell>
                  <TableCell className="capitalize">{offer.type}</TableCell>
                  <TableCell>
                    {offer.discountType === 'percentage' 
                      ? `${offer.discountValue}%` 
                      : `₹${offer.discountValue}`}
                  </TableCell>
                  <TableCell>₹{offer.minOrder}</TableCell>
                  <TableCell className="text-sm">
                    {new Date(offer.validFrom).toLocaleDateString()} - {new Date(offer.validTo).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={offer.active ? 'default' : 'secondary'}>
                      {offer.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(offer)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(offer.id)}>
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

      <OfferDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        offer={selectedOffer}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the offer.
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

export default Offers;
