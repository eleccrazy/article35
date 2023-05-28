import { TagStore } from '../models/tag';

// Create a new instance of the TagStore class
const tagStore = new TagStore();

// Get all tags from the database
export const getTags = async () => {
  try {
    const tags = await tagStore.getTags();
    return tags;
  } catch (error) {
    return null;
  }
};

// Get a single tag by its id.
export const getSingleTag = async (id: string) => {
  try {
    const tag = await tagStore.getSingleTag(id);
    return tag;
  } catch (error) {
    return null;
  }
};

// Create a new tag
export const createTag = async (name: string) => {
  try {
    // Check whether the name is provided.
    if (!name) {
      return { Error: 'name must be provided' };
    }
    // Get all tags from the database.
    const allTags = await tagStore.getTags();
    // Get a tag which was already registered with that name.
    const checkTag = allTags.filter((t) => name === t.name);
    // Check if the tag exists
    if (checkTag.length) {
      return { Error: 'Tag with that name exists' };
    }
    // Create a new tag.
    const tag = await tagStore.createTag(name);
    return tag;
  } catch (error) {
    return null;
  }
};

// Delete all tags
export const deleteAllTags = async () => {
  try {
    // Get all tags first
    const tags = await tagStore.getTags();
    // Iterate over each tag and delete it
    tags.forEach(async (tag) => {
      await tagStore.deleteTag(tag.id);
    });
    return { Message: 'All tags were deleted successfully' };
  } catch (error) {
    return null;
  }
};

// Delete a tag by its id
export const deleteTag = async (id: string) => {
  try {
    // Check whether the id is provided.
    if (!id) {
      return { Error: 'id must be provided' };
    }
    // Get a tag by its id.
    const tag = await tagStore.getSingleTag(id);
    // Check if the tag exists
    if (!tag) {
      return { Error: 'Tag with that id does not exist' };
    }
    // Delete the tag.
    await tagStore.deleteTag(id);
    return { Message: 'Tag was deleted successfully' };
  } catch (error) {
    throw new Error(`Could not delete a tag with id ${id}. Error: ${error}`);
  }
};

// Update tag by its id
export const updateTag = async (id: string, name: string) => {
  try {
    // Check whether the id is provided.
    if (!id) {
      return { Error: 'id must be provided' };
    }
    // Check whether the name is provided.
    if (!name) {
      return { Error: 'name must be provided' };
    }
    // Get a tag by its id.
    const tag = await tagStore.getSingleTag(id);
    // Check if the tag exists
    if (!tag) {
      return { Error: 'Tag with that id does not exist' };
    }
    // Update the tag.
    const updatedTag = await tagStore.updateTag(id, name);
    return updatedTag;
  } catch (error) {
    throw new Error(`Could not update a tag with id ${id}. Error: ${error}`);
  }
};
