import SessionService from '~/server/services/SessionService';
import UserService  from '../../../services/UserService';


const sessionService = new SessionService();


export default defineEventHandler(async (event) => {
  let id_user = event.context.params?.id_user;
  let id_user_string: string | null = "";

  if (id_user !== null && id_user !== undefined) {
    id_user_string = id_user.toString();
    console.log("id_session : " ,id_user_string)
  }

  try {

    const sessions = await sessionService.getAllSessions(id_user_string);

    if(sessions){
      setResponseStatus(event, 200);
      return sessions;
    }
    setResponseStatus(event, 401);
    return {
      body: { error: 'No session available' }
    };

  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    return {
      statusCode: 500,
      body: { error: 'Erreur lors de la connexion' }
    };
  }
});
