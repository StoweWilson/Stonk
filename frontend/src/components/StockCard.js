import React from 'react';

const StockCard = ({
  symbol,
  regularMarketPrice,
  preMarketPrice,
  postMarketPrice,
  previousClose,
  marketState,
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

  const priceChange =
    regularMarketPrice && previousClose
      ? regularMarketPrice - previousClose
      : null;
  const isUp = priceChange > 0;

  return (
    <div style={styles.card}>
      <h3>{symbol}</h3>
      <p>Market State: {marketState}</p>
      {marketState === 'PRE' && preMarketPrice && (
        <p>Pre-Market Price: ${preMarketPrice.toFixed(2)}</p>
      )}
      {marketState === 'REGULAR' && regularMarketPrice && (
        <p>Regular Market Price: ${regularMarketPrice.toFixed(2)}</p>
      )}
      {marketState === 'POST' && postMarketPrice && (
        <p>Post-Market Price: ${postMarketPrice.toFixed(2)}</p>
      )}
      <p>Previous Close: ${previousClose.toFixed(2)}</p>
      <button onClick={onRemove} style={styles.removeButton}>
        Remove
      </button>
    </div>
  );
};

const styles = {
  card: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '1rem',
    margin: '1rem',
    background: '#faf8ef',
    width: '200px',
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
  arrowUp: {
    color: 'green',
    fontSize: '18px',
    marginLeft: '5px',
  },
  arrowDown: {
    color: 'red',
    fontSize: '18px',
    marginLeft: '5px',
  },
};

export default StockCard;