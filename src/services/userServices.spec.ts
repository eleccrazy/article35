import {
  getUsers,
  getUsersById,
  userSignUp,
  getUserByEmail,
  deleteAllUsers,
  userLogin,
  deleteUser,
  updateUser
} from './userServices';

// Define variables for test data
let email: string | undefined;
let id: string | undefined;

describe('Test suite for user services', () => {
  // Delete all users before all test
  beforeAll(async () => {
    await deleteAllUsers();
  });
  // Test if the getUsers function returns an array of users
  it('should return an empty array of users at start', async () => {
    const users = await getUsers();
    expect(users).toEqual([]);
  });

  // Test if the userSignUp function returns an object with an Error property when necessary parameters are missed
  it('should return an object with an Error property when necessary parameters are missed', async () => {
    const userData = {
      email: 'test@gmail.com',
      password: '12345678'
    };
    const result = await userSignUp(userData);
    expect(result).toEqual({
      Error: 'email, firstName, and password must be provided'
    });
  });

  // Test if the userSignUp function returns an object with an Error property when a user with invalid password length is provided
  it('should return an object with an Error property when a user with invalid password length is provided', async () => {
    const userData = {
      email: 'test@gmail.com',
      password: '1234567',
      firstName: 'Test'
    };
    const result = await userSignUp(userData);
    expect(result).toEqual({
      Error: 'Password must be at least 8 characters long'
    });
  });

  // Test if the userSignUp function returns a valid token with a valid user data when all required parameters are provided
  it('should return a valid token with a valid user data when all required field parameters are provided', async () => {
    const userData = {
      email: 'test@gmail.com',
      password: '12345678',
      firstName: 'Test'
    };
    const result = await userSignUp(userData);
    expect(Object.keys(result)).toContain('token');
    expect(Object.keys(result)).toContain('user');
    email = result.user?.email;
    id = result.user?.id;
  });

  // Test if the getUserByEmail function returns null when an invalid email is provided
  it('should return null when an invalid email is provided', async () => {
    const result = await getUserByEmail('test22@gmail.com');
    expect(result).toBeNull();
  });

  // Test if the getUserbyEmail function returns a user object when a valid email is provided
  it('should return a user object when a valid email is provided', async () => {
    const result = await getUserByEmail(email as string);
    expect(result).not.toBeNull();
  });

  // Test if the getUsersById function returns null when an invalid id is provided
  it('should return null when an invalid id is provided', async () => {
    const result = await getUsersById('123');
    expect(result).toBeNull();
  });

  // Test if the getUsersById function returns a user object when a valid id is provided
  it('should return a user object when a valid id is provided', async () => {
    const result = await getUsersById(id as string);
    expect(result).not.toBeNull();
  });

  // Test the newUser password is hashed
  it('should return a user object with a hashed password', async () => {
    const userData = {
      email: 'test2@gmail.com',
      password: '12345678',
      firstName: 'Test'
    };
    const result = await userSignUp(userData);
    expect(result.user?.password).not.toEqual(userData.password);
  });

  // Test if the getUsers function returns an array of users
  it('should return an array of users', async () => {
    const users = await getUsers();
    expect(users).not.toEqual([]);
  });

  // Test if user registration with an already registered email returns an object with an Error property
  it('should return an object with an Error property when a user with an already registered email is provided', async () => {
    const userData = {
      email: 'test@gmail.com',
      password: 'helloworld',
      firstName: 'Test'
    };
    const result = await userSignUp(userData);
    expect(result).toEqual({
      Error: 'User with that email exists'
    });
  });

  // Test if the user with invalid login email is not authenticated
  it('should return null when a user with invalid login email is provided', async () => {
    const userData = {
      email: 'test23@gmail.com',
      password: 'helloworld'
    };
    const result = await userLogin(userData);
    expect(result).toEqual({
      Error: 'Invalid credentials'
    });
  });

  // Test if the user with invalid login password is not authenticated
  it('should return an object with an Error property when a user with invalid login password is provided', async () => {
    const userData = {
      email: 'test@gmail.com',
      password: 'helloworld2'
    };
    const result = await userLogin(userData);
    expect(result).toEqual({
      Error: 'Invalid credentials'
    });
  });

  //Test if the user with valid login credentials is authenticated
  it('should return a valid token with a valid user data when a user with valid login credentials is provided', async () => {
    const userData = {
      email: 'test@gmail.com',
      password: '12345678'
    };
    const result = await userLogin(userData);
    expect(Object.keys(result)).toContain('token');
    expect(Object.keys(result)).toContain('user');
  });

  // Test the user with invalid id is not deleted and an object with an Error property is returned
  it('should return an object with an Error property when a user with invalid id is provided', async () => {
    const result = await deleteUser('123');
    expect(result).toEqual({
      Error: 'User with that id does not exist'
    });
  });

  // Test that the user with valid id is deleted
  it('should return an object with a Success property when a user with valid id is provided', async () => {
    const result = await deleteUser(id as string);
    expect(result).toEqual({
      Success: 'User deleted successfully'
    });
  });

  // Test if the user with invalid id is not updated and an object with an Error property is returned
  it('should return an object with an Error property when a user with invalid id is provided', async () => {
    const userUpdateData = {
      phone: '08012345678'
    };
    // Update the user with invalid id
    const result = await updateUser('123', userUpdateData);
    expect(result).toBeNull();
  });

  // Test if the user with valid id is updated
  it('should return an object with a Success property when a user with valid id is provided', async () => {
    // Create a new user first
    const userData = {
      email: 'test2@gmail.com',
      password: '12345678',
      firstName: 'Test'
    };
    const result = await userSignUp(userData);
    const newId = result.user?.id;
    if (newId) {
      const userUpdateData = {
        phone: '08012345678'
      };
      // Update the user with valid id
      const result2 = await updateUser(newId as string, userUpdateData);
      expect(result2?.phone).toEqual('08012345678');
    }
  });

  // Test if the user with valid id is updated
  it('should return an object with a Success property when a user with valid id is provided (All parameters)', async () => {
    // Create a new user first
    const userData = {
      email: 'test3@gmail.com',
      password: '12345678',
      firstName: 'Test'
    };
    const result = await userSignUp(userData);
    const newId = result.user?.id;
    if (newId) {
      const userUpdateData = {
        phone: '08012345678',
        lastName: 'King',
        bio: 'I am a developer'
      };
      // Update the user with valid id
      const result2 = await updateUser(newId as string, userUpdateData);
      expect(result2?.phone).toEqual('08012345678');
      expect(result2?.lastName).toEqual('King');
      expect(result2?.bio).toEqual('I am a developer');
    }
  });

  // Test if the updatedAt value is changed when the user is updated
  it('updatedAt property should be changed when the user gets updated', async () => {
    // Create a new user first
    const userData = {
      email: 'test3@gmail.com',
      password: '12345678',
      firstName: 'Test'
    };
    const result = await userSignUp(userData);
    const newId = result.user?.id;
    if (newId) {
      const userUpdateData = {
        phone: '08012345678'
      };
      // Update the user with valid id
      const result2 = await updateUser(newId as string, userUpdateData);
      console.log(result2);
      expect(result2?.updatedAt).not.toEqual(result2?.createdAt);
    }
  });

  afterAll(async () => {
    await deleteAllUsers();
  });
});
