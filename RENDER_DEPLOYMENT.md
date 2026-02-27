# Render Deployment Guide for VaraNex AI Backend

## Prerequisites
- Render Account (https://render.com)
- GitHub repository with backend code
- Groq API Key (https://console.groq.com)

## Deployment Steps

### 1. Prepare Repository

Create a `.gitignore` file in the backend directory:
```
node_modules/
.env
.env.local
dist/
*.log
```

### 2. Create Render Service

1. Go to https://dashboard.render.com
2. Click "New +"
3. Select "Web Service"
4. Connect your GitHub repository
5. Fill in the configuration:

**Name:** `varanex-ai-backend`

**Environment:** `Node`

**Build Command:** `npm install`

**Start Command:** `npm start`

### 3. Add Environment Variables

In Render Dashboard:
1. Go to your Web Service → Environment
2. Add the following variables:
   - `GROQ_API_KEY`: Your Groq API key from https://console.groq.com
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: Your Vercel frontend URL (e.g., `https://your-project.vercel.app`)

### 4. Deploy

- Click "Create Web Service"
- Render will automatically build and deploy
- Your backend will be available at `https://your-service-name.onrender.com`

## Getting Groq API Key

1. Visit https://console.groq.com
2. Sign up or login
3. Navigate to API Keys
4. Create a new API key
5. Copy the key to your Render environment variables

## Testing Deployment

### Check Health
```bash
curl https://your-service-name.onrender.com/health
```

Response should be:
```json
{
  "status": "OK",
  "message": "Backend is running"
}
```

### Send Test Message
```bash
curl -X POST https://your-service-name.onrender.com/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "Hello, who are you?"}'
```

## Monitoring

View logs in Render Dashboard:
1. Select your Web Service
2. Go to "Logs"
3. Monitor for errors and performance

## Troubleshooting

### 502 Bad Gateway
- Check that `npm start` command is correct
- Verify all environment variables are set
- Check server logs for errors

### API Key Errors
- Verify GROQ_API_KEY is set correctly
- Check if API key is active at https://console.groq.com
- Ensure no extra spaces or quotes in the key

### Cold Start Issues
- Free tier services have 15-minute inactivity timeout
- First request after inactivity may be slow
- Upgrade to paid plan to avoid cold starts

## Updating Deployment

To redeploy:
1. Push changes to GitHub
2. Render automatically redeploys on push
3. Or manually click "Deploy latest commit" in Render Dashboard

## Cost Considerations

**Free Tier:**
- $0/month
- Auto-stops after 15 minutes of inactivity
- Good for development and testing

**Paid Plans:**
- Starting at $7/month
- Always active
- Better uptime and performance

## Performance Tips

1. Keep request bodies small
2. Implement request timeouts
3. Use pagination for large responses
4. Monitor API usage in Groq Console
