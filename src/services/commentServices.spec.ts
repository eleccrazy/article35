import {
  createComment,
  deleteAllComments,
  deleteComment,
  updateComment,
  getSingleComment
} from './commentServices';
import { deleteAllBlogs, createBlog } from './blogServices';
import { deleteAllUsers, userSignUp } from './userServices';

// Define variables to hold the id of the user, blog, and comment
let userId: string;
let blogId: string;
let commentId: string;

// Test suite for commentServices
describe('Test suite for comment services', () => {
  // Delete all comments before all tests
  beforeAll(async () => {
    await deleteAllComments();
    await deleteAllBlogs();
    await deleteAllUsers();

    // Create a new user
    const userData = {
      email: 'test2@gmail.com',
      password: '12345678',
      firstName: 'Test'
    };
    const user = await userSignUp(userData);
    userId = user.user?.id as string;

    // Create a new blog
    const blogData = {
      title: 'test',
      content:
        'test should return an object with an Error property when a blog with invalid summary length is provided',
      summary:
        'test should return an object with an Error property when a blog with invalid summar',
      authorId: userId,
      image: 'test',
      links: ['test']
    };

    const blog = await createBlog(blogData);
    blogId = blog.blog?.id as string;
  });
  // Test if createComment returns an object with an Error property when one of the required parameters is missing
  it('should return an object with an Error property when one of the required parameters is missing', async () => {
    const result = await createComment({});
    expect(result).toEqual({
      Error: 'content, userId, and blogId must be provided'
    });
  });
  // Test if createComment returns an object with an Error property when the content is too short
  it('should return an object with an Error property when the content is too short', async () => {
    const result = await createComment({
      content: 'ab',
      userId: '1',
      blogId: '1'
    });
    expect(result).toEqual({
      Error: 'content must be at least 3 characters long'
    });
  });

  // Test if createComment returns an object with an Error property when the authorId does not exist
  it('should return an object with an Error property when the authorId does not exist', async () => {
    const result = await createComment({
      content: 'abc',
      userId: '100',
      blogId: '1'
    });
    expect(result).toEqual({
      Error: 'User with that id does not exist'
    });
  });

  // Tes if createComment returns an object with an Error property when the blogId does not exist
  it('should return an object with an Error property when the blogId does not exist', async () => {
    const result = await createComment({
      content: 'abc',
      userId: userId,
      blogId: '100'
    });

    expect(result).toEqual({
      Error: 'Blog with that id does not exist'
    });
  });

  // Test if createComment returns a comment object when all required parameters are provided
  it('should return a comment object when all required parameters are provided', async () => {
    const result = await createComment({
      content: 'abc',
      userId: userId,
      blogId: blogId
    });
    // Set the commentId to the id of the comment returned by createComment
    commentId = result.comment?.id as string;
    expect(result.comment?.id).toBeDefined();
    expect(result.comment?.content).toEqual('abc');
    expect(result.comment?.userId).toEqual(userId);
    expect(result.comment?.blogId).toEqual(blogId);
  });

  // Test if getSingleComment returns null when the comment does not exist
  it('should return null when the comment does not exist', async () => {
    const result = await getSingleComment('100');
    expect(result).toBeNull();
  });

  // Test if getSingleComment returns a comment object when the comment exists
  it('should return a comment object when the comment exists', async () => {
    const result = await getSingleComment(commentId);
    expect(result?.id).toEqual(commentId);
  });

  // Test if updateComment returns null when the comment does not exist
  it('should return null when the comment does not exist', async () => {
    const result = await updateComment('100', 'test');
    expect(result?.Error).toEqual('Comment with that id does not exist');
  });

  // Test if updateComment returns a comment object when the comment exists
  it('should return a comment object when the comment exists', async () => {
    const result = await updateComment(commentId, 'new test');
    expect(result.comment?.id).toEqual(commentId);
    expect(result.comment?.content).toEqual('new test');
  });

  // Test if deleteComment returns null when the comment does not exist
  it('should return null when the comment does not exist', async () => {
    const result = await deleteComment('100');
    expect(result).toBeNull();
  });

  // Test if deleteComment returns a comment object when the comment exists
  it('should return a comment object when the comment exists', async () => {
    const result = await deleteComment(commentId);
    expect(result?.id).not.toBeNull();
  });

  // Delte all comments after all tests
  afterAll(async () => {
    await deleteAllComments();
    await deleteAllBlogs();
    await deleteAllUsers();
  });
});
