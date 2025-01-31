import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js';
import 'chartjs-adapter-date-fns'; // ✅ Import Date Adapter for time-based scales
import { Line } from 'react-chartjs-2';
import { Card, CardContent, CardActions, Typography, Button, Box } from '@mui/material';

// ✅ Register all required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const StockCard = ({ symbol, onRemove }) => {
  const [stockData, setStockData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/api/stocks?symbol=${symbol}`);
        console.log(`Stock Info for ${symbol}:`, response.data);
        setStockData(response.data);
      } catch (error) {
        console.error(`Error fetching stock info for ${symbol}:`, error);
      }
    };

    const fetchStockHistory = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/api/stock-history?symbol=${symbol}`);
        console.log(`Stock History for ${symbol}:`, response.data);

        setChartData({
          labels: response.data.dates,
          datasets: [
            {
              label: `${symbol} Price`,
              data: response.data.prices,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              tension: 0.4,
            },
          ],
        });
      } catch (error) {
        console.error(`Error fetching stock history for ${symbol}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
    fetchStockHistory();
  }, [symbol]);

  return (
    <Card sx={styles.card}>
      <CardContent>
        <Typography variant="h6" component="div">
          {symbol}
        </Typography>

        {/* ✅ Display Stock Info */}
        {stockData ? (
          <>
            <Typography variant="body1">
              <strong>Price:</strong> ${stockData.regularMarketPrice?.toFixed(2) || 'N/A'}
            </Typography>
            <Typography variant="body1">
              <strong>Previous Close:</strong> ${stockData.previousClose?.toFixed(2) || 'N/A'}
            </Typography>
            <Typography variant="body1">
              <strong>Market Cap:</strong> {stockData.marketCap ? `$${(stockData.marketCap / 1e9).toFixed(2)}B` : 'N/A'}
            </Typography>
            <Typography variant="body1">
              <strong>Trend:</strong> {stockData.trend || 'N/A'}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 'bold',
                color: stockData.recommendation === 'Great Buy' ? '#4CAF50' : '#f44336',
              }}
            >
              <strong>Recommendation:</strong> {stockData.recommendation || 'N/A'}
            </Typography>
          </>
        ) : (
          <Typography>Loading stock data...</Typography>
        )}

        {/* ✅ Line Chart */}
        <Box sx={{ marginTop: 2, marginBottom: 2 }}>
          {chartData ? (
            <Line
              key={symbol}
              data={chartData}
              options={{
                plugins: { legend: { display: true } },
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          ) : (
            <Typography variant="body2" color="text.secondary">
              No chart data available
            </Typography>
          )}
        </Box>
      </CardContent>

      {/* ✅ Remove Button */}
      <CardActions>
        <Button variant="contained" color="error" onClick={() => onRemove(symbol)}>
          Remove
        </Button>
      </CardActions>
    </Card>
  );
};

const styles = {
  card: {
    margin: '1rem',
    width: '350px',
    boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.2)',
    borderRadius: '12px',
    backgroundColor: '#f9f9f9',
  },
};

export default StockCard;