import { Box, CircularProgress } from "@mui/material";

export default function Loader() {
  return (
    <Box
  sx={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    py: 5,
  }}
>
  <CircularProgress />
</Box>
  );
}