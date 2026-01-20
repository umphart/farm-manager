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
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Warning as WarningIcon,
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  LocalShipping as ShippingIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { formatNaira, formatNumber, formatDate, statusColors } from '../utils/constants';

const inventoryCategories = [
  'Fish Feed',
  'Poultry Feed',
  'Medication',
  'Vaccines',
  'Equipment',
  'Fertilizer',
  'Supplies',
  'Tools',
  'Packaging',
  'Other',
];

const suppliers = [
  'Agro Feed Nigeria Ltd',
  'VetCare Pharmaceuticals',
  'FarmTools Nigeria',
  'AquaFarm Supplies',
  'Poultry Masters Ltd',
  'Local Market',
  'Online Suppliers',
];

const initialInventory = [
  {
    id: 1,
    name: 'Premium Fish Feed Pellets',
    category: 'Fish Feed',
    sku: 'FF-2024-001',
    quantity: 500,
    unit: 'kg',
    minStock: 100,
    maxStock: 1000,
    unitCost: 900,
    supplier: 'Agro Feed Nigeria Ltd',
    lastRestock: '2024-01-15',
    nextRestock: '2024-02-15',
    status: 'good',
    location: 'Store Room A',
  },
  {
    id: 2,
    name: 'Broiler Starter Feed',
    category: 'Poultry Feed',
    sku: 'PF-2024-002',
    quantity: 300,
    unit: 'kg',
    minStock: 150,
    maxStock: 800,
    unitCost: 1200,
    supplier: 'Poultry Masters Ltd',
    lastRestock: '2024-01-18',
    nextRestock: '2024-02-18',
    status: 'warning',
    location: 'Store Room B',
  },
  {
    id: 3,
    name: 'Broad Spectrum Antibiotics',
    category: 'Medication',
    sku: 'MED-2024-003',
    quantity: 50,
    unit: 'units',
    minStock: 20,
    maxStock: 200,
    unitCost: 1500,
    supplier: 'VetCare Pharmaceuticals',
    lastRestock: '2024-01-10',
    nextRestock: '2024-03-10',
    status: 'critical',
    location: 'Medicine Cabinet',
  },
  {
    id: 4,
    name: 'Water Pumps (2HP)',
    category: 'Equipment',
    sku: 'EQ-2024-004',
    quantity: 5,
    unit: 'pcs',
    minStock: 2,
    maxStock: 10,
    unitCost: 75000,
    supplier: 'FarmTools Nigeria',
    lastRestock: '2024-01-05',
    nextRestock: '2024-04-05',
    status: 'good',
    location: 'Equipment Shed',
  },
];

function Inventory() {
  const theme = useTheme();
  const [inventory, setInventory] = useState(initialInventory);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    sku: '',
    quantity: '',
    unit: 'kg',
    minStock: '',
    maxStock: '',
    unitCost: '',
    supplier: '',
    location: '',
    lastRestock: new Date().toISOString().split('T')[0],
    nextRestock: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  // Calculate statistics
  const stats = {
    totalItems: inventory.length,
    totalValue: inventory.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0),
    lowStock: inventory.filter(item => {
      const stockPercentage = (item.quantity / item.maxStock) * 100;
      return stockPercentage <= 30;
    }).length,
    categories: [...new Set(inventory.map(item => item.category))].length,
  };

  // Filter inventory
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Chart data
  const categoryData = inventoryCategories.map(category => ({
    name: category,
    value: inventory
      .filter(item => item.category === category)
      .reduce((sum, item) => sum + (item.quantity * item.unitCost), 0),
    count: inventory.filter(item => item.category === category).length,
  })).filter(item => item.count > 0);

  const getStockStatus = (item) => {
    const percentage = (item.quantity / item.maxStock) * 100;
    if (percentage <= 30) return { status: 'critical', label: 'Low Stock', color: 'error' };
    if (percentage <= 50) return { status: 'warning', label: 'Medium Stock', color: 'warning' };
    return { status: 'good', label: 'Good Stock', color: 'success' };
  };

  const getStockPercentage = (item) => {
    return Math.min((item.quantity / item.maxStock) * 100, 100);
  };

  const handleSubmit = () => {
    const newItem = {
      id: inventory.length + 1,
      ...formData,
      quantity: parseInt(formData.quantity),
      minStock: parseInt(formData.minStock),
      maxStock: parseInt(formData.maxStock),
      unitCost: parseFloat(formData.unitCost),
      status: getStockStatus(formData).status,
    };
    setInventory([...inventory, newItem]);
    setOpenDialog(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      sku: '',
      quantity: '',
      unit: 'kg',
      minStock: '',
      maxStock: '',
      unitCost: '',
      supplier: '',
      location: '',
      lastRestock: new Date().toISOString().split('T')[0],
      nextRestock: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
  };

  const handleDelete = (id) => {
    setInventory(inventory.filter(item => item.id !== id));
  };

  // Low stock items
  const lowStockItems = inventory.filter(item => getStockStatus(item).status === 'critical');

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 3 }}>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Inventory Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track and manage all farm supplies and equipment
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{ mt: { xs: 2, sm: 0 } }}
          >
            Add Item
          </Button>
        </Box>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <Alert 
            severity="warning" 
            icon={<WarningIcon />}
            sx={{ mb: 3, borderRadius: 2 }}
            action={
              <Button color="inherit" size="small">
                Restock All
              </Button>
            }
          >
            <Typography fontWeight={600}>
              {lowStockItems.length} items are running low on stock
            </Typography>
          </Alert>
        )}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}>
                    <InventoryIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight={700}>
                      {stats.totalItems}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Items
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
                  <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.main' }}>
                    <TrendingIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight={700}>
                      {formatNaira(stats.totalValue)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Value
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
                    <WarningIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight={700} color="warning.main">
                      {stats.lowStock}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Low Stock Items
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
                    <CategoryIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight={700}>
                      {stats.categories}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Categories
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Inventory Value by Category
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  tick={{ fill: theme.palette.text.secondary }}
                />
                <YAxis 
                  tickFormatter={(value) => `₦${formatNumber(value/1000)}K`}
                  tick={{ fill: theme.palette.text.secondary }}
                />
                <ChartTooltip 
                  formatter={(value) => [formatNaira(value), 'Value']}
                  labelFormatter={(label) => `Category: ${label}`}
                />
                <Legend />
                <Bar dataKey="value" name="Inventory Value" radius={[4, 4, 0, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={theme.palette.primary.main} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Low Stock Items
            </Typography>
            {lowStockItems.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">All items are sufficiently stocked</Typography>
              </Box>
            ) : (
              <Stack spacing={2}>
                {lowStockItems.slice(0, 4).map((item) => (
                  <Card key={item.id} variant="outlined">
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        {item.name}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {item.quantity} {item.unit} left
                        </Typography>
                        <Chip label="Low Stock" size="small" color="error" />
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={getStockPercentage(item)} 
                        color="error"
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              placeholder="Search items..."
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
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterIcon color="action" />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {inventoryCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
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
                Export
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Inventory Table */}
      <Paper sx={{ mb: 4 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Stock Level</TableCell>
                <TableCell>Unit Cost</TableCell>
                <TableCell>Total Value</TableCell>
                <TableCell>Supplier</TableCell>
                <TableCell>Last Restock</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInventory.map((item) => {
                const stockStatus = getStockStatus(item);
                const totalValue = item.quantity * item.unitCost;
                return (
                  <TableRow key={item.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {item.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          SKU: {item.sku}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.category}
                        size="small"
                        sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {item.quantity} {item.unit}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <Box sx={{ flexGrow: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={getStockPercentage(item)}
                              color={stockStatus.color}
                              sx={{ height: 6, borderRadius: 3 }}
                            />
                          </Box>
                          <Chip
                            label={stockStatus.label}
                            size="small"
                            color={stockStatus.color}
                          />
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {formatNaira(item.unitCost)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600} color="success.main">
                        {formatNaira(totalValue)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {item.supplier}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(item.lastRestock)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton size="small" color="primary">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDelete(item.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add Item Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            Add New Inventory Item
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Item Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="SKU"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="Auto-generated if empty"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <MenuItem value="">
                  <em>Select category</em>
                </MenuItem>
                {inventoryCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Supplier"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              >
                <MenuItem value="">
                  <em>Select supplier</em>
                </MenuItem>
                {suppliers.map((supplier) => (
                  <MenuItem key={supplier} value={supplier}>
                    {supplier}
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
                InputProps={{ inputProps: { min: 0 } }}
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
                {['kg', 'g', 'L', 'ml', 'units', 'pcs', 'bags', 'boxes'].map((unit) => (
                  <MenuItem key={unit} value={unit}>
                    {unit}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Unit Cost (₦)"
                type="number"
                value={formData.unitCost}
                onChange={(e) => setFormData({ ...formData, unitCost: e.target.value })}
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">₦</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Minimum Stock Level"
                type="number"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Maximum Stock Level"
                type="number"
                value={formData.maxStock}
                onChange={(e) => setFormData({ ...formData, maxStock: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Storage Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Store Room A, Shelf 3"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Last Restock Date"
                value={formData.lastRestock}
                onChange={(e) => setFormData({ ...formData, lastRestock: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Next Restock Date"
                value={formData.nextRestock}
                onChange={(e) => setFormData({ ...formData, nextRestock: e.target.value })}
                InputLabelProps={{ shrink: true }}
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
            disabled={!formData.name || !formData.category || !formData.quantity || !formData.unitCost}
          >
            Add Item
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Inventory;