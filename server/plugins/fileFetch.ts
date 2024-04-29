import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

export let id_session:string = "undefind"
export default function fileFetch() {
    const prisma = new PrismaClient();
    let isFetchingData = false; // Variable to keep track of the state

    async function fetchDataAndInsertIntoDatabase(filePath: string): Promise<void> {
        // Check if an operation is already in progress
        if (isFetchingData) {
            console.log('An operation is already in progress. Waiting for the next iteration.');
            return;
        }
        isFetchingData = true; // Set to true to indicate the start of the operation

        try {
            // Read the file
            fs.readFile(filePath, 'utf8', async (err, data) => {
                if (err) {
                    console.error('Error reading the file:', err);
                    isFetchingData = false; // Set back to false in case of error
                    return;
                }

                // Divide blocks using separator "===="
                const blocks: string[] = data.split('====');
                // Iterate through each block and process it
                for (const block of blocks) {

                    // Insert into the database
                    //await insertIntoDatabase(block);

                    try{
                        const parsedRequest = parseHttpRequestTextToJSON(block);
                        if(parsedRequest){
                            console.log(parsedRequest)
                            insertIntoDatabase(parsedRequest)
                        }
                    }
                    catch(err){
                        isFetchingData = false;
                    }
                }

                // Empty the file after processing all blocks
                fs.writeFile(filePath, '', 'utf8', (err) => {
                    if (err) {
                        console.error('Error writing to the file:', err);
                    }
                    isFetchingData = false; // Set back to false after operation completion
                });
            });
        } catch (error) {
            console.error('An error occurred:', error);
            isFetchingData = false; // Set back to false in case of error
        }
    }

    // Function to insert into the database
    async function insertIntoDatabase(str:any): Promise<void> {
        const verb = str.verb;
        let type = str.object.type;

        if ((verb == "submit"||(verb=="completed"&&str.context.actorStatus == "group")||verb=="corrected") && type == "Quiz") {
            type = str.object.quizType
        }
        console.log("New object : " + verb)
        console.log("type : " + type)

        //if message is a qcm
        //if(type == )
        if(type == "QCM" || type == "QCU") insertQCM_QCU(str,verb,prisma);
        if(type == "access") insertSync(str, prisma)
        else{
            console.log("error no path for now")
        }

    }

     // Call fetchDataAndInsertIntoDatabase at regular intervals
     setInterval(() => {
        let filePath:string
        if(process.platform === "linux") filePath = './filtered_requests.log';
        else filePath = '.\\filtered_requests.log';
        //const filePath: string = '..\\ks\\serveurRequete\\filtered_requests.log';
        //const filePath: string = '..\\filtered_requests.log';
        fetchDataAndInsertIntoDatabase(filePath);
    }, 1000);
}
//get question ids to be able to get the right answer when professor correct it
function extractIDs(quizAnswers:any) {
    const listeIDs = [];
    for (const answers of quizAnswers.result.quiz) {
        if (answers && answers.name) {
            listeIDs.push(Number(answers.name));
        }
    }
    console.log(listeIDs)
    return listeIDs;
}

//update answers list with the new answer
function newAnswer(founded:any, student_answer:any){
    let updated_tab = founded.list
    console.log(founded)
    for (const answer of student_answer.result.quiz) {
        if (answer && answer.name) {
            //console.log(answer)
            updated_tab[answer.index-1]= answer.count //here we add the 'now score' of the answers to the question
        }
    }
    console.log('tdr list inititalized')
    return updated_tab;
}

//after the prof correct the quiz, we want to get what are the right anwsers
function getRightAnswers(correction:any, size:number,ids:any){
    let tab_right_answers:number[] = new Array(size)
    let correctAnswers = correction.result.answers
    //console.log(correctAnswers)
    //console.log(ids)
    for (let i = 0; i < size; i++) {
        //console.log(ids[i])
        for(const answer of correctAnswers){
            if(ids[i] === Number(answer)){tab_right_answers[i] = 1; break}
            else{tab_right_answers[i] = 0}
        }
    }
    return tab_right_answers
}


function StringAsFloatToInt(str:string){
    return Math.floor(parseFloat(str))
}

function parseHttpRequestTextToJSON(httpRequestText: string): string | null {
    //const startMarker = "> Body";
    //const startIndex = httpRequestText.indexOf(startMarker);
    //if(!httpRequestText) return null

    //const bodyText = httpRequestText.substring(startIndex + startMarker.length).trim();
    const startMarker = "> Body"
    const startIndex = httpRequestText.indexOf(startMarker);
    const JsonRequest = httpRequestText.substring(startIndex+startMarker.length).trim()
    if(!JsonRequest) return null
    else {console.log("request : ") ;//console.log(JsonRequest)
    }
    try {
        const bodyJSON = JSON.parse(JsonRequest);
        return bodyJSON;
    } catch (error) {
        console.error("Error parsing body JSON:", error);
        return null;
    }
}

// INSERT DATA THERE, DEPEND ON THE TYPE OF DATA STORED
//QCM => 3 options,
//1 the question has just been create
//2 an answer from a student is coming
//3 a correction from the professor close the QCMS
async function insertQCM_QCU(str:any,verb:string, prisma:PrismaClient){
    //1
    if(verb == "submit") {
        try {
            // Insert into the database using Prisma
            await prisma.data_Question.create({
                data: {
                    id_session: str.courseSessionId,
                    id_question: str.object.id,
                    num_slide: Number(str.context.currentView.currentSection),
                    list:  [],
                    question_url:str.object.title,
                    list_tdr: [],
                    right_answers: [],
                    answers_id:[],
                    type: str.object.quizType
                },
            });
        }
        catch (error) {
            console.error('An error occurred while inserting into the database:', error);
        }
    }
    else{
        let questionFounded
        //search the question data's in db
        try{
            questionFounded = await prisma.data_Question.findFirst({
                where: {
                    id_question: str.object.id
                }
            });
        }catch(error){
            console.error('error getting question in bdd: '+error)
        }

        //2
        if (verb == "completed") {
            // If question founded
            if(questionFounded) {
                //initialize for the 1st time
                if(questionFounded.list.length==0){
                    let list_init:number[] =[];
                    for (let i = 0; i < str.result.quiz.length; i++) {
                        list_init.push(0);
                    }
                    await prisma.data_Question.update({
                        where: {
                            id: questionFounded.id
                        },
                        data: {
                            list_tdr: list_init,
                            answers_id: extractIDs(str)
                        }
                    });
                }
                //get the student answer
                await prisma.data_Question.update({
                    where: {
                        id: questionFounded.id
                    },
                    data:{
                        list: newAnswer(questionFounded, str),
                    }
                })
            }
        }
        //2
        if(verb=="corrected"){
            console.log("corrected")
            if(questionFounded)
            await prisma.data_Question.update({
                where:{
                    id: questionFounded.id
                },
                data:{
                    right_answers : getRightAnswers(str, questionFounded.list.length,questionFounded.answers_id)
                }
            })
        }
    }
}

async function insertSync(str:any, prisma:PrismaClient){

    let session = await prisma.session.findFirst({
        where : {
            id_session : str.id_session
        }
    })
    let data
    if(session)
    data = await prisma.data_Suivi_RT.findFirst({
        where:{
            id_session : session.id_session,
            num_slide: session.current_slide
        }
    })
    if(str.context.actorStatus == "teacher" && session){
        if(!data){
            prisma.data_Suivi_RT.create({
                data:{
                    id_session : session.id_session,
                    id_slides : [str.object.currentSection],
                    num_slide : str.object.currentSection,
                    id_slide : str.object.currentSection,
                    list: [0]
                }
            })
            await prisma.session.update({
                where:{
                    id_session: session.id_session
                },
                data:{
                    current_slide : Number(str.object.currentSectionTitle)
                }
            })
        }
    }
    if(str.context.actorStatus == "student" && data && session){
        let firstConnexion = false
        if(str.context.type == "DialogSelectBag"){
            firstConnexion = true
        }
        data = updateData(data, str, firstConnexion)
        if(data)
        prisma.data_Suivi_RT.update({
            where:{
                id : data.id
            },
            data:{
                list: data.list,
                id_slides: data.id_slides,
                index : data.index
            }
        })
    }
}

function updateData(data: any,str:any, firstConnexion:boolean):any{
    if(!data.id_slides.include(str.object.currentSection)){
        data.index.push(str.object.currentSectionTitle)
        data.id_slides.push(str.object.currentSection)
    }
    if(!firstConnexion){
        data.list[data.index.indexOf(str.context.currentSectionTitle)] --
    }
    data.list[data.index.indexOf(str.object.currentSectionTitle)] ++

    return data
}
