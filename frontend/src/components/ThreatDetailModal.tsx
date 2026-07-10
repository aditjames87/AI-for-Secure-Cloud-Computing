import React from "react";
import type { Threat } from "../types/threat";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Paper,
  Box,
} from "@mui/material";
import dayjs from "dayjs";

interface ThreatDetailModalProps {
  open: boolean;
  onClose: () => void;
  threat: Threat | null;
}

interface DetailItemProps {
  label: string;
  value: React.ReactNode;
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => (
  <Grid item xs={12} sm={6}>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>

    <Typography variant="body1">
      {value ?? "-"}
    </Typography>
  </Grid>
);

const ThreatDetailModal: React.FC<ThreatDetailModalProps> = ({
  open,
  onClose,
  threat,
}) => {
  if (!threat) {
    return null;
  }

  const formattedTimestamp = threat.timestamp
    ? dayjs(threat.timestamp).format("YYYY-MM-DD HH:mm:ss")
    : "-";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Threat Details - ID: {threat.id}
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <DetailItem
            label="Server Name"
            value={threat.destination_ip}
          />

          <DetailItem
            label="Threat Type"
            value={threat.attack_type}
          />

          <DetailItem
            label="Risk Level"
            value={threat.severity}
          />

          <DetailItem
            label="Status"
            value={threat.status}
          />

          <DetailItem
            label="Source IP"
            value={threat.source_ip}
          />

          <DetailItem
            label="Timestamp"
            value={formattedTimestamp}
          />

          <Grid item xs={12}>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Description
            </Typography>

            
          </Grid>

          <Grid item xs={12}>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Raw Details
            </Typography>

            <Paper
              sx={{
                mt: 1,
                p: 2,
                bgcolor: "#f5f5f5",
                overflowX: "auto",
              }}
            >
              <Box
                component="pre"
                sx={{
                  m: 0,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          onClick={onClose}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ThreatDetailModal;