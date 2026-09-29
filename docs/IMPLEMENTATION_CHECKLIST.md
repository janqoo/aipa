# AI Perfume Recommendation System — Implementation Checklist

Use this checklist to track your progress through the 4-week project.

---

## Week 1: Frontend & AWS Basics ⏰ 5-7 hours

### Environment Setup
- [x] Install Node.js 20+ (`node --version`)
- [x] Install npm 10+ (`npm --version`)
- [x] Clone project repository
- [x] Run `npm install` successfully
- [x] Run `npm run dev` and see app at http://localhost:5173
- [x] Explore all pages (Home, Perfumes, Recommendations, Collections, Profile, Admin)
- [x] Add real perfume images to `public/perfume-images/`
- [x] Verify all perfume cards display correctly

### AWS Account Setup
- [ ] Create AWS account at https://aws.amazon.com
- [ ] Set up billing alert for $10 USD
- [ ] Create IAM user for development
- [ ] Install AWS CLI (`aws --version`)
- [ ] Configure AWS CLI (`aws configure`)
- [ ] Verify AWS CLI works (`aws sts get-caller-identity`)

### First Lambda Function
- [ ] Create Lambda function: `hello-world-test`
- [ ] Deploy and test Lambda in AWS Console
- [ ] Create API Gateway REST API
- [ ] Create `/hello` resource and GET method
- [ ] Enable CORS on API Gateway
- [ ] Deploy API to `dev` stage
- [ ] Test with curl: `curl https://YOUR-API-ID.execute-api.us-east-1.amazonaws.com/dev/hello`
- [ ] See successful response with message and timestamp

### Create GitHub Repository
- [ ] Create public GitHub repository: `ai-perfume-recommendation-system`
- [ ] Initialize git in project: `git init`
- [ ] Verify .gitignore exists (already provided in project)
- [ ] Make initial commit: `git add . && git commit -m "Initial commit: Week 1 complete"`
- [ ] Push to GitHub: `git remote add origin <your-repo-url> && git push -u origin main`
- [ ] Add repository description: "AI-powered perfume recommendation system"
- [ ] Add topics: `aws`, `react`, `typescript`, `serverless`, `perfume`, `ai`
- [ ] Commit your progress daily throughout the project

✅ **Week 1 Complete!** You have a working Lambda function and your project is on GitHub.

---

## Week 2: Backend API ⏰ 8-10 hours

### DynamoDB Setup
- [ ] Create DynamoDB table: `Perfumes`
  - Partition key: `id` (String)
  - On-demand pricing
- [ ] Create DynamoDB table: `Collections`
  - Partition key: `userId` (String)
  - Sort key: `id` (String)
  - On-demand pricing
- [ ] Create DynamoDB table: `UserPreferences`
  - Partition key: `userId` (String)
  - On-demand pricing
- [ ] Create Global Secondary Index on Collections: `id-index`
- [ ] Copy perfumes from `src/services/mockData.ts`
- [ ] Convert to DynamoDB JSON format
- [ ] Load perfumes into DynamoDB using AWS CLI
- [ ] Verify data in DynamoDB Console

### Perfumes API Lambda Functions
- [ ] Create Lambda: `perfume-get-perfumes`
- [ ] Add DynamoDB read permissions to Lambda role
- [ ] Deploy get-perfumes code
- [ ] Test Lambda in AWS Console
- [ ] Create API Gateway resource: `/perfumes`
- [ ] Create GET method, integrate with Lambda
- [ ] Enable CORS
- [ ] Deploy API
- [ ] Test: `curl https://YOUR-API-ID.execute-api.us-east-1.amazonaws.com/dev/perfumes`
- [ ] See array of perfumes from DynamoDB
- [ ] Create Lambda: `perfume-get-perfume`
- [ ] Deploy get-perfume code
- [ ] Create API Gateway resource: `/perfumes/{id}`
- [ ] Create GET method, integrate with Lambda
- [ ] Enable CORS
- [ ] Deploy API
- [ ] Test: `curl https://YOUR-API-ID.execute-api.us-east-1.amazonaws.com/dev/perfumes/1`
- [ ] See single perfume details with notes and accords

### Collections API Lambda Functions
- [ ] Create Lambda: `perfume-get-collections`
- [ ] Deploy code with DynamoDB Query by userId
- [ ] Create API Gateway resource: `/collections`
- [ ] Create GET method
- [ ] Enable CORS
- [ ] Deploy API
- [ ] Create Lambda: `perfume-create-collection`
- [ ] Deploy code with DynamoDB PutItem
- [ ] Create POST method on `/collections`
- [ ] Enable CORS
- [ ] Deploy API
- [ ] Create Lambda: `perfume-update-collection`
- [ ] Deploy code with DynamoDB UpdateItem
- [ ] Create PUT method on `/collections/{id}`
- [ ] Enable CORS
- [ ] Deploy API
- [ ] Create Lambda: `perfume-delete-collection`
- [ ] Deploy code with DynamoDB DeleteItem
- [ ] Create DELETE method on `/collections/{id}`
- [ ] Enable CORS
- [ ] Deploy API

### Connect Frontend to API
- [ ] Note your API Gateway URL
- [ ] Create `.env` file in project root
- [ ] Add `VITE_API_BASE_URL=https://YOUR-API-ID.execute-api.us-east-1.amazonaws.com/dev`
- [ ] Update `getPerfumes()` function in `src/services/api.ts` to call real API
- [ ] Update `getPerfume()` function to call real API
- [ ] Test frontend — perfumes should load from DynamoDB
- [ ] Verify in browser console — no mock data messages

✅ **Week 2 Complete!** You have a working REST API connected to your frontend.

---

## Week 3: Authentication ⏰ 6-8 hours

### Cognito Setup
- [ ] Go to AWS Cognito Console
- [ ] Create User Pool: `perfume-users`
- [ ] Configure sign-in: Email
- [ ] Configure password policy: Cognito defaults
- [ ] Disable MFA (for simplicity)
- [ ] Enable self-registration
- [ ] Required attributes: name, email
- [ ] Create app client: `perfume-web-client`
- [ ] Don't generate client secret
- [ ] Note User Pool ID (e.g., `us-east-1_abc123`)
- [ ] Note App Client ID (e.g., `1a2b3c4d5e6f7g8h9i0j`)

### Frontend Integration
- [ ] Install AWS Amplify: `npm install aws-amplify`
- [ ] Update `.env` file:
  ```
  VITE_COGNITO_USER_POOL_ID=us-east-1_abc123
  VITE_COGNITO_CLIENT_ID=1a2b3c4d5e6f7g8h9i0j
  VITE_AWS_REGION=us-east-1
  ```
- [ ] Verify Amplify configuration in `src/main.tsx`
- [ ] Update `src/contexts/AuthContext.tsx` with Cognito signIn
- [ ] Replace `login()` function with Cognito signIn
- [ ] Replace `logout()` function with Cognito signOut
- [ ] Replace `signup()` function with Cognito signUp
- [ ] Update `useEffect` to check Cognito session
- [ ] Remove localStorage mock code
- [ ] Test signup flow — create new user
- [ ] Check email for verification code
- [ ] Verify user in Cognito Console
- [ ] Test login flow
- [ ] Test logout flow
- [ ] Verify user state persists on page refresh

### API Authorization
- [ ] Go to API Gateway Console
- [ ] Create Cognito Authorizer
- [ ] Select your User Pool
- [ ] Token source: `Authorization`
- [ ] Test authorizer with a token
- [ ] Add authorizer to POST /collections
- [ ] Add authorizer to PUT /collections/{id}
- [ ] Add authorizer to DELETE /collections/{id}
- [ ] Add authorizer to POST /recommendations
- [ ] Deploy API to `dev` stage
- [ ] Update `src/services/api.ts`
- [ ] Implement `getAuthHeaders()` function
- [ ] Update `createCollection()` to use auth headers
- [ ] Update `updateCollection()` to use auth headers
- [ ] Update `deleteCollection()` to use auth headers
- [ ] Test creating collection while logged in
- [ ] Test that API calls fail when logged out
- [ ] Verify JWT token in browser Network tab

✅ **Week 3 Complete!** You have full authentication with protected APIs.

---

## Week 4: AI & Deployment ⏰ 8-10 hours

### AI Recommendations (AWS Bedrock)
- [ ] Go to AWS Bedrock Console
- [ ] Click "Model access"
- [ ] Request access to Claude 3 Haiku
- [ ] Wait for approval (usually instant)
- [ ] Create Lambda: `perfume-get-recommendations`
- [ ] Set timeout to 30 seconds
- [ ] Add Bedrock permissions to Lambda role
- [ ] Deploy recommendations code with perfume context prompt
- [ ] Test Lambda with sample query (e.g. "I want a woody evening scent")
- [ ] Create API Gateway resource: `/recommendations`
- [ ] Create POST method
- [ ] Add Cognito authorizer
- [ ] Enable CORS
- [ ] Deploy API
- [ ] Update `getRecommendations()` in `src/services/api.ts`
- [ ] Replace mock code with real API call
- [ ] Update `src/pages/Recommendations.tsx` to pass query to API
- [ ] Test recommendations page
- [ ] Try different queries (e.g. "fresh summer scent", "gift for her")
- [ ] Verify AI responses suggest real perfumes from your catalog

### Frontend Deployment with CI/CD

#### Step 1: Create S3 Bucket and CloudFront
- [ ] Go to S3 Console
- [ ] Create bucket: `perfume-app-frontend-[your-name]`
- [ ] Uncheck "Block all public access"
- [ ] Enable static website hosting
  - Index document: `index.html`
  - Error document: `index.html`
- [ ] Add bucket policy for public read access
- [ ] Go to CloudFront Console
- [ ] Create distribution
  - Origin: Your S3 bucket
  - Redirect HTTP to HTTPS
  - Default root object: `index.html`
- [ ] Wait for CloudFront deployment (10-15 minutes)
- [ ] Update CORS in API Gateway to allow CloudFront URL

#### Step 2: Set Up CI/CD Pipeline with CodePipeline
- [ ] Go to CodePipeline Console
- [ ] Create new pipeline: `perfume-frontend-pipeline`
- [ ] Configure source stage:
  - Source provider: GitHub (Version 2)
  - Connect to GitHub account
  - Select your repository: `ai-perfume-recommendation-system`
  - Branch: `main`
  - Change detection: GitHub webhooks
- [ ] Configure build stage:
  - Build provider: AWS CodeBuild
  - Create new build project: `perfume-frontend-build`
  - Environment: Managed image, Ubuntu, Standard runtime, Latest image
  - Service role: Create new service role
- [ ] Configure deploy stage:
  - Deploy provider: Amazon S3
  - Bucket: Your S3 bucket name
  - Extract files before deploy: Yes
- [ ] Review and create pipeline

#### Step 3: Create buildspec.yml
- [ ] Create `buildspec.yml` in project root:
  ```yaml
  version: 0.2
  phases:
    install:
      runtime-versions:
        nodejs: 20
      commands:
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    files:
      - '**/*'
    base-directory: dist
  ```
- [ ] Commit and push buildspec.yml to GitHub
- [ ] Watch pipeline execute automatically
- [ ] Verify build succeeds
- [ ] Verify deployment to S3
- [ ] Test CloudFront URL — app should load

#### Step 4: Test CI/CD
- [ ] Make a small change to frontend (e.g., update homepage text)
- [ ] Commit and push to GitHub
- [ ] Watch CodePipeline automatically trigger
- [ ] Verify changes appear on CloudFront URL
- [ ] CI/CD is working! 🎉

### Testing & Polish
- [ ] Test user registration flow
- [ ] Test login/logout
- [ ] Test browsing perfumes
- [ ] Test perfume detail pages (notes pyramid + accords)
- [ ] Test creating collections
- [ ] Test adding perfumes to collections
- [ ] Test deleting collections
- [ ] Test AI recommendations with various queries
- [ ] Test on mobile device
- [ ] Test on different browsers
- [ ] Fix any bugs found
- [ ] Run `npm run lint` — fix any errors

### Documentation & Presentation
- [ ] Update README.md with:
  - Live application URL
  - API endpoints list
  - Team member contributions
  - Setup instructions
- [ ] Create architecture diagram showing:
  - Frontend (S3/CloudFront)
  - API Gateway
  - Lambda functions
  - DynamoDB tables (Perfumes, Collections, UserPreferences)
  - Cognito User Pool
  - Bedrock integration
- [ ] Share project on GitHub:
  - Push all code (frontend + documentation)
  - Add .gitignore (exclude node_modules, .env, AWS credentials)
  - Write comprehensive README
  - Add LICENSE file
  - Include architecture diagram
  - Add live demo URL to repository description
- [ ] Take screenshots of:
  - Homepage (hero sections)
  - Perfumes page (grid with glass cards)
  - Perfume detail page (notes pyramid + accords)
  - Recommendations page
  - Collections page
- [ ] Record demo video (5-10 minutes)
- [ ] Prepare presentation slides
- [ ] Practice demo
- [ ] Prepare to discuss:
  - Architecture decisions
  - Challenges faced
  - Solutions implemented
  - What you learned

✅ **Week 4 Complete!** You have a fully deployed, production-ready application! 🎉

---

## Final Checklist

### Technical Requirements
- [ ] Frontend deployed and accessible via CloudFront URL
- [ ] All API endpoints working
- [ ] User authentication functional (Cognito)
- [ ] AI recommendations working (Bedrock)
- [ ] Perfume notes pyramid displays correctly
- [ ] Main accords chart displays correctly
- [ ] All perfume images loading
- [ ] Code follows TypeScript strict mode
- [ ] All commits have clear messages

### Documentation
- [ ] README.md updated
- [ ] Architecture diagram created
- [ ] API documentation complete
- [ ] Team contributions documented
- [ ] Setup instructions clear
- [ ] Project shared on GitHub (public repository)

### Presentation
- [ ] Demo video recorded
- [ ] Presentation slides prepared
- [ ] Can explain architecture
- [ ] Can discuss challenges and solutions
- [ ] Can demonstrate all features

### Cleanup (Important!)
- [ ] Delete test Lambda functions
- [ ] Keep only production resources
- [ ] Verify AWS costs are within Free Tier
- [ ] Document any ongoing costs

---

## AWS Resources Summary

| Resource | Name | Purpose |
|---|---|---|
| Cognito User Pool | `perfume-users` | Authentication |
| DynamoDB | `Perfumes` | Perfume catalog |
| DynamoDB | `Collections` | User collections |
| DynamoDB | `UserPreferences` | User preferences |
| Lambda | `perfume-get-perfumes` | List perfumes |
| Lambda | `perfume-get-perfume` | Single perfume |
| Lambda | `perfume-get-collections` | List collections |
| Lambda | `perfume-create-collection` | Create collection |
| Lambda | `perfume-update-collection` | Update collection |
| Lambda | `perfume-delete-collection` | Delete collection |
| Lambda | `perfume-get-recommendations` | AI recommendations |
| API Gateway | `perfume-api` | REST API |
| S3 | `perfume-app-frontend-[name]` | Frontend hosting |
| CloudFront | — | CDN + HTTPS |
| Bedrock | Claude 3 Haiku | AI recommendations |

---

## Tips for Success
- ✅ Start early — Don't wait until the last day
- ✅ Test frequently — Test each Lambda as you create it
- ✅ Commit often — Small commits with clear messages
- ✅ Read errors carefully — Error messages usually tell you what's wrong
- ✅ Use CloudWatch Logs — Essential for debugging Lambda functions
- ✅ Monitor costs — Check AWS billing dashboard regularly
- ✅ Have fun! — You're building something awesome!

---

Good luck! You've got this! 🚀
