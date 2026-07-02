import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import {
  Box,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Alert,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDebounce } from 'use-debounce';

import ServerForm from '../components/ServerForm';
import type { ServerFormData } from '../components/ServerForm';
import ResourceProgressBar from '../components/ResourceProgressBar';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import TableSkeleton from '../components/TableSkeleton';

interface Server {
  id: number;
  server_name: string;
  ip_address: string;
  operating_system: string;
  status: 'Online' | 'Offline';
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
}

const fetchServers = async (searchTerm: string): Promise<Server[]> => {
  const { data } = await api.get(`/api/v1/servers?search=${searchTerm}`);
  return data;
};

const ServerManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingServer, setEditingServer] = useState<Server | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [serverToDelete, setServerToDelete] = useState<Server | null>(null);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  const { data: servers, isLoading, isError, error } = useQuery<Server[], Error>({
    queryKey: ['servers', debouncedSearchTerm],
    queryFn: () => fetchServers(debouncedSearchTerm),
  });

  const mutationConfig = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servers'] });
      setServerToDelete(null);
      handleCloseForm();
    },
  };

  const addServerMutation = useMutation({
    mutationFn: (newServer: ServerFormData) => api.post('/api/v1/servers', newServer),
    ...mutationConfig,
  });

  const editServerMutation = useMutation({
    mutationFn: ({ id, ...updatedServer }: ServerFormData & { id: number }) =>
      api.put(`/api/v1/servers/${id}`, updatedServer),
    ...mutationConfig,
  });

  const deleteServerMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/api/v1/servers/${id}`),
    ...mutationConfig,
  });

  const handleOpenForm = (server: Server | null = null) => {
    setEditingServer(server);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setEditingServer(null);
    setFormOpen(false);
  };

  const handleFormSubmit = (data: ServerFormData) => {
    if (editingServer) {
      editServerMutation.mutate({ ...data, id: editingServer.id });
    } else {
      addServerMutation.mutate(data);
    }
  };

  const handleDeleteConfirm = () => {
    if (serverToDelete) {
      deleteServerMutation.mutate(serverToDelete.id);
    }
  };

  const StatusBadge = ({ status }: { status: 'Online' | 'Offline' }) => (
    <Chip label={status} color={status === 'Online' ? 'success' : 'error'} size="small" />
  );

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Server Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenForm()}>
          Add Server
        </Button>
      </Box>

      <Paper sx={{ p: 2 }}>
        <TextField
          fullWidth
          placeholder="Search by name or IP..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Server Name</TableCell>
                <TableCell>IP Address</TableCell>
                <TableCell>Operating System</TableCell>
                <TableCell>Status</TableCell>
                <TableCell sx={{ width: '20%' }}>Resource Usage</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableSkeleton columns={6} />
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Alert severity="error">Error fetching servers: {error.message}</Alert>
                  </TableCell>
                </TableRow>
              ) : servers && servers.length > 0 ? (
                servers.map((server) => (
                  <TableRow key={server.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>{server.server_name}</TableCell>
                    <TableCell>{server.ip_address}</TableCell>
                    <TableCell>{server.operating_system}</TableCell>
                    <TableCell>
                      <StatusBadge status={server.status} />
                    </TableCell>
                    <TableCell>
                      <ResourceProgressBar label="CPU" value={server.cpu_usage} />
                      <ResourceProgressBar label="Mem" value={server.memory_usage} />
                      <ResourceProgressBar label="Disk" value={server.disk_usage} />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <IconButton size="small" onClick={() => handleOpenForm(server)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" onClick={() => setServerToDelete(server)}>
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">No servers found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {isFormOpen && (
        <ServerForm
          open={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
          defaultValues={
            editingServer
              ? {
                  server_name: editingServer.server_name,
                  ip_address: editingServer.ip_address,
                  operating_system: editingServer.operating_system,
                  id: editingServer.id,
                }
              : {}
          }
        />
      )}

      <DeleteConfirmationModal
        open={!!serverToDelete}
        onClose={() => setServerToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Server?"
        message={`Are you sure you want to delete the server "${serverToDelete?.server_name}"? This action cannot be undone.`}
      />
    </Box>
  );
};

export default ServerManagement;