# Stock Dashboard Application

A React-based web application for tracking stock data, managing watchlists, and categorizing stocks into sections like fast earners, big movers, and big companies. The app integrates with a Flask backend powered by Yahoo Finance (yfinance) to provide real-time and historical stock information.

## Features

# 🚀 Core Features
	•	Dashboard: View detailed stock data, including:
	•	Current market price
	•	Percentage change
	•	Market trends (upward, downward, or flat)
	•	Dynamic recommendations like “Good Buy” or “Don’t Buy”
	•	Watchlist: Add and remove stocks to create your personalized watchlist.
	•	Watchlist persists across sessions using localStorage.
	•	Browse Section: Explore stocks categorized into:
	•	Big Companies: Large market-cap companies like Apple and Microsoft.
	•	Fast Earners: High-growth stocks like NVIDIA.
	•	Big Movers: Stocks with significant daily percentage changes.

# 🔥 Additional Features
	•	Dynamic Updates: Stock data auto-refreshes every 60 seconds.
	•	User-Friendly Design: Includes hover effects, box shadows, and interactive UI elements.
	•	Responsive Design: Optimized for both desktop and mobile devices.

 # Technologies Used

### Frontend:
	•	React: For building the user interface.
	•	React Router: For routing between pages like the Dashboard and Browse section.
	•	CSS-in-JS: Styled with inline styles and React state for dynamic styling.

### Backend:
	•	Flask: Python-based backend for handling API requests.
	•	yfinance: To fetch real-time and historical stock data.
	•	CORS: For cross-origin requests between React and Flask.

## 💻 Usage
	1.	Dashboard: The main page displays your watchlist with detailed stock data.
	2.	Add Stocks: Enter a stock symbol in the input field (e.g., AAPL) and click Add Stock.
	3.	Remove Stocks: Click the Remove button on any stock card to remove it from your watchlist.
	4.	Browse Section: Explore categorized stocks under Big Companies, Fast Earners, and Big Movers.
