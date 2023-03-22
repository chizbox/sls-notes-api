'use strict';
const DynamoDB = require('aws-sdk/clients/dynamodb');
const documentClient = new DynamoDB.DocumentClient({ region: 'us-east-1' });

const send = (statusCode, data) => {
  return {
    statusCode,
    body: JSON.stringify(data),
  };
};

module.exports.createNote = async (event, context, cb) => {
  const data = JSON.parse(event.body);
  console.log(data);
  try {
    const params = {
      TableName: 'notes',
      Item: {
        notesId: data.id,
        title: data.title,
        body: data.body,
      },
      ConditionExpression: 'attribute_not_exists(notesId)',
    };
    await documentClient.put(params).promise();
    cb(null, send(201, data));
  } catch (err) {
    console.log(err.message);
    cb(null, send(500, err.message));
  }
};

module.exports.updateNote = async (event) => {
  const notesId = event.pathParameters.id;
  return {
    statusCode: 200,
    body: JSON.stringify(`The note with id ${notesId} is updated`),
  };
};

module.exports.deleteNote = async (event) => {
  const notesId = event.pathParameters.id;
  return {
    statusCode: 200,
    body: JSON.stringify(`The note with id ${notesId} is deleted`),
  };
};

module.exports.getallNotes = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(`All notes retrieved`),
  };
};
