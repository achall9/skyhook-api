import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/users';

dotenv.config();

const userResolver = {
  Query: {
    users: () => User.getAllUsers(),
    user: (_, {id}) => User.getUserById(id)
  },
  Mutation: {
    login: async (_, { email, password }) => {
      const user = await User.getUserByEmail(email);

      if(!user){
        throw new Error('No user found');
      }

      const valid = await bcrypt.compareSync(password, user.password);

      if(!valid){
        throw new Error('Invalid Credentials')
      }

      const token = jwt.sign({
        id: user.user_id, 
        email: user.email, 
        createdOn: user.createdOn
      }, process.env.JWT_SECRET);
      return token;
    }
  }
}

export default userResolver;
