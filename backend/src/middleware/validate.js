import { validationResult } from "express-validator";
import { body } from "express-validator";

export const registerValidation = [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ];

export function validateRequest(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  next();
}