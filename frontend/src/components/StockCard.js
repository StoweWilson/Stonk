import React from 'react';

const StockCard = ({ symbol, date, data }) => {
  if (!data) {
    return (
      <div style={styles.card}>
        <h3>{symbol}</h3>
        <p>No data available</p>
      </div>
    );
  }

  const open = parseFloat(data['1. open']).toFixed(2);
  const close = parseFloat(data['4. close']).toFixed(2);

  return (
    <div style={styles.card}>
      <h3>{symbol}</h3>
      <p>Date: {date}</p>
      <p>Open: ${open}</p>
      <p>Close: ${close}</p>
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
};

export default StockCard;