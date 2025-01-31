from flask import Flask, request, jsonify
import yfinance as yf
from flask_cors import CORS
import numpy as np
import datetime

app = Flask(__name__)
CORS(app)


@app.route('/api/stocks', methods=['GET'])
def get_stock_data():
    symbol = request.args.get('symbol', 'AAPL')

    try:
        stock = yf.Ticker(symbol)
        history = stock.history(period="1mo", interval="1d")  # Fetch last 1 month of daily data
        prices = history['Close'].tolist()

        
        x = np.arange(len(prices))
        y = np.array(prices)
        slope, intercept = np.polyfit(x, y, 1)  # Linear regression

        
        trend = 'upward' if slope > 0 else 'downward' if slope < 0 else 'flat'

        
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
    categories = {
        "bigCompanies": [
            "AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA", "META", "BRK-B", "V", "JNJ",
            "JPM", "UNH", "PG", "XOM", "WMT", "PFE", "DIS", "PEP", "NFLX", "COST"
        ],  
        "topMovers": [
            "AMD", "PYPL", "DIS", "SQ", "BA", "NKE", "PFE", "WMT", "KO", "TGT",
            "MCD", "HD", "LOW", "CSCO", "IBM", "INTC", "ABNB", "BABA", "NIO", "UBER"
        ],  
        "goodBuys": [
            "T", "VZ", "MRNA", "ABNB", "NIO", "TSM", "CRM", "FDX", "CVX", "MO",
            "TROW", "GIS", "MMM", "ORCL", "MDT", "LMT", "RTX", "SPGI", "CHTR", "SNOW"
        ],  
    }

    results = {}

    for category, symbols in categories.items():
        stocks = []
        for symbol in symbols:
            try:
                stock = yf.Ticker(symbol)
                info = stock.info
                stocks.append({
                    "symbol": symbol,
                    "name": info.get("shortName", "N/A"),
                    "price": info.get("regularMarketPrice"),
                    "change": info.get("regularMarketChangePercent"),
                    "marketCap": info.get("marketCap"),
                    "previousClose": info.get("previousClose"),
                    "high": info.get("dayHigh"),
                    "low": info.get("dayLow"),
                    "volume": info.get("volume"),
                })
            except Exception as e:
                print(f"Error fetching data for {symbol}: {e}")
        results[category] = stocks

    return jsonify(results)



@app.route('/api/market-status', methods=['GET'])
def get_market_status():
    try:
        stock = yf.Ticker('AAPL')
        market_state = stock.info.get('marketState', 'CLOSED')  # REGULAR, PRE, POST, CLOSED
        return jsonify({'marketState': market_state}), 200
    except Exception as e:
        print(f"Error fetching market state: {e}")
        return jsonify({'error': 'Failed to fetch market status'}), 500



@app.route('/api/stock-history', methods=['GET'])
def get_stock_history():
    symbol = request.args.get('symbol', 'AAPL')
    stock = yf.Ticker(symbol)
    
    end_date = datetime.datetime.today().strftime('%Y-%m-%d')
    start_date = (datetime.datetime.today() - datetime.timedelta(days=30)).strftime('%Y-%m-%d')
    history = stock.history(period="1mo")

    if history.empty:
        return jsonify({"error": "No data available"}), 404
    
    data = {
        "dates": history.index.strftime('%Y-%m-%d').tolist(),
        "prices": history["Close"].tolist(),
        "open": history["Open"].tolist(),
        "high": history["High"].tolist(),
        "low": history["Low"].tolist()
    }
    
    return jsonify(data)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)