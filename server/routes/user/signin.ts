import {defineEventHandler} from "h3";
import {readBody} from "h3";

// Function to generate a unique session cookie id
function generateSessionId() {
  // Random with 9 characters
  return Math.random().toString(36).substr(2, 9);
}

export default defineEventHandler(async (event) => {
  // to obtain the body
  const { username, password } = await readBody(event)

  try {
    // to debug if any problem
    console.log('Nom d\'utilisateur :', username);
    console.log('Mot de passe :', password);

    // user is already in db ? (Service to implemente)
    

    const user = {username , password};

    // to create a header cookie session
    const sessionId = generateSessionId();
    const cookieHeaderValue = `session=${sessionId}; Path=/; HttpOnly; SameSite=Strict`;

    // Return the user and a status code and set-cookie header
    return {
      statusCode: 200,
      body: user,
      headers: {
        'Set-Cookie': cookieHeaderValue
      }
    };
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    return {
      statusCode: 401,
      body: { error: 'Invalid login or password' }
    };
  }
});
