import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { TicketDialog } from "@/components/dialogs/TicketDialog";
import { useData } from "@/hooks/useData";
import { useFilteredData } from "@/hooks/useFilteredData";
import { useActivityLog } from "@/hooks/useActivityLog";
import CRUDTable from "@/components/CRUDTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRoleAccess } from "@/hooks/useRoleAccess";

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
  const { data: allTickets, loading } = useData<Ticket[]>("/src/data/tickets.json");
  const { data: users } = useData<any[]>("/src/data/users.json");
  const filteredTickets = useFilteredData(allTickets, { filterByUserId: true });
  const { addLog } = useActivityLog();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | undefined>();
  const [localTickets, setLocalTickets] = useState<Ticket[]>(filteredTickets);
  const {canAccessTickets} = useRoleAccess(); 
  const getUserName = (userId: string) => {
    const user = users?.find(u => u.id === userId);
    return user ? user.name : userId;
  };

  const handleAdd = () => {
    setSelectedTicket(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setDialogOpen(true);
  };

  const handleSave = (ticket: Ticket) => {
    if (selectedTicket) {
      setLocalTickets(localTickets.map((t) => (t.id === ticket.id ? ticket : t)));
      addLog('update', 'tickets', `Updated ticket: ${ticket.subject}`);
    } else {
      setLocalTickets([...localTickets, ticket]);
      addLog('create', 'tickets', `Created ticket: ${ticket.subject}`);
    }
    setDialogOpen(false);
    setSelectedTicket(undefined);
  };

  const handleDelete = (ticket: Ticket) => {
    setLocalTickets(localTickets.filter((t) => t.id !== ticket.id));
    addLog('delete', 'tickets', `Deleted ticket: ${ticket.subject}`);
  };

  const columns = [
    {
      key: 'id',
      label: 'ID',
      render: (value: string) => <span className="font-mono">#{value}</span>
    },
    {
      key: 'user_id',
      label: 'Raised By',
      render: (value: string) => (
        <span className="font-medium">{getUserName(value)}</span>
      )
    },
    {
      key: 'subject',
      label: 'Subject'
    },
    {
      key: 'category',
      label: 'Category',
      render: (value: string) => (
        <Badge variant="outline">{value}</Badge>
      )
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (value: string) => {
        const variants: Record<string, "default" | "secondary" | "destructive"> = {
          low: "secondary",
          medium: "default",
          high: "destructive",
          urgent: "destructive"
        };
        return <Badge variant={variants[value]}>{value}</Badge>;
      }
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => {
        const variants: Record<string, "default" | "secondary" | "outline"> = {
          open: "default",
          in_progress: "secondary",
          resolved: "outline"
        };
        return <Badge variant={variants[value]}>{value.replace('_', ' ')}</Badge>;
      }
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (value: string) => new Date(value).toLocaleDateString()
    }
  ];

  const stats = {
    total: localTickets.length,
    open: localTickets.filter(t => t.status === 'open').length,
    inProgress: localTickets.filter(t => t.status === 'in_progress').length,
    resolved: localTickets.filter(t => t.status === 'resolved').length
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Support Tickets</h2>
        <p className="text-muted-foreground">Manage customer support requests</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.open}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.inProgress}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.resolved}</p>
          </CardContent>
        </Card>
      </div>

      <CRUDTable
        data={localTickets}
        columns={columns}
        title="Ticket Management"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        permissions={canAccessTickets}
        loading={loading}
        rowsPerPage={10}
        searchPlaceholder="Search tickets..."
      />

      <TicketDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        ticket={selectedTicket}
        onSave={handleSave}
      />
    </div>
  );
};

export default Tickets;
