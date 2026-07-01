import { useState } from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import Loader from "../../components/common/Loader";

import {
  getServers,
  createServer,
  deleteServer,
  type Server,
  type CreateServer,
} from "../../services/serviceService";

export default function CloudMonitoring() {
  const queryClient = useQueryClient();

  // ✅ FIX 1: safe default + proper typing
  const { data: servers = [], isLoading } = useQuery<Server[]>({
    queryKey: ["servers"],
    queryFn: getServers,
  });

  const [open, setOpen] = useState(false);

  // ✅ FIX 2: strict typing avoids implicit errors
  const [form, setForm] = useState<CreateServer>({
    server_name: "",
    ip_address: "",
    operating_system: "",
  });

  if (isLoading) {
    return <Loader />;
  }

  // safety fallback (extra protection)
  const safeServers: Server[] = servers ?? [];

  const totalServers = safeServers.length;

  const runningServers = safeServers.filter(
    (s) => s.status === "Online"
  ).length;

  // -------------------------
  // HANDLERS (FIXED TYPES)
  // -------------------------

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreate = async () => {
    try {
      await createServer(form);

      setForm({
        server_name: "",
        ip_address: "",
        operating_system: "",
      });

      setOpen(false);

      queryClient.invalidateQueries({ queryKey: ["servers"] });
    } catch (error) {
      console.error("Create server failed:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteServer(id);
      queryClient.invalidateQueries({ queryKey: ["servers"] });
    } catch (error) {
      console.error("Delete server failed:", error);
    }
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Cloud Monitoring (Servers)
      </Typography>

      <Button
        variant="contained"
        sx={{ mb: 2 }}
        onClick={() => setOpen(true)}
      >
        + Add Server
      </Button>

      {/* KPI CARDS */}
      <Grid container spacing={3}>
  <Grid xs={12} md={4}>
    <Card>
      <CardContent>
        <Typography variant="h6">Total Servers</Typography>
        <Typography variant="h4">{totalServers}</Typography>
      </CardContent>
    </Card>
  </Grid>

  <Grid xs={12} md={4}>
    <Card>
      <CardContent>
        <Typography variant="h6">Running</Typography>
        <Typography variant="h4">{runningServers}</Typography>
      </CardContent>
    </Card>
  </Grid>

  <Grid xs={12} md={4}>
    <Card>
      <CardContent>
        <Typography variant="h6">Down</Typography>
        <Typography variant="h4">
          {totalServers - runningServers}
        </Typography>
      </CardContent>
    </Card>
  </Grid>
</Grid>

      {/* TABLE */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Server</TableCell>
              <TableCell>IP</TableCell>
              <TableCell>OS</TableCell>
              <TableCell>CPU</TableCell>
              <TableCell>Memory</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {safeServers.map((server) => (
              <TableRow key={server.id}>
                <TableCell>{server.server_name}</TableCell>
                <TableCell>{server.ip_address}</TableCell>
                <TableCell>{server.operating_system}</TableCell>
                <TableCell>{server.cpu_usage}%</TableCell>
                <TableCell>{server.memory_usage}%</TableCell>

                <TableCell>
                  <Chip
                    label={server.status}
                    color={
                      server.status === "Online"
                        ? "success"
                        : "error"
                    }
                    size="small"
                  />
                </TableCell>

                <TableCell>
                  <Button
                    color="error"
                    onClick={() => handleDelete(server.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* CREATE DIALOG */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Server</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Server Name"
            name="server_name"
            value={form.server_name}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            margin="dense"
            label="IP Address"
            name="ip_address"
            value={form.ip_address}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            margin="dense"
            label="Operating System"
            name="operating_system"
            value={form.operating_system}
            onChange={handleChange}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}