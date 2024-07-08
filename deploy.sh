#!/usr/bin/env bash

set -e
echo "Building Files"
if ! test -f .env.local; then
  gcloud secrets versions access latest --project="this-is-grow" --secret="matthews-faust-env" --out-file=".env.local"
fi

npm run build && mkdir ./matthews-build && rsync -av --exclude='node_modules' --exclude='matthews-build' ./ ./matthews-build

echo "Copying Files to VM"
gcloud compute scp --project="this-is-grow" -q --zone="us-central1-a" --recurse ./matthews-build matthews-website-fe:~/

echo "Copying Files Complete"
rm -rf ./matthews-build
rm -rf .env.local

# echo "Moving Files"
gcloud compute ssh --project="this-is-grow" --zone="us-central1-a" matthews-website-fe --command 'sudo chown -R matthews-fe:matthews-fe ~/matthews-build && sudo rm -rf /var/www/matthews-build && sudo -u matthews-fe cp -r ~/matthews-build /var/www/ && sudo rm -rf ~/matthews-build'
gcloud compute ssh --project="this-is-grow" --zone="us-central1-a" matthews-website-fe --command 'cd ../../var/www/matthews-build && sudo --user=matthews-fe bash -c -l "npm i && pm2 kill && pm2 start && pm2 save"'
# echo "Deploy Complete"