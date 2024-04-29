import QuestionReponseService  from '../../services/QuestionReponseService';


const questionReponseService = new QuestionReponseService();
export default defineEventHandler(async (event) => {
    
  // to obtain id_courses from the api routes 
  let id_session = event.context.params?.course;
  let id_session_string: string | null = "";

  if (id_session !== null && id_session !== undefined) {
    id_session_string = id_session.toString();
    console.log("id_session : " ,id_session_string)
  }
  try {
    // to get a data_question with our service
    const dataQuestion = await questionReponseService.getDataQuestionById(id_session_string) ;
    console.log("Data question", dataQuestion)
    if (dataQuestion != null || dataQuestion !== undefined) {
      return {
        statusCode: 200,
        body: dataQuestion
      };
    } else {  
      return {
        statusCode: 404,
        body: { error: 'Question not found' }
      };
    }
  } catch (error) {
    console.error('Error fetching question data:', error);
    return {
      statusCode: 500,
      body: { error: 'Failed to fetch question data' }
    };
  }
});
