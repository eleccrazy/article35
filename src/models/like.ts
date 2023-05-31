import { Like } from '@prisma/client';
import client from '../database';

// Define a custome type for the creating a like
export type CreateLike = {
  userId: string;
  blogId: string;
};

// Define a class that represents a like table
export default class LikeStore {
  // Create a like in the database
  async createLike(likeData: CreateLike): Promise<Like> {
    try {
      const like: Like = await client.like.create({
        data: likeData
      });
      return like;
    } catch (error) {
      throw new Error(`Could not create a new like. Error: ${error}`);
    } finally {
      await client.$disconnect();
    }
  }

  // Delete a like from the database based on its id
  async deleteLike(id: string): Promise<Like> {
    try {
      const like: Like = await client.like.delete({
        where: { id: id }
      });
      return like;
    } catch (error) {
      throw new Error(`Could not delete like ${id}. Error: ${error}`);
    } finally {
      await client.$disconnect();
    }
  }
}
