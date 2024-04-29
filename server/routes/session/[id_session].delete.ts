import DeleteService  from '../../services/DeleteService';


const deleteService = new DeleteService();
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
    const sessionDeleted = await deleteService.deleteSessionDatas(id_session_string);
    console.log("Session deleted : ", sessionDeleted)
    if (sessionDeleted != null || sessionDeleted !== undefined) {
      setResponseStatus(event, 200);
      return sessionDeleted;
    } else { 
      setResponseStatus(event, 404); 
      return {error: 'This session not found or already deleted'}
    }
  } catch (error) {
    setResponseStatus(event, 500);
    console.error('Error fetching this session:', error);
    return { error: 'Failed to fetch this session' };
  }
});
