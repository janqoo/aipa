# AWS Perfume Recommendation Backend Deployment Script (PowerShell)

param(
    [string]$Environment = "dev",
    [string]$Region = "us-east-1"
)

$ErrorActionPreference = "Stop"

$STACK_NAME = "perfume-recommendation-backend"
$LAMBDA_ZIP = "perfume-api.zip"
$LAMBDA_S3_KEY = "lambda/perfume-api-$((Get-Date).ToString('yyyyMMddHHmmss')).zip"

Write-Host "[*] Deploying AI Perfume Recommendation Backend to AWS..." -ForegroundColor Green

# Check if AWS CLI is configured
try {
    aws sts get-caller-identity | Out-Null
} catch {
    Write-Host "[!] AWS CLI is not configured. Please run 'aws configure' first." -ForegroundColor Red
    exit 1
}

# Install Lambda dependencies
Write-Host "[+] Installing Lambda dependencies..." -ForegroundColor Yellow
Push-Location lambda
npm install
Pop-Location

# Package Lambda function
Write-Host "[+] Packaging Lambda function..." -ForegroundColor Yellow
Push-Location lambda
if (Get-Command Compress-Archive -ErrorAction SilentlyContinue) {
    Compress-Archive -Path * -DestinationPath ../$LAMBDA_ZIP -Force
} else {
    Write-Host "[!] Compress-Archive not available. Please install Lambda dependencies manually." -ForegroundColor Red
    exit 1
}
Pop-Location

# Get AWS Account ID
$ACCOUNT_ID = aws sts get-caller-identity --query Account --output text
$S3_BUCKET = "perfume-recommendation-deployments-$Environment-$ACCOUNT_ID"

Write-Host "[+] Uploading Lambda package to S3 bucket: $S3_BUCKET" -ForegroundColor Yellow

# Create S3 bucket if it doesn't exist
$S3_EXISTS = aws s3 ls "s3://$S3_BUCKET" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Creating S3 bucket: $S3_BUCKET" -ForegroundColor Yellow
    aws s3 mb "s3://$S3_BUCKET" --region $Region
}

aws s3 cp $LAMBDA_ZIP "s3://$S3_BUCKET/$LAMBDA_S3_KEY"
if ($LASTEXITCODE -ne 0) {
    Write-Host "[!] Failed to upload Lambda package to S3." -ForegroundColor Red
    exit 1
}

# Update CloudFormation template
$TEMPLATE_FILE = "template-updated.yaml"
Copy-Item template.yaml $TEMPLATE_FILE

# Replace S3 bucket reference in template
(Get-Content $TEMPLATE_FILE) -replace 'S3Bucket: !Ref S3Bucket', "S3Bucket: $S3_BUCKET" | Set-Content $TEMPLATE_FILE
(Get-Content $TEMPLATE_FILE) -replace 'S3Key: lambda/perfume-api.zip', "S3Key: $LAMBDA_S3_KEY" | Set-Content $TEMPLATE_FILE

# Deploy CloudFormation stack
Write-Host "[*] Deploying CloudFormation stack: $STACK_NAME" -ForegroundColor Yellow
aws cloudformation deploy `
    --template-file $TEMPLATE_FILE `
    --stack-name $STACK_NAME `
    --parameter-overrides Environment=$Environment `
    --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM `
    --region $Region
if ($LASTEXITCODE -ne 0) {
    Write-Host "[!] CloudFormation deployment failed. Fix the error above and run this script again." -ForegroundColor Red
    exit 1
}

# Get stack outputs
Write-Host "[*] Getting stack outputs..." -ForegroundColor Yellow
$API_URL = aws cloudformation describe-stacks `
    --stack-name $STACK_NAME `
    --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' `
    --output text `
    --region $Region

$USER_POOL_ID = aws cloudformation describe-stacks `
    --stack-name $STACK_NAME `
    --query 'Stacks[0].Outputs[?OutputKey==`UserPoolId`].OutputValue' `
    --output text `
    --region $Region

$USER_POOL_CLIENT_ID = aws cloudformation describe-stacks `
    --stack-name $STACK_NAME `
    --query 'Stacks[0].Outputs[?OutputKey==`UserPoolClientId`].OutputValue' `
    --output text `
    --region $Region

$S3_BUCKET_NAME = aws cloudformation describe-stacks `
    --stack-name $STACK_NAME `
    --query 'Stacks[0].Outputs[?OutputKey==`S3BucketName`].OutputValue' `
    --output text `
    --region $Region

# Create .env file for frontend
Write-Host "[+] Creating .env file for frontend..." -ForegroundColor Yellow
$envContent = @"
VITE_API_BASE_URL=$API_URL
VITE_AWS_REGION=$Region
VITE_COGNITO_USER_POOL_ID=$USER_POOL_ID
VITE_COGNITO_CLIENT_ID=$USER_POOL_CLIENT_ID
VITE_S3_BUCKET=$S3_BUCKET_NAME
VITE_ENVIRONMENT=$Environment
"@

$envContent | Out-File -FilePath "../.env" -Encoding UTF8

# Upload perfume images to S3
Write-Host "[+] Uploading perfume images to S3..." -ForegroundColor Yellow
aws s3 sync ../public/perfume-images "s3://$S3_BUCKET_NAME/perfume-images/"
if ($LASTEXITCODE -ne 0) {
    Write-Host "[!] Image upload failed." -ForegroundColor Red
    exit 1
}

# Populate database with initial data
Write-Host "[*] Populating database with perfume data..." -ForegroundColor Yellow
$env:PERFUMES_TABLE = "perfume-recommendation-perfumes-$Environment"
$env:NODE_PATH = (Resolve-Path "lambda/node_modules").Path
node populate-db.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "[!] Database population failed." -ForegroundColor Red
    exit 1
}

# Clean up
Remove-Item $LAMBDA_ZIP -ErrorAction SilentlyContinue
Remove-Item $TEMPLATE_FILE -ErrorAction SilentlyContinue

Write-Host "[+] Deployment completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "[*] Backend Configuration:" -ForegroundColor Cyan
Write-Host "API URL: $API_URL" -ForegroundColor White
Write-Host "User Pool ID: $USER_POOL_ID" -ForegroundColor White
Write-Host "User Pool Client ID: $USER_POOL_CLIENT_ID" -ForegroundColor White
Write-Host "S3 Bucket: $S3_BUCKET_NAME" -ForegroundColor White
Write-Host ""
Write-Host "[*] Next steps:" -ForegroundColor Yellow
Write-Host "1. Update your frontend .env file with the values above" -ForegroundColor White
Write-Host "2. Test the API endpoints" -ForegroundColor White
Write-Host "3. Set up CI/CD pipeline for future deployments" -ForegroundColor White
Write-Host ""
Write-Host "[*] Useful commands:" -ForegroundColor Yellow
Write-Host "• View stack: aws cloudformation describe-stacks --stack-name $STACK_NAME --region $Region" -ForegroundColor White
Write-Host "• Delete stack: aws cloudformation delete-stack --stack-name $STACK_NAME --region $Region" -ForegroundColor White
Write-Host "• View logs: aws logs tail /aws/lambda/perfume-api-$Environment --region $Region" -ForegroundColor White
