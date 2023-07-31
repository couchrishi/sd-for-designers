# Cloud Run for handling image uploads

This folder contains code to deploy a Cloud Run that handles images uploaded by the end user. These images are stored under a backend GCS bucket path. These are then used by Vertex AI pipeline jobs to fine tune the OSS stable diffusion model & deploy it eventually

## Prerequisites

Before deploying the Cloud Run, make sure you have the following:

- A Google Cloud project set up with Project ID: `YOUR_PROJECT_ID'.
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) installed and configured.
- Node.js installed locally for development.
- Enable Necessary APIs: Make sure that the required APIs are enabled for your project. For Cloud Run, you need to enable the following APIs:
    Cloud Build API: cloudbuild.googleapis.com
    Cloud Run API: run.googleapis.com
    Artifact Registry API
- Artifact Registry Permissions: Ensure that the service account or user you are using to push Docker images to Artifact Registry has the necessary permissions. For example, the service account should have the Artifact Registry Writer role to push images to the repositor

- Before deploying the Cloud Function, activate the service account with the following command:

    $ gcloud auth activate-service-account --key-file=<YOUR_SERVICE_ACCOUNT_KEY>.json #Ensure you have all the right permissions for Cloud functions, Vertex AI and PubSub

##  Steps


1. **Clone the Repository**: Clone this repository to your local machine.

$ git clone https://github.com/couchrishi/sd-for-designers.git
$ cd sd-for-designers


2. **Edit the configuration**: Open the image-uploader-cloudbuild.yaml file and modify the necessary configuration options, such as the Cloud Function name, runtime, region, and environment variables.


4. **Build & Deploy the Cloud function**

Run this command - gcloud builds submit --config image-uploader-cloudbuild.yaml .



