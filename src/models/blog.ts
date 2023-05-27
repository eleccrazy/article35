import client from '../database';
import { Blog } from '@prisma/client';

// Define a class that represents a blog table
export default class BlogStore {
  // Get all blogs
  async getBlogs(): Promise<Blog[]> {
    try {
      const blogs = await client.blog.findMany();
      return blogs;
    } catch (error) {
      throw new Error(`Could not get all blogs. Error: ${error}`);
    } finally {
      await client.$disconnect();
    }
  }

  // Get a single blog
  async getSingleBlog(id: string): Promise<Blog | null> {
    try {
      const blog = await client.blog.findUnique({ where: { id: id } });
      return blog;
    } catch (error) {
      throw new Error(`Could not get a blog with id ${id}. Error: ${error}`);
    } finally {
      await client.$disconnect();
    }
  }

  // Create a blog
  async createBlog(blogData: Blog): Promise<Blog> {
    try {
      const blog: Blog = await client.blog.create({
        data: blogData
      });
      return blog;
    } catch (error) {
      throw new Error(`Could not create a new user. Error: ${error}`);
    } finally {
      await client.$disconnect();
    }
  }

  // Delete a blog
  async deleteBlog(id: string): Promise<Blog | null> {
    try {
      const blog = await client.blog.delete({ where: { id: id } });
      return blog;
    } catch (error) {
      throw new Error(`Could not delete a blog with id ${id}. Error: ${error}`);
    } finally {
      await client.$disconnect();
    }
  }

  // Update a blog
  async updateBlog(id: string, blogData: Blog): Promise<Blog | null> {
    try {
      const blog = await client.blog.update({
        where: { id: id },
        data: blogData
      });
      return blog;
    } catch (error) {
      throw new Error(`Could not update a blog with id ${id}. Error: ${error}`);
    } finally {
      await client.$disconnect();
    }
  }

  // Get all approved blogs
  async getApprovedBlogs(): Promise<Blog[]> {
    try {
      const blogs = await client.blog.findMany({
        where: { isApproved: true }
      });
      return blogs;
    } catch (error) {
      throw new Error(`Could not get all approved blogs. Error: ${error}`);
    } finally {
      await client.$disconnect();
    }
  }

  // Get pending blogs
  async getPendingBlogs(): Promise<Blog[]> {
    try {
      const blogs = await client.blog.findMany({
        where: { isApproved: false }
      });
      return blogs;
    } catch (error) {
      throw new Error(`Could not get all pending blogs. Error: ${error}`);
    } finally {
      await client.$disconnect();
    }
  }
}
