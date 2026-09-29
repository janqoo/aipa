# AI Perfume System - Bedrock Deployment Script (Windows PowerShell)
# This script deploys the Lambda functions and updates the CloudFormation stack

param(
    [string]$Environment = "dev",
    [string]$Region = "us-east-1"
)

$ErrorActionPreference = "Stop"

Write-Host "AI Perfume System - Bedrock Deployment" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

try {
    $awsVersion = aws --version 2>$null
    Write-Host "[OK] AWS CLI found: $awsVersion" -ForegroundColor Green
}
catch {
    Write-Host "[ERROR] AWS CLI is not installed" -ForegroundColor Red
    exit 1
}

try {
    $nodeVersion = node --version
    Write-Host "[OK] Node.js found: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "[ERROR] Node.js is not installed" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Get AWS account info
Write-Host "Checking AWS configuration..." -ForegroundColor Yellow

$AccountId = aws sts get-caller-identity --query Account --output text
$BucketName = "perfume-lambda-artifacts-$AccountId-$Region"

Write-Host "Account ID: $AccountId"
Write-Host "Region: $Region"
Write-Host "Environment: $Environment"
Write-Host ""

# Create S3 bucket for Lambda code
Write-Host "Setting up S3 bucket: $BucketName" -ForegroundColor Yellow

try {
    aws s3 ls "s3://$BucketName" --region $Region 2>$null | Out-Null
    Write-Host "[OK] S3 bucket already exists" -ForegroundColor Green
}
catch {
    Write-Host "Creating new S3 bucket..."
    aws s3 mb "s3://$BucketName" --region $Region
    Write-Host "[OK] Created S3 bucket" -ForegroundColor Green
}
Write-Host ""

# Install Lambda dependencies
Write-Host "Installing Lambda dependencies..." -ForegroundColor Yellow

Push-Location "lambda"

if (!(Test-Path "node_modules")) {
    npm install
    Write-Host "[OK] Dependencies installed" -ForegroundColor Green
}
else {
    Write-Host "[OK] Dependencies already installed" -ForegroundColor Green
}

# Package Lambda functions
Write-Host "Packaging Lambda functions..." -ForegroundColor Yellow

# Remove old zips if they exist
Remove-Item -Force -ErrorAction SilentlyContinue perfume-api.zip
Remove-Item -Force -ErrorAction SilentlyContinue photo-analyzer.zip
Remove-Item -Force -ErrorAction SilentlyContinue ai-recommendations.zip

# Create new zips
Compress-Archive -Path perfume-api.js, node_modules -DestinationPath perfume-api.zip -Force
Compress-Archive -Path photo-analyzer.js, bedrock-utils.js, node_modules -DestinationPath photo-analyzer.zip -Force
Compress-Archive -Path ai-recommendations.js, bedrock-utils.js, node_modules -DestinationPath ai-recommendations.zip -Force

Write-Host "[OK] Lambda functions packaged" -ForegroundColor Green
Write-Host ""

# Upload to S3
Write-Host "Uploading Lambda functions to S3..." -ForegroundColor Yellow

aws s3 cp perfume-api.zip "s3://$BucketName/lambda/" --region $Region
aws s3 cp photo-analyzer.zip "s3://$BucketName/lambda/" --region $Region
aws s3 cp ai-recommendations.zip "s3://$BucketName/lambda/" --region $Region

Write-Host "[OK] Uploaded to S3" -ForegroundColor Green
Write-Host ""

# Go back to root
Pop-Location

# Update CloudFormation stack
$StackName = "perfume-recommendation-system-$Environment"

Write-Host "Deploying CloudFormation stack: $StackName" -ForegroundColor Yellow
Write-Host ""

# Check if stack exists
try {
    aws cloudformation describe-stacks --stack-name $StackName --region $Region 2>$null | Out-Null
    $StackExists = $true
}
catch {
    $StackExists = $false
}

if ($StackExists) {
    Write-Host "Updating existing stack..."
    aws cloudformation update-stack `
        --stack-name $StackName `
        --template-body "file://template.yaml" `
        --parameters "ParameterKey=Environment,ParameterValue=$Environment" `
        --capabilities CAPABILITY_NAMED_IAM `
        --region $Region
}
else {
    Write-Host "Creating new stack..."
    aws cloudformation create-stack `
        --stack-name $StackName `
        --template-body "file://template.yaml" `
        --parameters "ParameterKey=Environment,ParameterValue=$Environment" `
        --capabilities CAPABILITY_NAMED_IAM `
        --region $Region
}

Write-Host "Waiting for stack deployment (this may take a few minutes)..." -ForegroundColor Yellow

# Wait for stack to complete (basic polling)
$MaxAttempts = 180
$Attempt = 0
$StackComplete = $false

while ($Attempt -lt $MaxAttempts) {
    try {
        $Status = aws cloudformation describe-stacks `
            --stack-name $StackName `
            --region $Region `
            --query 'Stacks[0].StackStatus' `
            --output text
        
        if ($Status -match "COMPLETE" -and $Status -notmatch "IN_PROGRESS") {
            $StackComplete = $true
            break
        }
    }
    catch {
        # Stack might not exist yet
    }
    
    Start-Sleep -Seconds 2
    $Attempt++
    Write-Host "." -NoNewline -ForegroundColor Yellow
}

Write-Host ""
Write-Host ""

if ($StackComplete) {
    Write-Host "[OK] Stack deployment complete" -ForegroundColor Green
}
else {
    Write-Host "[WARNING] Stack deployment is still in progress, check AWS console" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Stack Outputs:" -ForegroundColor Yellow
Write-Host "==============" -ForegroundColor Yellow

try {
    aws cloudformation describe-stacks `
        --stack-name $StackName `
        --region $Region `
        --query 'Stacks[0].Outputs' `
        --output table 2>$null
}
catch {
    Write-Host "(Stack may still be deploying)"
}

# Get stack outputs for frontend environment
Write-Host ""
Write-Host "Generating .env.local file..." -ForegroundColor Yellow

try {
    $ApiUrl = aws cloudformation describe-stacks `
        --stack-name $StackName `
        --region $Region `
        --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' `
        --output text

    $UserPoolId = aws cloudformation describe-stacks `
        --stack-name $StackName `
        --region $Region `
        --query 'Stacks[0].Outputs[?OutputKey==`UserPoolId`].OutputValue' `
        --output text

    $UserPoolClientId = aws cloudformation describe-stacks `
        --stack-name $StackName `
        --region $Region `
        --query 'Stacks[0].Outputs[?OutputKey==`UserPoolClientId`].OutputValue' `
        --output text

    $S3BucketName = aws cloudformation describe-stacks `
        --stack-name $StackName `
        --region $Region `
        --query 'Stacks[0].Outputs[?OutputKey==`S3BucketName`].OutputValue' `
        --output text
    
    $EnvContent = @"
# Auto-generated by deployment script
VITE_API_BASE_URL=$ApiUrl
VITE_PHOTO_ANALYSIS_ENDPOINT=$ApiUrl/analyze-photo
VITE_AWS_REGION=$Region
VITE_COGNITO_USER_POOL_ID=$UserPoolId
VITE_COGNITO_CLIENT_ID=$UserPoolClientId
VITE_S3_BUCKET=$S3BucketName
VITE_ENVIRONMENT=$Environment
"@

    $EnvContent | Out-File -FilePath "..\.env.local" -Encoding UTF8 -Force
    Write-Host "[OK] Created .env.local" -ForegroundColor Green
    Write-Host $EnvContent
}
catch {
    Write-Host "[WARNING] Could not retrieve API URL, update .env.local manually" -ForegroundColor Yellow
}

Write-Host ""

# Verify Bedrock access
Write-Host ""
Write-Host "Checking Bedrock model access..." -ForegroundColor Yellow

try {
    $Models = aws bedrock list-foundation-models `
        --region $Region `
        --query "modelSummaries[?contains(modelId, 'claude-sonnet-4-5')]" `
        --output text 2>$null
    
    if ($Models -like "*claude*") {
        Write-Host "[OK] Claude Sonnet 4.5 model access confirmed" -ForegroundColor Green
    }
    else {
        Write-Host "[WARNING] Claude 3.5 Sonnet not yet available" -ForegroundColor Yellow
        Write-Host "   Please go to AWS Bedrock console and request model access"
        Write-Host "   https://console.aws.amazon.com/bedrock/home?region=$Region#/models"
    }
}
catch {
    Write-Host "[WARNING] Could not check model access, verify in AWS console" -ForegroundColor Yellow
}

Write-Host ""

# Final instructions
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Verify Bedrock model access (if needed):" -ForegroundColor White
Write-Host "   https://console.aws.amazon.com/bedrock/home?region=$Region#/models"
Write-Host ""
Write-Host "2. Start development server:" -ForegroundColor White
Write-Host "   npm run dev"
Write-Host ""
Write-Host "3. Test photo analyzer:" -ForegroundColor White
Write-Host "   Upload a perfume bottle photo in the Photo Analyzer section"
Write-Host ""
Write-Host "4. Test recommendations:" -ForegroundColor White
Write-Host "   Use the Recommendations page with natural language queries"
Write-Host ""
Write-Host "For more info, see BEDROCK_SETUP.md" -ForegroundColor White
Write-Host ""
