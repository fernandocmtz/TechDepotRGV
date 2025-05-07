import { Category, OrderData, Product } from "./types";

const url = import.meta.env.VITE_API_URL;

export function api_get_all_products() {
  return new Promise<Product[]>((resolve, reject) => {
    fetch(`${url}/api/products`, {
      method: "GET",
    })
      .then((res) => {
        if (res.ok) {
          resolve(res.json());
        } else {
          throw res;
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function api_get_filtered_products(filter) {
  return new Promise<Product[]>((resolve, reject) => {
    fetch(`${url}/api/products/filter`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filter),
    })
      .then((res) => {
        if (res.ok) {
          resolve(res.json());
        } else {
          throw res;
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function api_get_all_categories() {
  return new Promise<Category[]>((resolve, reject) => {
    fetch(`${url}/api/categories`, {
      method: "GET",
    })
      .then((res) => {
        if (res.ok) {
          resolve(res.json());
        } else {
          throw res;
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function api_post_order(orderData: OrderData) {
  return new Promise((resolve, reject) => {
    fetch(`${url}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })
      .then((res) => {
        if (res.ok) {
          resolve(res.json());
        } else {
          return res.json().then((errBody) => {
            throw new Error(errBody.error || "Request failed");
          });
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}
