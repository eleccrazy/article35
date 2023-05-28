import { Tag } from '@prisma/client';
import client from '../database';

// Define a class that represents a  tags table in the database
export class TagStore {
  // Get all tags
  async getTags(): Promise<Tag[]> {
    try {
      const tags = await client.tag.findMany();
      return tags;
    } catch (error) {
      throw new Error(`Could not get all tags. Error: ${error}`);
    } finally {
      await client.$disconnect();
    }
  }

  // Get a single tag by its id.
  async getSingleTag(id: string): Promise<Tag | null> {
    try {
      const tag = await client.tag.findUnique({
        where: { id: id }
      });
      return tag;
    } catch (error) {
      throw new Error(`Could not get a tag with id ${id}. Error: ${error}`);
    } finally {
      await client.$disconnect();
    }
  }

  // Create a new Tag.
  async createTag(name: string): Promise<Tag> {
    try {
      const tag: Tag = await client.tag.create({
        data: { name: name }
      });
      return tag;
    } catch (error) {
      throw new Error(`Could not create a new tag. Error: ${error}`);
    } finally {
      await client.$disconnect();
    }
  }

  // Delete a tag by its id.
  async deleteTag(id: string): Promise<Tag | null> {
    try {
      const tag = await client.tag.delete({
        where: { id: id }
      });
      return tag;
    } catch (error) {
      throw new Error(`Could not get a tag with id ${id}. Error: ${error}`);
    } finally {
      await client.$disconnect();
    }
  }

  // Update a tag by its id.
  async updateTag(id: string, name: string): Promise<Tag | null> {
    try {
      const tag = await client.tag.update({
        where: { id: id },
        data: { name: name }
      });
      return tag;
    } catch (error) {
      throw new Error(`Could not get a tag with id ${id}. Error: ${error}`);
    } finally {
      await client.$disconnect();
    }
  }
}
