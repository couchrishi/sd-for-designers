# Use the official Python image as the base image
FROM python:3.9

# Set the working directory in the container
WORKDIR /app

# Copy the requirements.txt file into the container
COPY requirements.txt .
COPY sai-vertex-sa-key.json .

# Install the required Python libraries using pip
RUN pip install --no-cache-dir -r requirements.txt

# Set the Google Cloud Service Account Credentials
ENV GOOGLE_APPLICATION_CREDENTIALS="sai-vertex-sa-key.json"

# Set the environment variable for your service account key path (replace YOUR_SERVICE_ACCOUNT_KEY.json with the actual file name)
ENV SERVICE_ACCOUNT_KEY_PATH /app/sai-vertex-sa-key.json
