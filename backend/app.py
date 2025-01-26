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
    
@app.route('/api/browse', methods=['GET'])
def browse_stocks():
    # Define categories and example stock symbols for simplicity
    categories = {
        'big_companies': ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'],  # Large market cap
        'fast_earners': ['NVDA', 'AMD', 'META'],                     # High growth
        'big_movers': ['AMC', 'GME', 'BBBY'],                        # High volatility
    }

    result = {}

    for category, symbols in categories.items():
        category_data = []
        for symbol in symbols:
            try:
                stock = yf.Ticker(symbol)
                info = stock.info

                # Extract relevant data
                stock_data = {
                    'symbol': symbol,
                    'name': info.get('shortName'),
                    'price': info.get('regularMarketPrice'),
                    'change': info.get('regularMarketChangePercent'),
                    'market_cap': info.get('marketCap'),
                }
                category_data.append(stock_data)
            except Exception as e:
                print(f"Error fetching data for {symbol}: {e}")
        result[category] = category_data

    return jsonify(result), 200

if __name__ == '__main__':
    app.run(debug=True)