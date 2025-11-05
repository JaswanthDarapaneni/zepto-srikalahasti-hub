import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useActivityLog } from "@/hooks/useActivityLog";
import { TicketDialog } from "@/components/dialogs/TicketDialog";
import { useState } from "react";
import { toast } from "sonner";
import ticketsData from "@/data/tickets.json";

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

const Tickets = () => {
  const [tickets, setTickets] = useLocalStorage<Ticket[]>('tickets', ticketsData);
  const { addLog } = useActivityLog();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | undefined>();
  const [dialogMode, setDialogMode] = useState<'create' | 'reply'>('create');

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      open: "destructive",
      in_progress: "default",
      closed: "secondary",
    };
    return variants[status] || "secondary";
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      high: "destructive",
      urgent: "destructive",
      medium: "default",
      low: "outline",
    };
    return variants[priority] || "outline";
  };

  const handleSave = (ticket: Ticket) => {
    const existingIndex = tickets.findIndex((t) => t.id === ticket.id);
    if (existingIndex >= 0) {
      const updated = [...tickets];
      updated[existingIndex] = ticket;
      setTickets(updated);
      addLog('update', 'tickets', `Updated ticket #${ticket.id}`);
      toast.success('Ticket updated successfully');
    } else {
      setTickets([...tickets, ticket]);
      addLog('create', 'tickets', `Created new ticket: ${ticket.subject}`);
      toast.success('Ticket created successfully');
    }
  };

  const handleReply = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setDialogMode('reply');
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Support Tickets</h2>
          <p className="text-muted-foreground">Manage customer support tickets</p>
        </div>
        <Button 
          className="gap-2"
          onClick={() => {
            setSelectedTicket(undefined);
            setDialogMode('create');
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Create Ticket
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Open Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {tickets.filter((t) => t.status === "open").length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {tickets.filter((t) => t.status === "in_progress").length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Closed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {tickets.filter((t) => t.status === "closed").length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Tickets ({tickets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-mono text-sm">#{ticket.id}</TableCell>
                  <TableCell className="max-w-xs truncate font-medium">
                    {ticket.subject}
                  </TableCell>
                  <TableCell>{ticket.category}</TableCell>
                  <TableCell>
                    <Badge variant={getPriorityBadge(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadge(ticket.status)}>
                      {ticket.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button size="icon" variant="ghost" onClick={() => handleReply(ticket)}>
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <TicketDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        ticket={selectedTicket}
        onSave={handleSave}
        mode={dialogMode}
      />
    </div>
  );
};

export default Tickets;
