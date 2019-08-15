#!/usr/bin/env bash

if [ "$OSTYPE" == "cygwin" ] || [ "$OSTYPE" == "msys" ] || [ "$OSTYPE" == "win32" ] ; then
    alias gcloud="gcloud.cmd"
    alias gsutil="gsutil.cmd"
    echo "Windows fallback used..."
fi

export SCRIPT_PATH=$(dirname "$0")

# TODO: Load variables from args
export BUCKET_URI=app.zichange.io
export KEY_FILE=zichange-io-storage-service-account.json
export GCLOUD_PROJECT=zichange-io

echo ${BUCKET_URI}

# TODO: Check & install gcloud, gsutil if not exists

# Authorize and set project
gcloud auth activate-service-account --key-file ${SCRIPT_PATH}/${KEY_FILE}
gcloud config set project ${GCLOUD_PROJECT}

# Copy Files
gsutil -m cp -r ${SCRIPT_PATH}/build/* gs://${BUCKET_URI}/

# Make Files Publically Accessible
gsutil -m acl ch -u AllUsers:R -r gs://${BUCKET_URI}/

# Edit the website configuration
gsutil -m web set -m index.html -e index.html gs://${BUCKET_URI}