import { Button, Card, CardContent, TextField, Typography } from "@mui/material";
import { useState } from "react";

export default function Settings() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            User Settings
          </Typography>
          <TextField
            label="Name"
            fullWidth
            sx={{ mb: 2 }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Email"
            fullWidth
            sx={{ mb: 2 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button variant="contained">Save</Button>
        </CardContent>
      </Card>
    </>
  );
}