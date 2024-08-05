# docker build -t zk-demo-company -f company.dockerfile .

FROM node:lts-alpine@sha256:9e38d3d4117da74a643f67041c83914480b335c3bd44d37ccf5b5ad86cd715d1

RUN mkdir /app

WORKDIR /app

COPY ./app-company /app

RUN apk update && apk add curl jq

RUN npm install

HEALTHCHECK CMD wget --no-verbose --tries=1 --spider http://localhost:3001 || exit 1

ENTRYPOINT [ "npm", "run", "dev" ]

# docker run --rm -it --name zk-company -h zk-company -p 3001:3001 --entrypoint /bin/sh zk-demo-company

# docker run --rm -it --name zk-company -h zk-company -p 3001:3001 -v "$PWD/app-company":/app --entrypoint /bin/sh zk-demo-company

# docker run --rm -it --name zk-company -h zk-company -p 3001:3001 zk-demo-company

# is_healthy() { if [[ "$(docker inspect --format='{{.State.Health.Status}}' zk-company 2> /tmp/err)" == "healthy" ]]; then echo "healthy"; else echo ""; fi; };

# echo -en "\n\nWaiting..."; RES=""; while [[ -z "$RES" ]]; do sleep .1; RES=$(is_healthy); echo -n .; done; echo;
