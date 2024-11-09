terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket = "new-tf-state-bucket"
    key    = "website/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = "us-east-1"
}

# Use data source for existing certificate
data "aws_acm_certificate" "existing" {
  domain      = "theorjiugovictor.com"
  statuses    = ["ISSUED"]
  most_recent = true
}

# Use data source for existing Route 53 zone
data "aws_route53_zone" "existing" {
  zone_id = "Z04810281WDJTHR846HVG"
}

# S3 bucket for website
resource "aws_s3_bucket" "website" {
  bucket = "theorjiugovictor.com"

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket_website_configuration" "website" {
  bucket = aws_s3_bucket.website.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

resource "aws_s3_bucket_public_access_block" "website" {
  bucket = aws_s3_bucket.website.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Route53 record for the website
resource "aws_route53_record" "website" {
  zone_id = data.aws_route53_zone.existing.zone_id
  name    = "theorjiugovictor.com"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.website.domain_name
    zone_id                = aws_cloudfront_distribution.website.hosted_zone_id
    evaluate_target_health = false
  }

  lifecycle {
    prevent_destroy = true
  }
}

# CloudFront distribution
resource "aws_cloudfront_distribution" "website" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  aliases             = ["theorjiugovictor.com"]
  
  lifecycle {
    prevent_destroy = true
    ignore_changes = [
      viewer_certificate,
      aliases
    ]
  }

  origin {
    domain_name = aws_s3_bucket.website.bucket_regional_domain_name
    origin_id   = "S3Origin"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3Origin"
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = data.aws_acm_certificate.existing.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2019"
  }
}

# DynamoDB table for visitor count
resource "aws_dynamodb_table" "visitor_counter" {
  name         = "visitor-counter"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "visitor_count"

  attribute {
    name = "visitor_count"
    type = "S"
  }
}

# Lambda function
resource "aws_lambda_function" "visitor_counter" {
  filename      = "../backend/lambda_function.zip"
  function_name = "visitor-counter-function"
  role          = aws_iam_role.lambda_role.arn
  handler       = "index.lambda_handler"
  runtime       = "python3.9"
}

# API Gateway
resource "aws_api_gateway_rest_api" "visitor_counter" {
  name        = "visitor-counter-api"
  description = "API for updating visitor count"
}

resource "aws_api_gateway_resource" "count" {
  rest_api_id = aws_api_gateway_rest_api.visitor_counter.id
  parent_id   = aws_api_gateway_rest_api.visitor_counter.root_resource_id
  path_part   = "count"
}

resource "aws_api_gateway_method" "post" {
  rest_api_id   = aws_api_gateway_rest_api.visitor_counter.id
  resource_id   = aws_api_gateway_resource.count.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda" {
  rest_api_id             = aws_api_gateway_rest_api.visitor_counter.id
  resource_id             = aws_api_gateway_resource.count.id
  http_method             = aws_api_gateway_method.post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.visitor_counter.invoke_arn
}

# IAM role for Lambda
resource "aws_iam_role" "lambda_role" {
  name               = "visitor_counter_lambda_role"
  assume_role_policy = file("${path.module}/../backend/lambda-trust-policy.json")
}

# Outputs
output "website_endpoint" {
  value = aws_cloudfront_distribution.website.domain_name
}

output "domain_name" {
  value = "theorjiugovictor.com"
}