# NestJS BLOG

## Client

### Environment Variables

Create a file named `.env.local` in the "client" directory and add the following environment variables:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=f84f4bf59a306ddf514dda61e141c257
NEXT_PUBLIC_BASE_URL=http://localhost:8080
```

## Server

### Environment Variables

Create a file named `.env` in the "client" directory and add the following environment variables:

```env
DATABASE_URL="postgresql://postgres:123@localhost:5432/blog_app?schema=public"
JWT_SECRET="Supersecret"
BASE_URL=http://localhost:8000
```

## Client Setup

```bash
cd client
npm install
```

## Server Setup

```bash
cd server
npm install
# Start the Docker containers
docker compose up
# This command starts the Docker containers to run the database and server.
```

## Run development sever together

Go to outside client and server

```bash
    #if you inside client
    #if you inside server
    cd ..
```

```bash
    npm install
    npm run start:dev
```

## Hire Me

If you are interested in collaborating or need any assistance, feel free to reach out to me at:

📧 Email: shakiba448@gmail.com

Thanks
