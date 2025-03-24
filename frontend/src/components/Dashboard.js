import React, { useEffect } from 'react';
import { Box, Card, CardContent, Grid, LinearProgress, Typography } from '@mui/material';
import { LineChart, PieChart } from '@mui/x-charts';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '../store/slices/dashboardSlice';
import PropertyList from './PropertyList';
import CalendarView from './CalendarView';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { stats, loading } = useSelector(state => state.dashboard);
  const properties = useSelector(state => state.properties.items);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading) return <LinearProgress />;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
        Welcome back, {user?.username}!
      </Typography>

      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { title: 'Total Properties', value: properties.length },
          { title: 'Active Leads', value: stats.activeLeads || 0 },
          { title: 'Today\'s Appointments', value: stats.todayAppointments || 0 },
          { title: 'Conversion Rate', value: `${stats.conversionRate || 0}%` }
        ].map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {metric.title}
                </Typography>
                <Typography variant="h4">{metric.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Content Area */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Properties
              </Typography>
              <PropertyList showAll={false} />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sales Performance
              </Typography>
              <LineChart
                xAxis={[{ 
                  data: stats.salesData?.labels || [],
                  scaleType: 'point' 
                }]}
                series={[{ 
                  data: stats.salesData?.values || [],
                  area: true,
                  showMark: false
                }]}
                height={300}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ mb: 3, p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <CardContent sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                Upcoming Appointments
              </Typography>
              <CalendarView />
            </CardContent>
          </Card>
        
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Lead Sources
              </Typography>
              <PieChart
                series={[{
                  data: stats.leadSources || [],
                  innerRadius: 40,
                  outerRadius: 100
                }]}
                height={300}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}