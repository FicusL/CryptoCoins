#!/usr/bin/env bash

SOURCE_REPOSITORY_URL=git@gitlab.com:ZichainMoscowIT/Zichange/zichange-api.git
DESTINATION_REPOSITORY_URL=git@gitlab.com:ZichainMoscowIT/Zichange/new-zichain-api.git

echo from: ${SOURCE_REPOSITORY_URL}
echo to: ${DESTINATION_REPOSITORY_URL}

rm -rf tmp_synchronization_repository_directory
mkdir tmp_synchronization_repository_directory
cd tmp_synchronization_repository_directory

git clone ${SOURCE_REPOSITORY_URL} repository_from
git clone ${DESTINATION_REPOSITORY_URL} repository_to

rm -rf ./repository_from/.git
mv ./repository_to/.git ./repository_from/.git

cd repository_from
git add .
git commit -m "Synchronized with source repository"
git push

cd ../../
rm -rf tmp_synchronization_repository_directory

echo "end"
