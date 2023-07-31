

## Cloud Build will build and publish a custom image for running the Vertex Pipeline Component

1. ** Enable Necessary APIs ** : Make sure that the required APIs are enabled for your project

    gcloud services enable artifactregistry.googleapis.com container.googleapis.com aiplatform.googleapis.com


2. ** Create a repo for your container artifacts ** 

    BUILD_REGIST='your-repo-name'

3. ** Update the service account key path in the Dockerfile


3. ** Replace the values in the cloud-build-config.yaml file with your values (YOUR_IMAGE and YOUR_TAG can be newly added. You should already have the values for the other components - YOUR_HOSTNAME, YOUR_PROJECT_ID and YOUR_REPOSITORY) 

  # Build the custom container image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'YOUR_HOSTNAME/YOUR_PROJECT_ID/YOUR_CREREPOSITORY/YOUR_IMAGE:YOUR_TAG', '.']


  # Push the image to Artifact Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'YOUR_HOSTNAME/YOUR_PROJECT_ID/YOUR_REPOSITORY/YOUR_IMAGE:YOUR_TAG']
    
options:
  machineType: 'N1_HIGHCPU_8'
  diskSizeGb: '200'


4. ** Build your component image by running the Cloud build command ** 

    gcloud builds submit --config cloud-build-config.yaml .

