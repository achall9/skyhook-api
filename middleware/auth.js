import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { Users } from '../models';

dotenv.config();

const isAuthenticated = (req, res, next) => {
  const token = req.headers["x-access-token"] || req.headers.authorization;

  if(!token) return res.status(401).send("Access denied");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(400).send("Invalid Token")
  }
}

const generateToken = async (userEmail) => {
  try {
    const user = await Users.getUserByEmail(userEmail);
    if(!user) return null;

    const token = jwt.sign({
      id: user.user_id, 
      email: user.email, 
      createdOn: user.createdOn
    }, process.env.JWT_SECRET);
    return token;
  } catch(error) {
    return error;
  }
}

export default { 
  isAuthenticated,
  generateToken
};
