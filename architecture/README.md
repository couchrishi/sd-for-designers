
# The Workflow

1. User uploads images via Cloud Run
2. Cloud run uploads the files 
3. Cloud run also updates the "upload job" status on Firestore
4. Cloud run publishes a message to PubSub with the new “jobID”
5. A Cloud function picks up this new jobID (through a subscription)
6. The cloud function triggeres a new Vertex AI Pipeline & runs the The 1st step/component : Fetches the Cloud Storage bucket path for the images (instance) from Firestore & runs the Vertex AI custom container training job
7. The pipeline executes the second step of uploading the output artifacts to a Cloud storage bucket location
8. Stores the model in a model registry
8. Creates/Updates a Vertex endpoint and deploys the model for consumption


