# Full Stack Open – Containerization Exercises (22–24)

Containerized development and production environments for the Full Stack Open Bloglist application.

## Project Links

- **Repository:** [fs-containers / bloglist-app](https://github.com/mcmnyages/fs-containers/tree/main/fullstackopen-blog-containers-ex22/bloglist-app)
or copy this link:
```
https://github.com/mcmnyages/fs-containers/tree/main/fullstackopen-blog-containers-ex22/bloglist-app
```
- **Course:** Full Stack Open – Containers

## Project Structure

```text
bloglist-app/
├── frontend/
│ ├── dev.Dockerfile
│ └── Dockerfile
├── backend/
│ ├── dev.Dockerfile
│ └── Dockerfile
├── nginx.dev.conf
├── nginx.conf
├── docker-compose.dev.yml
└── docker-compose.yml
```

## Getting Started

### Development Environment (Exercise 22)

Run the application in development mode with hot reloading:

```bash
docker compose -f docker-compose.dev.yml up
```

### Production Environment (Exercise 23)

Build and run the application in production mode:

```bash
docker compose -f docker-compose.yml up --build
```

## Technologies Used

- Docker
- Docker Compose
- Nginx
- React
- Node.js

## Exercises

- **Exercise 22:** Development environment with Docker.
- **Exercise 23:** Production environment with Docker.
- **Exercise 24:** Further containerization improvements.