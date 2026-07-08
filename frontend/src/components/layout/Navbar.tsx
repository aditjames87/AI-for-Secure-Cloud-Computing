import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import NotificationPanel from "../NotificationPanel";

export default function Navbar() {
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          AI Secure Cloud Dashboard
        </Typography>

        <Box>
          <NotificationPanel />
        </Box>
      </Toolbar>
    </AppBar>
  );
}