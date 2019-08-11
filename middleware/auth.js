import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

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

const generateToken = async (user) => {
  if(!user) return null;

  const token = jwt.sign({
    id: user.user_id, 
    email: user.email, 
    createdOn: user.createdOn
  }, process.env.JWT_SECRET);
  return token;
}

export default { 
  isAuthenticated,
  generateToken
};
