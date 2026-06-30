import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getPredictions } from "../../services/predictionService";
import Loader from "../../components/common/Loader";

export default function Prediction() {
  const { data: predictions, isLoading } = useQuery({
    queryKey: ["predictions"],
    queryFn: getPredictions,
  });

  if (isLoading) {
    return <Loader />;
  }

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
              <TableCell>Prediction Result</TableCell>
              <TableCell>Confidence</TableCell>
              <TableCell>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {predictions?.map((prediction) => (
              <TableRow key={prediction.id}>
                <TableCell>{prediction.id}</TableCell>
                <TableCell>{prediction.prediction_result}</TableCell>
                <TableCell>{prediction.confidence}</TableCell>
                <TableCell>
                  {new Date(prediction.timestamp).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}