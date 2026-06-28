import { Box, TextField, Button, Typography } from "@mui/material";

export default function Register() {
  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 10 }}>
      <Typography variant="h4" mb={2}>
        Register
      </Typography>

      <TextField fullWidth label="Name" margin="normal" />
      <TextField fullWidth label="Email" margin="normal" />
      <TextField fullWidth type="password" label="Password" margin="normal" />

      <Button fullWidth variant="contained">
        Create Account
      </Button>
    </Box>
  );
}