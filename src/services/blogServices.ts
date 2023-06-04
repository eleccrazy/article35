import { BlogStore, BlogData, BlogUpdateData } from '../models/blog';
import { Blog } from '@prisma/client';
import { getUsersById } from './userServices';
import { getSingleTag } from './tagServices';

// Create a new instance of the BlogStore class.
const blogStore = new BlogStore();

// Get all blogs from the database
export const getBlogs = async (): Promise<Blog[]> => {
  const blogs = await blogStore.getBlogs();
  return blogs;
};

// Get a single blog based on its id
export const getSingleBlog = async (id: string) => {
  try {
    const blog = await blogStore.getSingleBlog(id);
    return blog;
  } catch (error) {
    return null;
  }
};

// Create a new blog
export const createBlog = async (blogData: BlogData) => {
  try {
    // Check whether all required fields are provided.
    if (
      !blogData.title ||
      !blogData.content ||
      !blogData.authorId ||
      !blogData.summary ||
      !blogData.links
    ) {
      return {
        Error: 'title, content, authorId, summary, and links must be provided'
      };
    }
    // Check the length of the title.
    if (blogData.title.length < 3) {
      return { Error: 'title must be at least 3 characters long' };
    }
    // Check the length of the content.
    if (blogData.content.length < 100) {
      return { Error: 'content must be at least 100 characters long' };
    }
    // Check the length of the summary.
    if (blogData.summary.length < 20) {
      return { Error: 'summary must be at least 20 characters long' };
    }
    // Check that links must be an array of type string.
    if (!Array.isArray(blogData.links)) {
      return { Error: 'links must be an array of type string' };
    }
    // Check if user with authorId exists
    const user = await getUsersById(blogData.authorId);
    if (user === null) {
      return { Error: 'authorId must be an existing user' };
    }
    // Create a new blog.
    const blog: Blog = await blogStore.createBlog(blogData);
    return { blog: blog };
  } catch (error) {
    throw new Error(`Could not create a new blog. Error: ${error}`);
  }
};

// Delete a blog by its id.
export const deleteBlog = async (id: string) => {
  try {
    // Delete the blog
    const blog = await blogStore.deleteBlog(id);
    return blog;
  } catch (error) {
    return null;
  }
};

// Update a blog by its id.
export const updateBlog = async (id: string, blogData: BlogUpdateData) => {
  // Check if the blog exists
  const blog = await blogStore.getSingleBlog(id);
  if (!blog) {
    return null;
  }
  // Check if there is a title to update, it must be greater than 3 characters
  if (blogData.title && blogData.title.length < 3) {
    return { Error: 'title must be at least 3 characters long' };
  }
  // Check if there is a content to update, it must be greater than 100 characters
  if (blogData.content && blogData.content.length < 100) {
    return { Error: 'content must be at least 100 characters long' };
  }
  // Check if there is a summary to update, it must be greater than 20 characters
  if (blogData.summary && blogData.summary.length < 20) {
    return { Error: 'summary must be at least 20 characters long' };
  }
  // Update the blog
  try {
    const updatedBlog = await blogStore.updateBlog(id, {
      ...blogData,
      updatedAt: new Date()
    });
    return { blog: updatedBlog };
  } catch (error) {
    throw new Error(`Could not update a blog with id ${id}. Error: ${error}`);
  }
};

// Delete all blogs
export const deleteAllBlogs = async () => {
  try {
    // Get all blogs first
    const blogs = await blogStore.getBlogs();
    // Iterate over each blog and delete it
    blogs.forEach(async (blog) => {
      await blogStore.deleteBlog(blog.id);
    });
    return { message: 'All blogs deleted successfully' };
  } catch (error) {
    throw new Error(`Could not delete all blogs. Error: ${error}`);
  }
};

// Get all approved blogs
export const getApprovedBlogs = async () => {
  try {
    const blogs = await blogStore.getApprovedBlogs();
    return blogs;
  } catch (error) {
    throw new Error(`Could not get all approved blogs. Error: ${error}`);
  }
};

// Get all unapproved blogs
export const getUnapprovedBlogs = async () => {
  try {
    const blogs = await blogStore.getPendingBlogs();
    return blogs;
  } catch (error) {
    throw new Error(`Could not get all unapproved blogs. Error: ${error}`);
  }
};

// Approve a blog
export const approveBlog = async (id: string) => {
  try {
    // Check if the blog with the given id exists
    const blog = await blogStore.getSingleBlog(id);
    if (!blog) {
      return null;
    }
    const updatedBlog = await blogStore.updateBlog(id, {
      isApproved: true,
      updatedAt: new Date()
    });
    return { blog: updatedBlog };
  } catch (error) {
    throw new Error(`Could not approve blog with id ${id}. Error: ${error}`);
  }
};

// unApprove a blog
export const unApproveBlog = async (id: string) => {
  try {
    // Check if the blog with the given id exists
    const blog = await blogStore.getSingleBlog(id);
    if (!blog) {
      return null;
    }
    const updatedBlog = await blogStore.updateBlog(id, {
      isApproved: false,
      updatedAt: new Date()
    });
    return { blog: updatedBlog };
  } catch (error) {
    throw new Error(`Could not approve blog with id ${id}. Error: ${error}`);
  }
};

// Get all tags of a blog
export const getBlogTags = async (id: string) => {
  try {
    const blog = await blogStore.getSingleBlog(id);
    return blog?.tags;
  } catch (error) {
    throw new Error(
      `Could not get tags of blog with id ${id}. Error: ${error}`
    );
  }
};

// Get all comments of a blog
export const getBlogComments = async (id: string) => {
  try {
    const blog = await blogStore.getSingleBlog(id);
    return blog?.comments;
  } catch (error) {
    throw new Error(
      `Could not get comments of blog with id ${id}. Error: ${error}`
    );
  }
};

// Get the number of likes of a blog
export const countLikes = async (id: string) => {
  try {
    const blog = await blogStore.getSingleBlog(id);
    if (!blog) {
      return null;
    }
    return { likes: blog.likes?.length };
  } catch (error) {
    throw new Error(
      `Could not get the number of likes of blog with id ${id}. Error: ${error}`
    );
  }
};

// Link tags to a blog with many to many relationships
export const linkTagsToBlog = async (blogId: string, tagIds: string[]) => {
  try {
    const blog = await blogStore.getSingleBlog(blogId);
    if (!blog) {
      return { Error: 'Blog with that id does not exist' };
    }
    // Check if tagIds is an array of strings
    if (!Array.isArray(tagIds)) {
      return { Error: 'tagIds must be an array of strings' };
    }
    // Check if tags with the given ids exist
    const tags = await Promise.all(
      tagIds.map(async (id) => {
        const tag = await getSingleTag(id);
        return tag;
      })
    );
    // Check if all tags exist
    if (tags.includes(null)) {
      return { Error: 'One or more tags with that id do not exist' };
    }
    // Link tags to the blog
    const linkedBlog = await blogStore.linkTagsToBlog(blogId, tagIds);
    await updateBlog(blogId, { updatedAt: new Date() });
    // Check if tags are linked to the blog
    if (!linkedBlog) {
      return { Error: 'Could not link tags to the blog' };
    }
    return { blog: linkedBlog };
  } catch (error) {
    throw new Error(
      `Could not link tags to blog with id ${blogId}. Error: ${error}`
    );
  }
};

// Append a new link to a blog
export const appendLinkToBlog = async (blogId: string, link: string) => {
  try {
    const blog = await blogStore.getSingleBlog(blogId);
    if (!blog) {
      return null;
    }
    // Check if the link is provided
    if (!link) {
      return { Error: 'Link must be provided' };
    }
    // Check if the link is a string
    if (typeof link !== 'string') {
      return { Error: 'Link must be a string' };
    }
    // Append the link to the blog
    const updatedBlog = await blogStore.updateLinks(blogId, link);
    await updateBlog(blogId, { updatedAt: new Date() });
    return { blog: updatedBlog };
  } catch (error) {
    throw new Error(
      `Could not append link to blog with id ${blogId}. Error: ${error}`
    );
  }
};
