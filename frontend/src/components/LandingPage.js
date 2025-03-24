import React from 'react';
import { Box, Typography, Button, Grid, Container, Stack,} from '@mui/material';
import { Link } from 'react-router-dom';
import {ManageSearch, Analytics, TrackChanges, HomeWork, SupportAgent, IntegrationInstructions,PhoneIphone } from '@mui/icons-material';

const LandingPage = () => {
  const features = [
    {
      title: "Property Management Simplified",
      icon: <HomeWork fontSize="large" />,
      description: "Centralize listings, tenant communications, and maintenance requests in one intuitive dashboard."
    },
    {
      title: "Lead Tracking That Converts",
      icon: <TrackChanges fontSize="large" />,
      description: "AI-driven insights prioritize hot prospects so you never miss a deal-winning opportunity."
    },
    {
      title: "Analytics That Drive Decisions",
      icon: <Analytics fontSize="large" />,
      description: "Unlock actionable reports on sales pipelines, ROI, and market trends."
    },
    {
      title: "Smart Search. Smarter Results.",
      icon: <ManageSearch fontSize="large" />,
      description: "Find properties, clients, or insights instantly with AI-powered search."
    }
  ];

  const benefits = [
    { icon: <SupportAgent />, text: "24/7 Dedicated Client Support" },
    { icon: <IntegrationInstructions />, text: "Seamless Platform Integrations" },
    { icon: <PhoneIphone />, text: "Mobile-Optimized Workflow Management" }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.paper' }}>
      {/* Hero Section */}
      <Box sx={{ 
        py: 10, 
        background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
        color: 'white',
        textAlign: 'center'
      }}>
        <Container maxWidth="md">
          <Typography variant="h2" gutterBottom sx={{ fontWeight: 700 }}>
            Real Estate CRM Pro
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            Your All-in-One Platform to Sell Smarter & Close Faster
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large"
            component={Link}
            to="/auth"
            sx={{ 
              px: 6,
              py: 1.5,
              fontSize: '1.1rem',
              textTransform: 'none',
              borderRadius: 2,
              boxShadow: 4
            }}
          >
            Get Started Now
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {features.map((feature) => (
            <Grid item xs={12} md={6} lg={3} key={feature.title}>
              <Box sx={{ 
                p: 3, 
                height: '100%',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
                transition: '0.3s',
                '&:hover': {
                  boxShadow: 2,
                  transform: 'translateY(-4px)'
                }
              }}>
                <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Benefits Section */}
      <Box sx={{ py: 8, bgcolor: 'background.default' }}>
        <Container maxWidth="md">
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 700, mb: 6 }}>
            Why Top Agents Choose Us
          </Typography>
          <Grid container spacing={4}>
            {benefits.map((benefit, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Stack alignItems="center" spacing={2}>
                  <Box sx={{ 
                    p: 2,
                    bgcolor: 'primary.main',
                    color: 'white',
                    borderRadius: '50%'
                  }}>
                    {benefit.icon}
                  </Box>
                  <Typography variant="h6" align="center">
                    {benefit.text}
                  </Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          Ready to Transform Your Business?
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, fontSize: '1.1rem' }}>
          Join thousands of successful agents already maximizing their potential
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          component={Link}
          to="/auth"
          sx={{
            px: 8,
            py: 2,
            fontSize: '1.1rem',
            borderRadius: 2,
            textTransform: 'none'
          }}
        >
          Start Your Success Journey
        </Button>
      </Container>
    </Box>
  );
};

export default LandingPage;