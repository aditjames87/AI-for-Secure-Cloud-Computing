import { Drawer, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

const menu = [
  { text: "Dashboard", path: "/" },
  { text: "Threats", path: "/threats" },
  { text: "AI Prediction", path: "/prediction" },
  { text: "Cloud", path: "/cloud" },
  { text: "Reports", path: "/reports" },
  { text: "Profile", path: "/profile" },
  { text: "Settings", path: "/settings" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <Drawer variant="permanent" sx={{ width: 240 }}>
      <List>
        {menu.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
            >
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}