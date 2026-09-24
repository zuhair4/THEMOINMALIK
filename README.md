# THEMOINMALIK DAIRY — B2B Dairy Booking Web Application

A commercial B2B dairy ordering web portal for **THEMOINMALIK DAIRY**, tailored for restaurants, sweet shops, bakeries, cafes, and commercial kitchens.

---

## 🌟 Key Features

1. **CRED Luxury Dark Aesthetics**:
   - Deep obsidian dark palette (`#09090b`), emerald neon mint accents (`#00e599`), glassmorphism cards, and smooth micro-interactions.
2. **Two-Way Google Sheets Live Sync**:
   - **Catalog & Inventory (`Inventory` tab)**: Live availability, prices, and packaging are fetched directly from Google Sheets.
   - **Order Dispatch (`Orders` tab)**: Every booking automatically creates an entry with unique Order IDs (`TMD-ORD-XXXXXX`) and Customer IDs (`CUST-XXXXXX`).
   - **Customer Directory (`Customers` tab)**: Tracks buyer lifetime order counts, contact details, and commercial revenue.
3. **2 Fulfillment Methods**:
   - **Delivery as per Demand**: Direct chilled dispatch to store / kitchen gate.
   - **Self Pick-up**: Direct collection from THEMOINMALIK DAIRY plant.
4. **Mobile App Experience**:
   - High-density 2-column mobile layout, bottom-sheet checkout modals, integrated header search, and 1-click WhatsApp order dispatch.
5. **Printable Commercial Challans**:
   - Instant printable invoices and delivery slips formatted for commercial logistics.

---

## 🚀 Live Demo & Deployment

- **GitHub Repository**: [https://github.com/zuhair4/THEMOINMALIK](https://github.com/zuhair4/THEMOINMALIK)
- **Hosted on GitHub Pages**: Automated via GitHub Actions on push to `main`.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite 8, Lucide Icons, Canvas Confetti
- **Styling**: Vanilla CSS Design System with responsive media queries
- **Backend / Database**: Google Apps Script & Google Sheets REST API
- **CI/CD**: GitHub Actions (`deploy.yml`)

---

## 📦 Local Development

```bash
# Clone the repository
git clone https://github.com/zuhair4/THEMOINMALIK.git

# Navigate into project directory
cd THEMOINMALIK

# Install dependencies
npm install

# Start local dev server
npm run dev

# Build production bundle
npm run build
```

---

## 📄 License
MIT License. Crafted for THEMOINMALIK DAIRY commercial operations.
