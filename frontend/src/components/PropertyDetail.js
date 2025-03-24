import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardMedia, CardContent, Typography, Grid, Chip, Button, Box } from '@mui/material';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { fetchProperty } from '../store/slices/propertySlice';

const PropertyDetail = () => {
  const { propertyId } = useParams();
  const dispatch = useDispatch();
  const property = useSelector((state) => 
    state.properties.items.find(p => p.id === parseInt(propertyId))
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyCs9b3PPBIMPkMczZdNa86VlOxfKhl6f2s',
 });

  useEffect(() => {
    console.log("Property ID:",propertyId)
    if (propertyId && !property) {
      dispatch(fetchProperty(propertyId));
    }
  }, [dispatch, propertyId, property]);

  if (!property) return <div>Loading...</div>;

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardMedia
          component="img"
          height="400"
          image={property.image || '/placeholder-property.jpg'}
          alt={property.title}
        />
        <CardContent>
          <Typography gutterBottom variant="h4">{property.title}</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" color="text.secondary">
                {property.location}
              </Typography>
              <Chip 
                label={property.status.toUpperCase()} 
                color={property.status === 'available' ? 'success' : 'error'}
                sx={{ mt: 1, mb: 2 }}
              />
              <Typography variant="body1" paragraph>
                {property.description || 'No description available'}
              </Typography>
              <Button variant="contained" color="primary">
                Schedule Viewing
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              {isLoaded && (
                <GoogleMap
                  zoom={14}
                  center={{ lat: property.lat, lng: property.lng }}
                  mapContainerClassName="map-container"
                  mapContainerStyle={{ height: '300px', width: '100%' }}
                >
                  <Marker position={{ lat: property.lat, lng: property.lng }} />
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