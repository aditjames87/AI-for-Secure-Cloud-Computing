import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Stack,
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import BugReportIcon from '@mui/icons-material/BugReport';
import OnlinePredictionIcon from '@mui/icons-material/OnlinePrediction';
import StorageIcon from '@mui/icons-material/Storage';

const ReportCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactElement;
  onExportCsv: () => void;
}> = ({ title, description, icon, onExportCsv }) => {
  return (
    <Card
      sx={{
        display: 'flex', flexDirection: 'column', height: '100%',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          {icon}
          <Typography variant="h5" component="div">
            {title}
          </Typography>
        </Stack>
        <Typography color="text.secondary">{description}</Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={onExportCsv} startIcon={<DescriptionIcon />}>
          Export CSV
        </Button>
        <Button size="small" disabled startIcon={<DescriptionIcon />}>
          Export PDF
        </Button>
      </CardActions>
    </Card>
  );
};

const Reports: React.FC = () => {
  const handleExport = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Generate Reports
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Export detailed reports for threats, predictions, and servers in various formats.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <ReportCard
            title="Threat Report"
            description="A comprehensive log of all detected threats, including their type, risk level, and associated server."
            icon={<BugReportIcon color="error" sx={{ fontSize: 40 }} />}
            onExportCsv={() => handleExport('/api/v1/reports/threats/csv')}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <ReportCard
            title="Prediction Report"
            description="A complete history of all AI-driven predictions, including the outcome and confidence score for each."
            icon={<OnlinePredictionIcon color="primary" sx={{ fontSize: 40 }} />}
            onExportCsv={() => handleExport('/api/v1/reports/predictions/csv')}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <ReportCard
            title="Server Report"
            description="An inventory of all managed servers, including their status, operating system, and current resource usage."
            icon={<StorageIcon color="action" sx={{ fontSize: 40 }} />}
            onExportCsv={() => handleExport('/api/v1/reports/servers/csv')}
          />
        </Grid>
      </Grid>

      <Typography variant="caption" sx={{ display: 'block', mt: 4, textAlign: 'center' }}>
        Note: PDF export functionality is planned for a future update.
      </Typography>
    </Box>
  );
};

export default Reports;