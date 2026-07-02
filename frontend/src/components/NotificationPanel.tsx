import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import {
  IconButton,
  Badge,
  Popover,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Button,
  CircularProgress,
  Chip,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface Notification {
  id: number;
  title: string;
  description: string;
  risk_level: 'High' | 'Medium' | 'Low';
  read: boolean;
  created_at: string;
}

interface NotificationsResponse {
  unread_count: number;
  notifications: Notification[];
}

const fetchNotifications = async (): Promise<NotificationsResponse> => {
  const { data } = await api.get('/api/v1/notifications');
  return data;
};

const NotificationPanel: React.FC = () => {
  const queryClient = useQueryClient();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [seenHighRiskIds, setSeenHighRiskIds] = useState<Set<number>>(new Set());
  const [seenMediumRiskIds, setSeenMediumRiskIds] = useState<Set<number>>(new Set());

  const { data, isLoading } = useQuery<NotificationsResponse, Error>({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    refetchInterval: 15000, // Refetch every 15 seconds
  });

  useEffect(() => {
    if (data?.notifications) {
      const newHighRisk = data.notifications.filter(n => n.risk_level === 'High' && !n.read && !seenHighRiskIds.has(n.id));
      const newMediumRisk = data.notifications.filter(n => n.risk_level === 'Medium' && !n.read && !seenMediumRiskIds.has(n.id));

      newHighRisk.forEach(n => {
        toast.error(`High Risk: ${n.title}`, { duration: 6000 });
        setSeenHighRiskIds(prev => new Set(prev).add(n.id));
      });

      newMediumRisk.forEach(n => {
        toast('Medium Risk: ' + n.title, { icon: '⚠️', duration: 4000 });
        setSeenMediumRiskIds(prev => new Set(prev).add(n.id));
      });
    }
  }, [data, seenHighRiskIds, seenMediumRiskIds]);

  const markAllReadMutation = useMutation({
    mutationFn: () => api.post('/api/v1/notifications/read-all'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'notification-popover' : undefined;

  const RiskChip = ({ risk }: { risk: Notification['risk_level'] }) => {
    const color = risk === 'High' ? 'error' : risk === 'Medium' ? 'warning' : 'default';
    return <Chip label={risk} color={color} size="small" sx={{ mr: 1 }} />;
  }

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={data?.unread_count ?? 0} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ width: 360 }}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Notifications</Typography>
            <Button size="small" onClick={() => markAllReadMutation.mutate()} disabled={data?.unread_count === 0}>
              Mark all as read
            </Button>
          </Box>
          <Divider />
          {isLoading ? <CircularProgress sx={{ m: 2 }}/> : (
            <List sx={{ maxHeight: 400, overflow: 'auto' }}>
              {data?.notifications.length === 0 && <ListItem><ListItemText primary="No new notifications" /></ListItem>}
              {data?.notifications.map((notification) => (
                <ListItem key={notification.id} sx={{ bgcolor: notification.read ? 'transparent' : 'action.hover' }}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <RiskChip risk={notification.risk_level} />
                        <Typography variant="body1" component="span">{notification.title}</Typography>
                      </Box>
                    }
                    secondary={
                      <>
                        {notification.description}
                        <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>{dayjs(notification.created_at).fromNow()}</Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Popover>
    </>
  );
};

export default NotificationPanel;