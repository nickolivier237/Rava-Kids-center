import 'dotenv/config'; // Charge les variables d'environnement immédiatement
import { createClient } from "@supabase/supabase-js";

// Récupération des variables d'environnement
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Sécurité : Vérifier la présence des variables obligatoires
if (!supabaseUrl || !supabaseKey) {
  console.error("ERREUR CRITIQUE : SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY est manquante dans l'environnement !");
}

const supabase = createClient(
  supabaseUrl || "",
  supabaseKey || "",
  {
    global: {
      fetch: (...args) => fetch(...args),
    },
  }
);

const TABLE_NAME = "kv_store_35cfb8b9";

/**
 * Helper: ensure keys/values are valid
 */
function assertKey(key) {
  if (!key || typeof key !== "string") throw new Error("KV key must be a non-empty string");
}

/**
 * set: upsert a key with a JSON-serializable value
 */
export const set = async (key, value) => {
  try {
    assertKey(key);
    const row = { key, value, updated_at: new Date().toISOString() };
    const { error } = await supabase.from(TABLE_NAME).upsert(row, { onConflict: "key" });
    if (error) {
      console.error("KV Set Error:", error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error("KV Set Exception:", e.message);
    return false;
  }
};

/**
 * get: return the stored value (parsed JSON)
 */
export const get = async (key) => {
  try {
    assertKey(key);
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("value")
      .eq("key", key)
      .maybeSingle();

    if (error) {
      console.error("KV Get Error:", error.message);
      return null;
    }
    return data?.value ?? null;
  } catch (e) {
    console.error("KV Get Exception:", e.message);
    return null;
  }
};

/**
 * del: delete a key
 */
export const del = async (key) => {
  try {
    assertKey(key);
    const { error } = await supabase.from(TABLE_NAME).delete().eq("key", key);
    if (error) {
      console.error("KV Delete Error:", error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error("KV Delete Exception:", e.message);
    return false;
  }
};

/**
 * mset: set many keys at once
 */
export const mset = async (keys, values) => {
  try {
    if (!Array.isArray(keys) || !Array.isArray(values) || keys.length !== values.length)
      throw new Error("KV mset requires keys and values arrays of equal length");

    const rows = keys.map((k, i) => ({
      key: k,
      value: values[i],
      updated_at: new Date().toISOString(),
    }));
    const { error } = await supabase.from(TABLE_NAME).upsert(rows, { onConflict: "key" });
    if (error) {
      console.error("KV MSet Error:", error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error("KV MSet Exception:", e.message);
    return false;
  }
};

/**
 * mget: returns array of values in the same order as keys
 */
export const mget = async (keys) => {
  try {
    if (!Array.isArray(keys) || keys.length === 0) return [];
    const { data, error } = await supabase.from(TABLE_NAME).select("key, value").in("key", keys);
    if (error) {
      console.error("KV MGet Error:", error.message);
      return [];
    }
    const map = new Map((data ?? []).map((r) => [r.key, r.value]));
    return keys.map((k) => (map.has(k) ? map.get(k) : null));
  } catch (e) {
    console.error("KV MGet Exception:", e.message);
    return [];
  }
};

/**
 * mdel: delete many keys
 */
export const mdel = async (keys) => {
  try {
    if (!Array.isArray(keys) || keys.length === 0) return true;
    const { error } = await supabase.from(TABLE_NAME).delete().in("key", keys);
    if (error) {
      console.error("KV MDel Error:", error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error("KV MDel Exception:", e.message);
    return false;
  }
};

/**
 * getByPrefix: returns array of { key, value } for keys starting with prefix
 */
export const getByPrefix = async (prefix) => {
  try {
    if (typeof prefix !== "string") throw new Error("prefix must be a string");
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("key, value")
      .like("key", `${prefix}%`);

    if (error) {
      console.error("KV getByPrefix Error:", error.message);
      return [];
    }
    return (data ?? []).map((r) => ({ key: r.key, value: r.value }));
  } catch (e) {
    console.error("KV getByPrefix Exception:", e.message);
    return [];
  }
};
