/* eslint-disable no-restricted-syntax,no-await-in-loop */
import client from '../../../database/dynamodb/client';
import config from '../../../../Commons/config';

const DynamoDBTestHelper = {
  async findTodosById(todoId: string) {
    const result = await client.query({
      TableName: config.dynamodb.todos.name,
      KeyConditionExpression: 'todoId = :todoId',
      ExpressionAttributeValues: {
        ':todoId': todoId,
      },
      ScanIndexForward: false,
    }).promise();

    return result.Items;
  },
  async getAllTodos() {
    const result = await client.scan({
      TableName: config.dynamodb.todos.name,
    }).promise();

    return result.Items;
  },
  async cleanTodosTable() {
    const todos = await this.getAllTodos();

    for (const todo of todos) {
      await client.delete({
        TableName: config.dynamodb.todos.name,
        Key: {
          todoId: todo.todoId,
        },
        ConditionExpression: 'todoId = :todoId',
        ExpressionAttributeValues: {
          ':todoId': todo.todoId,
        },
      }).promise();
    }
  },
};

export default DynamoDBTestHelper;
