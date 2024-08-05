# docker build -t zk-demo-initiator -f initiator.dockerfile .
FROM python:3.10-alpine@sha256:02384776f32c7b09c3e17914dc1d386ca543c599713f7b8d647e0c8eab0fb536

# Create the app directory in the container
RUN mkdir /app
WORKDIR /app

# Prepare the Python env
RUN python -m venv /app/venv
RUN /bin/sh -c "source /app/venv/bin/activate"
ENV PATH="/app/venv/bin:$PATH"

# Upgrade PIP then install dependencies
RUN pip install --upgrade pip
RUN pip install fastapi==0.110.3 uvicorn==0.30.1 python-multipart==0.0.9 ezkl==11.4.2

# Update and install curl as it is needed for the healthcheck process
RUN apk --no-cache add curl

# Copy the main Python app file
COPY ./app-init/app/main.py /app/main.py

# Copy the utils Python app file
COPY ./app-init/app/utils.py /app/utils.py

# Expose the needed port
EXPOSE 8001

# Check the health of the container
HEALTHCHECK CMD curl --fail http://localhost:8001/v1/ || exit 1

# The entrypoint for the container that can be overwritten with --entrypoint /bin/sh
ENTRYPOINT ["uvicorn", "--host=0.0.0.0", "main:app", "--port=8001"]

# docker run --rm -it --name zk-initiator -h zk-initiator -p 8001:8001 --entrypoint /bin/sh zk-demo-initiator

# docker run --rm -it --name zk-initiator -h zk-initiator -p 8001:8001 -v "$PWD/app-init/app/data":/app/data zk-demo-initiator

# docker run --rm -it --name zk-initiator -h zk-initiator -p 8001:8001 zk-demo-initiator
