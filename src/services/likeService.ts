import { LikeStore } from '../models/like';
import { getUsersById } from './userServices';
import { getSingleBlog } from './blogServices';

// Create an instance of the LikeStore class

const store = new LikeStore();

// Create a new like
export const createLike = async (likeData: any) => {
  try {
    // Check if likeData contains all required fileds
    if (!likeData.userId || !likeData.blogId) {
      return { Error: 'userId and blogId must be provided' };
    }
    // Check if user with authorId exists
    const user = await getUsersById(likeData.userId);
    if (user === null) {
      return { Error: 'User with that id does not exist' };
    }
    // Check if blog with blogId exists
    const blog = await getSingleBlog(likeData.blogId);
    if (blog === null) {
      return { Error: 'Blog with that id does not exist' };
    }
    // Check if the user has already liked the post
    const likes = await store.getAllLikes();
    const expectedUser = likes.filter((like) => {
      return like.userId === likeData.userId;
    });
    if (expectedUser.length > 0) {
      return { Error: 'The associated user has already clicked the like' };
    }
    // Create a new like
    const like = await store.createLike(likeData);
    return { like: like };
  } catch (error) {
    throw new Error(`Could not create like ${error}`);
  }
};

// Delete a like by its id.
export const deleteLike = async (id: string, userId: string) => {
  try {
    // Check if the userId on like matches with the requested userId
    const checkLike = await store.getSingleLike(id);
    if (checkLike === null) {
      return null;
    }
    if (checkLike?.userId !== userId) {
      return { Error: 'You are not authorized to delete this like' };
    }
    const like = await store.deleteLike(id);
    return { like: like };
  } catch (error) {
    return null;
  }
};

// Delete all likes
export const deleteAllLikes = async () => {
  try {
    // Get all likes from the database
    const likes = await store.getAllLikes();
    // Delete all likes
    for (const like of likes) {
      await store.deleteLike(like.id);
    }
  } catch (error) {
    return null;
  }
};
