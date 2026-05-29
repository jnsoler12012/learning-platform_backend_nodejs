import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { validate, required, isEmail, minLength } from '../middlewares/validate.middleware.js';

const router = Router();

// Validation schema for registration: email must be valid, password at least 6 chars
const registerSchema = {
  email: [required, isEmail],
  password: [required, minLength(6)],
};

// Validation schema for login: email and password are required
const loginSchema = {
  email: [required, isEmail],
  password: [required],
};

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

export default router;
