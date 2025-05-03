import {
  Product
} from "./types";

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
