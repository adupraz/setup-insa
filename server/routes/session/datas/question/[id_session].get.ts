import QuestionReponseService  from '../../../../services/QuestionReponseService';


const questionReponseService = new QuestionReponseService();
export default defineEventHandler(async (event) => {
  // to obtain year_promotion and id_course from query
  let id_session = event.context.params?.id_session; 
  let id_session_string: string = "";

  if (id_session !== null && id_session !== undefined) {
    id_session_string = id_session.toString();
    console.log("id_session for : " ,id_session_string)
  }
  try {
    // to get a data_question with our service
    const dataQuestion = await questionReponseService.getDataQuestionById(id_session_string) ;
    console.log("Data question", dataQuestion)
    if (dataQuestion != null || dataQuestion !== undefined) {
        setResponseStatus(event, 200);
        return dataQuestion
    } else {  
        setResponseStatus(event, 404);
        return { error: 'Question not found' }
    }
  } catch (error) {
    console.error('Error fetching question data:', error);
    setResponseStatus(event, 500);
    return { error: 'Failed to fetch question data' }
  }
});
