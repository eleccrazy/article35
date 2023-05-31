import CommentStore from '../models/comment';
import { getUsersById } from './userServices';
import { getSingleBlog } from './blogServices';

// Create a new instance of the CommentStore class.
const store = new CommentStore();

// Create a new comment
export const createComment = async (commentData: any) => {
  try {
    // Check if commentData contains all required fileds
    if (!commentData.content || !commentData.userId || !commentData.blogId) {
      return { Error: 'content, userId, and blogId must be provided' };
    }
    // Check the length of the content.
    if (commentData.content.length < 3) {
      return { Error: 'content must be at least 3 characters long' };
    }
    // Check if user with authorId exists
    const user = await getUsersById(commentData.userId);
    if (user === null) {
      return { Error: 'User with that id does not exist' };
    }
    // Check if blog with blogId exists
    const blog = await getSingleBlog(commentData.blogId);
    if (blog === null) {
      return { Error: 'Blog with that id does not exist' };
    }
    // Create a new comment
    const comment = await store.createComment(commentData);
    return { comment: comment };
  } catch (error) {
    throw new Error(`Could not create comment ${error}`);
  }
};

// Get a single comment based on its id
export const getSingleComment = async (id: string) => {
  try {
    const comment = await store.getSingleComment(id);
    return comment;
  } catch (error) {
    return null;
  }
};

// Delete a comment by its id.
export const deleteComment = async (id: string) => {
  try {
    const comment = await store.deleteComment(id);
    return comment;
  } catch (error) {
    return null;
  }
};

// Update a comment by its id.
export const updateComment = async (id: string, comment: string) => {
  try {
    // Check if the comment exists
    const commentExists = await store.getSingleComment(id);
    if (commentExists === null) {
      return { Error: 'Comment with that id does not exist' };
    }
    // Check the length of the comment.
    if (comment.length < 3) {
      return { Error: 'Comment must be at least 3 characters long' };
    }
    const updatedComment = await store.updateComment(id, comment);
    return { comment: updatedComment };
  } catch (error) {
    throw new Error(`Could not update comment ${error}`);
  }
};

// Delete all comments from the database.
export const deleteAllComments = async () => {
  try {
    // First get all comments
    const comments = await store.getComments();
    // Then delete all comments
    for (const comment of comments) {
      await store.deleteComment(comment.id);
    }
    return comments;
  } catch (error) {
    throw new Error(`Could not delete all comments ${error}`);
  }
};
