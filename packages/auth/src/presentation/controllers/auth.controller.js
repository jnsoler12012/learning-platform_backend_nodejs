import { registerUser } from '../../application/use-cases/auth/registerUser.usecase.js';
import { loginUser } from '../../application/use-cases/auth/loginUser.usecase.js';

// POST /auth/register - registers a new user and returns a JWT
export async function register(req, res, next) {
  try {
    const result = await registerUser({
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

// POST /auth/login - authenticates a user and returns a JWT
export async function login(req, res, next) {
  try {
    const result = await loginUser({
      email: req.body.email,
      password: req.body.password,
    });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
