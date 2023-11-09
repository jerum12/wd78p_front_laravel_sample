import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Alert, Button, CircularProgress, TextField } from '@mui/material';
import axios from 'axios';
import MUIDataTable from 'mui-datatables';
import React, { useEffect, useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Grid } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import toast from 'react-hot-toast';
// const data = [
//   ['Joe James', 'Test Corp', 'Yonkers', 'NY'],
//   ['John Walsh', 'Test Corp', 'Hartford', 'CT'],
//   ['Bob Herm', 'Test Corp', 'Tampa', 'FL'],
//   ['James Houston', 'Test Corp', 'Dallas', 'TX'],
// ];

const options = {
  filterType: 'checkbox',
  download: false,
  selectableRows: 'none',
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

function Services() {
  const apiBackendUrl = process.env.REACT_APP_BACK_END_URL;

  const [data2, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [transaction, setTransaction] = useState('');

  const [formData, setFormData] = useState({
    id: '',
    service_name: '',
    service_details: '',
  });

  const [error, setError] = useState('');

  const handleAdd = () => {
    setTransaction('add');
    setOpen(true);
    setSuccess(false);
  };

  const handleEditDelete = (rowIndex, type) => {
    console.log(rowIndex);
    setSuccess(false);
    const rowData = data2[rowIndex];
    setOpen(true);

    setFormData({
      id: rowData.id,
      service_name: rowData.service_name,
      service_details: rowData.service_details,
    });
    setTransaction(type);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    } else {
      try {
        if (transaction === 'add') {
          const response = await axios.post(`${apiBackendUrl}services`, formData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('login_token')}`,
              Accept: 'application/json',
            },
          });
          const p = response.data.service;
          toast.success(`Service ${p.service_name} successfully created!`);
        } else if (transaction === 'edit') {
          const response = await axios.put(`${apiBackendUrl}services/${formData.id}`, formData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('login_token')}`,
              Accept: 'application/json',
            },
          });

          const p = response.data.service;
          toast.success(`Service ${p.service_name} successfully updated!`);
        } else if (transaction === 'delete') {
          const response = await axios.delete(`${apiBackendUrl}services/${formData.id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('login_token')}`,
              Accept: 'application/json',
            },
          });

          const p = response.data.service;
          toast.success(`Service ${p.service_name} successfully deleted!`);
        }

        setSuccess(true);
        handleClose();
      } catch (error) {
        toast.error(error);
        setSuccess(false);
        console.error(error);
      }
    }
  };

  const handleClose = () => {
    setFormData({ service_name: '', service_details: '' });
    setOpen(false);
  };

  const handleInput = (event) => {
    setFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const validateForm = () => {
    if (formData.service_name === undefined || formData.service_name === '') {
      setError('Service Name is mandatory!');
      return false;
    }
    if (formData.service_details === undefined || formData.service_details === '') {
      setError('Service Details is mandatory!');
      return false;
    }

    return true;
  };

  const columns = [
    {
      name: 'service_name',
      label: 'Service Name',
    },
    {
      name: 'service_details',
      label: 'Service Details',
    },
    {
      name: 'Actions',
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          const rowIndex = tableMeta.rowIndex;
          return (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <Button
                variant="outlined"
                color="secondary"
                style={{
                  background: 'white',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginLeft: 'auto',
                }}
                onClick={() => handleEditDelete(rowIndex, 'edit')}
              >
                <EditIcon />
              </Button>
              <Button
                variant="outlined"
                color="error"
                style={{
                  background: 'white',
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
                onClick={() => handleEditDelete(rowIndex, 'delete')}
              >
                <DeleteIcon />
              </Button>
            </div>
          );
        },
      },
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiBackendUrl}services`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('login_token')}`,
            Accept: 'application/json',
          },
        });

        const services = response.data.services;
        setData(services);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };

    fetchData();
  }, [success]);

  return (
    <div>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress size={30} />
        </div>
      ) : (
        <>
          <Button
            variant="outlined"
            style={{
              background: 'white',
              display: 'flex',
              justifyContent: 'flex-end',
              marginLeft: 'auto',
            }}
            onClick={handleAdd}
          >
            {' '}
            <AddCircleIcon />
            ADD
          </Button>

          <MUIDataTable
            loading={loading}
            title={'Service List'}
            data={data2}
            columns={columns}
            options={options}
          />
        </>
      )}

      <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {transaction === 'add' ? 'Add' : transaction === 'edit' ? 'Edit' : 'Delete'} Service
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          {error && <Alert severity="error">{error}</Alert>}
          <Grid container spacing={4}>
            <Grid item xs={12} sm={12} md={12}>
              <TextField
                id="outlined-basic"
                label="Service Name"
                variant="outlined"
                fullWidth
                name="service_name"
                value={formData.service_name}
                onChange={handleInput}
                disabled={transaction === 'delete'}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <TextField
                id="outlined-basic"
                label="Service Details"
                variant="outlined"
                name="service_details"
                value={formData.service_details}
                fullWidth
                onChange={handleInput}
                disabled={transaction === 'delete'}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleSubmit} variant="contained">
            {transaction === 'add' ? 'Save' : transaction === 'edit' ? 'Update' : 'Delete'}
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}

export default Services;
