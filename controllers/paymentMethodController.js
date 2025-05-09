import { PaymentMethod } from '../models/paymentMethodModel.js';

// ✅ Create a new payment method
export const addPaymentMethod = async (req, res) => {
  try {
    const { cardholder_name, card_last4, expiration_date, brand } = req.body;

    const newMethod = await PaymentMethod.create({
      user_id: req.user.id, // comes from auth middleware
      cardholder_name,
      card_last4,
      expiration_date,
      brand
    });

    res.status(201).json(newMethod);
  } catch (err) {
    console.error('Error creating payment method:', err.message);
    res.status(500).json({ message: 'Failed to create payment method' });
  }
};

// ✅ Get all payment methods for current user
export const getUserPaymentMethods = async (req, res) => {
  try {
    const methods = await PaymentMethod.findAll({
      where: { user_id: req.user.id }
    });

    res.json(methods);
  } catch (err) {
    console.error('Error fetching payment methods:', err.message);
    res.status(500).json({ message: 'Failed to fetch payment methods' });
  }
};

// ✅ Update an existing payment method
export const updatePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const { cardholder_name, expiration_date, brand } = req.body;

    const method = await PaymentMethod.findOne({
      where: { method_id: id, user_id: req.user.id }
    });

    if (!method) {
      return res.status(404).json({ message: 'Payment method not found' });
    }

    await method.update({ cardholder_name, expiration_date, brand });

    res.json({ message: 'Payment method updated', method });
  } catch (err) {
    console.error('Error updating payment method:', err.message);
    res.status(500).json({ message: 'Failed to update payment method' });
  }
};

// ✅ Delete a payment method
export const deletePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await PaymentMethod.destroy({
      where: { method_id: id, user_id: req.user.id }
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Payment method not found' });
    }

    res.json({ message: 'Payment method deleted' });
  } catch (err) {
    console.error('Error deleting payment method:', err.message);
    res.status(500).json({ message: 'Failed to delete payment method' });
  }
};
