import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import api from "../services/api";

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
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";

import { useDebounce } from "use-debounce";
import dayjs from "dayjs";

import ThreatDetailModal from "../components/ThreatDetailModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import TableSkeleton from "../components/TableSkeleton";

interface Threat {
  id: number;
  server_name: string;
  threat_type: string;
  risk_level: string;
  timestamp: string | null;
  status: string;
  source_ip: string;
  description: string;
  details: Record<string, unknown>;
}

interface PaginatedThreats {
  total: number;
  threats: Threat[];
}

const fetchThreats = async (
  filters: Record<string, string | undefined>
): Promise<PaginatedThreats> => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value);
    }
  });

  const response = await api.get(
    `/api/v1/threats?${params.toString()}`
  );

  return response.data;
};

export default function ThreatManagement() {
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [riskLevel, setRiskLevel] = useState("");
  const [status, setStatus] = useState("");

  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  const [selectedThreat, setSelectedThreat] =
    useState<Threat | null>(null);

  const [threatToDelete, setThreatToDelete] =
    useState<Threat | null>(null);

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["threats", debouncedSearchTerm, riskLevel, status],
    queryFn: () => fetchThreats({
      search: debouncedSearchTerm,
      risk_level: riskLevel,
      status: status,
    }),
  });

  console.log("Threat API Response:", data);

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/v1/threats/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["threats"],
      });

      setThreatToDelete(null);
    },
  });

  const handleDeleteConfirm = () => {
    if (threatToDelete) {
      deleteMutation.mutate(threatToDelete.id);
    }
  };

  const RiskLevelBadge = ({ risk }: { risk: string }) => {
    const level = risk.toLowerCase();

    const color =
      level === "critical" || level === "high"
        ? "error"
        : level === "medium"
        ? "warning"
        : "default";

    return (
      <Chip
        label={risk}
        color={color}
        size="small"
      />
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Threat Management
      </Typography>

      <Paper sx={{ p: 2 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{ mb: 2 }}
        >
          <TextField
            fullWidth
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <FormControl fullWidth>
            <InputLabel>Risk Level</InputLabel>

            <Select
              value={riskLevel}
              label="Risk Level"
              onChange={(e: SelectChangeEvent) =>
                setRiskLevel(e.target.value)
              }
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="critical">Critical</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>

            <Select
              value={status}
              label="Status"
              onChange={(e: SelectChangeEvent) =>
                setStatus(e.target.value)
              }
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="detected">Detected</MenuItem>
              <MenuItem value="blocked">Blocked</MenuItem>
              <MenuItem value="resolved">Resolved</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Server</TableCell>
                <TableCell>Threat</TableCell>
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
                    <Alert severity="error">
                      {error instanceof Error
                        ? error.message
                        : "Failed to load threats."}
                    </Alert>
                  </TableCell>
                </TableRow>
              ) : (data?.threats?.length ?? 0) > 0 ? (
                data!.threats.map((threat) => (
                  <TableRow key={threat.id} hover>
                    <TableCell>{threat.id}</TableCell>

                    <TableCell>
                      {threat.server_name}
                    </TableCell>

                    <TableCell>
                      {threat.threat_type}
                    </TableCell>

                    <TableCell>
                      <RiskLevelBadge
                        risk={threat.risk_level}
                      />
                    </TableCell>

                    <TableCell>
                      {threat.status}
                    </TableCell>

                    <TableCell>
                      {threat.timestamp
                        ? dayjs(threat.timestamp).format(
                            "YYYY-MM-DD HH:mm"
                          )
                        : "-"}
                    </TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          size="small"
                          onClick={() =>
                            setSelectedThreat(threat)
                          }
                        >
                          <VisibilityIcon />
                        </IconButton>

                        <IconButton
                          size="small"
                          color="error"
                          onClick={() =>
                            setThreatToDelete(threat)
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                  >
                    No threats found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography
          variant="caption"
          sx={{
            display: "block",
            mt: 2,
          }}
        >
          Total Threats: {data?.total ?? 0}
        </Typography>
      </Paper>

      <ThreatDetailModal
        open={Boolean(selectedThreat)}
        onClose={() => setSelectedThreat(null)}
        threat={selectedThreat}
      />

      <DeleteConfirmationModal
        open={Boolean(threatToDelete)}
        onClose={() => setThreatToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Threat"
        message={`Delete threat ID ${threatToDelete?.id}? This action cannot be undone.`}
      />
    </Box>
  );
}