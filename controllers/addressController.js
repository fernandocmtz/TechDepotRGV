import { Address } from "../models/addressModel.js";

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
    },
    defaults: addressData,
  });

  return address;
};
