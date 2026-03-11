# Rava Kids Center - Node.js Backend Setup

This is the Node.js version of the backend server, replacing the previous Deno setup.

## Prerequisites

- Node.js v18 or higher installed
- npm or yarn package manager

## Setup Instructions

### 1. Configure Environment Variables

Navigate to the server directory and set up your environment:

```bash
cd supabase/functions/server
```

Copy the `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key
PORT=3000
NODE_ENV=development
```

You can find these credentials in your Supabase Project Settings > API keys.

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Server with Nodemon

For development with auto-reload on file changes:

```bash
npm run dev
```

Or use the alternative dev command:

```bash
npm run dev:watch
```

For production:

```bash
npm start
```

The server will start on `http://localhost:3000`

## Frontend Configuration

The frontend is already configured to use `http://localhost:3000` for API calls when running in development mode.

If you need to change the API URL, edit the `.env.local` file in the root directory:

```
VITE_API_URL=http://localhost:3000
```

## Available Endpoints

### Health Check

- `GET /make-server-35cfb8b9/health`

### Admin Authentication

- `POST /make-server-35cfb8b9/admin/signup` - Create admin account
- `POST /make-server-35cfb8b8/admin/login` - Login admin
- `GET /make-server-35cfb8b9/admin/check` - Check if admin exists

### Products (CRUD)

- `GET /make-server-35cfb8b9/products` - Get all products
- `GET /make-server-35cfb8b9/products/:id` - Get single product
- `POST /make-server-35cfb8b9/products` - Create product (admin only)
- `PUT /make-server-35cfb8b9/products/:id` - Update product (admin only)
- `DELETE /make-server-35cfb8b9/products/:id` - Delete product (admin only)

### Storage

- `POST /make-server-35cfb8b9/upload-image` - Upload image to Supabase Storage (admin only)

## Troubleshooting

### Admin Creation Fails to Fetch

If you're getting fetch errors when creating an admin:

1. **Check the server is running**: Make sure `npm run dev` is running in the server directory
2. **Check CORS**: The server has CORS enabled for all origins, but verify `http://localhost:3000` is accessible
3. **Check Supabase credentials**: Ensure your `.env` file has the correct SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
4. **Check the console**: Look at the browser console and server logs for detailed error messages
5. **Network tab**: Check the browser's Network tab to see the actual request/response

### Port Already in Use

If port 3000 is already in use, change it in `.env`:

```
PORT=3001
```

And update `.env.local` in the root:

```
VITE_API_URL=http://localhost:3001
```

## Differences from Deno Version

- Import syntax changed from `import "npm:..."` to standard npm imports
- Environment variables changed from `Deno.env.get()` to `process.env`
- Server startup changed from `Deno.serve()` to Hono's built-in server
- File extensions changed from `.tsx` to `.js` for non-React files
- Added `dotenv` for environment variable loading

## Database

This server uses Supabase as the backend database:

- **Auth**: Supabase Authentication for admin users
- **KV Store**: `kv_store_35cfb8b9` table for storing products and data
- **Storage**: Supabase Storage for product images

All data is stored in your Supabase project, so no local database is needed.
