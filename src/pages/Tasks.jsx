import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Chip,
  IconButton,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Badge,
  Tabs,
  Tab,
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
  CheckCircle as CheckIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Pets as PetIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Notifications as NotificationIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { formatDate, formatTime, formatShortDate, taskPriorities } from '../utils/constants';

const taskTypes = [
  { value: 'feeding', label: 'Feeding', icon: '🍽️', color: '#4CAF50' },
  { value: 'cleaning', label: 'Cleaning', icon: '🧹', color: '#2196F3' },
  { value: 'health_check', label: 'Health Check', icon: '🏥', color: '#E91E63' },
  { value: 'harvest', label: 'Harvest', icon: '🌾', color: '#FF9800' },
  { value: 'maintenance', label: 'Maintenance', icon: '🔧', color: '#795548' },
  { value: 'inventory', label: 'Inventory', icon: '📦', color: '#9C27B0' },
  { value: 'administration', label: 'Administration', icon: '📋', color: '#607D8B' },
  { value: 'other', label: 'Other', icon: '📝', color: '#00BCD4' },
];

const assignees = [
  { id: 1, name: 'John Doe', role: 'Farm Manager', avatar: 'JD' },
  { id: 2, name: 'Sarah Johnson', role: 'Veterinary Assistant', avatar: 'SJ' },
  { id: 3, name: 'Mike Wilson', role: 'Farm Hand', avatar: 'MW' },
  { id: 4, name: 'Emma Davis', role: 'Inventory Manager', avatar: 'ED' },
  { id: 5, name: 'Robert Brown', role: 'Maintenance', avatar: 'RB' },
];

const livestockTypes = [
  { value: 'all', label: 'All Livestock', icon: '🐄' },
  { value: 'fish', label: 'Fish', icon: '🐟' },
  { value: 'poultry', label: 'Poultry', icon: '🐔' },
  { value: 'goat', label: 'Goat', icon: '🐐' },
  { value: 'sheep', label: 'Sheep', icon: '🐑' },
];

const initialTasks = [
  {
    id: 1,
    title: 'Morning Fish Feeding',
    type: 'feeding',
    priority: 'high',
    description: 'Feed fish in all ponds with premium pellets',
    date: new Date(),
    time: '08:00',
    duration: 2,
    assignee: assignees[0],
    livestock: 'fish',
    completed: false,
    recurring: true,
    location: 'Pond A, B, C',
  },
  {
    id: 2,
    title: 'Poultry Health Check',
    type: 'health_check',
    priority: 'medium',
    description: 'Check broilers for signs of illness and administer vaccines',
    date: new Date(),
    time: '10:00',
    duration: 1.5,
    assignee: assignees[1],
    livestock: 'poultry',
    completed: true,
    recurring: false,
    location: 'Coop B',
  },
  {
    id: 3,
    title: 'Pond Maintenance',
    type: 'maintenance',
    priority: 'medium',
    description: 'Clean and check pond filters, check water quality',
    date: new Date(Date.now() + 86400000),
    time: '09:00',
    duration: 3,
    assignee: assignees[4],
    livestock: 'fish',
    completed: false,
    recurring: false,
    location: 'Pond C',
  },
  {
    id: 4,
    title: 'Egg Collection',
    type: 'harvest',
    priority: 'low',
    description: 'Collect eggs from all coops and package for delivery',
    date: new Date(Date.now() + 86400000),
    time: '14:00',
    duration: 1,
    assignee: assignees[2],
    livestock: 'poultry',
    completed: false,
    recurring: true,
    location: 'All Coops',
  },
  {
    id: 5,
    title: 'Inventory Restock',
    type: 'inventory',
    priority: 'high',
    description: 'Restock fish feed and medication supplies',
    date: new Date(Date.now() + 2 * 86400000),
    time: '11:00',
    duration: 2,
    assignee: assignees[3],
    livestock: 'all',
    completed: false,
    recurring: false,
    location: 'Storage Room',
  },
];

function Tasks() {
  const theme = useTheme();
  const [tasks, setTasks] = useState(initialTasks);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLivestock, setFilterLivestock] = useState('all');
  const [showCalendar, setShowCalendar] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    priority: 'medium',
    description: '',
    date: new Date(),
    time: '08:00',
    duration: 1,
    assignee: assignees[0],
    livestock: '',
    recurring: false,
    location: '',
  });

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = searchTerm === '' || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLivestock = filterLivestock === 'all' || task.livestock === filterLivestock;
    return matchesSearch && matchesLivestock;
  });

  // Tab filtered tasks
  const tabFilteredTasks = selectedTab === 0 
    ? filteredTasks 
    : selectedTab === 1 
    ? filteredTasks.filter(task => !task.completed)
    : filteredTasks.filter(task => task.completed);

  // Today's tasks
  const todayTasks = tasks.filter(
    task => 
      task.date.toDateString() === new Date().toDateString() &&
      !task.completed
  );

  // Tomorrow's tasks
  const tomorrowTasks = tasks.filter(
    task => 
      task.date.toDateString() === new Date(Date.now() + 86400000).toDateString()
  );

  // Upcoming tasks (next 7 days)
  const upcomingTasks = tasks.filter(
    task => 
      task.date > new Date() &&
      task.date <= new Date(Date.now() + 7 * 86400000) &&
      !task.completed
  ).sort((a, b) => a.date - b.date);

  // Statistics
  const stats = {
    total: tasks.length,
    completed: tasks.filter(task => task.completed).length,
    pending: tasks.filter(task => !task.completed).length,
    overdue: tasks.filter(task => 
      task.date < new Date() && !task.completed
    ).length,
  };

  const getTaskTypeInfo = (type) => {
    return taskTypes.find(t => t.value === type) || { label: type, color: '#757575', icon: '📝' };
  };

  const getPriorityInfo = (priority) => {
    return taskPriorities.find(p => p.value === priority) || { label: priority, color: 'default' };
  };

  const handleTaskToggle = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleSubmit = () => {
    const newTask = {
      id: tasks.length + 1,
      ...formData,
      date: formData.date,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setOpenDialog(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: '',
      priority: 'medium',
      description: '',
      date: new Date(),
      time: '08:00',
      duration: 1,
      assignee: assignees[0],
      livestock: '',
      recurring: false,
      location: '',
    });
  };

  // Group tasks by date for calendar view
  const tasksByDate = tasks.reduce((acc, task) => {
    const dateStr = task.date.toDateString();
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(task);
    return acc;
  }, {});

  // Get next 7 days for calendar view
  const next7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 3 }}>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Task Scheduling
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Plan, schedule, and track farm activities
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{ mt: { xs: 2, sm: 0 } }}
          >
            New Task
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight={700} color="primary.main">
                  {stats.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Tasks
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight={700} color="success.main">
                  {stats.completed}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight={700} color="warning.main">
                  {stats.pending}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight={700} color="error.main">
                  {stats.overdue}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Overdue
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Filters and Controls */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              placeholder="Search tasks..."
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
              value={filterLivestock}
              onChange={(e) => setFilterLivestock(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterIcon color="action" />
                  </InputAdornment>
                ),
              }}
            >
              {livestockTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography>{type.icon}</Typography>
                    <Typography>{type.label}</Typography>
                  </Stack>
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <FormControlLabel
                control={
                  <Switch
                    checked={showCalendar}
                    onChange={(e) => setShowCalendar(e.target.checked)}
                    color="primary"
                    size="small"
                  />
                }
                label="Calendar View"
                sx={{ mr: 0 }}
              />
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                size="small"
              >
                Export
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Today's Tasks */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Today's Tasks
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(new Date())}
                </Typography>
              </Box>
              <Badge badgeContent={todayTasks.length} color="error" />
            </Box>
            
            {todayTasks.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">No tasks scheduled for today</Typography>
              </Box>
            ) : (
              <Stack spacing={2}>
                {todayTasks.map(task => {
                  const typeInfo = getTaskTypeInfo(task.type);
                  const priorityInfo = getPriorityInfo(task.priority);
                  return (
                    <Card key={task.id} variant="outlined">
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography fontSize="1.5rem">{typeInfo.icon}</Typography>
                            <Box>
                              <Typography variant="subtitle2" fontWeight={600}>
                                {task.title}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {formatTime(task.time)} • {task.duration}h
                              </Typography>
                            </Box>
                          </Box>
                          <Chip
                            label={priorityInfo.label}
                            size="small"
                            color={priorityInfo.color}
                          />
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {task.description}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                              {task.assignee.avatar}
                            </Avatar>
                            <Typography variant="caption">
                              {task.assignee.name}
                            </Typography>
                          </Box>
                          <Button
                            size="small"
                            variant={task.completed ? "outlined" : "contained"}
                            onClick={() => handleTaskToggle(task.id)}
                            startIcon={task.completed ? <CheckIcon /> : null}
                          >
                            {task.completed ? 'Completed' : 'Mark Complete'}
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })}
              </Stack>
            )}
          </Paper>
        </Grid>

        {/* Calendar View or Upcoming Tasks */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>
                {showCalendar ? 'Weekly Schedule' : 'Upcoming Tasks'}
              </Typography>
            </Box>
            
            {showCalendar ? (
              <Grid container spacing={2}>
                {next7Days.map((day, index) => {
                  const dayTasks = tasksByDate[day.toDateString()] || [];
                  const isToday = day.toDateString() === new Date().toDateString();
                  const isTomorrow = day.toDateString() === new Date(Date.now() + 86400000).toDateString();
                  
                  return (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card sx={{ 
                        height: '100%',
                        border: isToday ? 2 : 1,
                        borderColor: isToday ? 'primary.main' : 'divider'
                      }}>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            {day.toLocaleDateString('en-NG', { weekday: 'short' })}
                            {isToday && ' (Today)'}
                            {isTomorrow && ' (Tomorrow)'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {formatShortDate(day)}
                          </Typography>
                          
                          {dayTasks.length === 0 ? (
                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mt: 2 }}>
                              No tasks scheduled
                            </Typography>
                          ) : (
                            <Stack spacing={1} sx={{ mt: 2 }}>
                              {dayTasks.slice(0, 3).map(task => {
                                const typeInfo = getTaskTypeInfo(task.type);
                                return (
                                  <Box 
                                    key={task.id} 
                                    sx={{ 
                                      p: 1, 
                                      borderRadius: 1,
                                      bgcolor: alpha(typeInfo.color, 0.1),
                                      borderLeft: `3px solid ${typeInfo.color}`,
                                    }}
                                  >
                                    <Typography variant="caption" fontWeight={600} display="block">
                                      {task.title}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                      {formatTime(task.time)}
                                    </Typography>
                                  </Box>
                                );
                              })}
                              {dayTasks.length > 3 && (
                                <Typography variant="caption" color="text.secondary">
                                  +{dayTasks.length - 3} more tasks
                                </Typography>
                              )}
                            </Stack>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            ) : (
              <Stack spacing={2}>
                {upcomingTasks.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="text.secondary">No upcoming tasks</Typography>
                  </Box>
                ) : (
                  upcomingTasks.map(task => {
                    const typeInfo = getTaskTypeInfo(task.type);
                    const priorityInfo = getPriorityInfo(task.priority);
                    return (
                      <Card key={task.id} variant="outlined">
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar sx={{ bgcolor: alpha(typeInfo.color, 0.1), color: typeInfo.color }}>
                                {typeInfo.icon}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle2" fontWeight={600}>
                                  {task.title}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {formatDate(task.date)} • {formatTime(task.time)} • {task.duration}h
                                </Typography>
                              </Box>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip
                                label={priorityInfo.label}
                                size="small"
                                color={priorityInfo.color}
                              />
                              <Checkbox
                                checked={task.completed}
                                onChange={() => handleTaskToggle(task.id)}
                                icon={<CheckIcon />}
                                checkedIcon={<CheckIcon color="success" />}
                                size="small"
                              />
                            </Box>
                          </Box>
                          
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                            {task.description}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                                {task.assignee.avatar}
                              </Avatar>
                              <Typography variant="caption">
                                {task.assignee.name}
                              </Typography>
                              {task.livestock && task.livestock !== 'all' && (
                                <>
                                  <Typography variant="caption" color="text.secondary">•</Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {livestockTypes.find(l => l.value === task.livestock)?.icon} {task.livestock}
                                  </Typography>
                                </>
                              )}
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              {task.location}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </Stack>
            )}
          </Paper>
        </Grid>

        {/* All Tasks Tab View */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
                <Tab label="All Tasks" />
                <Tab label={
                  <Badge badgeContent={tasks.filter(t => !t.completed).length} color="error">
                    Pending
                  </Badge>
                } />
                <Tab label="Completed" />
              </Tabs>
            </Box>

            <Grid container spacing={2}>
              {tabFilteredTasks.map(task => {
                const typeInfo = getTaskTypeInfo(task.type);
                const priorityInfo = getPriorityInfo(task.priority);
                return (
                  <Grid item xs={12} sm={6} md={4} key={task.id}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ 
                              bgcolor: alpha(typeInfo.color, 0.1), 
                              color: typeInfo.color,
                              width: 32,
                              height: 32 
                            }}>
                              {typeInfo.icon}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" fontWeight={600}>
                                {task.title}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {typeInfo.label}
                              </Typography>
                            </Box>
                          </Box>
                          <Checkbox
                            checked={task.completed}
                            onChange={() => handleTaskToggle(task.id)}
                            icon={<CheckIcon />}
                            checkedIcon={<CheckIcon color="success" />}
                            size="small"
                          />
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {task.description}
                        </Typography>
                        
                        <Stack spacing={1} sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarIcon fontSize="small" color="action" />
                            <Typography variant="caption">
                              {formatDate(task.date)} • {formatTime(task.time)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonIcon fontSize="small" color="action" />
                            <Typography variant="caption">
                              {task.assignee.name}
                            </Typography>
                          </Box>
                          {task.livestock && task.livestock !== 'all' && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <PetIcon fontSize="small" color="action" />
                              <Typography variant="caption">
                                {livestockTypes.find(l => l.value === task.livestock)?.label}
                              </Typography>
                            </Box>
                          )}
                        </Stack>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Chip
                            label={priorityInfo.label}
                            size="small"
                            color={priorityInfo.color}
                          />
                          <Chip
                            label={task.completed ? 'Completed' : 'Pending'}
                            size="small"
                            color={task.completed ? 'success' : 'warning'}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Add Task Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            Create New Task
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Task Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Task Type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              >
                <MenuItem value="">
                  <em>Select type</em>
                </MenuItem>
                {taskTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography>{type.icon}</Typography>
                      <Typography>{type.label}</Typography>
                    </Stack>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Priority"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                {taskPriorities.map((priority) => (
                  <MenuItem key={priority.value} value={priority.value}>
                    <Chip
                      label={priority.label}
                      size="small"
                      color={priority.color}
                      sx={{ mr: 1 }}
                    />
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Date"
                value={formData.date}
                onChange={(newDate) => setFormData({ ...formData, date: newDate })}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TimePicker
                label="Time"
                value={formData.time}
                onChange={(newTime) => setFormData({ ...formData, time: newTime })}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Duration (hours)"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                InputProps={{ inputProps: { min: 0.5, step: 0.5 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Assign To"
                value={formData.assignee.id}
                onChange={(e) => {
                  const selectedAssignee = assignees.find(a => a.id === parseInt(e.target.value));
                  setFormData({ ...formData, assignee: selectedAssignee });
                }}
              >
                {assignees.map((assignee) => (
                  <MenuItem key={assignee.id} value={assignee.id}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                        {assignee.avatar}
                      </Avatar>
                      <Box>
                        <Typography>{assignee.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {assignee.role}
                        </Typography>
                      </Box>
                    </Stack>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Related Livestock"
                value={formData.livestock}
                onChange={(e) => setFormData({ ...formData, livestock: e.target.value })}
              >
                <MenuItem value="">None (General Task)</MenuItem>
                {livestockTypes.filter(l => l.value !== 'all').map((animal) => (
                  <MenuItem key={animal.value} value={animal.value}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography>{animal.icon}</Typography>
                      <Typography>{animal.label}</Typography>
                    </Stack>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Pond A, Storage Room, All Coops"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed description of the task..."
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.recurring}
                    onChange={(e) => setFormData({ ...formData, recurring: e.target.checked })}
                    color="primary"
                  />
                }
                label="Recurring Task (e.g., daily, weekly)"
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
            disabled={!formData.title || !formData.type}
          >
            Create Task
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Tasks;