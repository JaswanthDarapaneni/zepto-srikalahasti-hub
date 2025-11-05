import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Gift } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useActivityLog } from '@/hooks/useActivityLog';
import { GiftCardDialog } from '@/components/dialogs/GiftCardDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import giftCardsData from '@/data/giftcards.json';

interface GiftCard {
  id: string;
  code: string;
  amount: number;
  balance: number;
  validFrom: string;
  validTo: string;
  active: boolean;
  usedBy?: string;
}

const GiftCards = () => {
  const [giftCards, setGiftCards] = useLocalStorage<GiftCard[]>('giftcards', giftCardsData);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<GiftCard | null>(null);
  const [cardToDelete, setCardToDelete] = useState<string>('');
  const { logAction } = useActivityLog();

  const totalValue = giftCards.reduce((sum, card) => sum + card.amount, 0);
  const activeCards = giftCards.filter(c => c.active).length;

  const handleSave = (card: GiftCard) => {
    if (card.id && giftCards.find(c => c.id === card.id)) {
      setGiftCards(giftCards.map(c => c.id === card.id ? card : c));
      logAction('update', 'giftcard', card.id);
    } else {
      const newCard = { ...card, id: `gc${Date.now()}`, balance: card.amount };
      setGiftCards([...giftCards, newCard]);
      logAction('create', 'giftcard', newCard.id);
    }
    setDialogOpen(false);
    setSelectedCard(null);
  };

  const handleEdit = (card: GiftCard) => {
    setSelectedCard(card);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setCardToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setGiftCards(giftCards.filter(c => c.id !== cardToDelete));
    logAction('delete', 'giftcard', cardToDelete);
    setDeleteDialogOpen(false);
    setCardToDelete('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gift Cards Management</h1>
        <Button onClick={() => { setSelectedCard(null); setDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Gift Card
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalValue}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCards}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Used Cards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{giftCards.filter(c => c.usedBy).length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Gift Cards</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Valid Period</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {giftCards.map(card => (
                <TableRow key={card.id}>
                  <TableCell className="font-mono font-medium">{card.code}</TableCell>
                  <TableCell>₹{card.amount}</TableCell>
                  <TableCell>₹{card.balance}</TableCell>
                  <TableCell className="text-sm">
                    {new Date(card.validFrom).toLocaleDateString()} - {new Date(card.validTo).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={card.active && card.balance > 0 ? 'default' : 'secondary'}>
                      {card.active && card.balance > 0 ? 'Active' : card.balance === 0 ? 'Used' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(card)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(card.id)}>
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

      <GiftCardDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        giftCard={selectedCard}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the gift card.
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

export default GiftCards;
