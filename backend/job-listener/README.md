# Cloud Function with Vertex Pipeline Trigger

This repository contains code to deploy a Cloud Function that triggers a Vertex Pipeline when a Pub/Sub event is received.

## Prerequisites

Before deploying the Cloud Function, make sure you have the following:

- A Google Cloud project set up with Project ID: `YOUR_PROJECT_ID'.
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) installed and configured.
- Python 3.11 or higher installed locally for development.
- A Pub/Sub topic named `` set up to send events to the Cloud Function whenever an upload job is completed (The uploads are handled by the code under root/backend/upload-handler )

##  Steps


1. **Clone the Repository**: Clone this repository to your local machine.

$ git clone https://github.com/couchrishi/sd-for-designers.git
$ cd sd-for-designers


2. **Activate the Service Account**: Before deploying the Cloud Function, activate the service account with the following command:

$ gcloud auth activate-service-account --key-file=<YOUR_SERVICE_ACCOUNT_KEY>.json #Ensure you have all the right permissions for Cloud functions, Vertex AI and PubSub


3. **Edit the configuration**: Open the job-listener-cloudbuild.yaml file and modify the necessary configuration options, such as the Cloud Function name, runtime, region, and environment variables.


4. **Deploy the Cloud function**

Run this command - gcloud builds submit --config job-listener-cloudbuild.yaml .



