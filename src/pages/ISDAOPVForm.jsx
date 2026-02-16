import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Divider,
  Snackbar,
  Alert,
  Autocomplete,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

// API Configuration
// API Configuration
const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  // If the env URL already has /api, use it.
  if (envUrl.endsWith('/api')) {
    return envUrl;
  }
  // Otherwise, append /api. Be careful with trailing slash.
  return envUrl.endsWith('/') ? `${envUrl}api` : `${envUrl}/api`;
};

const API_URL = getApiUrl();

const ISDAOPVForm = () => {
  // --- State ---
  const [formData, setFormData] = useState({
    bankName: '',
    accountNumber: '',
    referenceNumber: 'Loading...',
    date: new Date().toISOString().split('T')[0],
    beneficiary: '',
    totalAmount: 0,
    amountInWords: '',
    currency: 'USD',
    preparedBy: '',
    checkedBy: '',
    authorizedBy: ''
  });

  const [items, setItems] = useState([
    { particulars: '', amount: '', accountName: '', fundingSourceCode: '', quickBooksCode: '' }
  ]);

  const [banks, setBanks] = useState([]);
  const [availableAccounts, setAvailableAccounts] = useState([]);
  const [coaOptions, setCoaOptions] = useState([]);
  const [loadingCOA, setLoadingCOA] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // --- Effects ---
  useEffect(() => {
    fetchBanks();
    fetchNextReferenceNumber();
  }, []);

  useEffect(() => {
    // Update total amount whenever items change
    const total = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    setFormData(prev => ({ ...prev, totalAmount: total }));
  }, [items]);

  // --- API Calls ---
  const fetchBanks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/banks`, {
         headers: { Authorization: `Bearer ${token}` }
      });
      setBanks(response.data);
    } catch (error) {
      console.error('Error fetching banks:', error);
      const errorMsg = error.response ? `Status: ${error.response.status}` : error.message;
      showSnackbar(`Error fetching banks (${errorMsg}) // Erreur lors de la récupération des banques`, 'error');
    }
  };

  const fetchNextReferenceNumber = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/payment-vouchers/next-ref`, {
         headers: { Authorization: `Bearer ${token}` }
      });
      setFormData(prev => ({ ...prev, referenceNumber: response.data.referenceNumber }));
    } catch (error) {
      console.error('Error fetching reference number:', error);
      const errorMsg = error.response ? `Status: ${error.response.status}` : error.message;
    }
  };

  const fetchCOA = async (query) => {
    if (!query || query.length < 1) {
      setCoaOptions([]);
      return;
    }
    setLoadingCOA(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/chart-of-accounts`, {
        params: { q: query },
        headers: { Authorization: `Bearer ${token}` }
      });
      setCoaOptions(response.data);
    } catch (error) {
      console.error('Error fetching COA:', error);
    } finally {
      setLoadingCOA(false);
    }
  };

  // --- Handlers ---
  const handleBankChange = (event) => {
    const selectedBankName = event.target.value;
    const bank = banks.find(b => b.name === selectedBankName);
    setFormData(prev => ({ ...prev, bankName: selectedBankName, accountNumber: '' }));
    setAvailableAccounts(bank ? bank.accounts : []);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItemRow = () => {
    setItems([...items, { particulars: '', amount: '', accountName: '', fundingSourceCode: '', quickBooksCode: '' }]);
  };

  const removeItemRow = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleSubmit = async () => {
    try {
      const payload = { ...formData, items };
      await axios.post(`${API_URL}/payment-vouchers`, payload, {
         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      showSnackbar('Bon de paiement créé avec succès ! // Payment Voucher created successfully!', 'success');
      
      // Refresh reference number and clear sensitive fields
      fetchNextReferenceNumber();
      setItems([{ particulars: '', amount: '', accountName: '', fundingSourceCode: '', quickBooksCode: '' }]);
      setFormData(prev => ({
         ...prev, 
         beneficiary: '',
         amountInWords: '',
         preparedBy: '',
         checkedBy: '',
         authorizedBy: ''
      }));

    } catch (error) {
      console.error('Error creating voucher:', error);
      showSnackbar('Erreur lors de la création du bon // Error creating voucher', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  // --- Styles ---
  const headerStyle = { fontWeight: 'bold', fontSize: '1.2rem', textTransform: 'uppercase' };
  const labelStyle = { fontSize: '0.85rem', color: '#666', marginBottom: '4px', display: 'block' };

  return (
    <Container maxWidth="lg" sx={{ py: 4, bgcolor: 'white', minHeight: '100vh' }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
           {/* Placeholder for Logo */}
           <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>ISDAO</Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
            {/* Removed PV AVIENTI */}
        </Box>
      </Box>

      <Box sx={{ mb: 4, textAlign: 'center' }}>
         <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
            Bon de paiement // Payment Voucher
         </Typography>

         <Grid container spacing={2} justifyContent="flex-end">
            <Grid item xs={12} md={6}>
               {/* Bank Info Block */}
               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'left' }}>
                  
                  {/* Bank Name */}
                  <Box display="flex" alignItems="center">
                    <Box width="250px">
                       <Typography sx={labelStyle}>Nom de la banque // Bank name:</Typography>
                    </Box>
                    <FormControl fullWidth size="small">
                      <Select
                        value={formData.bankName}
                        onChange={handleBankChange}
                        displayEmpty
                      >
                        <MenuItem value="" disabled>Sélectionner la banque // Select Bank</MenuItem>
                        {banks.map(bank => (
                          <MenuItem key={bank._id} value={bank.name}>{bank.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  {/* Reference Number */}
                   <Box display="flex" alignItems="center">
                    <Box width="250px">
                       <Typography sx={labelStyle}>Numéro de référence // Reference number:</Typography>
                    </Box>
                    <TextField 
                        fullWidth 
                        size="small" 
                        value={formData.referenceNumber} 
                        InputProps={{ readOnly: true }}
                    />
                  </Box>

                  {/* Account Number */}
                   <Box display="flex" alignItems="center">
                    <Box width="250px">
                       <Typography sx={labelStyle}>Numéro de compte // Account number:</Typography>
                    </Box>
                     <FormControl fullWidth size="small">
                      <Select
                        value={formData.accountNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                        displayEmpty
                        disabled={!formData.bankName}
                      >
                        <MenuItem value="" disabled>Sélectionner le compte // Select Account</MenuItem>
                        {availableAccounts.map(acc => (
                          <MenuItem key={acc} value={acc}>{acc}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  {/* Date */}
                   <Box display="flex" alignItems="center">
                    <Box width="250px">
                       <Typography sx={labelStyle}>Date // Date:</Typography>
                    </Box>
                    <TextField 
                        type="date"
                        fullWidth 
                        size="small" 
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                    />
                  </Box>

               </Box>
            </Grid>
         </Grid>
      </Box>

      {/* Payee Section */}
      <Box sx={{ mb: 4 }}>
         <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
             <Grid item xs={12} md={2}>
                 <Typography sx={{ fontWeight: 'bold' }}>BENEFICIAIRE // PAYEE:</Typography>
             </Grid>
             <Grid item xs={12} md={10}>
                 <TextField 
                    fullWidth 
                    variant="standard" 
                    name="beneficiary"
                    value={formData.beneficiary}
                    onChange={handleInputChange}
                 />
             </Grid>
         </Grid>

         <Grid container spacing={2} alignItems="center">
             <Grid item xs={12} md={4}>
                 <Typography sx={{ fontWeight: 'bold', display: 'inline' }}>MONTANT EN USD : {formData.totalAmount.toLocaleString()} $ // AMOUNT IN USD : $ {formData.totalAmount.toLocaleString()}</Typography>
             </Grid>
             <Grid item xs={12} md={8}>
                 <TextField 
                    fullWidth 
                    variant="standard" 
                    placeholder="Cent un mille... // One hundred and one thousand..."
                    name="amountInWords"
                    value={formData.amountInWords}
                    onChange={handleInputChange}
                 />
             </Grid>
         </Grid>
      </Box>

      {/* Dynamic Table */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #000', mb: 4, borderRadius: 0 }}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="payment voucher table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ borderRight: '1px solid #000', fontWeight: 'bold', width: '30%' }}>
                  Détail du paiement // Particulars of payment
              </TableCell>
              <TableCell sx={{ borderRight: '1px solid #000', fontWeight: 'bold', width: '15%' }}>
                  Montant (Devise) // Amount (Currency)
              </TableCell>
              <TableCell sx={{ borderRight: '1px solid #000', fontWeight: 'bold', width: '20%' }}>
                  Nom du compte // Account name
              </TableCell>
              <TableCell sx={{ borderRight: '1px solid #000', fontWeight: 'bold', width: '15%' }}>
                  Code de la source de financement // Funding source code
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>
                  Code QuickBooks
              </TableCell>
              <TableCell width="5%"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((row, index) => (
              <TableRow key={index} sx={{ borderBottom: '1px solid #ccc' }}>
                <TableCell sx={{ borderRight: '1px solid #000', p: 1 }}>
                    <TextField 
                        fullWidth 
                        multiline 
                        rows={3} 
                        variant="standard" 
                        InputProps={{ disableUnderline: true }}
                        value={row.particulars}
                        onChange={(e) => handleItemChange(index, 'particulars', e.target.value)}
                    />
                </TableCell>
                <TableCell sx={{ borderRight: '1px solid #000', p: 1 }}>
                    <TextField 
                        fullWidth 
                        type="number"
                        variant="standard" 
                        InputProps={{ disableUnderline: true }}
                        value={row.amount}
                        onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                    />
                </TableCell>
                <TableCell sx={{ borderRight: '1px solid #000', p: 1 }}>
                    <TextField 
                        fullWidth 
                        multiline
                        rows={3}
                        variant="standard" 
                        InputProps={{ disableUnderline: true }}
                        value={row.accountName}
                        onChange={(e) => handleItemChange(index, 'accountName', e.target.value)}
                    />
                </TableCell>
                <TableCell sx={{ borderRight: '1px solid #000', p: 1 }}>
                     <TextField 
                        fullWidth 
                        multiline
                        rows={3}
                        variant="standard" 
                        InputProps={{ disableUnderline: true }}
                        value={row.fundingSourceCode}
                        onChange={(e) => handleItemChange(index, 'fundingSourceCode', e.target.value)}
                    />
                </TableCell>
                <TableCell sx={{ p: 1 }}>
                     <Autocomplete
                        size="small"
                        options={coaOptions}
                        getOptionLabel={(option) => {
                            if (typeof option === 'string') return option;
                            return `${option.code} - ${option.name}`;
                        }}
                        filterOptions={(options, params) => {
                            // If user typed something, show all options from backend
                            if (params.inputValue !== '') {
                                return options;
                            }
                            return options;
                        }}
                        onInputChange={(e, value, reason) => {
                            if (reason === 'input' || reason === 'clear') {
                                fetchCOA(value);
                            }
                        }}
                        // Ensure it shows the code even if the object isn't in coaOptions yet
                        value={coaOptions.find(opt => opt.code === row.quickBooksCode) || (row.quickBooksCode ? { code: row.quickBooksCode, name: '' } : null)}
                        isOptionEqualToValue={(option, value) => option.code === value.code}
                        onChange={(e, newValue) => {
                            if (newValue) {
                                // If it's a string (from freeSolo), just set it
                                if (typeof newValue === 'string') {
                                    handleItemChange(index, 'quickBooksCode', newValue);
                                } else {
                                    handleItemChange(index, 'quickBooksCode', newValue.code);
                                    if (!row.accountName || row.accountName === '') {
                                        handleItemChange(index, 'accountName', newValue.name);
                                    }
                                }
                            } else {
                                handleItemChange(index, 'quickBooksCode', '');
                            }
                        }}
                        loading={loadingCOA}
                        freeSolo
                        autoHighlight
                        clearOnBlur
                        renderInput={(params) => (
                            <TextField 
                                {...params}
                                fullWidth 
                                variant="standard" 
                                placeholder="Chercher code... // Search code..."
                                InputProps={{ 
                                    ...params.InputProps,
                                    disableUnderline: true,
                                    startAdornment: (
                                        <React.Fragment>
                                            <SearchIcon sx={{ color: 'action.active', mr: 1, fontSize: 18 }} />
                                            {params.InputProps.startAdornment}
                                        </React.Fragment>
                                    ),
                                    endAdornment: (
                                        <React.Fragment>
                                            {loadingCOA ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </React.Fragment>
                                    ),
                                }}
                            />
                        )}
                    />
                </TableCell>
                <TableCell>
                    <IconButton size="small" color="error" onClick={() => removeItemRow(index)}>
                        <DeleteIcon />
                    </IconButton>
                </TableCell>
              </TableRow>
            ))}
             {/* Totals Row */}
             <TableRow>
                <TableCell sx={{ borderRight: '1px solid #000', fontWeight: 'bold' }}>
                    TOTAL // TOTAL
                </TableCell>
                <TableCell sx={{ borderRight: '1px solid #000', fontWeight: 'bold' }}>
                    {formData.totalAmount.toFixed(2)}
                </TableCell>
                <TableCell colSpan={4}></TableCell>
             </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Button startIcon={<AddIcon />} variant="outlined" onClick={addItemRow} sx={{ mb: 4 }}>
        Ajouter une ligne // Add Row
      </Button>

      {/* Footer Signatures */}
      <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" alignItems="center"  sx={{ mb: 2 }}>
                  <Typography sx={{ fontWeight: 'bold', width: '200px' }}>Préparé par // Prepared By:</Typography>
                  <TextField 
                    variant="standard" 
                    fullWidth 
                    name="preparedBy"
                    value={formData.preparedBy}
                    onChange={handleInputChange}
                  />
                  <Box display="flex" alignItems="center" ml={2} minWidth="200px">
                      <Typography sx={{ fontWeight: 'bold', mr: 1 }}>Date:</Typography>
                      <TextField variant="standard" value={formData.date} InputProps={{ readOnly: true }} />
                  </Box>
              </Box>

               <Box display="flex" justifyContent="space-between" alignItems="center"  sx={{ mb: 2 }}>
                  <Typography sx={{ fontWeight: 'bold', width: '200px' }}>Vérifié par // Checked by:</Typography>
                  <TextField 
                    variant="standard" 
                    fullWidth
                    name="checkedBy"
                    value={formData.checkedBy}
                    onChange={handleInputChange}
                  />
                  <Box display="flex" alignItems="center" ml={2} minWidth="200px">
                      <Typography sx={{ fontWeight: 'bold', mr: 1 }}>Date:</Typography>
                      <TextField variant="standard" value={formData.date} InputProps={{ readOnly: true }} />
                  </Box>
              </Box>

               <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography sx={{ fontWeight: 'bold', width: '350px' }}>Signataire autorisée // Authorised signatory:</Typography>
                  <TextField 
                    variant="standard" 
                    fullWidth
                    name="authorizedBy"
                    value={formData.authorizedBy}
                    onChange={handleInputChange}
                   />
                  <Box display="flex" alignItems="center" ml={2} minWidth="200px">
                      <Typography sx={{ fontWeight: 'bold', mr: 1 }}>Date:</Typography>
                      <TextField variant="standard" />
                  </Box>
              </Box>
          </Grid>
      </Grid>
      
      <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" color="primary" size="large" onClick={handleSubmit}>
              Enregistrer le bon de paiement // Save Payment Voucher
          </Button>
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ISDAOPVForm;
