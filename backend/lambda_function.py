import boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('visitor-counter')

def lambda_handler(event, context):
    try:
        # Retrieve the current visitor count
        response = table.get_item(Key={'visitor_count': 'total'})
        current_count = response.get('Item', {'count': 0})['count']

        # Increment the visitor count
        new_count = current_count + 1
        table.put_item(Item={'visitor_count': 'total', 'count': new_count})

        return {
            'statusCode': 200,
            'body': str(new_count)
        }
    except ClientError as e:
        print(e.response['Error']['Message'])
        raise e
