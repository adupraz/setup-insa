
import UserService  from '../../services/UserService';
const userService = new UserService();

// Function to generate a unique session cookie id
function generateId() {
  // Random with 9 characters
  return Math.random().toString(36).substr(2, 9);
}

function sign(session: any, secret: string){
  return session+secret; 
}
export default defineEventHandler(async (event) => {
  const response = await readBody(event)

  try {
  
    console.log('Response :', response);

    // user is already in db ? (Service to implemente)
    const user = await userService.signin(response.username, response.password);
    console.log("User :", user);
    
    if(user){
      setResponseStatus(event, 200);
      const config = useRuntimeConfig();

      const session = generateId();
      const signedSession = sign(session, config.cookieSecret);

      setCookie(event, config.cookieName, signedSession, {
        httpOnly: true,
        path: "/login",
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        expires: 
          new Date(Date.now() + parseInt(config.cookieExpires)),
      });
    
      return user;
    }
    setResponseStatus(event, 401);
    return {
      body: { error: 'Invalid login or password' }
    };

  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    setResponseStatus(event, 500);
    return { error: 'Erreur lors de la connexion' };
  }


});
