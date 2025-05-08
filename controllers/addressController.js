import { Address } from "../models/addressModel.js";

//  Get all addresses for current user
export const getUserAddresses = async (req, res) => {
  try {
    const addresses = await Address.findAll({
      where: { user_id: req.user.id },
    });
    res.json(addresses);
  } catch (err) {
    console.error("Error fetching addresses:", err.message);
    res.status(500).json({ message: "Failed to fetch addresses" });
  }
};

export const createAddress = async (req, res) => {
  try {
    const {
      address_line_1,
      address_line_2,
      city,
      state,
      postal_code,
      country,
    } = req.body;

    if (!address_line_1 || !city || !state || !postal_code || !country) {
      return res
        .status(400)
        .json({ message: "Missing required address fields." });
    }

    const newAddress = await Address.create({
      user_id: req.user.id,
      address_line_1,
      address_line_2,
      city,
      state,
      postal_code,
      country,
    });

    res.status(201).json(newAddress);
  } catch (error) {
    console.error("Error creating address:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const utilfindOrCreateAddress = async (addressData) => {
  const [address] = await Address.findOrCreate({
    where: {
      address_line_1: addressData.address_line_1,
      address_line_2: addressData.address_line_2 || null,
      city: addressData.city,
      state: addressData.state,
      postal_code: addressData.postal_code,
      country: addressData.country,
      user_id: addressData.user_id,
    },
    defaults: addressData,
  });

  return address;
};

//  Update an address
export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { address_line1, address_line2, city, state, postal_code, country } =
      req.body;

    const address = await Address.findOne({
      where: { address_id: id, user_id: req.user.id },
    });

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    await address.update({
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country,
    });

    res.json({ message: "Address updated", address });
  } catch (err) {
    console.error("Error updating address:", err.message);
    res.status(500).json({ message: "Failed to update address" });
  }
};

//  Delete an address
export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Address.destroy({
      where: { address_id: id, user_id: req.user.id },
    });

    if (!deleted) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.json({ message: "Address deleted" });
  } catch (err) {
    console.error("Error deleting address:", err.message);
    res.status(500).json({ message: "Failed to delete address" });
  }
};
