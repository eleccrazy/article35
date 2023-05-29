import {
  getBlogs,
  getApprovedBlogs,
  getBlogComments,
  getBlogTags,
  getSingleBlog,
  getUnapprovedBlogs,
  updateBlog,
  deleteAllBlogs,
  deleteBlog,
  createBlog,
  approveBlog,
  linkTagsToBlog,
  countLikes
} from './blogServices';
import { userSignUp, deleteAllUsers } from './userServices';
import { createTag, deleteAllTags } from './tagServices';

let blogId: string | undefined;

describe('Test for blog services', () => {
  // Test if the getBlogs function returns an empty array of blogs at start
  it('should return an empty array of blogs at start', async () => {
    const blogs = await getBlogs();
    expect(blogs).toEqual([]);
  });

  // Test if the createBlog function returns an object with an Error property when necessary parameters are missed
  it('should return an object with an Error property when necessary parameters are missed', async () => {
    const result = await createBlog({
      title: '',
      content: '',
      summary: '',
      authorId: '',
      image: '',
      links: []
    });
    expect(result).toEqual({
      Error:
        'title, content, authorId, summary, image, and links must be provided'
    });
  });

  // Test if the createBlog function returns an object with an Error property when a blog with invalid title length is provided
  it('should return an object with an Error property when a blog with invalid title length is provided', async () => {
    const result = await createBlog({
      title: 'te',
      content: 'test',
      summary: 'test',
      authorId: 'test',
      image: 'test',
      links: ['test']
    });
    expect(result).toEqual({
      Error: 'title must be at least 3 characters long'
    });
  });

  // Test if the createBlog function returns an object with an Error property when a blog with invalid content length is provided
  it('should return an object with an Error property when a blog with invalid content length is provided', async () => {
    const result = await createBlog({
      title: 'test',
      content: 'te',
      summary: 'test',
      authorId: 'test',
      image: 'test',
      links: ['test']
    });
    expect(result).toEqual({
      Error: 'content must be at least 100 characters long'
    });
  });

  // Test if the createBlog function returns an object with an Error property when a blog with invalid summary length is provided
  it('should return an object with an Error property when a blog with invalid summary length is provided', async () => {
    const result = await createBlog({
      title: 'test',
      content:
        'testshould return an object with an Error property when a blog with invalid summary length is provided',
      summary: 'te',
      authorId: 'test',
      image: 'test',
      links: ['test']
    });
    expect(result).toEqual({
      Error: 'summary must be at least 20 characters long'
    });
  });

  // Test if the createBlog function returns an object with an Error property when the authorId is not an existing user
  it('should return an object with an Error property when the authorId is not an existing user', async () => {
    const result = await createBlog({
      title: 'test',
      content:
        'test should return an object with an Error property when a blog with invalid summary length is provided',
      summary:
        'test should return an object with an Error property when a blog with invalid summar',
      authorId: 'test',
      image: 'test',
      links: ['test']
    });
    expect(result).toEqual({
      Error: 'authorId must be an existing user'
    });
  });

  // Test if the createBlog function returns a blog object when a valid blog data is provided
  it('should return a blog object when a valid blog data is provided', async () => {
    // First create a user
    const userData = {
      email: 'test@gmail.com',
      password: '12345678',
      firstName: 'Test'
    };
    const result = await userSignUp(userData);
    const user = result.user;
    const blogData = {
      title: 'test',
      content:
        'test should return an object with an Error property when a blog with invalid summary length is provided',
      summary:
        'test should return an object with an Error property when a blog with invalid summar',
      authorId: user?.id as string,
      image: 'test',
      links: ['test']
    };

    const blog = await createBlog(blogData);
    blogId = blog.blog?.id;

    expect(blog.blog?.id).toBeDefined();
    expect(blog.blog?.authorId).toEqual(user?.id);
  });

  // Test if the getBlogs function returns an array of blogs
  it('should return an array of blogs', async () => {
    const blogs = await getBlogs();
    expect(blogs?.length).not.toEqual(0);
  });

  // Test if the getSingleBlog function returns an object with an Error property when the blog with the given id is not found
  it('should return an object with an Error property when the blog with the given id is not found', async () => {
    const result = await getSingleBlog('test');
    expect(result).toBeNull();
  });

  // Test if the getSingleBlog function returns a blog object when the blog with the given id is found
  it('should return a blog object when the blog with the given id is found', async () => {
    const blog = await getSingleBlog(blogId as string);
    expect(blog?.id).toEqual(blogId);
  });

  // Test if the updateBlog function returns an object with an Error property when the blog with the given id is not found
  it('should return an object with an Error property when the blog with the given id is not found', async () => {
    const result = await updateBlog('test', {
      title: 'New test title'
    });
    expect(result).toBeNull();
  });

  // Test if the updateBlog function returns an object with an Error property when a blog with invalid title length is provided
  it('should return an object with an Error property when a blog with invalid title length is provided', async () => {
    const result = await updateBlog(blogId as string, {
      title: 'te'
    });
    expect(result).toEqual({
      Error: 'title must be at least 3 characters long'
    });
  });

  // Test if the updateBlog function returns an object with an Error property when a blog with invalid content length is provided
  it('should return an object with an Error property when a blog with invalid content length is provided', async () => {
    const result = await updateBlog(blogId as string, {
      content: 'te'
    });
    expect(result).toEqual({
      Error: 'content must be at least 100 characters long'
    });
  });

  // Test if the updateBlog function returns an object with an Error property when a blog with invalid summary length is provided
  it('should return an object with an Error property when a blog with invalid summary length is provided', async () => {
    const result = await updateBlog(blogId as string, {
      summary: 'te'
    });
    expect(result).toEqual({
      Error: 'summary must be at least 20 characters long'
    });
  });

  // Test if the updateBlog function returns a blog object when a valid blog data is provided
  it('should return a blog object when a valid blog data is provided', async () => {
    const result = await updateBlog(blogId as string, {
      title: 'New test title'
    });
    expect(result?.blog?.title).toEqual('New test title');
  });

  // Test if the getBlogTags function returns an array of tags
  it('should return an array of tags', async () => {
    const tags = await getBlogTags(blogId as string);
    expect(tags?.length).toEqual(0);
  });

  // Test if the linkTagsToBlog function returns an object with an Error property when the blog with the given id is not found
  it('should return an object with an Error property when the blog with the given id is not found', async () => {
    const result = await linkTagsToBlog('test', ['test']);
    expect(result).toEqual({
      Error: 'Blog with that id does not exist'
    });
  });

  // Test if the linkTagsToBlog function returns an object with an Error property when the tag with the given id is not found
  it('should return an object with an Error property when the tag with the given id is not found', async () => {
    const result = await linkTagsToBlog(blogId as string, ['test', 'test2']);
    expect(result).toEqual({
      Error: 'One or more tags with that id do not exist'
    });
  });

  // Test if the linkTagsToBlog function returns an updated blog object when a valid blog id and tag ids are provided
  it('should return an updated blog object when a valid blog id and tag ids are provided', async () => {
    // First create a tag
    const tag1 = await createTag('tag1');
    const tagId1 = tag1.tag?.id;
    const tag2 = await createTag('tag2');
    const tagId2 = tag2.tag?.id;
    const blog = await linkTagsToBlog(blogId as string, [
      tagId1 as string,
      tagId2 as string
    ]);
    expect(blog.blog?.tags?.length).toEqual(2);
  });

  // Test if the getBlogComments function returns an array of comments
  it('should return an array of comments', async () => {
    const comments = await getBlogComments(blogId as string);
    expect(comments?.length).toEqual(0);
  });

  // Test if the approveBlog function returns an object with an Error property when the blog with the given id is not found
  it('should return an object with an Error property when the blog with the given id is not found', async () => {
    const result = await approveBlog('test');
    expect(result).toBeNull();
  });

  // Test if the approveBlog function returns an updated blog object when a valid blog id is provided
  it('should return an updated blog object when a valid blog id is provided', async () => {
    const blog = await approveBlog(blogId as string);
    expect(blog?.blog?.isApproved).toEqual(true);
  });

  // Test if the deleleBlog function returns an object with an Error property when the blog with the given id is not found
  it('should return an object with an Error property when the blog with the given id is not found', async () => {
    const result = await deleteBlog('test');
    expect(result).toBeNull();
  });

  // Test if the deleleBlog function returns a blog object when a valid blog id is provided
  it('should return a blog object when a valid blog id is provided', async () => {
    // First create a user
    const userData = {
      email: 'test2@gmail.com',
      password: '12345678',
      firstName: 'Test'
    };
    const result = await userSignUp(userData);
    const user = result.user;
    // Create a blog to be deleted
    const blogData = {
      title: 'test',
      content:
        'test should return an object with an Error property when a blog with invalid summary length is provided',
      summary:
        'test should return an object with an Error property when a blog with invalid summar',
      authorId: user?.id as string,
      image: 'test',
      links: ['test']
    };
    const blog = await createBlog(blogData);
    blogId = blog.blog?.id;
    // Delete the blog
    const deletedBlog = await deleteBlog(blogId as string);
    expect(deletedBlog?.id).toEqual(blogId);
  });

  // Test if the getApprovedBlogs function returns an array of approved blogs
  it('should return an array of approved blogs', async () => {
    const blogs = await getApprovedBlogs();
    expect(blogs?.length).not.toEqual(0);
  });

  // Test if the getUnapprovedBlogs function returns an array of unapproved blogs
  it('should return an array of unapproved blogs', async () => {
    const blogs = await getUnapprovedBlogs();
    expect(blogs?.length).toEqual(0);
  });

  afterAll(async () => {
    await deleteAllTags();
    await deleteAllBlogs();
    await deleteAllUsers();
  });
});
