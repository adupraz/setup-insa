import SessionService  from '../../../services/SessionService';


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
    const datas = await sessionService.getAllDatas(id_session_string);
    console.log("All datas of this Session : ", datas)
    if (datas != null || datas !== undefined) {
        setResponseStatus(event, 200);
        return datas; 
    } else {  
        setResponseStatus(event, 404);
      return { error: 'No data available' }
      
    }
  } catch (error) {
    console.error('Error fetching this session:', error);
    setResponseStatus(event, 500);
    return  { error: 'Failed to fetch this session' }
  }
});
