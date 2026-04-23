# Fliplyn Admin Backend

Backend API for Fliplyn Admin Dashboard connected to PostgreSQL Neon Database.

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Database Setup

- Open your Neon database console
- Run the SQL commands from `schema.sql` to create all required tables
- Or use psql:

```bash
psql postgresql://neondb_owner:npg_P8FCVkdp4Rbs@ep-lively-voice-a4auloou-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require < schema.sql
```

### 3. Start the Server

```bash
npm start
# or for development with auto-reload:
npm run dev
```

The server will run on `http://localhost:5000`

## API Endpoints

### Test Connection

- **GET** `/api/test` - Test database connection

### Vendors

- **GET** `/api/vendors` - Get all vendors
- **POST** `/api/vendors` - Create vendor
- **PUT** `/api/vendors/:id` - Update vendor
- **DELETE** `/api/vendors/:id` - Delete vendor

### Outlets

- **GET** `/api/outlets` - Get all outlets
- **POST** `/api/outlets` - Create outlet
- **PUT** `/api/outlets/:id` - Update outlet
- **DELETE** `/api/outlets/:id` - Delete outlet

### Items

- **GET** `/api/items` - Get all items
- **POST** `/api/items` - Create item
- **PUT** `/api/items/:id` - Update item
- **DELETE** `/api/items/:id` - Delete item

### Wallets

- **GET** `/api/wallets` - Get all wallets
- **POST** `/api/wallets` - Create wallet
- **PUT** `/api/wallets/:id` - Update wallet
- **DELETE** `/api/wallets/:id` - Delete wallet

## Environment Variables

The `.env` file contains:

- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)

## Frontend Integration

Update your frontend API calls to use: `http://localhost:5000/api/`

Example:

```javascript
// Fetch vendors
fetch("http://localhost:5000/api/vendors")
  .then((res) => res.json())
  .then((data) => console.log(data));
```
