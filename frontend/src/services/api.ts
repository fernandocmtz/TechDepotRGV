import {
  Category,
  FetchedAddress,
  FetchedUser,
  OrderData,
  PatchUser,
  Product,
  PostPutAddress,
  FetchOrderItems,
  PostReturn,
  PostProduct,
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

export function api_post_order(orderData: OrderData, accessToken: string) {
  return new Promise((resolve, reject) => {
    fetch(`${url}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
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

export function api_get_active_user(accessToken: string) {
  return new Promise<FetchedUser>((resolve, reject) => {
    fetch(`${url}/api/users/active`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
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

export function api_patch_active_user(
  userData: PatchUser,
  accessToken: string
) {
  return new Promise<FetchedUser>((resolve, reject) => {
    fetch(`${url}/api/users/active`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(userData),
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

export function api_get_active_user_addresses(accessToken: string) {
  return new Promise<FetchedAddress[]>((resolve, reject) => {
    fetch(`${url}/api/address/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
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

export function api_post_active_user_address(
  addressData: PostPutAddress,
  accessToken: string
) {
  return new Promise<{ message: string; address: FetchedAddress }>(
    (resolve, reject) => {
      fetch(`${url}/api/address/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(addressData),
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
    }
  );
}

export function api_put_active_user_address_by_id(
  addressId: number,
  addressData: PostPutAddress,
  accessToken: string
) {
  return new Promise<{ message: string; address: FetchedAddress }>(
    (resolve, reject) => {
      fetch(`${url}/api/address/${addressId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(addressData),
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
    }
  );
}

export function api_get_active_user_order_items(accessToken: string) {
  return new Promise<FetchOrderItems>((resolve, reject) => {
    fetch(`${url}/api/order-items/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
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

export function api_post_return(accessToken: string, returnData: PostReturn) {
  return new Promise((resolve, reject) => {
    fetch(`${url}/api/returns/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(returnData),
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

export function api_post_product(
  accessToken: string,
  productData: PostProduct
) {
  return new Promise((resolve, reject) => {
    fetch(`${url}/api/products/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(productData),
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
