
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Alert,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getPredictions } from "../../services/predictionService";
import Loader from "../../components/common/Loader";

interface Prediction {
  id: number;
  threat_id: number;
  prediction: string;
  confidence: number;
  created_at: string;
}

export default function Prediction() {
  const query = useQuery({
  queryKey: ["predictions"],
  queryFn: getPredictions,
});

const predictions = Array.isArray(query.data) ? query.data : [];

const isLoading = query.isLoading;
const isError = query.isError;
const error = query.error;


console.log("Query status:", query.status);
console.log("Data:", query.data);
console.log("Is Array:", Array.isArray(query.data));

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    
    return (
      <Alert severity="error">
        {error instanceof Error
          ? error.message
          : "Failed to load predictions."}
      </Alert>
    );
  }
  const predictionList = Array.isArray(predictions)
    ? predictions
    : [];
    return (
    <>
      <Typography variant="h4" gutterBottom>
        AI Predictions
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Threat ID</TableCell>
              <TableCell>Prediction</TableCell>
              <TableCell>Confidence</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {predictions.length > 0 ? (
              predictionList.map((prediction) => (
                <TableRow key={prediction.id}>
                  <TableCell>{prediction.id}</TableCell>

                  <TableCell>{prediction.threat_id}</TableCell>

                  <TableCell>{prediction.prediction}</TableCell>

                  <TableCell>
                    {prediction.confidence}%
                  </TableCell>

                  <TableCell>
                    {new Date(
                      prediction.created_at
                    ).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No predictions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}