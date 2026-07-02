import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from "../../services/api";
import type { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  TextField,
  Button,
  Stack,
  CircularProgress,
  Divider,
} from '@mui/material';
import toast from 'react-hot-toast';

interface User {
  id: number;
  email: string;
  name: string | null;
}

const nameUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});
type NameUpdateFormData = z.infer<typeof nameUpdateSchema>;

const passwordUpdateSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password: z.string().min(8, 'New password must be at least 8 characters'),
});
type PasswordUpdateFormData = z.infer<typeof passwordUpdateSchema>;

const fetchUserProfile = async (): Promise<User> => {
  const { data } = await api.get('/api/v1/users/me');
  return data;
};

const Profile: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: user } = useQuery<User, Error>({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
  });

  const nameForm = useForm<NameUpdateFormData>({
    resolver: zodResolver(nameUpdateSchema),
    values: { name: user?.name ?? '' },
  });

  const passwordForm = useForm<PasswordUpdateFormData>({
    resolver: zodResolver(passwordUpdateSchema),
  });

  const updateNameMutation = useMutation<User, AxiosError, NameUpdateFormData>({
    mutationFn: (data) => api.put('/api/v1/users/me', data),
    onSuccess: () => {
      toast.success('Name updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
    onError: () => toast.error('Failed to update name.'),
  });

  const updatePasswordMutation = useMutation<void, AxiosError, PasswordUpdateFormData>({
    mutationFn: (data) => api.put('/api/v1/users/me/password', data),
    onSuccess: () => {
      toast.success('Password updated successfully!');
      passwordForm.reset();
    },
    onError: (error) => {
      const message = (error.response?.data as any)?.detail || 'Failed to update password.';
      toast.error(message);
    },
  });

  if (!user) return <CircularProgress />;

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Avatar sx={{ width: 120, height: 120, margin: 'auto', mb: 2 }}>
              {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h5">{user.name || 'User'}</Typography>
            <Typography color="text.secondary">{user.email}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box
              component="form"
              onSubmit={nameForm.handleSubmit((data) => updateNameMutation.mutate(data))}
            >
              <Typography variant="h6">Edit Profile</Typography>
              <TextField
                {...nameForm.register('name')}
                label="Full Name"
                fullWidth
                margin="normal"
                error={!!nameForm.formState.errors.name}
                helperText={nameForm.formState.errors.name?.message}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={updateNameMutation.isPending}
              >
                {updateNameMutation.isPending ? <CircularProgress size={24} /> : 'Save Name'}
              </Button>
            </Box>

            <Divider sx={{ my: 4 }} />

            <Box
              component="form"
              onSubmit={passwordForm.handleSubmit((data) => updatePasswordMutation.mutate(data))}
            >
              <Typography variant="h6">Change Password</Typography>
              <Stack spacing={2} mt={2}>
                <TextField
                  {...passwordForm.register('current_password')}
                  label="Current Password"
                  type="password"
                  fullWidth
                  error={!!passwordForm.formState.errors.current_password}
                  helperText={passwordForm.formState.errors.current_password?.message}
                />
                <TextField
                  {...passwordForm.register('new_password')}
                  label="New Password"
                  type="password"
                  fullWidth
                  error={!!passwordForm.formState.errors.new_password}
                  helperText={passwordForm.formState.errors.new_password?.message}
                />
              </Stack>
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 2 }}
                disabled={updatePasswordMutation.isPending}
              >
                {updatePasswordMutation.isPending ? <CircularProgress size={24} /> : 'Change Password'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;