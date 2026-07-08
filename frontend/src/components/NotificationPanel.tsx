import type { FC } from "react";
import { useEffect, useState } from "react";
import api from "../services/api";

import {
  Badge,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Popover,
  Typography,
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";
import toast from "react-hot-toast";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface Notification {
  id: number;
  title: string;
  description: string;
  risk_level: "High" | "Medium" | "Low";
  read: boolean;
  created_at: string;
}

const Notification: FC<{ notification: Notification }> = ({ notification }) => {
  return (
    <ListItem key={notification.id}>
      <ListItemText
        primary={notification.title}
        secondary={notification.description}
      />
    </ListItem>
  );
};

const RiskChip = ({ risk }: { risk: Notification["risk_level"] }) => {
  const color =
    risk === "High"
      ? "error"
      : risk === "Medium"
      ? "warning"
      : "default";

  return <Chip label={risk} color={color} size="small" sx={{ mr: 1 }} />;
};

export default function NotificationPanel() {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const [loading, setLoading] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [unreadCount, setUnreadCount] = useState(0);

  const open = Boolean(anchorEl);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);

      const response = await api.get("/api/v1/notifications");

      const data = response.data;

      setNotifications(data.notifications ?? []);
      setUnreadCount(data.unread_count ?? 0);

      data.notifications?.forEach((n: Notification) => {
        if (!n.read) {
          if (n.risk_level === "High") {
            toast.error(`High Risk: ${n.title}`);
          } else if (n.risk_level === "Medium") {
            toast(`Medium Risk: ${n.title}`, {
              icon: "⚠️",
            });
          }
        }
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      await api.post("/api/v1/notifications/read-all");

      await loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box sx={{ width: 360 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
            }}
          >
            <Typography variant="h6">
              Notifications
            </Typography>

            <Button
              size="small"
              onClick={markAllRead}
              disabled={unreadCount === 0}
            >
              Mark all as read
            </Button>
          </Box>

          <Divider />

          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                p: 3,
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <List sx={{ maxHeight: 400, overflow: "auto" }}>
              {notifications.length === 0 ? (
                <ListItem>
                  <ListItemText primary="No notifications" />
                </ListItem>
              ) : (
                notifications.map((notification) => (
                  <ListItem
                    key={notification.id}
                    sx={{
                      bgcolor: notification.read
                        ? "transparent"
                        : "action.hover",
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <RiskChip risk={notification.risk_level} />

                          <Typography>
                            {notification.title}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2">
                            {notification.description}
                          </Typography>

                          <Typography variant="caption">
                            {dayjs(notification.created_at).fromNow()}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))
              )}
            </List>
          )}
        </Box>
      </Popover>
    </>
  );
}