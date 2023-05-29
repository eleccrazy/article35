import client from '../database';
import { Blog, Tag, Comment, Like } from '@prisma/client';

// Custome typescript type for creating a new post
export type BlogData = {
  title: string;
  summary: string;
  content: string;
  image: string | null;
  links: string[];
  authorId: string;
};

// Custome type for updating a post
export type BlogUpdateData = {
  title?: string;
  summary?: string;
  content?: string;
  image?: string | null;
  link?: string;
  isApproved?: boolean;
  updatedAt?: Date;
};

// Custome type for relationship blog data
export type BlogRelationship = {
  id: string;
  title: string;
  summary: string;
  content: string;
  image: string | null;
  links: string[];
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  tags?: Tag[];
  comments?: Comment[];
  likes?: Like[];
};

// Define a class that represents a blog table
export class BlogStore {
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
  async getSingleBlog(id: string): Promise<BlogRelationship | null> {
    try {
      const blog = await client.blog.findUnique({
        where: { id: id },
        include: {
          likes: true,
          comments: true,
          tags: true
        }
      });
      return blog;
    } catch (error) {
      throw new Error(`Could not get a blog with id ${id}. Error: ${error}`);
    } finally {
      await client.$disconnect();
    }
  }

  // Create a blog
  async createBlog(blogData: BlogData): Promise<Blog> {
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
  async updateBlog(id: string, blogData: BlogUpdateData): Promise<Blog | null> {
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

  // Link tags to blog
  async linkTagsToBlog(
    blogId: string,
    tagIds: string[]
  ): Promise<BlogRelationship> {
    try {
      const blog = await client.blog.update({
        where: { id: blogId },
        data: {
          tags: {
            connect: tagIds.map((tagId) => ({ id: tagId }))
          }
        },
        include: {
          tags: true
        }
      });
      return blog;
    } catch (error) {
      throw new Error(`Could not link tags to blog. Error: ${error}`);
    } finally {
      await client.$disconnect();
    }
  }

  // Update array of links by appending a new link
  async updateLinks(blogId: string, link: string): Promise<Blog> {
    try {
      const blog = await client.blog.update({
        where: { id: blogId },
        data: {
          links: {
            push: link
          }
        }
      });
      return blog;
    } catch (error) {
      throw new Error(`Could not update links. Error: ${error}`);
    } finally {
      await client.$disconnect();
    }
  }
}
