from flask import Flask, request, jsonify
import yfinance as yf
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/stocks', methods=['GET'])
def get_stock_data():
    symbol = request.args.get('symbol', 'AAPL')

    try:
        # Fetch stock data using yfinance
        stock = yf.Ticker(symbol)
        data = stock.info

        # Extract relevant data
        stock_data = {
            'symbol': symbol,
            'regularMarketPrice': data.get('regularMarketPrice'),
            'preMarketPrice': data.get('preMarketPrice'),
            'postMarketPrice': data.get('postMarketPrice'),
            'previousClose': data.get('previousClose'),
            'marketState': data.get('marketState'),  # Shows if the market is open or closed
        }

        return jsonify(stock_data), 200

    except Exception as e:
        print(f"Error fetching data for {symbol}: {e}")
        return jsonify({'error': 'Failed to fetch stock data'}), 500

if __name__ == '__main__':
    app.run(debug=True)