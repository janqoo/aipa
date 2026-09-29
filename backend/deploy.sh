#!/bin/bash

# AWS Perfume Recommendation Backend Deployment Script

set -e

# Configuration
STACK_NAME="perfume-recommendation-backend"
ENVIRONMENT="dev"
REGION="us-east-1"

echo "🚀 Deploying AI Perfume Recommendation Backend to AWS..."

# Check if AWS CLI is configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS CLI is not configured. Please run 'aws configure' first."
    exit 1
fi

# Install Lambda dependencies
echo "📦 Installing Lambda dependencies..."
cd lambda
npm install
cd ..

# Package Lambda function
echo "📦 Packaging Lambda function..."
LAMBDA_ZIP="perfume-api.zip"
cd lambda
if command -v zip &> /dev/null; then
    zip -r ../$LAMBDA_ZIP .
else
    # Windows fallback - use PowerShell to create zip
    powershell "Compress-Archive -Path * -DestinationPath ../$LAMBDA_ZIP -Force"
fi
cd ..

# Upload Lambda package to S3
S3_BUCKET="perfume-recommendation-deployments-$ENVIRONMENT-$(aws sts get-caller-identity --query Account --output text)"
echo "📤 Uploading Lambda package to S3 bucket: $S3_BUCKET"

# Create S3 bucket if it doesn't exist
if ! aws s3 ls "s3://$S3_BUCKET" 2>&1 > /dev/null; then
    echo "Creating S3 bucket: $S3_BUCKET"
    aws s3 mb "s3://$S3_BUCKET" --region $REGION
fi

aws s3 cp $LAMBDA_ZIP "s3://$S3_BUCKET/lambda/$LAMBDA_ZIP"

# Update CloudFormation template with S3 bucket reference
TEMPLATE_FILE="template-updated.yaml"
cp template.yaml $TEMPLATE_FILE

# Replace S3 bucket reference in template
if [[ "$OSTYPE" == "darwin"* ]] || [[ "$OSTYPE" == "linux-gnu"* ]]; then
    sed -i "s|BucketName: !Ref S3Bucket|BucketName: $S3_BUCKET|" $TEMPLATE_FILE
    sed -i "s|S3Key: lambda/perfume-api.zip|S3Key: lambda/$LAMBDA_ZIP|" $TEMPLATE_FILE
else
    # Windows sed
    sed -i "s|BucketName: !Ref S3Bucket|BucketName: $S3_BUCKET|" $TEMPLATE_FILE
    sed -i "s|S3Key: lambda/perfume-api.zip|S3Key: lambda/$LAMBDA_ZIP|" $TEMPLATE_FILE
fi

# Deploy CloudFormation stack
echo "🏗️  Deploying CloudFormation stack: $STACK_NAME"
aws cloudformation deploy \
    --template-file $TEMPLATE_FILE \
    --stack-name $STACK_NAME \
    --parameter-overrides Environment=$ENVIRONMENT \
    --capabilities CAPABILITY_IAM \
    --region $REGION

# Get stack outputs
echo "📋 Getting stack outputs..."
API_URL=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' \
    --output text \
    --region $REGION)

USER_POOL_ID=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`UserPoolId`].OutputValue' \
    --output text \
    --region $REGION)

USER_POOL_CLIENT_ID=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`UserPoolClientId`].OutputValue' \
    --output text \
    --region $REGION)

S3_BUCKET_NAME=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`S3BucketName`].OutputValue' \
    --output text \
    --region $REGION)

# Create .env file for frontend
echo "📝 Creating .env file for frontend..."
cat > ../.env << EOF
VITE_API_BASE_URL=$API_URL
VITE_AWS_REGION=$REGION
VITE_COGNITO_USER_POOL_ID=$USER_POOL_ID
VITE_COGNITO_CLIENT_ID=$USER_POOL_CLIENT_ID
VITE_S3_BUCKET=$S3_BUCKET_NAME
VITE_ENVIRONMENT=$ENVIRONMENT
EOF

# Upload perfume images to S3
echo "🖼️  Uploading perfume images to S3..."
aws s3 sync ../public/perfume-images "s3://$S3_BUCKET_NAME/perfume-images/" --acl public-read

# Populate database with initial data
echo "🗄️  Populating database with perfume data..."
export PERFUMES_TABLE="perfume-recommendation-perfumes-$ENVIRONMENT"
node populate-db.js

# Clean up
rm $LAMBDA_ZIP $TEMPLATE_FILE

echo "✅ Deployment completed successfully!"
echo ""
echo "📋 Backend Configuration:"
echo "API URL: $API_URL"
echo "User Pool ID: $USER_POOL_ID"
echo "User Pool Client ID: $USER_POOL_CLIENT_ID"
echo "S3 Bucket: $S3_BUCKET_NAME"
echo ""
echo "🔧 Next steps:"
echo "1. Update your frontend .env file with the values above"
echo "2. Test the API endpoints"
echo "3. Set up CI/CD pipeline for future deployments"
echo ""
echo "📚 Useful commands:"
echo "• View stack: aws cloudformation describe-stacks --stack-name $STACK_NAME --region $REGION"
echo "• Delete stack: aws cloudformation delete-stack --stack-name $STACK_NAME --region $REGION"
echo "• View logs: aws logs tail /aws/lambda/perfume-api-$ENVIRONMENT --region $REGION"