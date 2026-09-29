# AI Perfume System - Claude 3.5 Sonnet Integration Guide

## Overview

This guide explains how to deploy and use the upgraded AI Perfume Recommendation System with Claude 3.5 Sonnet via AWS Bedrock.

## What's New

### 1. **Photo Analyzer with Vision Capabilities**
The photo analyzer now uses Claude's vision capabilities to:
- Identify perfume bottles from photos
- Extract brand and product name
- Detect concentration (EDT, EDP, etc.)
- Analyze fragrance notes (top, middle, base)
- Find affordable dupes and alternatives
- Classify into designer/niche/drugstore tiers

### 2. **AI-Powered Recommendations**
Recommendations are now powered by Claude 3.5 Sonnet to:
- Understand natural language preferences
- Match user queries to perfumes with reasoning
- Suggest complementary fragrances
- Provide personalized alternatives (dupes)
- Score recommendations with confidence levels

### 3. **Strongest Available Model**
Claude 3.5 Sonnet is AWS Bedrock's most capable model for this use case:
- Superior natural language understanding
- Advanced image analysis with vision capability
- Nuanced fragrance knowledge
- Better context understanding

---

## Prerequisites

1. **AWS Account** with:
   - Access to AWS Bedrock (must be enabled in your region)
   - Lambda, API Gateway, DynamoDB, S3, Cognito services
   - Appropriate IAM permissions

2. **AWS CLI** configured:
   ```bash
   aws configure
   ```

3. **Node.js 18+** installed

4. **Bedrock Model Access**:
   - Go to AWS Bedrock console
   - Click "Model access" in the left menu
   - Request access to `Anthropic Claude 3.5 Sonnet`
   - Wait for approval (usually instant)

---

## Installation & Deployment

### Step 1: Update Environment Variables

Create or update `.env.local` in the project root:

```env
# Frontend
VITE_API_BASE_URL=https://YOUR_API_GATEWAY_URL.execute-api.REGION.amazonaws.com/dev
VITE_PHOTO_ANALYSIS_ENDPOINT=https://YOUR_API_GATEWAY_URL.execute-api.REGION.amazonaws.com/dev/analyze-photo

# AWS Configuration (for local development only)
AWS_REGION=us-east-1
BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2
```

### Step 2: Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend Lambda dependencies
cd backend/lambda
npm install
cd ../..
```

### Step 3: Deploy Infrastructure

```bash
# Navigate to backend directory
cd backend

# Make deploy script executable (Linux/Mac)
chmod +x deploy.sh

# Run deployment (uses CloudFormation)
./deploy.sh

# On Windows PowerShell:
powershell -ExecutionPolicy Bypass -File deploy.ps1
```

The deployment script will:
- Create/update AWS resources
- Package and upload Lambda functions
- Configure API Gateway endpoints
- Generate configuration files

### Step 4: Enable Bedrock Model Access

Ensure Claude 3.5 Sonnet access is enabled:

```bash
aws bedrock list-foundation-models \
  --query "modelSummaries[?contains(modelId, 'claude-3-5-sonnet')]"
```

If not found, request model access in AWS Bedrock console.

### Step 5: Build & Run Locally

```bash
# Build frontend
npm run build

# Start development server
npm run dev
```

---

## API Endpoints

### Photo Analysis
**POST** `/analyze-photo`

Request:
```json
{
  "imageBase64": "base64_encoded_image_string",
  "mimeType": "image/jpeg"
}
```

Response:
```json
{
  "data": {
    "identified": true,
    "brand": "Chanel",
    "name": "No. 5",
    "concentration": "Eau de Parfum",
    "tier": "designer",
    "scentProfile": "Timeless floral with aldehydic character...",
    "notes": {
      "top": ["Bergamot", "Lemon", "Aldehydes"],
      "middle": ["Rose", "Jasmine", "Iris"],
      "base": ["Sandalwood", "Vetiver", "Musk"]
    },
    "accords": ["floral", "aldehydic", "classic"],
    "confidence": 0.98,
    "hasDupes": true,
    "dupes": [
      {
        "brand": "Avon",
        "name": "Timeless Classic",
        "price": "$15",
        "reason": "Similar floral composition with aldehydic opening"
      }
    ],
    "similarProfiles": [
      {
        "brand": "Estée Lauder",
        "name": "Beautiful",
        "reason": "Similar floral structure with creamy base"
      }
    ]
  },
  "source": "bedrock",
  "model": "claude-3-5-sonnet",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### AI Recommendations
**POST** `/recommendations`

Request:
```json
{
  "query": "I love fresh citrus scents perfect for summer beach days",
  "limit": 5,
  "includeAlternatives": true
}
```

Response:
```json
{
  "data": [
    {
      "id": "perfume_id_1",
      "score": 0.95,
      "reason": "This fragrance matches your preference for fresh citrus...",
      "highlights": ["Bergamot", "Lime", "Sea salt"],
      "whyBetter": "Specifically designed for warm weather with excellent longevity",
      "dupes": [
        {
          "brand": "Generic Brand",
          "name": "Fresh Coast",
          "price": "$25",
          "reason": "Similar citrus-marine profile at fraction of price"
        }
      ]
    }
  ],
  "query": "I love fresh citrus scents perfect for summer beach days",
  "source": "bedrock",
  "model": "claude-3-5-sonnet",
  "timestamp": "2024-01-15T10:30:00Z",
  "totalAvailable": 150
}
```

---

## Features & Capabilities

### Photo Analyzer Features

| Feature | Description |
|---------|-------------|
| **Brand Detection** | Identifies perfume brand from bottle label |
| **Name Extraction** | Extracts perfume name with concentration |
| **Note Analysis** | Predicts fragrance pyramid notes |
| **Tier Classification** | Categorizes as designer/niche/drugstore |
| **Confidence Score** | Provides accuracy percentage (0-100%) |
| **Dupe Finding** | Suggests affordable alternatives |
| **Similar Profiles** | Recommends complementary scents |

### Recommendation Features

| Feature | Description |
|---------|-------------|
| **Natural Language** | Understands conversational queries |
| **Scoring** | Provides confidence scores (0-1) |
| **Reasoning** | Explains why each perfume matches |
| **Alternatives** | Suggests budget options automatically |
| **Personalization** | Learns from user preferences |

---

## Configuration & Customization

### Adjust AI Model Parameters

Edit `backend/lambda/bedrock-utils.js`:

```javascript
// Change max tokens for longer responses
const maxTokens = 3000; // default: 2000

// Add system prompt for specific behavior
const systemPrompt = "You are an expert fragrance sommelier...";
```

### Customize Image Analysis

Modify the photo analyzer prompt in `bedrock-utils.js`:

```javascript
async function analyzePermumeImage(imageBase64, imageMediaType) {
  const prompt = `
    // Your custom prompt here
    // Control what Claude analyzes and returns
  `;
  // ...
}
```

### Adjust Recommendation Scoring

Edit `backend/lambda/ai-recommendations.js` to customize:
- Number of recommendations returned
- Scoring criteria
- Alternative suggestions logic

---

## Troubleshooting

### "Model access denied" Error

**Problem**: Bedrock returns model access error  
**Solution**:
1. Go to AWS Bedrock console
2. Click "Model access"
3. Search for "Claude 3.5 Sonnet"
4. Request access if not already done
5. Wait for approval (usually instant)

### Photo Analysis Returns Null

**Problem**: Image analysis fails or returns incomplete data  
**Solution**:
- Ensure image is clear perfume bottle photo
- Check file size < 4MB
- Try different image angles
- Verify Bedrock permissions in IAM role

### API Timeout (Lambda runs for 60s)

**Problem**: Analysis takes too long  
**Solution**:
- Reduce image resolution before upload
- Optimize Lambda memory (currently 512MB)
- Use faster internet connection

### CORS Errors from Frontend

**Problem**: Frontend can't call API endpoints  
**Solution**:
```yaml
# Already configured in template.yaml but verify:
CorsConfiguration:
  CorsRules:
    - AllowedHeaders: ['*']
      AllowedMethods: [GET, POST, PUT, DELETE]
      AllowedOrigins: ['*']
```

---

## Monitoring & Costs

### CloudWatch Logs

View Lambda execution logs:
```bash
aws logs tail /aws/lambda/perfume-photo-analyzer-dev --follow
aws logs tail /aws/lambda/perfume-ai-recommendations-dev --follow
```

### Bedrock Costs

Pricing for Claude 3.5 Sonnet (as of 2024):
- **Input**: $0.003 per 1K tokens (~750 words)
- **Output**: $0.015 per 1K tokens
- **Vision**: Included in token count

Estimate: $0.02-0.05 per analysis request

### Optimize Costs

1. **Cache responses** for common queries
2. **Limit perfume catalog** sent to Claude (currently 50 max)
3. **Use mock data** during development
4. **Set Lambda timeouts** appropriately

---

## Advanced Usage

### Batch Processing

Process multiple images:
```javascript
const images = [/* array of base64 images */];
const results = await Promise.all(
  images.map(img => analyzePermumeImage(img))
);
```

### Custom Model Switching

To use a different Claude model:

```javascript
// In bedrock-utils.js
const MODEL_ID = "anthropic.claude-3-opus-20240229"; // Change model
```

### Streaming Responses

For real-time analysis:
```javascript
// Use InvokeModelWithResponseStream for streaming
const command = new InvokeModelWithResponseStreamCommand({...});
```

---

## Support & Resources

- **AWS Bedrock Docs**: https://docs.aws.amazon.com/bedrock/
- **Claude Documentation**: https://docs.anthropic.com/claude/
- **AWS CLI Reference**: https://docs.aws.amazon.com/cli/

---

## Version Info

- **Claude Model**: 3.5 Sonnet (anthropic.claude-3-5-sonnet-20241022-v2)
- **AWS SDK**: @aws-sdk/client-bedrock-runtime (v3)
- **Node.js Runtime**: 18.x
- **React Frontend**: 18.2+

---

## Next Steps

1. ✅ Deploy infrastructure
2. ✅ Enable Bedrock model access
3. ✅ Test photo analyzer with perfume images
4. ✅ Test recommendations with natural language queries
5. 📊 Monitor CloudWatch logs and costs
6. 🚀 Scale with caching and optimization
