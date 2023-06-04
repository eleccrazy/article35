# API Documentation

Implemented HTTP status codes: 200, 201, 400, 401, 404, 500

## /api/users route

1. `POST /api/users/sign-up` - Register a new user

Request

Required Fields

```json
{
  "email": "string",
  "password": "string",
  "firstName": "string"
}
```

Optional Fields

```json
{
  "lastName?": "string",
  "bio?": "string",
  "phone?": "string",
  "role?": "Role"
}
```

    - Role must be one of the following: "ADMIN", "USER" (default is "USER")

    - Response: A user object and a token on success or an error message on failure

2. `POST /api/users/login` - Login a user

Request

```json
{
  "email": "string",
  "password": "string"
}
```

    - Response: A user object and a token on success or an error message on failure

3.  `GET /api/users` - Get all users (Admin only) [Token required]

    - Response: a list of users on success or an error message on failure

4.  `GET /api/users/:id` - Get a user by id. [Token required]

    - Response: a user object on success or an error message on failure

5.  `PUT /api/users/:id` - Update a user by id. [Token required]

    - Response: an updated user object on success or an error message on failure

6.  `DELETE /api/users/:id` - Delete a user by id. [Token required]

    - Response: a success message on success or an error message on failure

7.  `GET /api/users/:id/blogs` - Get all blog posts created by a user. [Token required]

    - Response: a list of blog posts on success or an error message on failure

8.  `GET /api/users/:id/projects` - Get all projects created by a user. [Token required]

    - Response: a list of projects on success or an error message on failure

9.  `GET /api/users/:id/likes` - Get all likes created by a user. [Token required]

    - Response: a list of likes on success or an error message on failure

10. `GET /api/users/:id/comments` - Get all comments created by a user. [Token required]

        - Response: a list of comments on success or an error message on failure

11. `GET /api/users/:id/events` - Get all events created by a user. [Token required]

        - Response: a list of events on success or an error message on failure

12. `PUT /api/users/user-id/promote` - Promote a user to admin. [Token required] (Only Admins can promote users)

        - Response: a success message on success or an error message on failure

13. `PUT /api/users/user-id/demote` - Demote a user to user. [Token required] (Only Admins can demote users)

        - Response: a success message on success or an error message on failure

## /api/blogs route

1. `POST /api/blogs` - Create a new blog post. [Token required]

Request

```json
{
  "title": "string",
  "content": "string",
  "summary": "string",
  "author": "string",
  "links": ["link1", "link2", ".."]
}
```

    - Response: a blog post object on success or an error message on failure

2.  `GET /api/blogs` - Get all blog posts. [Token required] (Only Admins can get all blog posts)

        - Response: a list of blog posts on success or an error message on failure

3.  `GET /api/blogs/:id` - Get a blog post by id

        - Response: a blog post object on success or an error message on failure

4.  `PUT /api/blogs/:id` - Update a blog post by id. [Token required]

        - Response: an updated blog post object on success or an error message on failure

5.  `DELETE /api/blogs/:id` - Delete a blog post by id. [Token required]

        - Response: a deleted blog object on success or an error message on failure

6.  `GET /api/blogs/:id/likes` - Get all likes for a blog post.

        - Response: a list of likes on success or an error message on failure

7.  `GET /api/blogs/:id/comments` - Get all comments for a blog post.

        - Response: a list of comments on success or an error message on failure

8.  `GET /api/blogs/:id/tags` - Get all tags for a blog post.

        - Response: a list of tags on success or an error message on failure

9.  `PUT /api/blogs/:id/link-tags` - Add tags to a blog post. [Token required]

Request

```json
{
  "tags": ["tag1 id", "tag2 id", ".."]
}
```

    - Response: an updated blog post object on success or an error message on failure

10. `PUT /api/blogs/:id/link-update` - Adds links to a blog post. [Token required]

Request

```json
{
  "link": "string"
}
```

    - Response: an updated blog post object on success or an error message on failure

11. `PUT /api/blogs/get-all/approved` - Get all approved blog posts.

        - Response: a list of blog posts on success or an error message on failure

12. `PUT /api/blogs/get-all/unapproved` - Get all unapproved blog posts. [Token required] (Only Admins can get unapproved blog posts)

        - Response: a list of blog posts on success or an error message on failure

13. `PUT /api/blogs/:id/approve` - Approve a blog post. [Token required] (Only Admins can approve blog posts)

        - Response: an updated blog post object on success or an error message on failure

14. `PUT /api/blogs/:id/unapprove` - Unapprove a blog post. [Token required] (Only Admins can unapprove blog posts)

        - Response: an updated blog post object on success or an error message on failure

## /api/tags route

1. `POST /api/tags` - Create a new tag. [Token required] (Only Admins can create tags)

Request

```json
{
  "name": "string"
}
```

    - Response: a tag object on success or an error message on failure

2.  `GET /api/tags` - Get all tags. [Token required]

        - Response: a list of tags on success or an error message on failure

3.  `GET /api/tags/:id` - Get a tag by id. [Token required]

        - Response: a tag object on success or an error message on failure

4.  `PUT /api/tags/:id` - Update a tag by id. [Token required] (Only Admins can update tags)

        - Response: an updated tag object on success or an error message on failure

5.  `DELETE /api/tags/:id` - Delete a tag by id. [Token required] (Only Admins can delete tags)

        - Response: a deleted tag object on success or an error message on failure

## /api/projects route

1. `POST /api/projects` - Create a new project. [Token required] (Only Admins can create projects)

Request

```json
{
  "title": "string",
  "content": "string",
  "userId": "string"
}
```

    - Response: a project object on success or an error message on failure

2.  `GET /api/projects` - Get all projects.

        - Response: a list of projects on success or an error message on failure

3.  `GET /api/projects/:id` - Get a project by id. [Token required]

        - Response: a project object on success or an error message on failure

4.  `PUT /api/projects/:id` - Update a project by id. [Token required] (Only Admins can update projects)

        - Response: an updated project object on success or an error message on failure

5.  `DELETE /api/projects/:id` - Delete a project by id. [Token required] (Only Admins can delete projects)

        - Response: a deleted project object on success or an error message on failure

6.  `PUT /api/projects/<project_id>/signatures` - Add a signature to a project. [Token required]

Request

```json
{
  "signature": "Email address of the person signin"
}
```

    - Response: an updated project object on success or an error message on failure

## /api/comments route

1. `POST /api/comments` - Create a new comment. [Token required]

Request

```json
{
  "content": "string",
  "userId": "string",
  "blogId": "string"
}
```

    - Response: a comment object on success or an error message on failure

2.  `GET /api/comments/:id` - Get a comment by id. [Token required]

    - Response: a comment object on success or an error message on failure

3.  `PUT /api/comments/:id` - Update a comment by id. [Token required]

    - Response: an updated comment object on success or an error message on failure

4.  `DELETE /api/comments/:id` - Delete a comment by id. [Token required]

    - Response: a deleted comment object on success or an error message on failure

## /api/likes route

1. `POST /api/likes` - Create a new like. [Token required]

Request

```json
{
  "blogId": "string"
}
```

    - Response: a like object on success or an error message on failure

3. `DELETE /api/likes/:id` - Delete a like by id. [Token required]

   - Response: a deleted like object on success or an error message on failure
