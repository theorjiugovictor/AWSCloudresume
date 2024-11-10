import unittest
from unittest.mock import patch, MagicMock
import json
from lambda_function import lambda_handler

class TestLambdaFunction(unittest.TestCase):
    def setUp(self):
        # Reset any module-level variables before each test
        import lambda_function
        lambda_function.dynamodb = None
        lambda_function.table = None

    @patch('lambda_function.get_table')
    def test_lambda_handler(self, mock_get_table):
        # Set up mock table
        mock_table = MagicMock()
        mock_get_table.return_value = mock_table

        # Configure mock get_item response with a simple integer
        mock_table.get_item.return_value = {
            'Item': {
                'visitor_count': 'total',
                'count': 5  # Now using plain integer instead of Decimal
            }
        }

        # Call the lambda function
        result = lambda_handler({}, {})

        # Parse the JSON response body
        body = json.loads(result['body'])

        # Assertions
        self.assertEqual(result['statusCode'], 200)
        self.assertIn('count', body)
        self.assertEqual(body['count'], 6)  # Expected count is 5 + 1 = 6

        # Verify DynamoDB calls
        mock_table.get_item.assert_called_once_with(Key={'visitor_count': 'total'})
        mock_table.put_item.assert_called_once_with(
            Item={'visitor_count': 'total', 'count': 6}
        )

if __name__ == '__main__':
    unittest.main()