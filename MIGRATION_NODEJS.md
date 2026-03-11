# Rava Kids Center - Migration to Node.js Backend

## What Changed

Your backend has been migrated from **Deno** to **Node.js with Express/Hono and Nodemon**. This provides:

✅ Better compatibility and support  
✅ Easier debugging with nodemon auto-reload  
✅ Standard Node.js ecosystem  
✅ Simplified deployment  
✅ Same Supabase functionality

---

## Quick Start

### Option 1: Using Batch File (Windows - Easiest)

Double-click `start-server.bat` in the root directory. It will automatically:

- Navigate to the server folder
- Install dependencies (first time only)
- Start the server with nodemon

### Option 2: Using PowerShell (Windows)

```powershell
# Run this command:
.\start-server.ps1
```

### Option 3: Manual Setup (All Platforms)

1. **Open Terminal** and navigate to the server directory:

```bash
cd supabase/functions/server
```

2. **Install dependencies** (first time only):

```bash
npm install
```

3. **Configure Supabase credentials**:
   - Edit `.env` file in `supabase/functions/server/`
   - Add your Supabase credentials:

```
SUPABASE_URL=your_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key
PORT=3000
```

4. **Start the server**:

```bash
npm run dev
```

The server will start at `http://localhost:3000`

---

## How to Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - `Project URL` → `SUPABASE_URL`
   - `Service Role Key` → `SUPABASE_SERVICE_ROLE_KEY`
   - `Anon Public Key` → `SUPABASE_ANON_KEY`

---

## File Structure

```
supabase/functions/server/
├── index.js              # Main server file (Node.js version)
├── kv_store.js           # Database helper (Node.js version)
├── package.json          # Dependencies
├── nodemon.json          # Auto-reload config
├── .env                  # Your Supabase credentials (private)
├── .env.example          # Template for .env
└── README.md             # Detailed documentation
```

---

## Key Differences from Deno

| Feature      | Deno             | Node.js                  |
| ------------ | ---------------- | ------------------------ |
| Imports      | `npm:package`    | `package`                |
| Environment  | `Deno.env.get()` | `process.env`            |
| Server Start | `Deno.serve()`   | `serve()` from hono/node |
| File Types   | `.tsx`           | `.js`                    |
| Auto-reload  | Manual restart   | Nodemon (automatic)      |

---

## Troubleshooting

### Admin Creation Fails

**Problem**: Getting "Failed to fetch" when creating an admin profile

**Solutions**:

1. **Verify server is running**:
   - Check if you see "Server starting on http://localhost:3000" in the terminal
   - If not, run `npm run dev` in the server directory

2. **Check Supabase credentials**:

   ```bash
   # Open .env file and verify:
   # ✓ SUPABASE_URL has value
   # ✓ SUPABASE_SERVICE_ROLE_KEY has value
   # ✓ SUPABASE_ANON_KEY has value
   ```

3. **Check browser console** (F12):
   - Look for specific error messages
   - Common issues:
     - `CORS error` → Server not running
     - `Unauthorized` → Invalid Supabase credentials
     - `Connection refused` → Server not accessible

4. **Check server logs**:
   - Look at the terminal where `npm run dev` is running
   - Server errors will appear there

5. **Verify port not in use**:
   ```bash
   # If port 3000 is busy, change it:
   # Edit .env: PORT=3001
   # Also update root .env.local: VITE_API_URL=http://localhost:3001
   ```

### Server Won't Start

**Check Node.js version**:

```bash
node --version
# Should be v18 or higher
```

**Install dependencies**:

```bash
cd supabase/functions/server
npm install
```

**Clear cache**:

```bash
rm -r node_modules package-lock.json
npm install
```

### Port 3000 Already in Use

Change the port in `supabase/functions/server/.env`:

```
PORT=3001
```

And update the API URL in `.env.local` (root directory):

```
VITE_API_URL=http://localhost:3001
```

---

## Development Workflow

1. **Keep server running** in one terminal:

```bash
cd supabase/functions/server
npm run dev
```

2. **Run frontend** in another terminal:

```bash
npm run dev
```

3. **Nodemon will auto-reload** when you edit `index.js` or `kv_store.js`

4. **Browser auto-refresh** when you edit React components

---

## Running in Production

When deploying to production:

1. Change `NODE_ENV=production` in `.env`

2. Start without nodemon:

```bash
npm start
```

3. Set proper environment variables on the hosting platform (Heroku, Railway, Vercel, etc.)

---

## Database & Storage

All data is stored in **Supabase**:

- **Products**: `kv_store_35cfb8b9` table
- **Admin User ID**: `kv_store_35cfb8b9` table
- **Product Images**: Supabase Storage bucket

No local database needed!

---

## Testing the API

Test if the server is working:

```bash
# Health check
curl http://localhost:3000/make-server-35cfb8b9/health

# Should return:
# {"status":"ok"}
```

---

## Need Help?

1. Check the **console output** when starting the server
2. Look at **browser console** (F12 → Console tab)
3. Check **Network tab** in browser dev tools → Click failed request for details
4. Review logs in the terminal running `npm run dev`

The most common issue is **wrong Supabase credentials in .env** - double-check those first!

---

## Next Steps

✅ Start the server with `start-server.bat` or `npm run dev`  
✅ Add your Supabase credentials to `.env`  
✅ Create an admin account in the dashboard  
✅ Start managing products!
