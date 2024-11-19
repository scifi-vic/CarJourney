import React, { useState } from 'react';
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Paper,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function Garage() {
  // Sample data for owned cars
  const [cars] = useState([
    {
      id: 1,
      make: 'Toyota',
      model: 'Camry',
      year: 2019,
      color: 'Blue',
      mileage: 15000,
      imageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRENy11OwlDkxdwjalVia9uY4HXEBNEfdhMIsaGJZCOEZuKL5Zc',
    },
    {
      id: 2,
      make: 'Honda',
      model: 'Civic',
      year: 2018,
      color: 'Red',
      mileage: 20000,
      imageUrl: 'https://via.placeholder.com/400x300?text=Honda+Civic',
    },
    {
      id: 3,
      make: 'Ford',
      model: 'Mustang',
      year: 2020,
      color: 'Black',
      mileage: 5000,
      imageUrl: 'https://via.placeholder.com/400x300?text=Ford+Mustang',
    },
    {
      id: 4,
      make: 'Chevrolet',
      model: 'Malibu',
      year: 2017,
      color: 'White',
      mileage: 30000,
      imageUrl: 'https://via.placeholder.com/400x300?text=Chevrolet+Malibu',
    },
    {
      id: 5,
      make: 'Nissan',
      model: 'Altima',
      year: 2021,
      color: 'Silver',
      mileage: 10000,
      imageUrl: '',
    },
    {
      id: 6,
      make: 'BMW',
      model: '3 Series',
      year: 2016,
      color: 'Grey',
      mileage: 40000,
      imageUrl: '',
    },
    // Add more cars as needed
  ]);

  const [selectedCar, setSelectedCar] = useState(null);

  const handleCarClick = (car) => {
    setSelectedCar(car);
  };

  const handleCloseDetails = () => {
    setSelectedCar(null);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* TITLE OF MAIN AREA */}
      <Typography variant="h4" component="h1" gutterBottom>
        My Car Garage
      </Typography>

      {/* CONTAINER FOR LISTS AND DETAILS */}
      <Box sx={{ display: 'flex', mt: 2 }}>
        {/* Left side: List of cars */}
        <Box
          sx={{
            width: '40%',
            mr: 2,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* CONTAINERS FOR HEIGHT */}
          <Box
            component={Paper}
            sx={{
              height: 400, 
              overflowY: 'auto',
            }}
          >
            {/* CARS LIST */}
            <List>
              {cars.map((car, index) => (
                <React.Fragment key={car.id}>
                  <ListItem
                    button
                    onClick={() => handleCarClick(car)}
                    sx={{
                      backgroundColor:
                        selectedCar && selectedCar.id === car.id ? 'lightblue' : 'transparent',
                    }}
                  >
                    <ListItemAvatar sx={{ pr: 2 }}>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          component="img"
                          src={car.imageUrl || 'https://via.placeholder.com/56x56?text=No+Image'}
                          alt={`${car.make} ${car.model}`}
                          sx={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                          }}
                        />
                      </Box>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${car.year} ${car.make} ${car.model}`}
                      secondary={`Mileage: ${car.mileage} miles`}
                    />
                  </ListItem>
                  {index < cars.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Box>
        </Box>

        {/* CAR DETAILS BOX */}
        <Box
          sx={{
            width: '60%',
          }}
        >
          {selectedCar ? (
            <Paper sx={{ p: 2, position: 'relative' }}>
              <IconButton
                aria-label="close"
                onClick={handleCloseDetails}
                sx={{ position: 'absolute', top: 8, right: 8 }}
              >
                <CloseIcon />
              </IconButton>

              {/* Car Image */}
              <Box
                component="img"
                src={selectedCar.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'}
                alt={`${selectedCar.make} ${selectedCar.model}`}
                sx={{
                  width: 400,
                  height: 300,
                  objectFit: 'contain',
                  display: 'block',
                  margin: '0 auto 16px',
                }}
              />

              <Typography variant="h5" component="h2" gutterBottom>
                Car Details
              </Typography>
              <Typography variant="body1">
                <strong>Make:</strong> {selectedCar.make}
              </Typography>
              <Typography variant="body1">
                <strong>Model:</strong> {selectedCar.model}
              </Typography>
              <Typography variant="body1">
                <strong>Year:</strong> {selectedCar.year}
              </Typography>
              <Typography variant="body1">
                <strong>Color:</strong> {selectedCar.color}
              </Typography>
              <Typography variant="body1">
                <strong>Mileage:</strong> {selectedCar.mileage} miles
              </Typography>
            </Paper>
          ) : (
            <Paper sx={{ p: 2 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Select a car to view details
              </Typography>
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  );
}
