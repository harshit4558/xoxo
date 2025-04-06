import React, { useState } from 'react';
import { Button, Box, Typography, TextField, Container, Snackbar, Alert, Paper } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

export default function App() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      console.log('Sending credentials to backend...');
      
      const response = await fetch('http://localhost:8000/api/credentials/linkedin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      console.log('API Response:', data);
      
      if (response.ok) {
        setNotification({
          open: true,
          message: 'Credentials saved successfully!',
          severity: 'success'
        });
        // Clear the form
        setCredentials({ username: '', password: '' });
      } else {
        throw new Error(data.detail || 'Failed to save credentials');
      }
    } catch (error) {
      console.error('Error:', error);
      setNotification({
        open: true,
        message: error.message || 'Failed to save credentials',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <Paper 
      elevation={0}
      sx={{ 
        width: '400px', 
        minHeight: '450px',
        margin: '0 auto',
        background: '#f8f9fa'
      }}
    >
      <Container sx={{ pt: 3, pb: 3 }}>
        <Box 
          sx={{
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            p: 4,
            borderRadius: 2,
            boxShadow: 2,
            bgcolor: 'background.paper',
            width: '100%'
          }}
        >
          <LinkedInIcon sx={{ fontSize: 48, color: '#0077b5', mb: 2 }} />
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              mb: 3,
              color: '#0077b5'
            }}
          >
            LinkedIn Credentials
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 1 }}>
            <TextField
              fullWidth
              margin="normal"
              label="LinkedIn Username"
              name="username"
              variant="outlined"
              value={credentials.username}
              onChange={handleChange}
              required
              disabled={loading}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              margin="normal"
              label="LinkedIn Password"
              name="password"
              type="password"
              variant="outlined"
              value={credentials.password}
              onChange={handleChange}
              required
              disabled={loading}
              sx={{ mb: 3 }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 2, 
                mb: 2,
                backgroundColor: '#0077b5',
                '&:hover': {
                  backgroundColor: '#006097'
                },
                py: 1.5,
                fontSize: '1rem',
                fontWeight: '500',
                borderRadius: 2
              }}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Credentials'}
            </Button>
          </Box>
        </Box>
        
        <Snackbar 
          open={notification.open} 
          autoHideDuration={6000} 
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseNotification} 
            severity={notification.severity}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
    </Paper>
  );
} 