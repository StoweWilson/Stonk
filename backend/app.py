from flask import Flask, request, jsonify
import yfinance as yf
from flask_cors import CORS
import numpy as np

app = Flask(__name__)
CORS(app)

@app.route('/api/stocks', methods=['GET'])
def get_stock_data():
    symbol = request.args.get('symbol', 'AAPL')

    try:
        stock = yf.Ticker(symbol)
        history = stock.history(period="1mo", interval="1d")  # Fetch last 1 month of daily data
        prices = history['Close'].tolist()

        # Calculate linear regression slope
        x = np.arange(len(prices))
        y = np.array(prices)
        slope, intercept = np.polyfit(x, y, 1)  # Linear regression

        # Determine trend
        trend = 'upward' if slope > 0 else 'downward' if slope < 0 else 'flat'

        # Suggestion based on trend
        if trend == 'upward' and slope > 0.5:
            recommendation = 'Great Buy'
        elif trend == 'upward':
            recommendation = 'Good Buy'
        elif trend == 'downward' and slope < -0.5:
            recommendation = 'Don’t Buy'
        else:
            recommendation = 'Eh'

        stock_data = {
            'symbol': symbol,
            'regularMarketPrice': stock.info.get('regularMarketPrice'),
            'previousClose': stock.info.get('previousClose'),
            'trend': trend,
            'recommendation': recommendation,
        }

        return jsonify(stock_data), 200
    except Exception as e:
        print(f"Error fetching data for {symbol}: {e}")
        return jsonify({'error': 'Failed to fetch stock data'}), 500

if __name__ == '__main__':
    app.run(debug=True)