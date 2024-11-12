# AWS Cloud Resume Challenge

## Introduction
Welcome to my AWS Cloud Resume Challenge implementation! This project showcases a serverless resume website built using various AWS services, incorporating DevOps practices, Infrastructure as Code (IaC), and modern web development techniques.

## Features
- **Static Website Hosting**: HTML/CSS resume hosted on AWS S3
- **HTTPS Security**: SSL/TLS encryption via AWS Certificate Manager
- **Content Delivery**: Global content delivery through CloudFront CDN
- **DNS Management**: Custom domain configuration with Route 53
- **Visitor Counter**: Serverless API using API Gateway, Lambda, and DynamoDB
- **Infrastructure as Code**: AWS infrastructure managed with Terraform
- **CI/CD Pipeline**: Automated deployments using GitHub Actions

## Technologies Used
### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Python (Lambda Function)
- AWS Lambda
- Amazon DynamoDB
- Amazon API Gateway

### DevOps & Infrastructure
- Terraform
- GitHub Actions
- AWS CloudFront
- AWS S3
- AWS Route 53
- AWS Certificate Manager

## Project Structure
```
.
├── README.md
├── frontend/
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   └── visitor-counter.js
├── backend/
│   ├── lambda_function.py
│   └── tests/
│       └── test_lambda.py
└── terraform/
    ├── main.tf
    ├── policy.json
    ├── otherpolicy.json
    └── anotherpolicy.json
```

## Prerequisites
- AWS Account
- AWS CLI configured
- Terraform installed
- GitHub account
- Domain name (registered in Route 53)
- Basic understanding of AWS services

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/aws-cloud-resume.git
cd aws-cloud-resume
```

### 2. Configure AWS Credentials
```bash
aws configure
```

### 3. Infrastructure Deployment
```bash
cd terraform
terraform init
terraform plan
terraform apply
```

### 4. Frontend Deployment
```bash
cd frontend
# Update visitor-counter.js with your API Gateway URL
# Deploy to S3 using GitHub Actions
```

### 5. Configure GitHub Actions
- Add AWS credentials to GitHub repository secrets:
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`
  - `AWS_REGION`

## Continuous Integration/Continuous Deployment (CI/CD)

The project uses GitHub Actions for automated deployments:

1. **Infrastructure Pipeline**:
   - Triggers on push to main branch
   - Runs Terraform validation and plan
   - Applies infrastructure changes if approved

2. **Frontend Pipeline**:
   - Deploys HTML/CSS/JS to S3
   - Invalidates CloudFront cache

3. **Backend Pipeline**:
   - Runs Python tests
   - Deploys Lambda function
   - Updates API Gateway configuration

## Testing

### Backend Tests
```bash
cd backend
python -m pytest tests/
```

### Frontend Tests
```bash
# Manual testing steps
1. Visit website and verify visitor counter
2. Check browser console for errors
3. Verify HTTPS security
```

## Monitoring and Maintenance

### CloudWatch Metrics to Monitor
- Lambda function invocations and errors
- API Gateway requests and latency
- CloudFront distribution metrics
- S3 bucket metrics

### Regular Maintenance Tasks
1. Review and apply AWS cost optimization recommendations
2. Check CloudWatch logs for errors
3. Update dependencies and security patches
4. Review and update infrastructure as needed

## Security Considerations
- S3 bucket configured with appropriate permissions
- CloudFront distribution restricted to HTTPS only
- API Gateway configured with CORS
- Lambda function with minimal IAM permissions
- DynamoDB table with encryption at rest

## Cost Optimization
This project uses AWS Free Tier eligible services:
- S3: First 5GB storage free
- CloudFront: First 1TB transfer free
- Lambda: First 1M requests free
- DynamoDB: First 25GB storage free
- API Gateway: First 1M requests free

## Troubleshooting

### Common Issues and Solutions
1. **CloudFront Not Updating**
   - Clear CloudFront cache
   - Check distribution status

2. **API Gateway CORS Errors**
   - Verify CORS configuration in API Gateway
   - Check browser console for specific errors

3. **Lambda Function Failures**
   - Check CloudWatch logs
   - Verify IAM permissions

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request


## Acknowledgments
- [Cloud Resume Challenge](https://theorjiugovictor.com)

## Contact
- Prince Victor Orjiugo      
- LinkedIn: https://www.linkedin.com/in/theorjiugovictor/
- Twitter: orjiugo_victor
- Email: hellounamed@gmail.com
