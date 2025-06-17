# Backend app

### Setup

rename .env.copy to .env and set variables for mysql & redis configuration

```
REDIS_HOST=redis://redis
REDIS_PORT=6379

MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=app_db
MYSQL_USER=user
MYSQL_PASSWORD=password
MYSQL_PORT=3306

DATABASE_URL="mysql://root:rootpassword@127.0.0.1:3306/mydb"

```


### Prisma Migration

To sync migrations run

`npm run db:push`

### Testing

To run integration tests for apis

`npm run test`
