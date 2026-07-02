import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  Switch,
  Divider,
  ListSubheader,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SecurityIcon from '@mui/icons-material/Security';
import PersonIcon from '@mui/icons-material/Person';
import { useCustomTheme } from '../../context/ThemeContext';

const Settings: React.FC = () => {
  const { mode, toggleTheme } = useCustomTheme();
  const [notificationSettings, setNotificationSettings] = useState({
    highRisk: true,
    mediumRisk: true,
    serverStatus: false,
  });

  const handleNotificationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotificationSettings({
      ...notificationSettings,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Paper>
        <List>
          {/* System Settings */}
          <ListSubheader>System</ListSubheader>
          <ListItem>
            <ListItemIcon>
              <Brightness4Icon />
            </ListItemIcon>
            <ListItemText primary="Dark Mode" />
            <Switch
              edge="end"
              onChange={toggleTheme}
              checked={mode === 'dark'}
            />
          </ListItem>
          <Divider />

          {/* Profile Settings */}
          <ListSubheader>Account</ListSubheader>
          <ListItemButton component="a" href="/profile">
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText
              primary="Profile Settings"
              secondary="Manage your name and password"
            />
          </ListItemButton>
          <Divider />

          {/* Notification Settings */}
          <ListSubheader>Notifications</ListSubheader>
          <ListItem>
            <ListItemIcon>
              <NotificationsActiveIcon />
            </ListItemIcon>
            <ListItemText
              primary="High Risk Alerts"
              secondary="Receive immediate alerts for critical threats"
            />
            <Switch
              edge="end"
              onChange={handleNotificationChange}
              checked={notificationSettings.highRisk}
              name="highRisk"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <SecurityIcon />
            </ListItemIcon>
            <ListItemText
              primary="Medium Risk Alerts"
              secondary="Receive alerts for non-critical warnings"
            />
            <Switch
              edge="end"
              onChange={handleNotificationChange}
              checked={notificationSettings.mediumRisk}
              name="mediumRisk"
            />
          </ListItem>
           <ListItem>
            <ListItemIcon>
              <SecurityIcon />
            </ListItemIcon>
            <ListItemText
              primary="Server Status Changes"
              secondary="Get notified when a server goes online or offline"
            />
            <Switch
              edge="end"
              onChange={handleNotificationChange}
              checked={notificationSettings.serverStatus}
              name="serverStatus"
            />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default Settings;