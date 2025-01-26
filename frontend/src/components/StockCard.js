import React from 'react';

const StockCard = ({
  symbol,
  regularMarketPrice,
  previousClose,
  trend,
  recommendation,
  error,
  onRemove,
}) => {
  if (error) {
    return (
      <div style={styles.card}>
        <h3>{symbol}</h3>
        <p>Error fetching data</p>
        <button onClick={onRemove} style={styles.removeButton}>
          Remove
        </button>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <h3>{symbol}</h3>
      <p>Regular Market Price: ${regularMarketPrice?.toFixed(2)}</p>
      <p>Previous Close: ${previousClose?.toFixed(2)}</p>
      <p>Trend: {trend}</p>
      <p style={styles.recommendation}>Recommendation: {recommendation}</p>
      <button onClick={onRemove} style={styles.removeButton}>
        Remove
      </button>
    </div>
  );
};

const styles = {
  card: {
    border: '2px solid #ccc',
    borderRadius: '8px',
    padding: '1rem',
    margin: '1rem',
    background: 'white',
    width: '250px',
    position: 'relative',
    boxShadow: '4px 4px 7px rgba(0, 0, 0, 0.3)',
  },
  recommendation: {
    fontWeight: 'bold',
    color: '#4CAF50', // Default color for recommendations
  },
  removeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    padding: '5px 10px',
  },
};

export default StockCard;