import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StockCard from '../components/StockCard';

const Dashboard = () => {
  const [stockSymbols, setStockSymbols] = useState(['AAPL', 'MSFT', 'GOOGL']);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newSymbol, setNewSymbol] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const fetchedStocks = await Promise.all(
        stockSymbols.map(async (symbol) => {
          try {
            const response = await axios.get('http://127.0.0.1:5000/api/stocks', {
              params: { symbol },
            });

            console.log(`Response for ${symbol}:`, response.data);
            return response.data;
          } catch (error) {
            console.error(`Error fetching data for ${symbol}:`, error);
            return { symbol, error: true };
          }
        })
      );

      setStocks(fetchedStocks);
      setLoading(false);
    };

    fetchData();
  }, [stockSymbols]);

  const handleAddSymbol = () => {
    if (newSymbol && !stockSymbols.includes(newSymbol.toUpperCase())) {
      setStockSymbols([...stockSymbols, newSymbol.toUpperCase()]);
      setNewSymbol('');
    } else {
      alert('Please enter a valid, unique stock symbol.');
    }
  };

  const handleRemoveSymbol = (symbolToRemove) => {
    setStockSymbols(stockSymbols.filter((symbol) => symbol !== symbolToRemove));
  };

  return (
    <div>
        
      <h2>Dashboard</h2>

      {/* Add Stock Input */}
      <div style={styles.addSymbolContainer}>
        <input
          type="text"
          placeholder="Enter stock symbol"
          value={newSymbol}
          onChange={(e) => setNewSymbol(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleAddSymbol} style={styles.button}>
          Add Stock
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {stocks.map((stock) => (
            <StockCard
              key={stock.symbol}
              {...stock}
              onRemove={() => handleRemoveSymbol(stock.symbol)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  addSymbolContainer: {
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px',
  },
  input: {
    padding: '5px',
    fontSize: '16px',
  },
  button: {
    padding: '5px 10px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Dashboard;