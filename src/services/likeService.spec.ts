import { deleteAllLikes, createLike, deleteLike } from './likeService';
import { deleteAllBlogs, createBlog } from './blogServices';
import { deleteAllUsers, userSignUp } from './userServices';

let userId: string;
let blogId: string;
let likeId: string;

// Test suite for like services
describe('Test suite for like services', () => {
  beforeAll(async () => {
    // Delete all likes before all likes
    await deleteAllLikes();
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

  // Test if createLike method returns an object with an Error property when one of the required fileds are missing.
  it('Should return an object with an Error property when one of the required fields are missing', async () => {
    const like = await createLike({});
    expect(like).toEqual({ Error: 'userId and blogId must be provided' });
  });

  // Test if createLike method returns an object with an Error when the user with the given id doesn't exist
  it('Should return an object with an Error prperty when the userId is not an existing users', async () => {
    const like = await createLike({
      userId: 'fake-id',
      blogId: blogId
    });
    expect(like).toEqual({ Error: 'User with that id does not exist' });
  });

  // Test if createLike method returns an object with an Error when the blogId is not an existing user.
  it('Should return an object with an Error property when the blog is not an existing user', async () => {
    const like = await createLike({
      userId: userId,
      blogId: 'fake-id'
    });
    expect(like).toEqual({ Error: 'Blog with that id does not exist' });
  });

  // Test if createLike method returns an object when all required parameters are provided
  it('Should return a like object when all required parameters are provided', async () => {
    const like = await createLike({
      userId: userId,
      blogId: blogId
    });
    expect(like.like?.id).toBeDefined();
    expect(like.like?.userId).toEqual(userId);
    expect(like.like?.blogId).toEqual(blogId);

    likeId = like.like?.id as string;
  });

  // Test if deleteLike method returns null when the likeId is not an existing like.
  it('Should return null when the likeId is not an existing like', async () => {
    const like = await deleteLike('test', userId);
    expect(like).toBeNull();
  });

  // Test if the deleteLike method returns an object with an Error property when the userId is not associated with the target like object
  it('Should return an object with an Error proerty when the userId is not the same as the userId  who liked the blog', async () => {
    const like = await deleteLike(likeId, 'fake-user-id');
    expect(like).toEqual({
      Error: 'You are not authorized to delete this like'
    });
  });

  // Test if the deleteLike method returns a deleted like object when the correct data is provided
  it('Should delte a like object when the correct data is provided', async () => {
    const like = await deleteLike(likeId, userId);
    expect(like).not.toBeNull();
  });

  // Delete all likes after all likes
  afterAll(async () => {
    await deleteAllLikes();
    await deleteAllBlogs();
    await deleteAllUsers();
  });
});
