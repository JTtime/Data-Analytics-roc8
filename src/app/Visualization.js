'use client';
import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  Paper,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';
import { fetchData } from '../../services/api';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Grid from '@mui/material/Grid2';
import axios from 'axios';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import Cookies from 'js-cookie';

interface DataItem {
  _id: string;
  Day: string;
  Age: string;
  Gender: string;
  A: number;
  B: number;
  C: number;
  D: number;
  E: number;
  F: number;
}

const Visualization = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [filters, setFilters] = useState<{
    age: string;
    gender: string;
    startDate: number | null;
    endDate: number | null;
  }>({
    age: '',
    gender: '',
    startDate: null,
    endDate: null,
  });
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [isDateRangePickerOpen, setDateRangePickerOpen] = useState(false);
  const dateRangeRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { token } = useAuth();

  useEffect(() => {
    const fetchDataFromAPI = async () => {
      try {
        const result = await fetchData(filters, token);
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchDataFromAPI();
  }, [filters, token]);



  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dateRangeRef.current && !dateRangeRef.current.contains(event.target as Node)) {
        setDateRangePickerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const calculateTotalSum = () => {
    const totals = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
    data.forEach((item) => {
      totals.A += item.A;
      totals.B += item.B;
      totals.C += item.C;
      totals.D += item.D;
      totals.E += item.E;
      totals.F += item.F;
    });
    return totals;
  };

  const totalSums = calculateTotalSum();

  const barData = [
    { feature: 'A', total: totalSums.A },
    { feature: 'B', total: totalSums.B },
    { feature: 'C', total: totalSums.C },
    { feature: 'D', total: totalSums.D },
    { feature: 'E', total: totalSums.E },
    { feature: 'F', total: totalSums.F },
  ];

  const lineData = data.map((item) => ({
    day: item.Day,
    value: item[selectedFeature as keyof DataItem] || 0,
  }));

  const handleFeatureClick = (feature: string) => {
    setSelectedFeature(feature);
  };

  const handleLogout = async () => {
    await axios.post('https://loginflowbackend.onrender.com/api/auth/logout');
    router.push('/auth/Login');
  };

  const constructApiUrl = (filters: any) => {
    const baseUrl = Cookies.get('apiBaseUrl') || 'https://loginflowbackend.onrender.com/api/data';
    const params = new URLSearchParams();
    if (filters.age) params.append('age', filters.age);
    if (filters.gender) params.append('gender', filters.gender);
    if (filters.startDate !== null || filters.endDate !== null) {
      params.append('startDate', filters.startDate?.toString() || '');
      params.append('endDate', filters.endDate?.toString() || '');
    }
    return `${baseUrl}?${params.toString()}`;
  };

  const handleDateChange = (item: any) => {
    const startDate = item.selection.startDate.getTime();
    const endDate = item.selection.endDate.getTime();
    setFilters((prev) => ({
      ...prev,
      startDate,
      endDate,
    }));
  };

  const handleSearch = async () => {
    try {
      const apiUrl = constructApiUrl(filters);
      const result = await fetchData(apiUrl, token);
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleClearDateRange = () => {
    setDateRangePickerOpen(false)
    setFilters((prev) => ({
      ...prev,
      startDate: null,
      endDate: null,
    }));
  };

  const formatDate = (date: number | null) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getDate() < 10 ? '0' : ''}${d.getDate()}-${d.toLocaleString('default', { month: 'short' })}-${d.getFullYear()}`;
  };

  const formattedStartDate = formatDate(filters.startDate);
  const formattedEndDate = formatDate(filters.endDate);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          padding: 4,
          backgroundColor: 'background.paper',
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" color="primary" gutterBottom>
          Data Visualization
        </Typography>
        <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
          <Typography variant="h5">Filters</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid size={6}>
              <FormControl fullWidth>
                <InputLabel>Age</InputLabel>
                <Select
                  value={filters.age}
                  onChange={(e) =>
                    setFilters({ ...filters, age: e.target.value })
                  }
                >
                  <MenuItem value="">Select Age</MenuItem>
                  <MenuItem value="15-25">15-25</MenuItem>
                  <MenuItem value=">25">25+</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={6}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={filters.gender}
                  onChange={(e) =>
                    setFilters({ ...filters, gender: e.target.value })
                  }
                >
                  <MenuItem value="">Select Gender</MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={12} ref={dateRangeRef}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setDateRangePickerOpen(!isDateRangePickerOpen)}
              >
                {formattedStartDate && formattedEndDate
                  ? `${formattedStartDate} - ${formattedEndDate}`
                  : 'Select Date Range'}
              </Button>
              {isDateRangePickerOpen && (
                <DateRangePicker
                  editableDateInputs={true}
                  onChange={handleDateChange}
                  moveRangeOnFirstSelection={false}
                  ranges={[{
                    startDate: filters.startDate ? new Date(filters.startDate) : new Date(),
                    endDate: filters.endDate ? new Date(filters.endDate) : new Date(),
                    key: 'selection'
                  }]}
                />
              )}
            </Grid>
            <Grid size={12}>
              <Button variant="contained" color="primary" onClick={handleSearch}>
                Search
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleClearDateRange}
                sx={{ marginLeft: 2 }}
              >
                Clear Date Range
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Paper
          elevation={3}
          sx={{ padding: 3, marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Box >
            <Typography variant="h5">Bar Chart</Typography>
            <BarChart width={600} height={300} data={barData} layout="vertical">
              <YAxis type="category" dataKey="feature" />
              <XAxis type="number" />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Bar
                dataKey="total"
                fill="#8884d8"
                onClick={(data) => handleFeatureClick(data.feature)}
              />
            </BarChart>


          </Box>

          {selectedFeature && (
            <Box>
              {/* <Paper elevation={3} sx={{ padding: 3 }}> */}
              <Typography variant="h5">
                Line Chart for Feature {selectedFeature}
              </Typography>
              <LineChart width={600} height={300} data={lineData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#ff4081"
                  strokeWidth={2}
                />
              </LineChart>

              {/* </Paper> */}
            </Box>
          )}


        </Paper>



        <Button
          variant="contained"
          color="secondary"
          onClick={handleLogout}
          sx={{ marginTop: 2 }}
        >
          Logout
        </Button>
      </Box>
    </LocalizationProvider>
  );
};

export default Visualization;
