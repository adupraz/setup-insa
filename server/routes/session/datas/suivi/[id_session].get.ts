import SynchroService  from '../../../../services/SynchroService';


const synchroService = new SynchroService();
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
    const datasSynchro = await synchroService.getAllSynchro(id_session_string);
    console.log("Information of this Synchronisation : ", datasSynchro)
    if (datasSynchro != null || datasSynchro !== undefined) {
        setResponseStatus(event, 200);
        return datasSynchro; 
    } else {  
        setResponseStatus(event, 404);
      return { error: 'No Synchronisation datas available' }
      
    }
  } catch (error) {
    console.error('Error fetching this session:', error);
    setResponseStatus(event, 500);
    return  { error: 'Failed to fetch this session' }
  }
});
