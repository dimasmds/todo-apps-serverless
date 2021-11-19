import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import TodoRepository from '../../Domains/todo/repository/TodoRepository';
import Todo from '../../Domains/todo/entities/Todo';
import TodoUpdate from '../../Domains/todo/entities/TodoUpdate';
import client from '../database/dynamodb/client';
import config from '../../Commons/config';

class TodoRepositoryDynamoDB implements TodoRepository {
  private client: DocumentClient;

  constructor() {
    this.client = client;
  }

  async persist(todo: Todo): Promise<void> {
    await this.client.put({
      TableName: config.dynamodb.todos.name,
      Item: todo,
    }).promise();
  }

  // eslint-disable-next-line no-unused-vars
  async update(todo: TodoUpdate): Promise<void> {
    const {
      todoId, name, done, dueDate,
    } = todo;

    await this.client.update({
      TableName: config.dynamodb.todos.name,
      Key: {
        todoId,
      },
      UpdateExpression: 'set #name = :name, #done = :done, #dueDate = :dueDate',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#done': 'done',
        '#dueDate': 'dueDate',
      },
      ExpressionAttributeValues: {
        ':name': name,
        ':done': done,
        ':dueDate': dueDate,
      },
    }).promise();
  }
}

export default TodoRepositoryDynamoDB;