
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";

// Supabase REST endpoint for the products table
const PRODUCTS_URL = SUPABASE_URL + "/rest/v1/products";

// Request headers (same for all requests)
const requestHeaders = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: "Bearer " + SUPABASE_ANON_KEY,
  "Content-Type": "application/json",
};

// Get all products (optional: filter by category)
export async function getProducts(category) {
  // Keep URL building simple and readable (student style)
  let url =
    PRODUCTS_URL +
    "?select=id,name,category,image_url,description,price,stock,is_offer,rating" +
    "&order=id.asc";

  if (category) {
    url += "&category=eq." + category;
  }

  const response = await fetch(url, {
    method: "GET",
    headers: requestHeaders,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products. Status: " + response.status);
  }

  const data = await response.json();
  return data;
}

// Get one product by id
export async function getProductById(id) {
  const url =
    PRODUCTS_URL +
    "?select=id,name,category,image_url,description,price,stock,is_offer,rating" +
    "&id=eq." +
    id +
    "&limit=1";

  const response = await fetch(url, {
    method: "GET",
    headers: requestHeaders,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch product. Status: " + response.status);
  }

  const data = await response.json();
  return data[0] || null;
}