import unittest
from unittest.mock import patch
from lambda_function import lambda_handler

class TestLambdaFunction(unittest.TestCase):
    @patch('boto3.resource')
    def test_lambda_handler(self, mock_boto3):
        # Mock DynamoDB response
        mock_table = mock_boto3.return_value.Table.return_value
        mock_table.get_item.return_value = {'Item': {'count': 5}}
        
        # Test the lambda function
        result = lambda_handler({}, {})
        
        # Assert the response
        self.assertEqual(result['statusCode'], 200)
        self.assertIn('count', result['body'])

if __name__ == '__main__':
    unittest.main()
