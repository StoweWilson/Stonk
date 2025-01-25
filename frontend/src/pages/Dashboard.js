import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StockCard from '../components/StockCard';

const Dashboard = () => {
  const [stockSymbols, setStockSymbols] = useState(['AAPL', 'MSFT', 'GOOGL']);
  const [stocks, setStocks] = useState([]); // Stores fetched stock data
  const [newSymbol, setNewSymbol] = useState('');
  const [loading, setLoading] = useState(false);


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

    const interval = setInterval(fetchData,60000);

    return () => clearInterval(interval);

  }, [stockSymbols]);

  const handleAddSymbol = () => {
    if (newSymbol && !stockSymbols.includes(newSymbol.toUpperCase())) {
        setStockSymbols([...stockSymbols, newSymbol.toUpperCase()]);
        setNewSymbol('');
    }else{
        alert('Please enter a valid, unique stock symbol.')
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

      {/* Show Spinner or Stock Cards */}
      {loading ? (
        <div style={styles.spinnerContainer}>
          <div style={styles.spinner}></div>
          <p>Loading stock data...</p>
        </div>
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
    spinnerContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '200px',
    },
    spinner: {
      width: '50px',
      height: '50px',
      border: '5px solid #ccc',
      borderTop: '5px solid #4CAF50',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
  };
  
  // Add a keyframes animation for the spinner
  const spinnerKeyframes = `
    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `;
  
  // Inject keyframes into the document head
  const styleSheet = document.styleSheets[0];
  styleSheet.insertRule(spinnerKeyframes, styleSheet.cssRules.length);
  

export default Dashboard;