# StayScout — MakeMyTrip Hotel Price Comparison Dashboard

A beginner-friendly B.Tech college project built with **Python, Streamlit, Pandas, and Plotly**.

> **Academic prototype:** the dashboard uses bundled sample/demo hotel data. It is not connected to MakeMyTrip, does not scrape MakeMyTrip, and does not claim to show live prices or availability.

## Folder structure

```text
hotel_price_dashboard/
├── .streamlit/
│   └── config.toml
├── app.py
├── hotels.csv
├── requirements.txt
└── README.md
```

## Features

- Travel-style responsive homepage with a branded hero section
- Search filters for destination, dates, guests, category, price, and rating
- Sort by lowest price, highest price, or highest rating
- Comparison table with hotel name, location, price, rating, category, and amenities
- Dashboard statistics for hotel count, lowest price, average price, and average rating
- Interactive Plotly charts for price comparison and rating vs price
- Hotel details section with selected-property profile
- CSV download for the currently filtered results
- Clearly marked sample/demo data for safe academic use

## How to run

1. Open a terminal in this folder:

   ```bash
   cd hotel_price_dashboard
   ```

2. (Recommended) Create and activate a virtual environment:

   ```bash
   python -m venv .venv
   # macOS/Linux
   source .venv/bin/activate
   # Windows PowerShell
   .venv\\Scripts\\Activate.ps1
   ```

3. Install the dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Start the dashboard:

   ```bash
   streamlit run app.py
   ```

5. Open the local URL printed by Streamlit, usually `http://localhost:8501`.

## Publish as a permanent website

This project is ready for **Streamlit Community Cloud**, which hosts the Python app at a permanent public URL while the repository remains available on GitHub.

1. Sign in at [share.streamlit.io](https://share.streamlit.io/) with the GitHub account that owns this repository.
2. Select **New app**.
3. Choose repository `anisha25comp-glitch/creative-hair-solutions` and branch `main`.
4. Set the main file path to `hotel_price_dashboard/app.py`.
5. Click **Deploy**. Streamlit Cloud automatically installs `hotel_price_dashboard/requirements.txt`.

The app will receive a permanent `streamlit.app` URL. The repository already includes the Streamlit theme configuration and all sample data required to run the dashboard.

## Customising the sample data

Open `hotels.csv` in a spreadsheet editor or text editor and add rows using the same column names. The `amenities` field uses ` · ` between amenities. The dashboard automatically reloads the CSV when the app reruns.

## Suggested viva explanation

- **Pandas** loads and filters the CSV data.
- **Streamlit** creates the web interface without separate frontend code.
- **Plotly** creates interactive charts.
- **CSV download** exports the currently filtered Pandas DataFrame.
- The filter pipeline applies destination, category, price, rating, and guest-capacity conditions before sorting the results.
