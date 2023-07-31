const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { Firestore } = require('@google-cloud/firestore');
const { Storage } = require('@google-cloud/storage');
const { PubSub } = require('@google-cloud/pubsub');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

async function main() {
  const cors = require('cors'); // Import the cors package

  const app = express();
  const port = 8080;

  // Enable CORS for all requests
  app.use(cors());

  // Initialize Firestore client
  async function initializeFirestore() {
    const projectId = process.env.CLOUDBUILD_PROJECT_ID;
    const cloudBuildSecretName = process.env.CLOUDBUILD_SECRET_NAME;

    if (!projectId || !cloudBuildSecretName) {
      throw new Error('Missing project ID or Firestore secret name');
    }

    const secretName = `projects/${projectId}/secrets/${cloudBuildSecretName}/versions/latest`;

    const client = new SecretManagerServiceClient();
    const [version] = await client.accessSecretVersion({
      name: secretName,
    });
    const credentials = version.payload.data.toString();
    const parsedCredentials = JSON.parse(credentials);

    return new Firestore({
      projectId,
      credentials: parsedCredentials,
    });
  }

  // Initialize Google Cloud Storage client
  async function initializeGCS() {
    const projectId = process.env.CLOUDBUILD_PROJECT_ID;
    const cloudBuildSecretName = process.env.CLOUDBUILD_SECRET_NAME;

    if (!projectId || !cloudBuildSecretName) {
      throw new Error('Missing project ID or Firestore secret name');
    }

    const secretName = `projects/${projectId}/secrets/${cloudBuildSecretName}/versions/latest`;

    const client = new SecretManagerServiceClient();
    const [version] = await client.accessSecretVersion({
      name: secretName,
    });
    const credentials = version.payload.data.toString();
    const parsedCredentials = JSON.parse(credentials);

    return new Storage({
      projectId,
      credentials: parsedCredentials,
    });
  }

  // Initialize Pubsub client for file uploads
  async function initializePubSub() {
    const projectId = process.env.CLOUDBUILD_PROJECT_ID;
    const cloudBuildSecretName = process.env.CLOUDBUILD_SECRET_NAME;

    if (!projectId || !cloudBuildSecretName) {
      throw new Error('Missing project ID or Firestore secret name');
    }

    const secretName = `projects/${projectId}/secrets/${cloudBuildSecretName}/versions/latest`;

    const client = new SecretManagerServiceClient();
    const [version] = await client.accessSecretVersion({
      name: secretName,
    });
    const credentials = version.payload.data.toString();
    const parsedCredentials = JSON.parse(credentials);

    return new PubSub({
      projectId,
      credentials: parsedCredentials,
    });
  }

  let firestore;
  let gcs;
  let pubSubClient;

  try {
    firestore = await initializeFirestore();
    gcs = await initializeGCS();
    pubSubClient = await initializePubSub();

    // Use firestore, gcs, and pubSubClient in your code...
  } catch (error) {
    console.error('Error initializing clients:', error);
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + uniqueSuffix);
    },
  });

  const upload = multer({ storage: storage });

  // Route to upload files
  app.post('/upload', upload.array('images', 10), async (req, res) => {
    try {
      const files = req.files;

      // Check if there are any files uploaded
      if (!files || files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }

      // Step 1: Create a new job with a UUID
      const jobId = uuidv4();
      const overallJobStatus = 'jobInitialized';

      // Step 2: Create a new entry in the "jobs" collection to track overall job status
      await firestore.collection('jobs').doc(jobId).set({
        jobId,
        status: overallJobStatus,
      });

      // Step 3: Upload the files to Google Cloud Storage
      const gcsBucketName = process.env.GCS_BUCKET_NAME;
      const gcsBucket = gcs.bucket(gcsBucketName);
      for (const file of files) {
        const filePath = `instance/${jobId}/${file.filename}`;

        await gcsBucket.upload(file.path, {
          destination: filePath,
          metadata: {
            contentType: file.mimetype,
            metadata: {
              jobId,
            },
          },
        });

        // Step 4: Create a new Firestore entry for each file with status set to 'uploadCompleted'
        const dbEntry = {
          jobId,
          img_path: `gs://${gcsBucketName}/${filePath}`,
          upload_status: 'uploadCompleted',
        };

        // Step 5: Write the entry to Firestore to set status to 'uploadCompleted' for each file
        await firestore.collection('jobDetails').add(dbEntry);
      }

      // Step 6: Check if all individual files are uploaded
      const allFilesUploaded = await checkAllFilesUploaded(jobId, files.length);

      if (allFilesUploaded) {
        await firestore.collection('jobs').doc(jobId).update({ status: 'jobCompleted' });

        // Trigger the Pub/Sub message and update the Firestore collection
        await publishMessage(jobId);
      }

      // Respond with success message
      res.status(200).json({ message: `Uploaded ${files.length} images successfully`, jobId });
    } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  });

  async function checkAllFilesUploaded(jobId, totalFiles) {
    const querySnapshot = await firestore
      .collection('jobDetails')
      .where('jobId', '==', jobId)
      .where('upload_status', '==', 'uploadCompleted')
      .get();

    return querySnapshot.size === totalFiles;
  }

  async function publishMessage(jobId) {
    const topicName = process.env.PUBSUB_TOPIC_NAME;
    const dataBuffer = Buffer.from(JSON.stringify({ jobId }));

    try {
      const messageId = await pubSubClient.topic(topicName).publish(dataBuffer);
      console.log(`Message ${messageId} published.`);
    } catch (error) {
      console.error('Error publishing message:', error);
      throw error;
    }
  }

  try {
    // Rest of your code that uses firestore, gcs, and pubSubClient
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Error initializing clients:', error);
  }
}

main();
