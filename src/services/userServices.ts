import { UserStore } from '../models/user';
import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Create a new instance of the UserStore class.
const store = new UserStore();

// Get the salt rounds and the papper from the environment variables.
const papper = process.env.PAPPER as string;
const saltRounds = process.env.SALT_ROUNDS as string;

// Get all users from the database
export const getUsers = async () => {
  const users = await store.getUsers();
  return users;
};

// Get a single user by its id.
export const getUsersById = async (id: string) => {
  try {
    const user = await store.getSingleUser(id);
    return user;
  } catch (error) {
    return null;
  }
};

// Get a single user by its email.
export const getUserByEmail = async (email: string) => {
  try {
    const user = await store.findByEmail(email);
    return user;
  } catch (error) {
    return null;
  }
};

// Registe a new user
export const userSignUp = async (userData: any) => {
  try {
    // Check whether one of the required parameters are missed.
    if (!userData.email || !userData.password || !userData.firstName) {
      return { Error: 'email, firstName, and password must be provided' };
    }
    // Get all users from the database.
    const allUsers = await store.getUsers();
    // Get a user which was already registered with that email.
    const checkUser = allUsers.filter((u) => userData.email === u.email);
    // Check if the user exists
    if (checkUser.length) {
      return { Error: 'User with that email exists' };
    }
    // Check the length of the password.
    if (userData.password.length < 8) {
      return { Error: 'Password must be at least 8 characters long' };
    }

    // Hash the password.
    const passwordDigest = await bcrypt.hashSync(
      (userData.password as unknown as string) + papper,
      Number(saltRounds)
    );

    // Create a new user.
    const newUser: User = await store.createUser({
      password: passwordDigest,
      email: userData.email,
      firstName: userData.firstName,
      role: userData.role
    });

    // Create a token.
    let token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      String(process.env.JWT_SECRET)
    );
    return { token: token, user: newUser };
  } catch (error) {
    throw new Error(`Could not create a new user. Error: ${error}`);
  }
};

// Delete all Users
export const deleteAllUsers = async () => {
  try {
    const users = await store.getUsers();
    users.forEach(async (user) => {
      await store.deleteUser(user.id);
    });
    return { message: 'All users were deleted' };
  } catch (error) {
    throw new Error(`Could not delete all users. Error: ${error}`);
  }
};

// Login a user
export const userLogin = async (userData: any) => {
  try {
    // Vaidate login data.
    if (!userData.email || !userData.password) {
      return { Error: 'email and password must be provided' };
    }
    // Get a user by its email.
    const user = await store.findByEmail(userData.email);
    // Check if the user exists.
    if (!user) {
      return { Error: 'Invalid credentials' };
    }
    // Check if the password is correct.
    const checkPassword = await bcrypt.compare(
      userData.password + papper,
      user.password
    );
    if (!checkPassword) {
      return { Error: 'Invalid credentials' };
    } else {
      // Create a token.
      let token = jwt.sign(
        { id: user.id, email: user.email },
        String(process.env.JWT_SECRET)
      );
      return { token: token, user: user };
    }
  } catch (error) {
    throw new Error(`Could not login the user. Error: ${error}`);
  }
};

// Delete a user by its id.
export const deleteUser = async (id: string) => {
  try {
    // Check if the user exists before deleting it.
    const user = await store.getSingleUser(id);
    if (user === null) {
      return { Error: 'User with that id does not exist' };
    }
    // delete the user
    await store.deleteUser(id);
    return { Success: 'User deleted successfully' };
  } catch (error) {
    throw new Error(`Could not delete the user. Error: ${error}`);
  }
};

// Update a user by its id.
export const updateUser = async (id: string, userData: any) => {
  try {
    // Check if the user exists before updating it.
    const user = await store.getSingleUser(id);
    if (user === null) {
      return null;
    }
    // Update the user.
    const updatedUser = await store.updateUser(id, {
      ...userData,
      updatedAt: new Date()
    });
    return updatedUser;
  } catch (error) {
    throw new Error(`Could not update the user. Error: ${error}`);
  }
};
