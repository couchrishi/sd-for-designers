import base64
import os
import json
from google.cloud import aiplatform
from google.oauth2 import service_account
from google.cloud import pubsub_v1

PROJECT_ID = os.environ.get('PROJECT_ID')                     # <---CHANGE THIS
REGION = os.environ.get('REGION')                          # <---CHANGE THIS
PIPELINE_ROOT = os.environ.get('PIPELINE_ROOT') # <---CHANGE THIS
TEMPLATE_PATH = os.environ.get('TEMPLATE_PATH')

def subscribe(event, context):
    """Triggered from a message on a Cloud Pub/Sub topic.
    Args:
        event (dict): Event payload.
        context (google.cloud.functions.Context): Metadata for the event.
    """
    # decode the event payload string
    payload_message = base64.b64decode(event['data']).decode('utf-8')
    # parse payload string into JSON object
    payload_json = json.loads(payload_message)
     # extract the jobId from the JSON object
    jobId = payload_json.get('jobId')

    # trigger pipeline run with payload
    if jobId:
        # call the trigger_pipeline_run function with the jobId
        trigger_pipeline_run(jobId)
    else:
        print("No 'jobId' found in the message.")

def trigger_pipeline_run(jobId):
    """Triggers a pipeline run
    Args:
        payload_json: expected in the following format:
            {
                "pipeline_spec_uri": "<path-to-your-compiled-pipeline>",
                "parameter_values": {
                    "greet_name": "<any-greet-string>"
                }
            }
    """
    # pipeline_spec_uri = payload_json['pipeline_spec_uri']
    # parameter_values = payload_json['parameter_values']

    # Create a PipelineJob using the compiled pipeline from pipeline_spec_uri
    #service_account_key_file = 'vertex-firestore-sa.json';
    #credentials = service_account.Credentials.from_service_account_file(service_account_key_file)


    aiplatform.init(
        project=PROJECT_ID,
        location=REGION,
        #credentials=credentials,
    )
    job = aiplatform.PipelineJob(
        display_name=f'{jobId}',
        template_path=TEMPLATE_PATH,
        pipeline_root=PIPELINE_ROOT,
        enable_caching=False,
        # parameter_values=parameter_values
            parameter_values= {
            "jobId": jobId  # Pass the jobId as a parameter
            }
        
    )

    # Submit the PipelineJob
    job.submit()
