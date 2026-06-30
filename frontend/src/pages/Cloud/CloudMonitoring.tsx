import { Paper, Typography, Grid, Card, CardContent } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getCloudStatus } from "../../services/cloudService";
import Loader from "../../components/common/Loader";

export default function CloudMonitoring() {
  const { data: cloudStatus, isLoading } = useQuery({
    queryKey: ["cloudStatus"],
    queryFn: getCloudStatus,
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Cloud Monitoring
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Provider
              </Typography>
              <Typography variant="h4">{cloudStatus?.provider}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Instances
              </Typography>
              <Typography variant="h4">{cloudStatus?.instances}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Running Instances
              </Typography>
              <Typography variant="h4">{cloudStatus?.running}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Stopped Instances
              </Typography>
              <Typography variant="h4">{cloudStatus?.stopped}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}