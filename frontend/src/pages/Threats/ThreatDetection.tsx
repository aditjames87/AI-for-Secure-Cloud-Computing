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
import { getThreats } from "../../services/threatService";
import Loader from "../../components/common/Loader";

export default function ThreatDetection() {
  const { data: threats, isLoading } = useQuery({
    queryKey: ["threats"],
    queryFn: getThreats,
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Threat Detection
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Attack Type</TableCell>
              <TableCell>Source IP</TableCell>
              <TableCell>Destination IP</TableCell>
              <TableCell>Timestamp</TableCell>
              <TableCell>Severity</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {threats?.map((threat) => (
              <TableRow key={threat.id}>
                <TableCell>{threat.id}</TableCell>
                <TableCell>{threat.attack_type}</TableCell>
                <TableCell>{threat.source_ip}</TableCell>
                <TableCell>{threat.destination_ip}</TableCell>
                <TableCell>{new Date(threat.timestamp).toLocaleString()}</TableCell>
                <TableCell>{threat.severity}</TableCell>
                <TableCell>{threat.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}