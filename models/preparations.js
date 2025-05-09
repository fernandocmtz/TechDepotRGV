import { Payment } from "./paymentModel.js";
import { encrypt, decrypt } from "../utils/encrypt.js";

export const prepareModels = () => {
  Payment.beforeCreate((payment) => {
    const { iv, data } = encrypt(payment.card_number);
    payment.card_number = data;
    payment.card_iv = iv;

    const encCvv = encrypt(payment.card_cvv);
    payment.card_cvv = encCvv.data;
  });

  // Decrypt on demand
  Payment.prototype.getDecryptedCardNumber = function () {
    return decrypt(this.card_number, this.card_iv);
  };
};
