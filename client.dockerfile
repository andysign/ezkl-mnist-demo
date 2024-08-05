# docker build -t zk-demo-client -f client.dockerfile .

FROM node:lts-alpine@sha256:9e38d3d4117da74a643f67041c83914480b335c3bd44d37ccf5b5ad86cd715d1

RUN mkdir /app

WORKDIR /app

COPY ./app-client /app

RUN npm install

HEALTHCHECK CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

ENTRYPOINT [ "npm", "run", "dev" ]

# docker run --rm -it --name zk-client -h zk-client -p 3000:3000 --entrypoint /bin/sh zk-demo-client

# docker run --rm -it --name zk-client -h zk-client -p 3000:3000 -v "$PWD/app-client":/app --entrypoint /bin/sh zk-demo-client

# docker run --rm -it --name zk-client -h zk-client -p 3000:3000 zk-demo-client

# is_healthy() { if [[ "$(docker inspect --format='{{.State.Health.Status}}' zk-client 2> /tmp/err)" == "healthy" ]]; then echo "healthy"; else echo ""; fi; };

# echo -en "\n\nWaiting..."; RES=""; while [[ -z "$RES" ]]; do sleep .1; RES=$(is_healthy); echo -n .; done; echo;
