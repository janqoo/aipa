# AI Perfume Assistant

A full-stack fragrance discovery app that helps users identify perfumes from photos, explore a curated catalog, and get AI-powered recommendations grounded in fragrance knowledge and product data.

## Key Features
- Photo-based perfume identification and visual product matching
- AI chatbot with a fragrance knowledge base and recommendation guidance
- Product catalog with search, filtering, and brand/category browsing
- Favorites and personal fragrance collections
- User authentication and protected account flows

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS

### Backend
- Python / Flask
- Node.js
- AWS Lambda
- API Gateway

### AI & Cloud
- AWS Bedrock
- Amazon Cognito
- Amazon S3
- Amazon DynamoDB
- AWS SAM / CloudFormation

## Project Structure
```text
ai-perfume-recommendation-system/
+-- backend/
+-- docs/
+-- public/
+-- scripts/
+-- src/
+-- .env.example
+-- .gitignore
+-- app.py
+-- README.md
+-- package.json
+-- vite.config.mts
+-- tailwind.config.cjs
```

## Setup

### Frontend
1. Open a terminal in the project root.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the app locally:
   ```bash
   npm run dev -- --host 0.0.0.0
   ```

### Backend
1. Use the Python environment for the Flask API and recommendation services.
2. Install Python dependencies as needed for the backend scripts and API.

### Environment Configuration
This project requires a local `.env` file with AWS, Cognito, and API configuration values for the app to run correctly. Copy `.env.example` to `.env` and fill in the required values before starting the app.

## About this project
This project was built as a graduation project focused on creating a modern AI-powered fragrance assistant with full-stack cloud integration.