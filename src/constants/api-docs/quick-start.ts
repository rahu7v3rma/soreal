import {
  defaultStyle,
  defaultAspectRatio,
  standardImageApiUrl,
} from "@/constants/create-image/standard";

export const codeSnippets = {
  curl: `curl ${standardImageApiUrl} \\
-X POST \\
-H "Authorization: Bearer YOUR_API_KEY" \\
-H "Content-Type: application/json" \\
-d '{
  "prompt": "A futuristic cityscape with flying cars",
  "style": "${defaultStyle}",
  "aspectRatio": "${defaultAspectRatio}"
}'`,
  javascript: `const apiKey = 'YOUR_API_KEY';
const apiUrl = '${standardImageApiUrl}';

async function generateImage() {
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${apiKey}\`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: "A futuristic cityscape with flying cars",
      style: "${defaultStyle}",
      aspectRatio: "${defaultAspectRatio}"
    })
  });
  
  const data = await response.json();
}

generateImage();`,
  python: `import requests

api_key = "YOUR_API_KEY"
api_url = "${standardImageApiUrl}"

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

payload = {
    "prompt": "A futuristic cityscape with flying cars",
    "style": "${defaultStyle}",
    "aspectRatio": "${defaultAspectRatio}"
}

response = requests.post(api_url, json=payload, headers=headers)`,
};
