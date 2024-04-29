import SessionService  from '../../services/SessionService';


const sessionService = new SessionService();
export default defineEventHandler(async (event) => {

  // to obtain id_session from the api routes 
  let id_session = event.context.params?.id_session; 
  let id_session_string: string | null = "";

  if (id_session !== null && id_session !== undefined) {
    id_session_string = id_session.toString();
    console.log("id_session : " ,id_session_string)
  }

  try {
    // to get a data_question with our service
    const sessionInfo = await sessionService.getSessionInfo(id_session_string);
    console.log("Information of this Session : ", sessionInfo)
    if (sessionInfo != null || sessionInfo !== undefined) {
      return {
        statusCode: 200,
        body: sessionInfo
      };
    } else {  
      return {
        statusCode: 404,
        body: { error: 'This session not found or already deleted' }
      };
    }
  } catch (error) {
    console.error('Error fetching this session:', error);
    return {
      statusCode: 500,
      body: { error: 'Failed to fetch this session' }
    };
  }
});
