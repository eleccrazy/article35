import {
  deleteAllTags,
  deleteTag,
  createTag,
  updateTag,
  getTags,
  getSingleTag
} from './tagServices';

// Define variables for test data
let id: string | undefined;

describe('Test suite for tag services', () => {
  // Test if the getTags function returns an empty array of tags at start
  it('should return an empty array of tags at start', async () => {
    const tags = await getTags();
    expect(tags).toEqual([]);
  });

  // Test if the createTag function returns an object with an Error property when necessary parameters are missed
  it('should return an object with an Error property when necessary parameters are missed', async () => {
    const result = await createTag('');
    expect(result).toEqual({
      Error: 'name must be provided'
    });
  });

  // Test if the createTag function returns an object with an Error property when a tag with invalid name length is provided
  it('should return an object with an Error property when a tag with invalid name length is provided', async () => {
    const result = await createTag('te');
    expect(result).toEqual({
      Error: 'name must be at least 3 characters long'
    });
  });

  // Test if the createTag function returns a valid tag when all required parameters are provided
  it('should return a valid tag when all required field parameters are provided', async () => {
    const result = await createTag('test');
    expect(Object.keys(result)).toContain('tag');
    id = result.tag?.id;
  });

  // Test if the createTag function returns an object with an Error property when a tag with already existing name is provided
  it('should return an object with an Error property when a tag with already existing name is provided', async () => {
    const result = await createTag('test');
    expect(result).toEqual({
      Error: 'Tag with that name exists'
    });
  });

  // Test if the getTags function returns an array of tags
  it('should return an array of tags', async () => {
    const tags = await getTags();
    expect(tags?.length).not.toEqual(0);
  });

  // Test getSingleTag function returns an object with an Error property when the user with the given id is not found
  it('should return an object with an Error property when the tag with the given id is not found', async () => {
    const result = await getSingleTag('123456789012345678901234');
    expect(result).toBeNull();
  });

  // Test getSingleTag function returns a tag when the tag with the given id is found
  it('should return a tag when the tag with the given id is found', async () => {
    if (id) {
      const result = await getSingleTag(id);
      expect(result?.id).toEqual(id);
    }
  });

  // Test if the updateTag function returns an object with an Error property when necessary parameters are missed
  it('should return an object with an Error property when necessary parameters are missed', async () => {
    const result = await updateTag('', '');
    expect(result).toEqual({
      Error: 'id must be provided'
    });
  });

  // Test if the updateTag function returns an object with an Error property when a tag with invalid name length is provided
  it('should return an object with an Error property when a tag with invalid name length is provided', async () => {
    if (id) {
      const result = await updateTag(id, 'e');
      expect(result).toEqual({
        Error: 'name must be at least 3 characters long'
      });
    }
  });

  // Test if the updateTag function returns an object with an Error property when the tag with the given id is not found
  it('should return an object with an Error property when the tag with the given id is not found', async () => {
    const result = await updateTag('123456789012345678901234', 'test');
    expect(result).toEqual({
      Error: 'Tag with that id does not exist'
    });
  });

  // Test if the updateTag function returns a valid tag when all required parameters are provided
  it('should return a valid tag when all required field parameters are provided', async () => {
    if (id) {
      const result = await updateTag(id, 'New test');
      if (result) {
        expect(result.tag?.name).toEqual('New test');
      }
    }
  });

  // Test if the deleteTag function returns an object with an Error property when necessary parameters are missed
  it('should return an object with an Error property when necessary parameters are missed', async () => {
    const result = await deleteTag('');
    expect(result).toEqual({
      Error: 'id must be provided'
    });
  });

  // Test if the deleteTag function returns an object with an Error property when the tag with the given id is not found
  it('should return an object with an Error property when the tag with the given id is not found', async () => {
    const result = await deleteTag('123456789012345678901234');
    expect(result).toEqual({
      Error: 'Tag with that id does not exist'
    });
  });

  // Test if the deleteTag function returns a valid tag when all required parameters are provided
  it('should return a valid tag when all required field parameters are provided', async () => {
    if (id) {
      const result = await deleteTag(id);
      expect(result).toEqual({
        Message: 'Tag was deleted successfully'
      });
    }
  });

  // Delete all tags after all tests.
  afterAll(async () => {
    await deleteAllTags();
  });
});
