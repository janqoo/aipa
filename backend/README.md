# AI Perfume Recommendation System - Backend

This directory contains the AWS backend infrastructure for the AI Perfume Recommendation System.

## Architecture

The backend consists of:
- **AWS Lambda**: Serverless functions for API endpoints
- **API Gateway**: REST API for frontend communication
- **DynamoDB**: NoSQL database for perfumes and user data
- **S3**: Storage for perfume images
- **Cognito**: User authentication and authorization

## Project Structure

```
backend/
├── lambda/                 # Lambda function code
│   ├── perfume-api.js     # Main API handler
│   └── package.json       # Lambda dependencies
├── template.yaml          # CloudFormation template
├── deploy.sh             # Deployment script
└── README.md             # This file
```

## Prerequisites

1. **AWS CLI**: Install and configure AWS CLI
   ```bash
   aws configure
   ```

2. **Node.js**: Version 18 or higher
3. **Bash**: For running the deployment script (or convert to PowerShell)

## Deployment

1. **Make the deploy script executable** (if on Linux/Mac):
   ```bash
   chmod +x backend/deploy.sh
   ```

2. **Run the deployment script**:
   ```bash
   cd backend
   ./deploy.sh
   ```

   Or on Windows with Git Bash:
   ```bash
   bash deploy.sh
   ```

The script will:
- Install Lambda dependencies
- Package the Lambda function
- Create/update CloudFormation stack
- Upload perfume images to S3
- Generate `.env` file for frontend

## API Endpoints

### Perfumes
- `GET /perfumes` - List perfumes with filtering and pagination
- `GET /perfumes/{id}` - Get specific perfume
- `POST /perfumes` - Create new perfume (admin)
- `PUT /perfumes/{id}` - Update perfume (admin)
- `DELETE /perfumes/{id}` - Delete perfume (admin)

### Collections
- `GET /collections` - List user collections
- `POST /collections` - Create new collection
- `PUT /collections/{id}` - Update collection
- `DELETE /collections/{id}` - Delete collection

### Recommendations
- `POST /recommendations` - Get AI recommendations

## Query Parameters

### Perfumes List
- `search`: Search term
- `category`: Filter by category
- `brand`: Filter by brand
- `gender`: Filter by gender (men/women/unisex)
- `minPrice`: Minimum price
- `maxPrice`: Maximum price
- `seasons`: Comma-separated seasons
- `occasions`: Comma-separated occasions
- `inStock`: Filter by stock status
- `sort`: Sort order (price_asc, price_desc, rating, name)
- `page`: Page number
- `limit`: Items per page

## Environment Variables

After deployment, the following environment variables will be set in `.env`:

```env
VITE_API_BASE_URL=https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/dev
VITE_AWS_REGION=us-east-1
VITE_COGNITO_USER_POOL_ID=your-user-pool-id
VITE_COGNITO_CLIENT_ID=your-client-id
VITE_S3_BUCKET=your-s3-bucket-name
VITE_ENVIRONMENT=dev
```

## Development

### Local Testing

1. **Install dependencies**:
   ```bash
   cd backend/lambda
   npm install
   ```

2. **Test Lambda locally** (requires SAM CLI):
   ```bash
   sam local invoke PerfumeApiFunction -e event.json
   ```

### Adding New Features

1. **Update Lambda function** in `lambda/perfume-api.js`
2. **Update CloudFormation template** in `template.yaml` if needed
3. **Redeploy** using the deploy script

## Monitoring

### CloudWatch Logs
```bash
aws logs tail /aws/lambda/perfume-api-dev --region us-east-1
```

### API Gateway Metrics
- View in AWS Console under API Gateway service
- Monitor latency, error rates, and request counts

### DynamoDB Metrics
- View table metrics in AWS Console
- Monitor read/write capacity and throttling

## Security

- **Cognito Authentication**: All API endpoints require authentication
- **IAM Roles**: Least privilege access for Lambda functions
- **API Gateway**: CORS configured for frontend domain
- **S3**: Public read access for images, private for other operations

## Cost Optimization

- **Lambda**: Pay per request, optimize memory and timeout
- **DynamoDB**: On-demand billing, use GSI efficiently
- **S3**: Standard storage for images
- **API Gateway**: Pay per request

## Troubleshooting

### Common Issues

1. **Deployment fails**: Check AWS credentials and permissions
2. **API returns 500**: Check CloudWatch logs for Lambda errors
3. **Images not loading**: Verify S3 bucket permissions and CORS
4. **Authentication fails**: Check Cognito User Pool configuration

### Useful Commands

```bash
# View stack status
aws cloudformation describe-stacks --stack-name perfume-recommendation-backend --region us-east-1

# Delete stack
aws cloudformation delete-stack --stack-name perfume-recommendation-backend --region us-east-1

# View Lambda logs
aws logs tail /aws/lambda/perfume-api-dev --region us-east-1 --follow
```

## Next Steps

1. **Add more perfume data** to DynamoDB
2. **Implement AI recommendations** using Amazon Q or SageMaker
3. **Add image upload functionality** for admin users
4. **Set up CI/CD pipeline** with GitHub Actions
5. **Add monitoring and alerting** with CloudWatch
6. **Implement caching** with API Gateway or ElastiCache