import { body } from 'express-validator';

const validateProduct = [
  body('name')
    .notEmpty()
    .withMessage('Name is required'),

  body('price')
    .isFloat({ gt: 0 })
    .withMessage('Price must be a positive number'),

  body('category_id')
    .isInt()
    .withMessage('Category ID must be an integer'),
];

export default validateProduct;
