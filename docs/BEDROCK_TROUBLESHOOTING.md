# Bedrock AI Features Troubleshooting

## Why Your AI Features Stop Working Between Sessions

The most common cause: **AWS credentials expire or aren't available when you restart the server the next day**.

### The Problem
Your `app.py` relies on AWS credentials that need to be present EVERY time you start the server:
- Your AWS Access Key ID and Secret Access Key
- These are typically stored in: `C:\Users\{username}\.aws\credentials`

When the server starts, it checks for these credentials. If they're missing or expired, Bedrock won't work.

---

## Quick Fix: Check Your Credentials

### Step 1: Verify AWS Credentials Are Available
Open PowerShell and run:
```powershell
aws sts get-caller-identity
```

**Expected output** (means credentials are good):
```
{
    "UserId": "AIDA43MOEDA6KFRBVKR5G",
    "Account": "883450714172",
    "Arn": "arn:aws:iam::883450714172:user/alsafi"
}
```

**If you see an error** (credentials are missing):
```
Unable to locate credentials
```

### Step 2: Re-configure AWS (if needed)
```powershell
aws configure
```

Then enter:
1. AWS Access Key ID: [your key from AWS]
2. AWS Secret Access Key: [your secret from AWS]
3. Default region: us-east-1
4. Default output format: json

---

## How to Know If Bedrock Is Working

### Health Check Endpoint
When your server is running, test this endpoint:

```powershell
Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing | ConvertFrom-Json | ConvertTo-Json
```

**Good response** (Bedrock is available):
```json
{
    "server": "running",
    "bedrock_available": true,
    "bedrock_error": null,
    "agent_id": "AOEJIIAEW5",
    "agent_alias_id": "ITLSPPP3S9",
    "region": "us-east-1"
}
```

**Bad response** (Bedrock is NOT available):
```json
{
    "server": "running",
    "bedrock_available": false,
    "bedrock_error": "Unable to locate credentials. You can configure credentials by running \"aws configure\".",
    "agent_id": "AOEJIIAEW5",
    "agent_alias_id": "ITLSPPP3S9",
    "region": "us-east-1"
}
```

---

## Startup Checklist

Every time you start the server, you should see these messages:
```
✓ AWS credentials found for account: 883450714172
✓ User/Role: arn:aws:iam::883450714172:user/alsafi
✓ Bedrock client initialized successfully
✓ Agent ID: AOEJIIAEW5
✓ Agent Alias ID: ITLSPPP3S9
```

**If you see ✗ instead of ✓**, your AWS credentials are the problem.

---

## Common Issues & Solutions

### Issue: "Bedrock not available: Unable to locate credentials"
**Cause**: AWS credentials file is missing or not found
**Fix**: 
```powershell
aws configure
```

### Issue: "Bedrock not available: The user: arn:aws:iam::883450714172:user/alsafi is not authorized"
**Cause**: Your IAM user doesn't have Bedrock permissions
**Fix**: 
1. Go to AWS Console → IAM → Users → Select your user
2. Add the policy: `AmazonBedrockFullAccess` or `AmazonBedrockAgentFullAccess`

### Issue: "Invalid Agent ID: AOEJIIAEW5"
**Cause**: The agent ID is wrong or doesn't exist in your account
**Fix**:
1. Go to AWS Bedrock Console
2. Find your actual agent ID in the "Agents" section
3. Update `AGENT_ID = "YOUR_ACTUAL_ID"` in `app.py`
4. Do the same for `AGENT_ALIAS_ID`

### Issue: Server runs but AI features return generic errors
**Cause**: Check the server logs
**Fix**: Look at the terminal where your server is running. You should see detailed error messages that explain what's wrong.

---

## How to Permanently Fix This

### Option 1: Use Environment Variables (Recommended)
Create a `.env` file in the project root:
```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
```

Then update `app.py` to load them:
```python
from dotenv import load_dotenv
load_dotenv()
```

### Option 2: Store Credentials in AWS Config
Make sure your `~/.aws/credentials` file has the right format:
```
[default]
aws_access_key_id = YOUR_ACCESS_KEY
aws_secret_access_key = YOUR_SECRET_KEY
```

And your `~/.aws/config` file:
```
[default]
region = us-east-1
output = json
```

### Option 3: Use AWS SSO (Best for Production)
```powershell
aws sso login --profile your-profile
```

---

## Testing the AI Feature

Once Bedrock is working, test it with:

```powershell
# Terminal 1: Start the server
python app.py

# Terminal 2: Test the recommendations endpoint
$body = @{ query = "I like sweet fruity perfumes" } | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:5000/recommendations" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body `
  -UseBasicParsing | ConvertFrom-Json | ConvertTo-Json
```

---

## Checking Server Logs

When something goes wrong, the first place to look is your server terminal. It will show:
- AWS credential status on startup
- Each API call error in detail
- Full stack traces to help debug

**Always check the server logs first before troubleshooting!**

---

## Summary

| Check | Command |
|-------|---------|
| AWS Credentials Available? | `aws sts get-caller-identity` |
| AWS Region Correct? | `aws configure` → check region = us-east-1 |
| Bedrock Available? | `Invoke-WebRequest http://localhost:5000/health` |
| Server Logs Clear? | Look at terminal where you ran `python app.py` |
| Agent IDs Correct? | Check AGENT_ID and AGENT_ALIAS_ID in `app.py` |

