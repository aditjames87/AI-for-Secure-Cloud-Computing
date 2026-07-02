import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import {
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import dayjs from 'dayjs';

import StatCard from '../components/StatCard';
import StorageIcon from '@mui/icons-material/Storage';
import BugReportIcon from '@mui/icons-material/BugReport';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import OnlinePredictionIcon from '@mui/icons-material/OnlinePrediction';
import InsightsIcon from '@mui/icons-material/Insights';

// Define types for the API response
interface StatCardsData {
  total_servers: number;
  total_threats: number;
  high_risk_threats: number;
  predictions_today: number;
  avg_prediction_confidence: number;
}

interface RecentThreat {
  id: number;
  server_name: string;
  threat_type: string;
  risk_level: string;
  timestamp: string;
}

interface ChartDataPoint {
  name: string;
  value: number;
}

interface TimeSeriesDataPoint {
  date: string;
  count: number;
}

interface DashboardData {
  stats: StatCardsData;
  recent_threats: RecentThreat[];
  cloud_usage: ChartDataPoint[];
  threat_trend: TimeSeriesDataPoint[];
  prediction_history: TimeSeriesDataPoint[];
}

const fetchDashboardData = async (): Promise<DashboardData> => {
  const { data } = await api.get('/api/v1/dashboard/stats');
  return data;
};

const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard: React.FC = () => {
  const { data, isLoading, isError, error } = useQuery<DashboardData, Error>({
    queryKey: ['dashboardData'],
    queryFn: fetchDashboardData,
  });

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <Alert severity="error">Error fetching dashboard data: {error.message}</Alert>;
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Security Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Stat Cards */}
        <Grid item xs={12} sm={6} lg={2.4}>
          <StatCard title="Total Servers" value={data?.stats.total_servers ?? 0} icon={<StorageIcon sx={{ fontSize: 40 }} color="primary" />} />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <StatCard title="Total Threats" value={data?.stats.total_threats ?? 0} icon={<BugReportIcon sx={{ fontSize: 40 }} color="error" />} />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <StatCard title="High Risk Threats" value={data?.stats.high_risk_threats ?? 0} icon={<WarningAmberIcon sx={{ fontSize: 40 }} color="warning" />} />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <StatCard title="Predictions Today" value={data?.stats.predictions_today ?? 0} icon={<OnlinePredictionIcon sx={{ fontSize: 40 }} color="success" />} />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <StatCard title="Avg. Confidence" value={`${((data?.stats.avg_prediction_confidence ?? 0) * 100).toFixed(1)}%`} icon={<InsightsIcon sx={{ fontSize: 40 }} color="info" />} />
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: 300 }}>
            <Typography variant="h6">Threat Trend</Typography>
            <ResponsiveContainer>
              <LineChart data={data?.threat_trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#FF8042" name="Threats" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: 300 }}>
            <Typography variant="h6">Cloud Usage</Typography>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={data?.cloud_usage} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {data?.cloud_usage.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12}>
           <Paper sx={{ p: 2, height: 300 }}>
            <Typography variant="h6">Prediction History</Typography>
            <ResponsiveContainer>
              <LineChart data={data?.prediction_history}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#8884d8" name="Predictions" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Recent Threats Table */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Threats
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Server</TableCell>
                    <TableCell>Threat Type</TableCell>
                    <TableCell>Risk Level</TableCell>
                    <TableCell>Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data && data.recent_threats.length > 0 ? (
                    data.recent_threats.map((threat) => (
                      <TableRow key={threat.id} hover>
                        <TableCell>{threat.server_name}</TableCell>
                        <TableCell>{threat.threat_type}</TableCell>
                        <TableCell>
                          <Typography color={threat.risk_level === 'High' ? 'error' : 'warning'}>
                            {threat.risk_level}
                          </Typography>
                        </TableCell>
                        <TableCell>{dayjs(threat.timestamp).format('YYYY-MM-DD HH:mm')}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">No recent threats to display.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;