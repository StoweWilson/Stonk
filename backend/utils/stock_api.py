import requests

def get_stock_data(symbol):
    API_KEY = 'J1ZYLBNLSLBO1DT5'
    BASE_URL = 'https://www.alphavantage.co/query'

    # Use the Intraday API
    params = {
        'function': 'TIME_SERIES_INTRADAY',
        'symbol': symbol,
        'interval': '5min',  # Fetch data in 5-minute intervals
        'apikey': API_KEY,
    }

    try:
        response = requests.get(BASE_URL, params=params)
        response.raise_for_status()
        data = response.json()

        # Extract the most recent intraday data
        time_series = data.get('Time Series (5min)', {})
        if not time_series:
            return None

        latest_datetime = max(time_series.keys())
        latest_data = time_series[latest_datetime]

        return {
            'symbol': symbol,
            'datetime': latest_datetime,
            'open': latest_data['1. open'],
            'close': latest_data['4. close'],
        }
    except Exception as e:
        print(f"Error fetching stock data: {e}")
        return None