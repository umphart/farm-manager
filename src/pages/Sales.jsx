import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Card,
  CardContent,
  Stack,
  alpha,
  useTheme,
  Avatar,
  Tooltip,
  InputAdornment,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingIcon,
  Receipt as ReceiptIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { formatNaira, formatNumber, formatDate, formatTime } from '../utils/constants';

const productTypes = [
  'Fish (Live)',
  'Fish (Processed)',
  'Poultry (Live)',
  'Poultry (Processed)',
  'Eggs',
  'Goats',
  'Sheep',
  'Manure',
  'Other Products',
];

const customerTypes = [
  'Individual Buyer',
  'Restaurant/Hotel',
  'Market Trader',
  'Wholesaler',
  'Retailer',
  'Online Customer',
  'Export',
];

const paymentMethods = [
  'Cash',
  'Bank Transfer',
  'POS',
  'Mobile Money',
  'Credit',
  'Cheque',
];

const initialSales = [
  {
    id: 1,
    date: '2024-01-20',
    time: '10:30',
    invoiceNo: 'INV-2024-001',
    customer: 'Golden Fish Restaurant',
    customerType: 'Restaurant/Hotel',
    product: 'Fish (Live)',
    quantity: 50,
    unit: 'kg',
    unitPrice: 2500,
    total: 125000,
    paymentMethod: 'Bank Transfer',
    status: 'completed',
    notes: 'Delivered to location'
  },
  {
    id: 2,
    date: '2024-01-19',
    time: '14:15',
    invoiceNo: 'INV-2024-002',
    customer: 'Local Market Trader',
    customerType: 'Market Trader',
    product: 'Poultry (Live)',
    quantity: 100,
    unit: 'birds',
    unitPrice: 3500,
    total: 350000,
    paymentMethod: 'Cash',
    status: 'completed',
    notes: 'Bulk order'
  },
  {
    id: 3,
    date: '2024-01-18',
    time: '09:00',
    invoiceNo: 'INV-2024-003',
    customer: 'Premium Eggs Ltd',
    customerType: 'Wholesaler',
    product: 'Eggs',
    quantity: 200,
    unit: 'crates',
    unitPrice: 1800,
    total: 360000,
    paymentMethod: 'Bank Transfer',
    status: 'completed',
    notes: 'Monthly supply contract'
  },
  {
    id: 4,
    date: '2024-01-17',
    time: '16:45',
    invoiceNo: 'INV-2024-004',
    customer: 'Farmers Market',
    customerType: 'Retailer',
    product: 'Fish (Processed)',
    quantity: 30,
    unit: 'kg',
    unitPrice: 3200,
    total: 96000,
    paymentMethod: 'POS',
    status: 'pending',
    notes: 'Awaiting delivery'
  },
];

function Sales() {
  const theme = useTheme();
  const [sales, setSales] = useState(initialSales);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProduct, setFilterProduct] = useState('all');
  const [showChart, setShowChart] = useState(true);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-NG', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    invoiceNo: `INV-${new Date().getFullYear()}-${String(sales.length + 1).padStart(3, '0')}`,
    customer: '',
    customerType: '',
    product: '',
    quantity: '',
    unit: 'kg',
    unitPrice: '',
    paymentMethod: 'Cash',
    notes: '',
  });

  // Calculate statistics
  const stats = {
    totalRevenue: sales.reduce((sum, sale) => sum + sale.total, 0),
    todaySales: sales
      .filter(sale => sale.date === new Date().toISOString().split('T')[0])
      .reduce((sum, sale) => sum + sale.total, 0),
    totalTransactions: sales.length,
    averageSale: sales.length > 0 ? sales.reduce((sum, sale) => sum + sale.total, 0) / sales.length : 0,
  };

  // Filter sales
  const filteredSales = sales.filter(sale => {
    const matchesSearch = searchTerm === '' || 
      sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProduct = filterProduct === 'all' || sale.product === filterProduct;
    return matchesSearch && matchesProduct;
  });

  // Chart data
  const revenueData = [
    { month: 'Jan', revenue: 1250000, target: 1000000 },
    { month: 'Feb', revenue: 980000, target: 1000000 },
    { month: 'Mar', revenue: 1520000, target: 1200000 },
    { month: 'Apr', revenue: 1180000, target: 1200000 },
    { month: 'May', revenue: 1450000, target: 1300000 },
    { month: 'Jun', revenue: 1680000, target: 1500000 },
  ];

  const productDistribution = productTypes.map(product => ({
    name: product,
    value: sales
      .filter(sale => sale.product === product)
      .reduce((sum, sale) => sum + sale.total, 0),
  })).filter(item => item.value > 0);

  const COLORS = ['#2196F3', '#4CAF50', '#FF9800', '#E91E63', '#9C27B0', '#795548', '#607D8B', '#00BCD4', '#8BC34A'];

  const handleSubmit = () => {
    const total = parseFloat(formData.quantity) * parseFloat(formData.unitPrice);
    const newSale = {
      id: sales.length + 1,
      ...formData,
      total: total,
      status: 'completed',
    };
    setSales([...sales, newSale]);
    setOpenDialog(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-NG', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      invoiceNo: `INV-${new Date().getFullYear()}-${String(sales.length + 2).padStart(3, '0')}`,
      customer: '',
      customerType: '',
      product: '',
      quantity: '',
      unit: 'kg',
      unitPrice: '',
      paymentMethod: 'Cash',
      notes: '',
    });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 2, bgcolor: 'background.paper', border: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            {label}
          </Typography>
          {payload.map((pld, index) => (
            <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ 
                  width: 12, 
                  height: 12, 
                  borderRadius: '50%', 
                  bgcolor: pld.color,
                  mr: 1 
                }} />
                <Typography variant="body2" color="text.secondary">
                  {pld.dataKey}:
                </Typography>
              </Box>
              <Typography variant="body2" fontWeight={600}>
                {formatNaira(pld.value)}
              </Typography>
            </Box>
          ))}
        </Paper>
      );
    }
    return null;
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 3 }}>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Sales & Revenue
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track sales, revenue, and customer transactions
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mt: { xs: 2, sm: 0 } }}>
            <FormControlLabel
              control={
                <Switch
                  checked={showChart}
                  onChange={(e) => setShowChart(e.target.checked)}
                  color="primary"
                />
              }
              label="Show Charts"
              sx={{ mr: 0 }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
            >
              New Sale
            </Button>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.main' }}>
                    <MoneyIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight={700} color="success.main">
                      {formatNaira(stats.totalRevenue)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Revenue
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), color: 'info.main' }}>
                    <TrendingIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight={700}>
                      {formatNaira(stats.todaySales)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Today's Sales
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}>
                    <ReceiptIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight={700}>
                      {stats.totalTransactions}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Transactions
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), color: 'warning.main' }}>
                    <TrendingIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight={700}>
                      {formatNaira(stats.averageSale)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Average Sale
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Charts Section */}
      {showChart && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Revenue Trend Chart */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Monthly Revenue Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: theme.palette.text.secondary }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `₦${formatNumber(value/1000)}K`}
                    tick={{ fill: theme.palette.text.secondary }}
                  />
                  <ChartTooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    name="Actual Revenue" 
                    stroke="#4CAF50" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    name="Target Revenue" 
                    stroke="#2196F3" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Product Distribution */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Revenue by Product
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={productDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name.split(' ')[0]}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {productDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip formatter={(value) => [formatNaira(value), 'Revenue']} />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              placeholder="Search sales..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              select
              fullWidth
              value={filterProduct}
              onChange={(e) => setFilterProduct(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterIcon color="action" />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="all">All Products</MenuItem>
              {productTypes.map((product) => (
                <MenuItem key={product} value={product}>
                  {product}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
              >
                Export Report
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Sales Table */}
      <Paper sx={{ mb: 4 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Invoice #</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Unit Price</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSales.map((sale) => (
                <TableRow key={sale.id} hover>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {sale.invoiceNo}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {sale.customer}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {sale.customerType}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={sale.product}
                      size="small"
                      sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {sale.quantity} {sale.unit}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatNaira(sale.unitPrice)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600} color="success.main">
                      {formatNaira(sale.total)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {formatDate(sale.date)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatTime(sale.time)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={sale.paymentMethod}
                      size="small"
                      color={sale.paymentMethod === 'Cash' ? 'success' : 'primary'}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton size="small" color="primary">
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add Sale Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            Record New Sale
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Invoice Number"
                value={formData.invoiceNo}
                onChange={(e) => setFormData({ ...formData, invoiceNo: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Customer Name"
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Customer Type"
                value={formData.customerType}
                onChange={(e) => setFormData({ ...formData, customerType: e.target.value })}
                required
              >
                <MenuItem value="">
                  <em>Select type</em>
                </MenuItem>
                {customerTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Product"
                value={formData.product}
                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                required
              >
                <MenuItem value="">
                  <em>Select product</em>
                </MenuItem>
                {productTypes.map((product) => (
                  <MenuItem key={product} value={product}>
                    {product}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              >
                {['kg', 'g', 'birds', 'crates', 'units', 'pcs', 'liters'].map((unit) => (
                  <MenuItem key={unit} value={unit}>
                    {unit}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Unit Price (₦)"
                type="number"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">₦</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Payment Method"
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              >
                {paymentMethods.map((method) => (
                  <MenuItem key={method} value={method}>
                    {method}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Total Amount"
                value={formData.quantity && formData.unitPrice ? 
                  (parseFloat(formData.quantity) * parseFloat(formData.unitPrice)).toFixed(2) : '0'}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₦</InputAdornment>,
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional information about this sale..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={() => setOpenDialog(false)} 
            color="inherit"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!formData.customer || !formData.product || !formData.quantity || !formData.unitPrice}
          >
            Record Sale
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Sales;