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
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDebounce } from 'use-debounce';
import dayjs from 'dayjs';

import ThreatDetailModal from '../components/ThreatDetailModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import TableSkeleton from '../components/TableSkeleton';

interface Threat {
  id: number;
  server_name: string;
  threat_type: string;
  risk_level: 'Low' | 'Medium' | 'High' | 'Critical';
  timestamp: string;
  status: 'New' | 'Investigating' | 'Resolved';
  source_ip: string;
  description: string;
  details: Record<string, any>;
}

interface PaginatedThreats {
  total: number;
  threats: Threat[];
}

const fetchThreats = async (filters: Record<string, string>): Promise<PaginatedThreats> => {
  const params = new URLSearchParams(filters);
  const { data } = await api.get(`/api/v1/threats?${params.toString()}`);
  return data;
};

const ThreatManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [riskLevel, setRiskLevel] = useState('');
  const [status, setStatus] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  const [selectedThreat, setSelectedThreat] = useState<Threat | null>(null);
  const [threatToDelete, setThreatToDelete] = useState<Threat | null>(null);

  const filters = { search: debouncedSearchTerm, risk_level: riskLevel, status };

  const { data, isLoading, isError, error } = useQuery<PaginatedThreats, Error>({
    queryKey: ['threats', filters],
    queryFn: () => fetchThreats(filters),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/api/v1/threats/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['threats'] });
      setThreatToDelete(null);
    },
  });

  const handleDeleteConfirm = () => {
    if (threatToDelete) {
      deleteMutation.mutate(threatToDelete.id);
    }
  };

  const RiskLevelBadge: React.FC<{ risk: Threat['risk_level'] }> = ({ risk }) => {
    const colorMap: Record<Threat['risk_level'], 'default' | 'warning' | 'error'> = {
      Low: 'default',
      Medium: 'warning',
      High: 'error',
      Critical: 'error',
    };
    return <Chip label={risk} color={colorMap[risk]} variant={risk === 'Critical' ? 'filled' : 'outlined'} size="small" />;
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>Threat Management</Typography>

      <Paper sx={{ p: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search by server, type, or IP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
          />
          <FormControl fullWidth>
            <InputLabel>Risk Level</InputLabel>
            <Select value={riskLevel} label="Risk Level" onChange={(e: SelectChangeEvent) => setRiskLevel(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Critical">Critical</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select value={status} label="Status" onChange={(e: SelectChangeEvent) => setStatus(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="New">New</MenuItem>
              <MenuItem value="Investigating">Investigating</MenuItem>
              <MenuItem value="Resolved">Resolved</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Server</TableCell>
                <TableCell>Threat Type</TableCell>
                <TableCell>Risk</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Detected At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableSkeleton columns={7} />
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Alert severity="error">Error fetching threats: {error.message}</Alert>
                  </TableCell>
                </TableRow>
              ) : data && data.threats.length > 0 ? (
                data.threats.map((threat) => (
                  <TableRow key={threat.id} hover>
                    <TableCell>{threat.id}</TableCell>
                    <TableCell>{threat.server_name}</TableCell>
                    <TableCell>{threat.threat_type}</TableCell>
                    <TableCell><RiskLevelBadge risk={threat.risk_level} /></TableCell>
                    <TableCell>{threat.status}</TableCell>
                    <TableCell>{dayjs(threat.timestamp).format('YYYY-MM-DD HH:mm')}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <IconButton size="small" onClick={() => setSelectedThreat(threat)}>
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton size="small" onClick={() => setThreatToDelete(threat)}>
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">No threats found for the selected filters.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="caption" sx={{ mt: 2, display: 'block' }}>
          Total threats found: {data?.total ?? 0}
        </Typography>
      </Paper>

      <ThreatDetailModal
        open={!!selectedThreat}
        onClose={() => setSelectedThreat(null)}
        threat={selectedThreat}
      />

      <DeleteConfirmationModal
        open={!!threatToDelete}
        onClose={() => setThreatToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Threat?"
        message={`Are you sure you want to delete threat ID ${threatToDelete?.id}? This action cannot be undone.`}
      />
    </Box>
  );
};

export default ThreatManagement;