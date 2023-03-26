const { CognitoJwtVerifier } = require(`aws-jwt-verify`);

const jwtVerifier = CognitoJwtVerifier.create({
  userPoolId:`us-east-1_yJXvpwwqD`,
  tokenUse: `id`,
  clientId: `69ljcg369to0e36bev0f5me6g0`,
})

const generatePolicy = (principalId, effect, resource) => {
  var authResponse = {};

  authResponse.principalId = principalId;

  if (effect && resource) {
    let policyDocument = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: effect,
          Resource: resource,
          Action: 'execute-api:Invoke',
        },
      ],
    };
    authResponse.policyDocument = policyDocument;
  }

  authResponse.context = {
    foo: 'bar',
  };
  console.log(JSON.stringify(authResponse));
  return authResponse;
};

exports.handler = async (event, context, callback) => {
  //lambda authorizer code
  var token = event.authorizationToken;
  console.log(token);

  //validate the token
  try {
    const payload = await jwtVerifier.verify(token);
    console.log(JSON.stringify(payload));
    callback(null, generatePolicy('user', 'Allow', `*`));
  } catch(err) {
    
  }
};
