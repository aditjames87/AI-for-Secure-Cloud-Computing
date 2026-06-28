import { useState } from "react";
import { Button, TextField, Box, Typography } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin() {
    // now values are intentionally used (removes warnings)
    console.log("Login attempt:", { email, password });

    const fakeToken = "demo-token-123";
    login(fakeToken);
    navigate("/");
  }

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 10 }}>
      <Typography variant="h4" sx={{ mb:2}}>
        Login
      </Typography>

      <TextField
        fullWidth
        label="Email"
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <TextField
        fullWidth
        type="password"
        label="Password"
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button fullWidth variant="contained" onClick={handleLogin}>
        Login
      </Button>
    </Box>
  );
}