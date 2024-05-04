import UserService  from '../../services/UserService';

const userService = new UserService(); 

export default defineEventHandler(async (event) => {

  const response = await readBody(event)

  try {
  
    console.log('Response :', response);

    // user is already in db ? (Service to implemente)
    const user = await userService.signin(response.username, response.password);
    console.log("User :", user);
    
    if(user){
    const config = useRuntimeConfig();
  
    console.log("Cookie Name :" , config.cookieName);
    deleteCookie(event, config.cookieName, {
      httpOnly: true,
      path: "/login",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    setResponseStatus(event, 200);
    return user; 
    }
  }

  catch (error) {
    console.error('Erreur lors de la deconnexion :', error);
    setResponseStatus(event, 500);
    return { error: 'Erreur lors de la deconnexion' };
  }
    return null;
  
 }
);