from flask import Flask, request, jsonify
from flask_cors import CORS
from utils.stock_api import get_stock_data

app = Flask(__name__)
CORS(app)  # Allows frontend to connect to backend

@app.route('/api/stocks', methods=['GET'])
def get_stocks():
    # Extract query parameters
    symbol = request.args.get('symbol', 'AAPL')
    indicator = request.args.get('indicator', 'SMA')  # Default to Simple Moving Average

    # Get stock data
    stock_data = get_stock_data(symbol, indicator)
    if stock_data:
        return jsonify(stock_data), 200
    else:
        return jsonify({'error': 'Failed to fetch stock data'}), 500

if __name__ == '__main__':
    app.run(debug=True)