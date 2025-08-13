echo "Opening a Pull Request"

curl -X 'POST' \
  'https://3000-port-ot7bvscbcueb36tz.kodekloud.com/api/v1/repos/kk-org/cgoa-demos/pulls' \
  -H 'accept: application/json' \
  -H "authorization: token $GITEA_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
  "assignee": "gitea-admin",    
  "assignees": [
    "gitea-admin"
  ],
  "base": "main",
  "body": "Updated deployment specification with a new image version.",
  "head": "feature-gitea",
  "title": "Updated background"
}'

echo "Success"