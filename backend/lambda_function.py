# lambda_function.py
import boto3
import json
from botocore.exceptions import ClientError

# Move these to module level but don't initialize them immediately
dynamodb = None
table = None

def get_table():
    global dynamodb, table
    if table is None:
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table('visitor-counter')
    return table

def lambda_handler(event, context):
    try:
        # Get the table using our new function
        table = get_table()
        
        # Retrieve the current visitor count
        response = table.get_item(Key={'visitor_count': 'total'})
        current_count = int(response.get('Item', {'count': 0})['count'])

        # Increment the visitor count
        new_count = current_count + 1
        
        # Update DynamoDB with the new count
        table.put_item(Item={
            'visitor_count': 'total',
            'count': new_count
        })

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'count': new_count})
        }
    except ClientError as e:
        print(e.response['Error']['Message'])
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e.response['Error']['Message'])})
        }
