import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { serve } from "@hono/node-server";
import * as kv from "./kv_store.js";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import crypto from "crypto";

// 1. Configuration initiale
dotenv.config();
const app = new Hono();

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// ✅ Vérification des clés au démarrage
console.log("--- VÉRIFICATION CONFIGURATION ---");
console.log("URL Supabase:", SUPABASE_URL);
console.log("Clé (début):", SUPABASE_SERVICE_ROLE_KEY.substring(0, 15) + "...");
console.log("----------------------------------");

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ ERREUR: Variables d'environnement manquantes dans le fichier .env");
  // Sur Render, on ne coupe pas forcément le process pour permettre de corriger les variables via l'interface
}

// 2. Client Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: { fetch: (...args) => fetch(...args) },
});

// 3. Middlewares
app.use("*", logger());
app.use("/*", cors({
  origin: "*", // 💡 On pourra restreindre à l'URL Vercel plus tard pour la sécurité
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
}));

// 4. Initialisation du Storage
const BUCKET_NAME = "make-35cfb8b9-product-images";

async function initializeBucket() {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = Array.isArray(buckets) && buckets.some((b) => b.name === BUCKET_NAME);
    if (!bucketExists) {
      await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: 20 * 1024 * 1024 // 20 Mo
      });
      console.log(`✅ Bucket '${BUCKET_NAME}' créé`);
    } else {
      console.log(`✅ Bucket '${BUCKET_NAME}' prêt`);
    }
  } catch (e) {
    console.error("❌ Erreur Initialisation Storage:", e.message);
  }
}
initializeBucket();

// Helper: Vérification Admin
async function verifyAdmin(c) {
  const authHeader = c.req.header("Authorization");
  if (!authHeader) return null;
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return null;
    const adminId = await kv.get("admin_user");
    return (user.id === adminId) ? user : null;
  } catch (e) {
    return null;
  }
}

// ========== ROUTES ADMIN ==========
app.get("/admin/check", async (c) => {
  const adminId = await kv.get("admin_user");
  return c.json({ exists: !!adminId });
});

app.post("/admin/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    const existingAdmin = await kv.get("admin_user");
    if (existingAdmin) return c.json({ error: "Admin already exists" }, 400);

    const { data, error } = await supabase.auth.admin.createUser({
      email, password, user_metadata: { name, role: "admin" }, email_confirm: true
    });

    if (error) return c.json({ error: error.message }, 400);
    await kv.set("admin_user", data.user.id);
    return c.json({ message: "Admin created", user: data.user });
  } catch (e) {
    return c.json({ error: "Server error" }, 500);
  }
});

app.post("/admin/login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return c.json({ error: "Invalid credentials" }, 401);
    return c.json({ access_token: data.session.access_token, user: data.user });
  } catch (e) {
    return c.json({ error: "Login failed" }, 500);
  }
});

// ========== ROUTES PRODUITS ==========
app.get("/products", async (c) => {
  const rows = await kv.getByPrefix("product:");
  const products = rows.map(r => r.value);
  const sorted = products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return c.json({ products: sorted });
});

app.post("/products", async (c) => {
  const user = await verifyAdmin(c);
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const productData = await c.req.json();
  const id = crypto.randomUUID();
  const product = { ...productData, id, createdAt: new Date().toISOString() };

  await kv.set(`product:${id}`, product);
  return c.json({ product });
});

app.put("/products/:id", async (c) => {
  const user = await verifyAdmin(c);
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const id = c.req.param("id");
  const updates = await c.req.json();
  const existing = await kv.get(`product:${id}`);
  if (!existing) return c.json({ error: "Product not found" }, 404);

  const updatedProduct = { ...existing, ...updates, id };
  await kv.set(`product:${id}`, updatedProduct);
  return c.json({ product: updatedProduct });
});

app.delete("/products/:id", async (c) => {
  const user = await verifyAdmin(c);
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const id = c.req.param("id");
  await kv.del(`product:${id}`);
  return c.json({ success: true });
});

// ========== ROUTE UPLOAD IMAGE ==========
app.post("/upload-image", async (c) => {
  const user = await verifyAdmin(c);
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  try {
    const formData = await c.req.formData();
    const file = formData.get("file");
    if (!file) return c.json({ error: "Aucun fichier reçu" }, 400);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = `${Date.now()}-${file.name || "upload.jpg"}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, buffer, {
        upsert: true,
        contentType: file.type || "image/jpeg",
        duplex: "half",
        metadata: { owner: user.id }
      });

    if (error) return c.json({ error: error.message }, 500);

    const { data: publicData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);
    return c.json({ url: publicData.publicUrl });
  } catch (e) {
    return c.json({ error: "Erreur interne lors de l'upload" }, 500);
  }
});

// ========== DÉMARRAGE DU SERVEUR (ADAPTÉ POUR RENDER) ==========

// Render fournit automatiquement la variable PORT
const port = Number(process.env.PORT) || 3000;

serve({
  fetch: app.fetch,
  port: port,
  hostname: '0.0.0.0' // Obligatoire sur Render pour l'accès externe
}, (info) => {
  console.log(`🚀 Serveur actif sur le port ${info.port}`);
});




