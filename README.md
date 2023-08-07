# sd-for-designers
A fully automated workflow for triggering, running &amp; managing fine tuning, training &amp; deploying custom stable diffusion models using Vertex AI

## Description

Sd-aa-S is a full automated MLOps pipeline for triggering, managing & tracking Stable diffusion finetuning jobs on GCP using GCP components such as Google Cloud Storage, Cloud Build, Cloud PubSub, Firestore, Cloud Run, Cloud Functions and Vertex AI. It aims to simplify the ML workflows for tuning Stable diffusion using different techniques, starting with Dreambooth. Support for Lora, ControlNet etc. coming soon. The project is targeted ML/Data Engineers, Data Scientists & anybody else interested in or on the road towards building a platform for finetuning stable diffusion at scale. 

## Three Parts

# 1. The App part

    1. Set up your Cloud Environment
    2. Create a backend service for handling uploads to a GCS bucket
        - Receive images from clients and store them under a predefined GCS bucket path
        - Track the status of individual uploads in a Firestore collection
        - Track the status of the overall upload job in a separate Firestore collection 
        - Once the job is compelted, publish the jobID as the message on a predefined PubSub topic
    3. Deploy this backend service as a Cloud Run endpoint using Cloud build
    4. Create a frontend portal to upload images using ReactJs
    5. Deploy the frontend service on Cloud Run

# 2. The Vertex AI part

    1. Set up your Cloud Environment
    2. Create a new custom container artifact for running the pipeline components
    3. Create a new custom container artifact for running the training job itself 
    4. Create a Jupyter notebook outlining the Pipeline flow & components
    5. Compile a YAML file from a Vertex AI workbench and store the precompiled YAML file under a GCS bucket path

 
# 3. The Plumbing part

    1. Set up your Cloud Environment
    2. Create a cloud function that gets triggered every time the jobID is published on a predefinied topic (from 1st part)
    3. Within the cloud function, the python code subscribes to the topic and triggers a Vertex AI pipeline job using the precomiled YAML file (from 2nd part)
    4. The pipeline jobs finetunes the stable diffusion model using Dreambooth, uploads the new custom model to Model registy & deploys an endpoint
    5. The job also updates Firestore with the status of the pipeline job from start to end