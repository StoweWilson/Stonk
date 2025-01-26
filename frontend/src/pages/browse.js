import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Browse = () => {
  const [marketState, setMarketState] = useState('');
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchMarketState = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/market-status');
        setMarketState(response.data.marketState);
      } catch (error) {
        console.error('Error fetching market state:', error);
      }
    };

    fetchMarketState();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/browse');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching browse data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <p>Loading categories...</p>;
  }

  return (
    <div>
      <h2 style={styles.title}>Browse Stocks</h2>
      <p>Stock Market is: <strong>{marketState === 'REGULAR' ? 'Open' : 'Closed'}</strong></p>
      {Object.entries(categories).map(([category, stocks]) => (
        <div key={category} style={styles.categorySection}>
          <h3>{category.replace('_', ' ').toUpperCase()}</h3>
          <div style={styles.stockList}>
            {stocks.map((stock) => (
              <div key={stock.symbol} style={styles.stockCard}>
                <h4>{stock.name} ({stock.symbol})</h4>
                <p>Price: ${stock.price?.toFixed(2)}</p>
                <p>Change: {stock.change?.toFixed(2)}%</p>
                <p>Market Cap: ${stock.market_cap?.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const styles = {
    title:{
        textAlign:'center',
        display: 'flex',
        justifyContent:'center',
        fontSize:'3vw',

    },

  categorySection: {
    marginBottom: '20px',
    marginLeft:'10px',
  },
  stockList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '15px',
  },
  stockCard: {
    border: '2px solid #ccc',
    borderRadius: '8px',
    padding: '1rem',
    margin: '1rem',
    background: 'white',
    width: '250px',
    position: 'relative',
    boxShadow: '4px 4px 7px rgba(0, 0, 0, 0.3)',
  },
};

export default Browse;