import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Grid, 
  Chip, 
  Button, 
  Box 
} from '@mui/material';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { clearCurrentProperty, fetchProperty } from '../store/slices/propertySlice';

const PropertyDetail = () => {
  const { propertyId } = useParams();
  const dispatch = useDispatch();
  const { currentProperty } = useSelector((state) => state.properties.items);
  
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    if (propertyId) {
      dispatch(fetchProperty(propertyId));
    }
    
    return () => {
      dispatch(clearCurrentProperty());
    };
  }, [dispatch, propertyId]);

  if (!currentProperty) {
    return <div>Property not found</div>;
  }

  const { 
    title, 
    image, 
    location, 
    status, 
    description, 
    lat, 
    lng 
  } = currentProperty;

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardMedia
          component="img"
          height="400"
          image={image || '/placeholder-property.jpg'}
          alt={title}
        />
        
        <CardContent>
          <Typography gutterBottom variant="h4">
            {title}
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" color="text.secondary">
                {location}
              </Typography>
              
              <Chip 
                label={status.toUpperCase()} 
                color={status === 'available' ? 'success' : 'error'}
                sx={{ mt: 1, mb: 2 }}
              />
              
              <Typography variant="body1" paragraph>
                {description || 'No description available'}
              </Typography>
              
              <Button variant="contained" color="primary">
                Schedule Viewing
              </Button>
            </Grid>
            
            <Grid item xs={12} md={4}>
              {isLoaded && (
                <GoogleMap
                  zoom={14}
                  center={{ lat, lng }}
                  mapContainerClassName="map-container"
                  mapContainerStyle={{ 
                    height: '300px', 
                    width: '100%' 
                  }}
                >
                  <Marker position={{ lat, lng }} />
                </GoogleMap>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PropertyDetail;