import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
} from '@mui/material';

const serverSchema = z.object({
  server_name: z.string().min(1, 'Server name is required'),
  ip_address: z.string().ip({ version: 'v4', message: 'Invalid IP address' }),
  operating_system: z.string().min(1, 'Operating system is required'),
});

export type ServerFormData = z.infer<typeof serverSchema>;

interface Server {
    id: number;
    server_name: string;
    ip_address: string;
    operating_system: string;
}

interface ServerFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ServerFormData) => void;
  defaultValues?: Partial<Server>;
}

const ServerForm: React.FC<ServerFormProps> = ({ open, onClose, onSubmit, defaultValues }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ServerFormData>({
    resolver: zodResolver(serverSchema),
    defaultValues: {
        server_name: '',
        ip_address: '',
        operating_system: '',
        ...defaultValues,
    },
  });

  const handleFormSubmit = (data: ServerFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ component: 'form', onSubmit: handleSubmit(handleFormSubmit) }}>
      <DialogTitle>{defaultValues?.id ? 'Edit Server' : 'Add New Server'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            {...register('server_name')}
            label="Server Name"
            fullWidth
            error={!!errors.server_name}
            helperText={errors.server_name?.message}
          />
          <TextField
            {...register('ip_address')}
            label="IP Address"
            fullWidth
            error={!!errors.ip_address}
            helperText={errors.ip_address?.message}
          />
          <TextField
            {...register('operating_system')}
            label="Operating System"
            fullWidth
            error={!!errors.operating_system}
            helperText={errors.operating_system?.message}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ServerForm;