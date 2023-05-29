import { ProjectStore, CreateProject, UpdateProject } from '../models/project';
import { getUsersById } from './userServices';
import { Project } from '@prisma/client';

// Create a new instance of the ProjectStore class.
const projectStore = new ProjectStore();

// Get all projects from the database
export const getProjects = async () => {
  const projects = await projectStore.getProjects();
  return projects;
};

// Get a single project based on its id
export const getSingleProject = async (id: string) => {
  try {
    const project = await projectStore.getSingleProject(id);
    return project;
  } catch (error) {
    return null;
  }
};

// Create a new project
export const createProject = async (projectData: CreateProject) => {
  try {
    // Check whether all required fields are provided.
    if (
      !projectData.title ||
      !projectData.content ||
      !projectData.signatures ||
      !projectData.userId
    ) {
      return {
        Error: 'title, content, signatures, and userId must be provided'
      };
    }
    // Check the length of the title.
    if (projectData.title.length < 3) {
      return { Error: 'title must be at least 3 characters long' };
    }
    // Check the length of the description.
    if (projectData.content.length < 100) {
      return { Error: 'content must be at least 100 characters long' };
    }
    // Check that links must be an array of type string.
    if (!Array.isArray(projectData.signatures)) {
      return { Error: 'signatures must be an array of type string' };
    }
    // Check if user with userId exists
    const user = await getUsersById(projectData.userId);
    if (user === null) {
      return { Error: 'userId must be an existing user' };
    }
    // Create a new project
    const project = await projectStore.createProject(projectData);
    return { project: project };
  } catch (error) {
    return { Error: `Could not create a new project. Error: ${error}` };
  }
};

// Delete a project
export const deleteProject = async (id: string) => {
  try {
    const project = await projectStore.deleteProject(id);
    return project;
  } catch (error) {
    return null;
  }
};

// Update a project
export const updateProject = async (id: string, projectData: UpdateProject) => {
  try {
    // Check if the blog exists
    const project = await projectStore.getSingleProject(id);
    if (project === null) {
      return null;
    }
    // Check the length of the title.
    if (projectData.title && projectData.title.length < 3) {
      return { Error: 'title must be at least 3 characters long' };
    }
    // Check the length of the content.
    if (projectData.content && projectData.content.length < 100) {
      return { Error: 'content must be at least 100 characters long' };
    }
    // Check that signatures must be an array of type string.
    if (projectData.signatures && !Array.isArray(projectData.signatures)) {
      return { Error: 'signatures must be an array of type string' };
    }
    const updatedProject = await projectStore.updateProject(id, projectData);
    return { project: updatedProject };
  } catch (error) {
    return null;
  }
};

// Delete all projects
export const deleteAllProjects = async () => {
  try {
    // Get all blogs first
    const projects = await projectStore.getProjects();
    // Delete all blogs
    for (const project of projects) {
      await projectStore.deleteProject(project.id);
    }
  } catch (error) {
    return null;
  }
};

// Update signatures of a project by appending a new signature
export const updateProjectSignatures = async (
  id: string,
  signature: string
) => {
  try {
    // Check if the project exists
    const project = await projectStore.getSingleProject(id);
    if (project === null) {
      return null;
    }
    // Check that signature must be a string.
    if (typeof signature !== 'string') {
      return { Error: 'signature must be a string' };
    }
    // Update signatures of the project
    const updatedProject = await projectStore.updateSignatures(id, signature);
    return { project: updatedProject };
  } catch (error) {
    return null;
  }
};
