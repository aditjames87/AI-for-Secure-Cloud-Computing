import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Alert,
  Button,
  IconButton,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const API_URL = 'http://localhost:8000/api/resources';

// Fetcher function for react-query
const fetchResources = async () => {
  const { data } = await axios.get(API_URL);
  return data;
};

const CloudResources = () => {
  const queryClient = useQueryClient();

  // Queries
  const { data: resources, error, isLoading, isError } = useQuery('resources', fetchResources);

  // Mutations
  const deleteMutation = useMutation(
    (resourceId) => axios.delete(`${API_URL}/${resourceId}`),
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries('resources');
      },
    }
  );

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      deleteMutation.mutate(id);
    }
  };

  // TODO: Implement Add/Edit functionality
  const handleAdd = () => {
    alert('Add functionality to be implemented!');
  };

  const handleEdit = (id) => {
    alert(`Edit functionality for resource ${id} to be implemented!`);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return <Alert severity="error">Error fetching resources: {error.message}</Alert>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom component="div">
          Cloud Resources
        </Typography>
        <Button variant="contained" color="primary" onClick={handleAdd}>
          Add Resource
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="cloud resources table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Provider</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {resources.map((resource) => (
              <TableRow key={resource.id}>
                <TableCell>{resource.id}</TableCell>
                <TableCell>{resource.name}</TableCell>
                <TableCell>{resource.resource_type}</TableCell>
                <TableCell>{resource.provider}</TableCell>
                <TableCell>{resource.status}</TableCell>
                <TableCell>{new Date(resource.created_at).toLocaleString()}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(resource.id)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(resource.id)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default CloudResources;


/*
  To complete this component, you would typically:
  1. Create a form (e.g., in a Modal) for adding/editing resources.
  2. Use React Hook Form or a similar library for form state and validation.
  3. Implement `createMutation` and `updateMutation` using `useMutation` from react-query.
     - `createMutation` would POST to /api/resources/
     - `updateMutation` would PUT to /api/resources/{id}
  4. Wire up the "Add Resource" button and "Edit" icons to open the form modal,
     passing initial data for editing.
  5. On form submission, call the appropriate mutation.
*/