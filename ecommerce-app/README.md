# ElevateShop - Modern MERN Stack E-Commerce Web Application

ElevateShop is a premium, secure, and responsive MERN stack storefront featuring automated catalog inventories, price range category selectors, shopping cart persistent states, secure payment checkout processing, reviews posting metrics, and visual administrator analytics dashboards utilizing custom-built SVG charts.

---

## Technical Highlights

- **Stripe-like Payment Processing**: Secure checkout panel validating mock credentials and capturing transaction IDs.
- **Inventory Stock Protection**: Transactional checks verify product inventories before placing orders, decrementing quantities on purchase success and raising low-stock/out-of-stock warning badges.
- **SVG Analytics Dashboard**: Pure CSS/SVG-compiled glowing daily sales line charts and categorical inventory bar charts—rendering complex metrics instantly without heavy external libraries.
- **Reviews & Ratings recycles**: User comments post forms that automatically recalculate products' average star rating scales.
- **Persistent Cart Caching**: Local storage cart state caches shopping baskets across browser sessions.
- **Secure Administrator Gates**: Role-restricted middlewares (`isAdmin` check) gating administrative products CRUD and financial statistics queries.

---

## Directory Structure

This E-Commerce repository isolates backend and frontend resources at its root:
```text
.
├── backend\
│   ├── config\db.js           # Database Mongoose helper
│   ├── middleware\auth.js     # JWT token decoding & admin role gate guards
│   ├── models\                # Mongoose User, Product, and Order schemas
│   ├── routes\                # REST API endpoints (auth, products, orders, admin stats)
│   ├── .env                   # DB links, JWT secrets, and PORT=7000 mapping
│   ├── package.json           # Server package lists
│   └── server.js              # Express server startup entry
│
└── frontend\
    ├── index.html             # HTML entry & SEO headers
    ├── tailwind.config.js     # Brand colors & typography definitions
    ├── postcss.config.js      # PostCSS bundler mappings
    ├── package.json           # Client packages and build scripts
    └── src\
        ├── main.jsx           # App mounting initiator
        ├── index.css          # base styles, glass blocks, scrollbars
        ├── App.jsx            # Router and Protected / Admin route guards
        ├── context\           # Auth and Cart providers
        ├── components\        # Navbar, Footer, Product Card, SVG Charts, step tracker
        └── pages\             # Catalog, Product Detail, Cart checkout, dashboards
```

---

## Local Startup Instructions

### Step 1: Start Backend (Port 7000)
1. Ensure your local MongoDB community instance is running on `mongodb://localhost:27017` (database `ecommerce-app` will be created automatically).
2. Open a terminal and start the server:
   ```bash
   cd backend
   npm run dev
   ```
   *Output logs:*
   `MongoDB Connected (E-Commerce): 127.0.0.1`  
   `E-Commerce application server is running on port 7000`

### Step 2: Start Frontend (Port 5173)
1. Open another terminal and start the Vite dev bundle:
   ```bash
   cd frontend
   npm run dev
   ```
   *Output logs:*
   `➜  Local:   http://localhost:5173/`

### Step 3: Run E2E Checkout & Admin
1. Open `http://localhost:5173` in your browser.
2. Sign up with the email **`admin@ecommerce.com`** to automatically grant yourself **Administrator** status.
3. Access `/admin` in the header nav to view your sales graphs, and fill in the "Add Catalog Item" form to add products (e.g. Laptop, price $999, stock 5, category Electronics).
4. Go back to the homepage storefront catalog, search or filter by Electronics, select your laptop, adjust quantities, add it to your shopping cart, and complete checkout.
5. Watch the product's inventory stock decrement instantly, your User Dashboard show order track progress, and the Admin charts compute and update your sales analytics immediately!
