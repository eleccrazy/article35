import { Comment } from '@prisma/client';
import client from '../database';

// Define a class that represents a comment table
export default class CommentStore {
  // Get all comments
  async getComments(): Promise<Comment[]> {
    try {
      const comments = await client.comment.findMany();
      return comments;
    } catch (error) {
      throw new Error(`Could not get all comments. Error: ${error}`);
    } finally {
      await client.$disconnect();
    }
  }

  // Get a single comment
  async getSingleComment(id: string): Promise<Comment | null> {
    try {
      const comment = await client.comment.findUnique({ where: { id: id } });
      return comment;
    } catch (error) {
      throw new Error(`Could not get a comment with id ${id}. Error: ${error}`);
    } finally {
      await client.$disconnect();
    }
  }

  // Create a comment
  async createComment(commentData: Comment): Promise<Comment> {
    try {
      const comment: Comment = await client.comment.create({
        data: commentData
      });
      return comment;
    } catch (error) {
      throw new Error(`Could not create a new comment. Error: ${error}`);
    } finally {
      await client.$disconnect();
    }
  }

  // Delete a comment
  async deleteComment(id: string): Promise<Comment | null> {
    try {
      const comment = await client.comment.delete({ where: { id: id } });
      return comment;
    } catch (error) {
      throw new Error(
        `Could not delete a comment with id ${id}. Error: ${error}`
      );
    } finally {
      await client.$disconnect();
    }
  }

  // Update a comment
  async updateComment(
    id: string,
    commentData: string
  ): Promise<Comment | null> {
    try {
      const comment = await client.comment.update({
        where: { id: id },
        data: { content: commentData }
      });
      return comment;
    } catch (error) {
      throw new Error(
        `Could not update a comment with id ${id}. Error: ${error}`
      );
    } finally {
      await client.$disconnect();
    }
  }
}
