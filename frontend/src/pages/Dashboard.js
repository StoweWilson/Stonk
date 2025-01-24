import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StockCard from '../components/StockCard';

const Dashboard = () => {
  const [stockSymbols, setStockSymbols] = useState(['AAPL', 'MSFT', 'GOOGL']); // List of stocks
  const [newStock, setNewStock] = useState('');
  const [stocks, setStocks] = useState([]); // Holds data for multiple stocks

  useEffect(() => {
    // Fetch data for each stock symbol
    const fetchData = async () => {
        try {
          const fetchedStocks = await Promise.all(
            stockSymbols.map(async (symbol) => {
              let response = await axios.get('https://www.alphavantage.co/query', {
                params: {
                  function: 'TIME_SERIES_INTRADAY',
                  symbol,
                  interval: '5min',
                  apikey: 'J1ZYLBNLSLBO1DT5',
                },
              });
      
              let timeSeries = response.data['Time Series (5min)'];
              let latestDateTime = timeSeries ? Object.keys(timeSeries)[0] : null;
              let latestData = timeSeries ? timeSeries[latestDateTime] : null;
      
              if (!latestData) {
                // Fallback to daily data if intraday is unavailable
                response = await axios.get('https://www.alphavantage.co/query', {
                  params: {
                    function: 'TIME_SERIES_DAILY',
                    symbol,
                    apikey: 'J1ZYLBNLSLBO1DT5',
                  },
                });
      
                const dailySeries = response.data['Time Series (Daily)'];
                const latestDate = dailySeries ? Object.keys(dailySeries)[0] : null;
                latestData = dailySeries ? dailySeries[latestDate] : null;
      
                return {
                  symbol,
                  datetime: latestDate,
                  data: latestData,
                };
              }
      
              return {
                symbol,
                datetime: latestDateTime,
                data: latestData,
              };
            })
          );
      
          setStocks(fetchedStocks);
        } catch (error) {
          console.error('Error fetching stock data:', error);
        }
      };

    fetchData();
  }, [stockSymbols]); // Re-run if stockSymbols changes
  const handleAddStock = () => {
    if (newStock && !stockSymbols.includes(newStock.toUpperCase())) {
      setStockSymbols([...stockSymbols, newStock.toUpperCase()]);
      setNewStock('');
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <div>
        <input
          type="text"
          placeholder="Enter stock symbol"
          value={newStock}
          onChange={(e) => setNewStock(e.target.value)}
        />
        <button onClick={handleAddStock}>Add Stock</button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {stocks.map((stock) => (
          <StockCard
            key={stock.symbol}
            symbol={stock.symbol}
            date={stock.date}
            data={stock.data}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;