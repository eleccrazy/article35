import {
  getProjects,
  getSingleProject,
  updateProject,
  updateProjectSignatures,
  deleteAllProjects,
  deleteProject,
  createProject
} from './projectsService';
import { deleteAllUsers, userSignUp } from './userServices';

describe('Test suite for projects Service', () => {
  // Delete all projects before all test
  beforeAll(async () => {
    await deleteAllProjects();
  });

  // Test if the getProjects function returns an empty array of projects at start
  it('should return an empty array of projects at start', async () => {
    const projects = await getProjects();
    expect(projects).toEqual([]);
  });

  // Test if the createProject function returns an object with an Error property when necessary parameters are missed
  it('should return an object with an Error property when necessary parameters are missed', async () => {
    const result = await createProject({
      title: '',
      content: '',
      signatures: [],
      userId: ''
    });
    expect(result).toEqual({
      Error: 'title, content, signatures, and userId must be provided'
    });
  });

  // Test if the createProject function returns an object with an Error property when a project with invalid title length is provided
  it('should return an object with an Error property when a project with invalid title length is provided', async () => {
    const result = await createProject({
      title: 'te',
      content: 'test',
      signatures: ['test@gmail.com'],
      userId: 'test-id'
    });
    expect(result).toEqual({
      Error: 'title must be at least 3 characters long'
    });
  });

  // Test if the createProject function returns an object with an Error property when a project with invalid content length is provided
  it('should return an object with an Error property when a project with invalid content length is provided', async () => {
    const result = await createProject({
      title: 'test',
      content: 'test',
      signatures: [],
      userId: 'test-id'
    });
    expect(result).toEqual({
      Error: 'content must be at least 100 characters long'
    });
  });

  // Test if the createProject function returns an object with an Error property when a userId is not an existing user.
  it('should return an object with an Error property when a userId is not an existing user', async () => {
    const result = await createProject({
      title: 'test',
      content:
        'Test if the createProject function returns an object with an Error property when a userId is not an existing user.',
      signatures: ['test'],
      userId: 'test-id'
    });
    expect(result).toEqual({
      Error: 'userId must be an existing user'
    });
  });

  // Test if the createProject function returns a valid project when all required parameters are provided
  it('should return a valid project when all required field parameters are provided', async () => {
    // First create a user
    const userData = {
      email: 'test@gmail.com',
      password: '12345678',
      firstName: 'Test'
    };
    const result = await userSignUp(userData);
    const user = result.user;
    const project = await createProject({
      title: 'test',
      content:
        'Test if the createProject function returns a valid project when all required parameters are provided',
      signatures: ['test@gmail.com'],
      userId: user?.id as string
    });
    expect(project.project?.id).toBeDefined;
    expect(project.project?.userId).toEqual(user?.id);
  });

  // Get all projects
  it('should return an array of projects', async () => {
    const projects = await getProjects();
    expect(projects?.length).not.toEqual(0);
  });

  // Test getSingleProject function returns an object with an Error property when the project with the given id is not found
  it('should return an object with an Error property when the project with the given id is not found', async () => {
    const result = await getSingleProject('123456789012345678901234');
    expect(result).toBeNull();
  });

  // Test getSingleProject function returns a project when the project with the given id is found
  it('should return a project when the project with the given id is found', async () => {
    const projects = await getProjects();
    const project = projects[0];
    const result = await getSingleProject(project.id);
    expect(result?.id).toEqual(project.id);
  });

  // Test updateProject function returns an object with an Error property when the project with the given id is not found
  it('should return an object with an Error property when the project with the given id is not found', async () => {
    const result = await updateProject('123456789012345678901234', {
      content: 'test'
    });
    expect(result).toBeNull();
  });

  // Test updateProject function returns an object with an Error property when a project with invalid content length is provided
  it('should return an object with an Error property when a project with invalid content length is provided', async () => {
    const projects = await getProjects();
    const project = projects[0];
    const result = await updateProject(project.id, {
      content: 'test'
    });
    expect(result).toEqual({
      Error: 'content must be at least 100 characters long'
    });
  });

  // Test updateProject function returns a project when the project with the given id is found
  it('should return a project when the project with the given id is found', async () => {
    const projects = await getProjects();
    const project = projects[0];
    const result = await updateProject(project.id, {
      title: 'New title'
    });
    expect(result?.project?.title).toEqual('New title');
  });

  // Test updateProjectSignatures function returns an object with an Error property when the project with the given id is not found
  it('should return an object with an Error property when the project with the given id is not found', async () => {
    const result = await updateProjectSignatures(
      '123456789012345678901234',
      'newbie@gmail.com'
    );
    expect(result).toBeNull();
  });
  // Test updateProjectSignatures function returns a project object when the project with the given id is found
  it('should return a project object when the project with the given id is found', async () => {
    const projects = await getProjects();
    const project = projects[0];
    const result = await updateProjectSignatures(project.id, 'test2@gmail.com');
    expect(result?.project?.signatures).toContain('test2@gmail.com');
  });

  // Test the deleteProject function returns an object with an Error property when the project with the given id is not found
  it('should return an object with an Error property when the project with the given id is not found', async () => {
    const result = await deleteProject('123456789012345678901234');
    expect(result).toBeNull();
  });

  // Test the deleteProject function returns a project object when the project with the given id is found
  it('should return a project object when the project with the given id is found', async () => {
    const projects = await getProjects();
    const project = projects[0];
    const result = await deleteProject(project.id);
    expect(result?.id).toEqual(project.id);
  });

  // Delete all projects after all test
  afterAll(async () => {
    await deleteAllProjects();
    await deleteAllUsers();
  });
});
