import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface Ticket {
  id: string;
  user_id: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  description: string;
  createdAt: string;
  replies?: Array<{ from: string; message: string; timestamp: string }>;
}

interface TicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket?: Ticket;
  onSave: (ticket: Ticket) => void;
  mode?: 'create' | 'reply';
}

export function TicketDialog({ open, onOpenChange, ticket, onSave, mode = 'create' }: TicketDialogProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<Ticket>({
    id: '',
    userId: '',
    userName: '',
    subject: '',
    category: 'order',
    priority: 'medium',
    status: 'open',
    message: '',
    createdAt: new Date().toISOString(),
    replies: [],
  });

  const [replyMessage, setReplyMessage] = useState('');

  useEffect(() => {
    if (ticket && mode === 'reply') {
      setFormData(ticket);
      setReplyMessage('');
    } else if (!ticket && mode === 'create') {
      setFormData({
        id: `ticket_${Date.now()}`,
        user_id: user?.id || '',
        subject: '',
        category: 'order',
        priority: 'medium',
        status: 'open',
        description: '',
        createdAt: new Date().toISOString(),
        replies: [],
      });
    }
  }, [ticket, open, mode, user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'reply' && ticket) {
      const updatedTicket = {
        ...ticket,
        replies: [
          ...(ticket.replies || []),
          {
            from: user?.name || 'Support',
            message: replyMessage,
            timestamp: new Date().toISOString(),
          },
        ],
        status: 'in_progress',
      };
      onSave(updatedTicket);
    } else {
      onSave(formData);
    }
    onOpenChange(false);
  };

  if (mode === 'reply' && ticket) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Reply to Ticket #{ticket.id}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Subject</Label>
                <p className="text-sm">{ticket.subject}</p>
              </div>
              <div className="grid gap-2">
                <Label>Original Message</Label>
                <p className="text-sm text-muted-foreground">{ticket.description}</p>
              </div>
              {ticket.replies && ticket.replies.length > 0 && (
                <div className="grid gap-2">
                  <Label>Previous Replies</Label>
                  <div className="space-y-2">
                    {ticket.replies.map((reply, idx) => (
                      <div key={idx} className="p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium">{reply.from}</p>
                        <p className="text-sm text-muted-foreground">{reply.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(reply.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="reply">Your Reply</Label>
                <Textarea
                  id="reply"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  required
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Send Reply</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Ticket</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="order">Order Issue</SelectItem>
                    <SelectItem value="payment">Payment Issue</SelectItem>
                    <SelectItem value="product">Product Issue</SelectItem>
                    <SelectItem value="delivery">Delivery Issue</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Message</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Ticket</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
