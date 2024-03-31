# TerralinkDemo

## CI/CD Scripts

### Frontend

- `npm i`
- `npx nx build terralink-demo`
- `docker build --platform linux/amd64 -t {user}/terralink-demo -f client.Dockerfile .`

### Backend

- `npm i`
- `npx nx build terralink-demo-api`
- `docker build --platform linux/amd64 -t {user}/terralink-demo-api -f api.Dockerfile .`
- `docker run -d --env-file="api.env" -p3333:3333 {user}/terralink-demo-api`
