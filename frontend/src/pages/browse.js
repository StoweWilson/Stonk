import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, Container, Box, CircularProgress } from '@mui/material';

const Browse = () => {
  const [categories, setCategories] = useState({
    bigCompanies: [],
    topMovers: [],
    goodBuys: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/browse');
        console.log('Fetched categories:', response.data);

        setCategories({
          bigCompanies: response.data.bigCompanies || [],
          topMovers: response.data.topMovers || [],
          goodBuys: response.data.goodBuys || [],
        });
      } catch (err) {
        console.error('Error fetching browse data:', err);
        setError('Failed to load stock data.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <Box sx={styles.center}><CircularProgress /></Box>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom>
        Browse Stocks
      </Typography>

      {["bigCompanies", "topMovers", "goodBuys"].map((category) => (
        <div key={category}>
          <Typography variant="h5" sx={{ mt: 3, mb: 2, fontWeight: 'bold' }}>
            {category.replace(/([A-Z])/g, ' $1')}
          </Typography>
          <Grid container spacing={3}>
            {(categories[category] || []).map((stock) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={stock.symbol}>
                <Card sx={styles.card}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {stock.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Symbol: {stock.symbol}
                    </Typography>
                    <Typography sx={styles.price(stock.change)}>
                      Price: ${stock.price?.toFixed(2)}
                    </Typography>
                    <Typography sx={styles.change(stock.change)}>
                      Change: {stock.change?.toFixed(2)}%
                    </Typography>
                    <Typography variant="body2">
                      High: ${stock.high?.toFixed(2)}
                    </Typography>
                    <Typography variant="body2">
                      Low: ${stock.low?.toFixed(2)}
                    </Typography>
                    <Typography variant="body2">
                      Volume: {stock.volume?.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      ))}
    </Container>
  );
};

const styles = {
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '80vh',
  },
  card: {
    padding: '16px',
    borderRadius: '10px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  price: (change) => ({
    fontSize: '1.1rem',
    fontWeight: 'bold',
  }),
  change: (change) => ({
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: change > 0 ? '#4CAF50' : '#f44336', // Green for positive, red for negative
  }),
};

export default Browse;