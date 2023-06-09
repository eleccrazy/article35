import { Project } from '@prisma/client';
import client from '../database';

// Define the shape of the data that will be used to create a new project.
export type CreateProject = {
  title: string;
  content: string;
  signatures: string[];
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
};

// Define the shape of the data that will be used to update a project.
export type UpdateProject = {
  title?: string;
  content?: string;
  signatures?: string[];
  userId?: string;
  updatedAt?: Date;
};

// Define a class that represents a projects table in the database
export class ProjectStore {
  // Get all projects
  async getProjects(): Promise<Project[]> {
    try {
      const projects = await client.project.findMany();
      return projects;
    } catch (error) {
      throw new Error(`Could not get all projects. Error: ${error}`);
    } finally {
      await client.$disconnect();
    }
  }

  // Get a single project by its id.
  async getSingleProject(id: string): Promise<Project | null> {
    try {
      const project = await client.project.findUnique({
        where: { id: id }
      });
      return project;
    } catch (error) {
      throw new Error(`Could not get a project with id ${id}. Error: ${error}`);
    } finally {
      await client.$disconnect();
    }
  }

  // Create a new Project.
  async createProject(projectData: CreateProject): Promise<Project> {
    try {
      const project: Project = await client.project.create({
        data: projectData
      });
      return project;
    } catch (error) {
      throw new Error(`Could not create a new project. Error: ${error}`);
    } finally {
      await client.$disconnect();
    }
  }

  // Delete a project by its id.
  async deleteProject(id: string): Promise<Project | null> {
    try {
      const project = await client.project.delete({
        where: { id: id }
      });
      return project;
    } catch (error) {
      throw new Error(`Could not get a project with id ${id}. Error: ${error}`);
    } finally {
      await client.$disconnect();
    }
  }

  // Update a project by its id.
  async updateProject(
    id: string,
    projectData: UpdateProject
  ): Promise<Project | null> {
    try {
      const project = await client.project.update({
        where: { id: id },
        data: projectData
      });
      return project;
    } catch (error) {
      throw new Error(`Could not get a project with id ${id}. Error: ${error}`);
    } finally {
      await client.$disconnect();
    }
  }
  // Update array of signatures by appending a new signature
  async updateSignatures(
    id: string,
    signature: string
  ): Promise<Project | null> {
    try {
      const project = await client.project.update({
        where: { id: id },
        data: { signatures: { push: signature } }
      });
      return project;
    } catch (error) {
      throw new Error(`Could not get a project with id ${id}. Error: ${error}`);
    } finally {
      await client.$disconnect();
    }
  }
}
