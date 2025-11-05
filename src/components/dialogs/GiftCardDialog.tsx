import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

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

interface GiftCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (giftCard: GiftCard) => void;
  giftCard: GiftCard | null;
}

export const GiftCardDialog = ({ open, onOpenChange, onSave, giftCard }: GiftCardDialogProps) => {
  const [formData, setFormData] = useState<GiftCard>({
    id: '',
    code: '',
    amount: 0,
    balance: 0,
    validFrom: new Date().toISOString().split('T')[0],
    validTo: new Date().toISOString().split('T')[0],
    active: true,
  });

  useEffect(() => {
    if (giftCard) {
      setFormData(giftCard);
    } else {
      setFormData({
        id: '',
        code: '',
        amount: 0,
        balance: 0,
        validFrom: new Date().toISOString().split('T')[0],
        validTo: new Date().toISOString().split('T')[0],
        active: true,
      });
    }
  }, [giftCard, open]);

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{giftCard ? 'Edit Gift Card' : 'Add Gift Card'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="GIFT1000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="validFrom">Valid From</Label>
              <Input
                id="validFrom"
                type="date"
                value={formData.validFrom}
                onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="validTo">Valid To</Label>
              <Input
                id="validTo"
                type="date"
                value={formData.validTo}
                onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
              />
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
