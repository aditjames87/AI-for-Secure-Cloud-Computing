import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Paper,
} from '@mui/material';
import dayjs from 'dayjs';

interface Threat {
  id: number;
  server_name: string;
  threat_type: string;
  risk_level: string;
  timestamp: string;
  status: string;
  source_ip: string;
  description: string;
  details: Record<string, any>;
}

interface ThreatDetailModalProps {
  open: boolean;
  onClose: () => void;
  threat: Threat | null;
}

const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <Grid item xs={12} sm={6}>
    <Typography variant="caption" color="text.secondary">{label}</Typography>
    <Typography variant="body1">{value}</Typography>
  </Grid>
);

const ThreatDetailModal: React.FC<ThreatDetailModalProps> = ({ open, onClose, threat }) => {
  if (!threat) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Threat Details - ID: {threat.id}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <DetailItem label="Server Name" value={threat.server_name} />
          <DetailItem label="Threat Type" value={threat.threat_type} />
          <DetailItem label="Risk Level" value={threat.risk_level} />
          <DetailItem label="Status" value={threat.status} />
          <DetailItem label="Source IP" value={threat.source_ip} />
          <DetailItem label="Timestamp" value={dayjs(threat.timestamp).format('YYYY-MM-DD HH:mm:ss')} />
          <Grid item xs={12}><DetailItem label="Description" value={threat.description} /></Grid>
          <Grid item xs={12}><DetailItem label="Raw Details" value={<Paper component="pre" sx={{ p: 1, bgcolor: 'grey.100', overflowX: 'auto' }}>{JSON.stringify(threat.details, null, 2)}</Paper>} /></Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ThreatDetailModal;