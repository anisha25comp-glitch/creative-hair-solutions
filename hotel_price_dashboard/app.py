from pathlib import Path

import pandas as pd
import plotly.express as px
import streamlit as st


# ---------- Page setup ----------
st.set_page_config(
    page_title="MakeMyTrip Hotel Price Comparison Dashboard",
    page_icon="✦",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ---------- Theme ----------
COLORS = {
    "navy": "#0B1F3A",
    "blue": "#1769AA",
    "orange": "#FF7A00",
    "off_white": "#F7F9FC",
    "text": "#172033",
    "muted": "#667085",
    "border": "#E4E7EC",
    "green": "#16A34A",
    "gold": "#F59E0B",
}

st.markdown(
    f"""
    <style>
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@700;800&display=swap');

        :root {{
            --navy: {COLORS['navy']}; --blue: {COLORS['blue']}; --orange: {COLORS['orange']};
            --bg: {COLORS['off_white']}; --text: {COLORS['text']}; --muted: {COLORS['muted']};
            --border: {COLORS['border']}; --green: {COLORS['green']}; --gold: {COLORS['gold']};
        }}
        .stApp {{ background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }}
        .block-container {{ max-width: 1440px; padding: 1.1rem 3.4rem 3.5rem; }}
        [data-testid="stSidebar"] {{ background: #ffffff; border-right: 1px solid var(--border); }}
        [data-testid="stSidebar"] > div:first-child {{ padding: 1.5rem 1.15rem; }}
        h1, h2, h3, h4 {{ font-family: 'Manrope', sans-serif; letter-spacing: -0.03em; color: var(--navy); }}
        h1 {{ font-size: clamp(2.25rem, 4vw, 4.3rem); line-height: 1.02; margin: 0.55rem 0 0.8rem; }}
        h2 {{ font-size: 1.65rem; margin: 0; }}
        h3 {{ font-size: 1.1rem; }}
        .topbar {{ display:flex; align-items:center; justify-content:space-between; margin-bottom: 1.2rem; }}
        .brand {{ display:flex; align-items:center; gap:.65rem; font-weight:800; color:var(--navy); font-size:1.08rem; }}
        .brand-mark {{ display:grid; place-items:center; width:34px; height:34px; border-radius:11px; background:var(--orange); color:white; font-weight:800; }}
        .demo-pill {{ color:#8a4b00; background:#fff2e8; border:1px solid #ffd9bd; padding:.42rem .75rem; border-radius:999px; font-size:.78rem; font-weight:700; }}
        .hero {{ background: linear-gradient(115deg, #0B1F3A 0%, #10345c 57%, #1769AA 100%); border-radius: 24px; padding: 2.25rem 2.4rem; color: white; position:relative; overflow:hidden; }}
        .hero:after {{ content:''; position:absolute; width:310px; height:310px; right:-90px; top:-145px; border-radius:50%; border: 42px solid rgba(255,255,255,.08); }}
        .eyebrow {{ text-transform:uppercase; letter-spacing:.14em; font-size:.72rem; font-weight:700; color:#a9d5ff; }}
        .hero h1 {{ color:white; max-width: 760px; }}
        .hero-copy {{ color:#dbeafe; max-width:650px; font-size:1.03rem; line-height:1.6; margin-bottom: 1.1rem; }}
        .hero-note {{ color:#b7d5ee; font-size:.8rem; }}
        .section-head {{ display:flex; justify-content:space-between; align-items:end; margin: 2rem 0 .8rem; }}
        .section-kicker {{ color:var(--orange); text-transform:uppercase; letter-spacing:.12em; font-size:.7rem; font-weight:800; margin-bottom:.32rem; }}
        .section-subtitle {{ color:var(--muted); font-size:.9rem; margin-top:.3rem; }}
        .metric-card {{ background:white; border:1px solid var(--border); border-radius:16px; padding:1.15rem 1.2rem; min-height:110px; box-shadow:0 5px 20px rgba(16,24,40,.035); }}
        .metric-label {{ color:var(--muted); font-size:.8rem; font-weight:600; }}
        .metric-value {{ font-family:'Manrope',sans-serif; color:var(--navy); font-size:1.65rem; font-weight:800; margin-top:.28rem; }}
        .metric-accent {{ width:26px; height:3px; background:var(--orange); border-radius:4px; margin-top:.65rem; }}
        .info-card {{ background:white; border:1px solid var(--border); border-radius:16px; padding:1.1rem 1.2rem; height:100%; }}
        .hotel-name {{ font-family:'Manrope',sans-serif; font-size:1.1rem; font-weight:800; color:var(--navy); }}
        .hotel-meta {{ color:var(--muted); font-size:.85rem; margin-top:.25rem; }}
        .tag {{ display:inline-block; padding:.28rem .55rem; border-radius:999px; font-size:.72rem; font-weight:700; margin:.35rem .25rem 0 0; background:#eef5fb; color:var(--blue); }}
        .rating {{ color:#9a5b00; background:#fff7db; display:inline-block; border-radius:8px; padding:.32rem .5rem; font-weight:800; font-size:.82rem; }}
        .price {{ font-family:'Manrope',sans-serif; color:var(--navy); font-weight:800; font-size:1.25rem; }}
        .sidebar-title {{ font-family:'Manrope',sans-serif; font-size:1.2rem; color:var(--navy); margin-bottom:.2rem; }}
        .sidebar-caption {{ color:var(--muted); font-size:.78rem; line-height:1.5; margin-bottom:1rem; }}
        .stButton > button, .stDownloadButton > button {{ border-radius:10px; font-weight:700; border:1px solid var(--border); }}
        .stDownloadButton > button {{ background:var(--navy); color:white; border-color:var(--navy); width:100%; }}
        div[data-testid="stDataFrame"] {{ border:1px solid var(--border); border-radius:14px; overflow:hidden; }}
        .footer {{ color:var(--muted); border-top:1px solid var(--border); margin-top:2.3rem; padding-top:1.1rem; font-size:.78rem; line-height:1.55; }}
        .empty {{ background:white; border:1px dashed #c8d0dc; border-radius:16px; padding:2rem; text-align:center; color:var(--muted); }}
    </style>
    """,
    unsafe_allow_html=True,
)


# ---------- Data ----------
DATA_FILE = Path(__file__).parent / "hotels.csv"


@st.cache_data
def load_hotels():
    """Load the bundled sample dataset once and reuse it during the session."""
    return pd.read_csv(DATA_FILE)


hotels = load_hotels()
hotels["amenities_list"] = hotels["amenities"].str.split(" · ")

# ---------- Header ----------
st.markdown(
    """
    <div class="topbar">
        <div class="brand"><span class="brand-mark">✦</span> MakeMyTrip Price Compare</div>
        <span class="demo-pill">ACADEMIC PROTOTYPE · NOT OFFICIAL · SAMPLE DATA</span>
    </div>
    <div class="hero">
        <div class="eyebrow">Compare stays. Plan smarter.</div>
        <h1>MakeMyTrip Hotel Price Comparison Dashboard</h1>
        <div class="hero-copy">Compare curated hotel options across popular Indian destinations using one clear, student-friendly dashboard.</div>
        <div class="hero-note">Prices shown are illustrative demo values — not live MakeMyTrip prices.</div>
    </div>
    """,
    unsafe_allow_html=True,
)

# ---------- Sidebar filters ----------
st.sidebar.markdown('<div class="sidebar-title">Plan your stay</div>', unsafe_allow_html=True)
st.sidebar.markdown('<div class="sidebar-caption">Use the filters to narrow down the sample hotel catalogue.</div>', unsafe_allow_html=True)

destinations = ["All destinations"] + sorted(hotels["destination"].unique().tolist())
destination = st.sidebar.selectbox("Destination", destinations)

col_a, col_b = st.sidebar.columns(2)
with col_a:
    check_in = st.date_input("Check-in", value=pd.Timestamp("2025-06-12"))
with col_b:
    check_out = st.date_input("Check-out", value=pd.Timestamp("2025-06-15"))

if check_out <= check_in:
    st.sidebar.warning("Check-out should be after check-in.")

guest_count = st.sidebar.number_input("Guests", min_value=1, max_value=8, value=2, step=1)
categories = ["All categories"] + sorted(hotels["category"].unique().tolist())
category = st.sidebar.selectbox("Hotel category", categories)
min_price = int(hotels["price_per_night"].min())
max_price = int(hotels["price_per_night"].max())
price_range = st.sidebar.slider("Price per night (₹)", min_value=min_price, max_value=max_price, value=(min_price, max_price), step=250)
min_rating = st.sidebar.slider("Minimum rating", min_value=0.0, max_value=5.0, value=0.0, step=0.1)

st.sidebar.markdown("---")
st.sidebar.caption("Tip: Start with a destination, then adjust price and rating to compare the best-fit options.")

# ---------- Filtering and sorting ----------
filtered = hotels.copy()
if destination != "All destinations":
    filtered = filtered[filtered["destination"] == destination]
if category != "All categories":
    filtered = filtered[filtered["category"] == category]
filtered = filtered[
    (filtered["price_per_night"].between(price_range[0], price_range[1]))
    & (filtered["rating"] >= min_rating)
    & (filtered["max_guests"] >= guest_count)
]

st.markdown('<div class="section-head"><div><div class="section-kicker">Your shortlist</div><h2>Compare sample hotels</h2><div class="section-subtitle">Sort the results and explore details before you decide.</div></div></div>', unsafe_allow_html=True)

sort_choice = st.selectbox("Sort results by", ["Lowest price", "Highest price", "Highest rating"], label_visibility="collapsed")
if sort_choice == "Lowest price":
    filtered = filtered.sort_values(["price_per_night", "rating"], ascending=[True, False])
elif sort_choice == "Highest price":
    filtered = filtered.sort_values(["price_per_night", "rating"], ascending=[False, False])
else:
    filtered = filtered.sort_values(["rating", "price_per_night"], ascending=[False, True])

# ---------- Stats ----------
stat_cols = st.columns(4)
statistics = [
    ("Hotels found", f"{len(filtered)}", "matching stays"),
    ("Lowest price", f"₹{filtered['price_per_night'].min():,.0f}" if not filtered.empty else "—", "per night"),
    ("Average price", f"₹{filtered['price_per_night'].mean():,.0f}" if not filtered.empty else "—", "per night"),
    ("Average rating", f"{filtered['rating'].mean():.1f} / 5" if not filtered.empty else "—", "guest score"),
]
for col, (label, value, note) in zip(stat_cols, statistics):
    with col:
        st.markdown(f'<div class="metric-card"><div class="metric-label">{label}</div><div class="metric-value">{value}</div><div class="metric-label">{note}</div><div class="metric-accent"></div></div>', unsafe_allow_html=True)

if filtered.empty:
    st.markdown('<div class="empty"><strong>No hotels match these filters.</strong><br>Try widening the price range or lowering the minimum rating.</div>', unsafe_allow_html=True)
else:
    # ---------- Main comparison table ----------
    table = filtered[["hotel_name", "destination", "location", "price_per_night", "rating", "category", "amenities"]].copy()
    table.columns = ["Hotel name", "Destination", "Location", "Price / night", "Rating", "Category", "Amenities"]
    table["Price / night"] = table["Price / night"].map(lambda value: f"₹{value:,.0f}")
    table["Rating"] = table["Rating"].map(lambda value: f"★ {value:.1f}")
    st.dataframe(table, use_container_width=True, hide_index=True, height=360)

    download_data = filtered.drop(columns=["amenities_list"]).to_csv(index=False).encode("utf-8")
    st.download_button("Download filtered results (CSV)", data=download_data, file_name="stayscout_filtered_hotels.csv", mime="text/csv")

    # ---------- Charts ----------
    chart_col1, chart_col2 = st.columns(2)
    with chart_col1:
        st.markdown("<div class='section-head'><div><div class='section-kicker'>Visual comparison</div><h2>Hotel price comparison</h2></div></div>", unsafe_allow_html=True)
        price_chart = px.bar(filtered.sort_values("price_per_night"), x="price_per_night", y="hotel_name", orientation="h", color="price_per_night", color_continuous_scale=["#b7d5ee", "#1769AA", "#0B1F3A"], labels={"price_per_night": "Price per night (₹)", "hotel_name": ""}, hover_data={"destination": True, "rating": ":.1f"})
        price_chart.update_layout(height=390, margin=dict(l=0, r=10, t=10, b=10), coloraxis_showscale=False, plot_bgcolor="white", paper_bgcolor="white", font=dict(family="DM Sans", color=COLORS["text"]))
        st.plotly_chart(price_chart, use_container_width=True)
    with chart_col2:
        st.markdown("<div class='section-head'><div><div class='section-kicker'>Value signal</div><h2>Rating vs price</h2></div></div>", unsafe_allow_html=True)
        scatter = px.scatter(filtered, x="price_per_night", y="rating", size="max_guests", color="category", hover_name="hotel_name", hover_data={"destination": True, "location": True, "price_per_night": ":,.0f"}, labels={"price_per_night": "Price per night (₹)", "rating": "Rating", "category": "Category"}, color_discrete_sequence=["#1769AA", "#FF7A00", "#16A34A", "#7C3AED"])
        scatter.update_yaxes(range=[3.7, 5.1])
        scatter.update_layout(height=390, margin=dict(l=0, r=10, t=10, b=10), plot_bgcolor="white", paper_bgcolor="white", font=dict(family="DM Sans", color=COLORS["text"]), legend_title_text="")
        st.plotly_chart(scatter, use_container_width=True)

    # ---------- Hotel details ----------
    st.markdown("<div class='section-head'><div><div class='section-kicker'>Explore a stay</div><h2>Hotel details</h2><div class='section-subtitle'>Select a property to see its demo profile and amenities.</div></div></div>", unsafe_allow_html=True)
    selected_hotel = st.selectbox("Choose a hotel", filtered["hotel_name"].tolist(), label_visibility="collapsed")
    hotel = filtered[filtered["hotel_name"] == selected_hotel].iloc[0]
    detail_cols = st.columns([1.65, 1, 1, 1])
    with detail_cols[0]:
        st.markdown(f'<div class="info-card"><div class="hotel-name">{hotel["hotel_name"]}</div><div class="hotel-meta">{hotel["location"]} · {hotel["destination"]}</div><div style="margin-top:.9rem">{"".join(f"<span class=tag>{item}</span>" for item in hotel["amenities_list"])}</div></div>', unsafe_allow_html=True)
    with detail_cols[1]:
        st.markdown(f'<div class="info-card"><div class="metric-label">Nightly rate</div><div class="price" style="margin-top:.5rem">₹{hotel["price_per_night"]:,.0f}</div><div class="hotel-meta">illustrative demo price</div></div>', unsafe_allow_html=True)
    with detail_cols[2]:
        st.markdown(f'<div class="info-card"><div class="metric-label">Guest rating</div><div class="rating" style="margin-top:.5rem">★ {hotel["rating"]:.1f} / 5</div><div class="hotel-meta">sample guest score</div></div>', unsafe_allow_html=True)
    with detail_cols[3]:
        st.markdown(f'<div class="info-card"><div class="metric-label">Best for</div><div class="hotel-name" style="font-size:1rem; margin-top:.45rem">{hotel["category"]}</div><div class="hotel-meta">Up to {hotel["max_guests"]} guests</div></div>', unsafe_allow_html=True)

st.markdown("<div class='footer'><strong>Academic prototype note:</strong> StayScout uses bundled sample/demo hotel data created for a college project. It is not connected to MakeMyTrip, does not scrape MakeMyTrip, and does not display live prices or availability.<br><br>Built with Python · Streamlit · Pandas · Plotly</div>", unsafe_allow_html=True)
