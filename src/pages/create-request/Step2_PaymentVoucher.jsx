import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    TextField, 
    Grid, 
    Paper,
    Select,
    MenuItem,
    FormControl,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Button,
    Autocomplete,
    CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { API_URL } from '../../config';

const Step2_PaymentVoucher = ({ formData, handleChange, handleItemsChange }) => {
    const [banks, setBanks] = useState([]);
    const [availableAccounts, setAvailableAccounts] = useState([]);
    const [coaOptions, setCoaOptions] = useState([]);
    const [loadingCOA, setLoadingCOA] = useState(false);

    useEffect(() => {
        fetchBanks();
    }, []);

    console.log(banks)

    useEffect(() => {
        if (formData.bankName) {
            const selectedBank = banks.find(b => b.name === formData.bankName);
            setAvailableAccounts(selectedBank ? selectedBank.accounts : []);
        } else {
            setAvailableAccounts([]);
        }
    }, [formData.bankName, banks]);

    const fetchBanks = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/api/banks`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBanks(response.data);
        } catch (error) {
            console.error('Error fetching banks:', error);
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
            const response = await axios.get(`${API_URL}/api/chart-of-accounts`, {
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

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;
        handleItemsChange(newItems);
    };

    const addItemRow = () => {
        const newItems = [...formData.items, { particulars: '', amount: '', accountName: '', fundingSourceCode: '', quickBooksCode: '' }];
        handleItemsChange(newItems);
    };

    const removeItemRow = (index) => {
        if (formData.items.length === 1) return;
        const newItems = formData.items.filter((_, i) => i !== index);
        handleItemsChange(newItems);
    };

    const labelStyle = { fontSize: '0.85rem', color: '#666', marginBottom: '4px', display: 'block' };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Payment Voucher // Bon de paiement
            </Typography>
            
            <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
                <Grid container spacing={2} justifyContent="flex-end">
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {/* Bank Name */}
                            <Box display="flex" alignItems="center">
                                <Box width="200px">
                                    <Typography sx={labelStyle}>Bank name // Nom de la banque:</Typography>
                                </Box>
                                <FormControl fullWidth size="small">
                                    <Select
                                        name="bankName"
                                        value={formData.bankName}
                                        onChange={handleChange}
                                        displayEmpty
                                    >
                                        <MenuItem value="" disabled>Select Bank</MenuItem>
                                        {banks.map(bank => (
                                            <MenuItem key={bank._id} value={bank.name}>{bank.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>

                            {/* Reference Number */}
                            <Box display="flex" alignItems="center">
                                <Box width="200px">
                                    <Typography sx={labelStyle}>Reference number // Référence:</Typography>
                                </Box>
                                <TextField 
                                    fullWidth 
                                    size="small" 
                                    value="Auto-generated upon submission" 
                                    disabled
                                />
                            </Box>

                            {/* Account Number */}
                            <Box display="flex" alignItems="center">
                                <Box width="200px">
                                    <Typography sx={labelStyle}>Account number // Numéro de compte:</Typography>
                                </Box>
                                <FormControl fullWidth size="small">
                                    <Select
                                        name="accountNumber"
                                        value={formData.accountNumber}
                                        onChange={handleChange}
                                        displayEmpty
                                        disabled={!formData.bankName}
                                    >
                                        <MenuItem value="" disabled>Select Account</MenuItem>
                                        {availableAccounts.map(acc => (
                                            <MenuItem key={acc} value={acc}>{acc}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>

                            {/* Date */}
                            <Box display="flex" alignItems="center">
                                <Box width="200px">
                                    <Typography sx={labelStyle}>Date:</Typography>
                                </Box>
                                <TextField 
                                    type="date"
                                    fullWidth 
                                    size="small" 
                                    name="requestDate"
                                    value={formData.requestDate}
                                    onChange={handleChange}
                                />
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 4, mb: 4 }}>
                    <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                        <Grid item xs={12} md={3}>
                            <Typography sx={{ fontWeight: 'bold' }}>PAYEE // BENEFICIAIRE:</Typography>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <TextField 
                                fullWidth 
                                variant="standard" 
                                name="beneficiary"
                                value={formData.beneficiary}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={12}>
                             <Box display="flex" alignItems="center">
                                <Typography sx={{ fontWeight: 'bold', mr: 2, whiteSpace: 'nowrap' }}>
                                    AMOUNT IN {formData.currency} : {formData.totalAmount.toLocaleString()} // MONTANT:
                                </Typography>
                                <TextField 
                                    fullWidth 
                                    variant="standard" 
                                    placeholder="Amount in words // Montant en lettres"
                                    name="amountInWords"
                                    value={formData.amountInWords}
                                    onChange={handleChange}
                                />
                             </Box>
                        </Grid>
                    </Grid>
                </Box>

                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #ccc', mb: 2, borderRadius: 0 }}>
                    <Table size="small">
                        <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell sx={{ borderRight: '1px solid #ccc', fontWeight: 'bold', width: '30%' }}>Particulars // Détails</TableCell>
                                <TableCell sx={{ borderRight: '1px solid #ccc', fontWeight: 'bold', width: '15%' }}>Amount // Montant</TableCell>
                                <TableCell sx={{ borderRight: '1px solid #ccc', fontWeight: 'bold', width: '20%' }}>Account Name // Compte</TableCell>
                                <TableCell sx={{ borderRight: '1px solid #ccc', fontWeight: 'bold', width: '15%' }}>Funding Source // Source</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>QuickBooks Code</TableCell>
                                <TableCell width="5%"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {formData.items.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ borderRight: '1px solid #ccc', p: 1 }}>
                                        <TextField 
                                            fullWidth multiline rows={2} variant="standard" 
                                            InputProps={{ disableUnderline: true }}
                                            value={row.particulars}
                                            onChange={(e) => handleItemChange(index, 'particulars', e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ borderRight: '1px solid #ccc', p: 1 }}>
                                        <TextField 
                                            fullWidth type="number" variant="standard" 
                                            placeholder="0.00"
                                            InputProps={{ 
                                                disableUnderline: true,
                                                sx: { 
                                                    backgroundColor: '#f9f9f9', 
                                                    border: '1px solid #e0e0e0', 
                                                    borderRadius: 1, 
                                                    px: 1,
                                                    py: 0.5
                                                }
                                            }}
                                            value={row.amount}
                                            onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ borderRight: '1px solid #ccc', p: 1 }}>
                                        <TextField 
                                            fullWidth multiline rows={2} variant="standard" 
                                            InputProps={{ disableUnderline: true }}
                                            value={row.accountName}
                                            onChange={(e) => handleItemChange(index, 'accountName', e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ borderRight: '1px solid #ccc', p: 1 }}>
                                        <TextField 
                                            fullWidth multiline rows={2} variant="standard" 
                                            InputProps={{ disableUnderline: true }}
                                            value={row.fundingSourceCode}
                                            onChange={(e) => handleItemChange(index, 'fundingSourceCode', e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ p: 1 }}>
                                        <Autocomplete
                                            size="small"
                                            options={coaOptions}
                                            getOptionLabel={(option) => typeof option === 'string' ? option : `${option.code} - ${option.name}`}
                                            filterOptions={(x) => x}
                                            onInputChange={(e, value, reason) => {
                                                if (reason === 'input' || reason === 'clear') fetchCOA(value);
                                            }}
                                            value={coaOptions.find(opt => opt.code === row.quickBooksCode) || (row.quickBooksCode ? { code: row.quickBooksCode, name: '' } : null)}
                                            isOptionEqualToValue={(option, value) => option.code === value.code}
                                            onChange={(e, newValue) => {
                                                if (newValue) {
                                                    if (typeof newValue === 'string') {
                                                        handleItemChange(index, 'quickBooksCode', newValue);
                                                    } else {
                                                        handleItemChange(index, 'quickBooksCode', newValue.code);
                                                        if (!row.accountName) handleItemChange(index, 'accountName', newValue.name);
                                                    }
                                                } else {
                                                    handleItemChange(index, 'quickBooksCode', '');
                                                }
                                            }}
                                            loading={loadingCOA}
                                            freeSolo
                                            renderInput={(params) => (
                                                <TextField 
                                                    {...params}
                                                    variant="standard" 
                                                    placeholder="Search..."
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
                            <TableRow sx={{ bgcolor: '#f9f9f9' }}>
                                <TableCell sx={{ borderRight: '1px solid #ccc', fontWeight: 'bold' }}>TOTAL</TableCell>
                                <TableCell sx={{ borderRight: '1px solid #ccc', fontWeight: 'bold' }}>{formData.totalAmount.toLocaleString()}</TableCell>
                                <TableCell colSpan={4}></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>

                <Button startIcon={<AddIcon />} variant="outlined" size="small" onClick={addItemRow}>
                    Add Item Row // Ajouter une ligne
                </Button>
            </Paper>
        </Box>
    );
};

export default Step2_PaymentVoucher;
