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
import { getReports } from "../../services/reportService";
import Loader from "../../components/common/Loader";

export default function Reports() {
  const { data: reports, isLoading } = useQuery({
    queryKey: ["reports"],
    queryFn: getReports,
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Reports
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Summary</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports?.map((report) => (
              <TableRow key={report.id}>
                <TableCell>{report.id}</TableCell>
                <TableCell>{report.title}</TableCell>
                <TableCell>{report.date}</TableCell>
                <TableCell>{report.summary}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}