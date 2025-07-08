echo "Opening a Pull Request"

curl -X 'POST' \
  'http://139.59.21.103:3000/api/v1/repos/siddharth/cgoa-demos/pulls' \
  -H 'accept: application/json' \
  -H "authorization: $GITEA_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
  "assignee": "siddharth",
  "assignees": [
    "siddharth"
  ],
  "base": "main",
  "body": "Updated deployment specification with a new image version.",
  "head": "feature-gitea",
  "title": "Updated background"
}'

echo "Success"