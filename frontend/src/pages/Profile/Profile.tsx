import { Card, CardContent, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../services/authService";
import Loader from "../../components/common/Loader";

export default function Profile() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h6">Name:</Typography>
          <Typography>{user?.name}</Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Email:
          </Typography>
          <Typography>{user?.email}</Typography>
        </CardContent>
      </Card>
    </>
  );
}