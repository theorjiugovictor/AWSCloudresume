#!/bin/bash

# Configuration
BUCKET_NAME="aws-cloud-labrat"
WEBSITE_FOLDER="./resume"  # Your new local folder

# Sync files to S3
aws s3 sync $WEBSITE_FOLDER s3://$BUCKET_NAME/ \
    --delete \
    --cache-control "max-age=3600"

# Set content types
aws s3 cp s3://$BUCKET_NAME/ s3://$BUCKET_NAME/ \
    --recursive \
    --exclude "*" \
    --include "*.html" \
    --content-type "text/html" \
    --metadata-directive REPLACE

aws s3 cp s3://$BUCKET_NAME/ s3://$BUCKET_NAME/ \
    --recursive \
    --exclude "*" \
    --include "*.css" \
    --content-type "text/css" \
    --metadata-directive REPLACE

aws s3 cp s3://$BUCKET_NAME/ s3://$BUCKET_NAME/ \
    --recursive \
    --exclude "*" \
    --include "*.js" \
    --content-type "application/javascript" \
    --metadata-directive REPLACE

echo "Deployment complete!"
