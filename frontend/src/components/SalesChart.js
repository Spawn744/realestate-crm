import React from 'react';
import { Line } from 'react-chartjs-2';
import { Card, CardContent, Typography, LinearProgress } from '@mui/material';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { useSelector } from 'react-redux';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SalesChart = () => {
  const salesState = useSelector(state => state.dashboard?.salesData || state.sales);
  const isLoading = !salesState || salesState.status === 'loading';

  // Chart data configuration
  const data = {
    labels: salesState?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Monthly Sales',
        data: salesState?.values || [],
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#1976d2'
      }
    ]
  };

  // Chart options configuration
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#666'
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0,0,0,0.8)'
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#666'
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0,0,0,0.05)'
        },
        ticks: {
          color: '#666',
          callback: (value) => `$${value.toLocaleString()}`
        }
      }
    }
  };

  if (isLoading) return <LinearProgress sx={{ mt: 2 }} />;
  if (!salesState?.values?.length) return <Typography>No sales data available</Typography>;

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Sales Performance
        </Typography>
        <div style={{ height: '400px', position: 'relative' }}>
          <Line data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesChart;