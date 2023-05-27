import { User } from '@prisma/client';
import client from '../database';
import { Role } from '@prisma/client';
import { Blog } from '@prisma/client';
import { Comment } from '@prisma/client';
import { Like } from '@prisma/client';
import { Project } from '@prisma/client';
import { Event } from '@prisma/client';

// Custome type for signup data
export type SignUpData = {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  bio?: string;
  phone?: string;
  role?: Role;
};

// Custome type for login data
export type LoginData = {
  email: string;
  password: string;
};

// Custome type for user update data
export type UserUpdateData = {
  phone?: string;
  lastName?: string;
  bio?: string;
};

// Custome type for relationship user data
export type UserRelationship = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  password: string;
  bio: string | null;
  phone: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  blogs: Blog[];
  comments: Comment[];
  likes: Like[];
  projects: Project[];
  events: Event[];
};

// Define a class that represents a  users table in the database
export class UserStore {
  // Get all users
  async getUsers(): Promise<User[]> {
    try {
      const users = await client.user.findMany({ include: { blogs: true } });
      return users;
    } catch (error) {
      throw new Error(`Could not get all users. Error: ${error}`);
    } finally {
      await client.$disconnect();
    }
  }

  // Get a single user by its id.
  async getSingleUser(id: string): Promise<UserRelationship | null> {
    try {
      const user = await client.user.findUnique({
        where: { id: id },
        include: {
          blogs: true,
          comments: true,
          likes: true,
          projects: true,
          events: true
        }
      });
      return user;
    } catch (error) {
      throw new Error(`Could not get a user with id ${id}. Error: ${error}`);
    } finally {
      await client.$disconnect();
    }
  }

  // Create a new User.
  async createUser(userData: SignUpData): Promise<User> {
    try {
      const user: User = await client.user.create({
        data: userData
      });
      return user;
    } catch (error) {
      throw new Error(`Could not create a new user. Error: ${error}`);
    } finally {
      await client.$disconnect();
    }
  }

  // Delete a user by its id.
  async deleteUser(id: string): Promise<User | null> {
    try {
      const user = await client.user.delete({
        where: { id: id }
      });
      return user;
    } catch (error) {
      throw new Error(`Could not get a user with id ${id}. Error: ${error}`);
    } finally {
      await client.$disconnect();
    }
  }
  // Find user by email
  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await client.user.findUnique({
        where: { email: email }
      });
      return user;
    } catch (error) {
      throw new Error(
        `Could not get a user with email ${email}. Error: ${error}`
      );
    } finally {
      await client.$disconnect();
    }
  }

  // Update user
  async updateUser(id: string, data: UserUpdateData): Promise<User | null> {
    try {
      const user = await client.user.update({
        where: { id: id },
        data: data
      });
      return user;
    } catch (error) {
      throw new Error(`Could not update a user. Error: ${error}`);
    } finally {
      await client.$disconnect();
    }
  }
}
