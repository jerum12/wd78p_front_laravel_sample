import { Alert, Avatar, Box, Button, Container, Grid, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const apiBackendUrl = process.env.REACT_APP_BACK_END_URL;

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleInput = (event) => {
    setFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    setError('');
    if (!validateForm()) {
      return;
    } else {
      try {
        //call apiBackend
        //http://127.0.0.1:8000/api/login
        const response = await axios.post(`${apiBackendUrl}login`, formData);
        console.log(response);
        const token = response.data.token;
        localStorage.setItem('login_token', token);
        navigate('/dashboard');
      } catch (error) {
        console.log(error);
        setError(error.response.data.message);
      }
    }
  };

  const validateForm = () => {
    if (formData.email === undefined || formData.email === '') {
      console.log('Email is required');
      setError('Email is mandatory!');
      return false;
    }
    if (formData.password === undefined || formData.password === '') {
      console.log('Password is required');
      setError('Password is mandatory!');
      return false;
    }

    return true;
  };

  return (
    <Container style={{ height: '90vh', display: 'flex', justifyContent: 'center' }}>
      <Box
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Avatar alt="Remy Sharp" src="https://cdn-icons-png.flaticon.com/512/295/295128.png" />
        <Typography component="h1" variant="h5" style={{ marginBottom: '10px' }}>
          Login
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}
        <Box
          component="form"
          style={{
            borderRadius: '5px',
            padding: '40px',
            boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
            backgroundColor: '#f1f1f1',
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12} sm={12} md={12}>
              <TextField
                id="outlined-basic"
                label="Email"
                variant="outlined"
                fullWidth
                name="email"
                value={formData.email}
                onChange={handleInput}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <TextField
                id="outlined-basic"
                label="Password"
                variant="outlined"
                type="password"
                name="password"
                value={formData.password}
                fullWidth
                onChange={handleInput}
              />
            </Grid>
          </Grid>

          <Box style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <Button variant="outlined" onClick={handleSubmit}>
              Login
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
