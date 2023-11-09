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

function Products() {
  const apiBackendUrl = process.env.REACT_APP_BACK_END_URL;

  const [data2, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [transaction, setTransaction] = useState('');

  const [formData, setFormData] = useState({
    id: '',
    product_name: '',
    product_description: '',
    amount: '',
    currency: '',
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
      product_name: rowData.product_name,
      product_description: rowData.product_description,
      amount: rowData.amount,
      currency: rowData.currency,
    });
    setTransaction(type);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    } else {
      try {
        if (transaction === 'add') {
          const response = await axios.post(`${apiBackendUrl}products`, formData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('login_token')}`,
              Accept: 'application/json',
            },
          });
          const p = response.data.product;
          toast.success(`Product ${p.product_name} successfully created!`);
        } else if (transaction === 'edit') {
          const response = await axios.put(`${apiBackendUrl}products/${formData.id}`, formData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('login_token')}`,
              Accept: 'application/json',
            },
          });

          const p = response.data.product;
          toast.success(`Product ${p.product_name} successfully updated!`);
        } else if (transaction === 'delete') {
          const response = await axios.delete(`${apiBackendUrl}products/${formData.id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('login_token')}`,
              Accept: 'application/json',
            },
          });

          const p = response.data.product;
          toast.success(`Product ${p.product_name} successfully deleted!`);
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
    setFormData({ product_name: '', product_description: '', amount: '', currency: '' });
    setOpen(false);
  };

  const handleInput = (event) => {
    setFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const validateForm = () => {
    if (formData.product_name === undefined || formData.product_name === '') {
      setError('Product Name is mandatory!');
      return false;
    }
    if (formData.product_description === undefined || formData.product_description === '') {
      setError('Product Description is mandatory!');
      return false;
    }
    if (formData.amount === undefined || formData.amount === '') {
      setError('Amount is mandatory!');
      return false;
    }
    if (formData.currency === undefined || formData.currency === '') {
      setError('Currency is mandatory!');
      return false;
    }

    return true;
  };

  const columns = [
    {
      name: 'product_name',
      label: 'Product Name',
    },
    {
      name: 'product_description',
      label: 'Product Description',
    },
    {
      name: 'amount',
      label: 'Amount',
    },
    {
      name: 'currency',
      label: 'Currency',
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
                  marginLeft: 'auto',
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
        const response = await axios.get(`${apiBackendUrl}products`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('login_token')}`,
            Accept: 'application/json',
          },
        });

        const products = response.data.products;
        setData(products);
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
            title={'Product List'}
            data={data2}
            columns={columns}
            options={options}
          />
        </>
      )}

      <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {transaction === 'add' ? 'Add' : transaction === 'edit' ? 'Edit' : 'Delete'} Product
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
                label="Product Name"
                variant="outlined"
                fullWidth
                name="product_name"
                value={formData.product_name}
                onChange={handleInput}
                disabled={transaction === 'delete'}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <TextField
                id="outlined-basic"
                label="Product Description"
                variant="outlined"
                name="product_description"
                value={formData.product_description}
                fullWidth
                onChange={handleInput}
                disabled={transaction === 'delete'}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <TextField
                id="outlined-basic"
                label="Amount"
                variant="outlined"
                name="amount"
                value={formData.amount}
                fullWidth
                type="number"
                onChange={handleInput}
                disabled={transaction === 'delete'}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <TextField
                id="outlined-basic"
                label="Currency"
                variant="outlined"
                name="currency"
                value={formData.currency}
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

export default Products;
