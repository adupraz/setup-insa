import { PrismaClient } from '@prisma/client';
import { getCurrentDateTime } from './updatePS';
import { getSharedValue } from '../sharedvalue';

import * as fs from 'fs';
import { isNumber } from 'chart.js/helpers';

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
               
                for (const block of (await getSharedValue())) {
                    //console.log("printblock")
                    //yconsole.log(block)
                    // Insert into the database
                    try{
                        if(block){
                            insertIntoDatabase(block)
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
                })
                fs.readFile(filePath, 'utf8', async (err, data) => {
                    if (err) {
                        console.error('Error reading the file:', err);
                        isFetchingData = false; // Set back to false in case of error
                        return;
                    }
                })
                //if(data) console.log(data)

            });
        } catch (error) {
            console.error('An error occurred:', error);
            isFetchingData = false; // Set back to false in case of error
        }
    }

    // Function to insert into the database
    async function insertIntoDatabase(str:any): Promise<void> {

        //str is the request
        const verb = str.verb;
        let type = str.object.type;

        if ((verb == "submit"||(verb=="completed"&&str.context.actorStatus == "group")||verb=="corrected") && type == "Quiz") {
            type = str.object.quizType
        }
        console.log("New object : " + verb)
        console.log("type : " + type)

        //Choice of which treatment to do to the data based on 'verb' and 'type'
        if(verb == "select" || "start") insertSession(str,verb, prisma)
        if(type == "QCM" || type == "QCU") insertQCM_QCU(str,verb,prisma);
        if(verb == "access") insertSync(str, prisma)
        else{
            console.log("error no path for now")
        }

    }

     // Call fetchDataAndInsertIntoDatabase at regular intervals
     setInterval(() => {
        let filePath: string
        if(process.platform === "linux") filePath = './filtered_requests.log';
        else filePath = '.\\filtered_requests.log';
        fetchDataAndInsertIntoDatabase(filePath);
    }, 1000);
}
//get question ids to be able to get the right answer when professor correct it
function extractIDs(quizAnswers:any):string[] {
    const listeIDs:string[] = [];
    for (const answers of quizAnswers.result.quiz) {
        if (answers && answers.name) {
            listeIDs.push(answers.name);
        }
    }
    //console.log(listeIDs)
    return listeIDs;
}

//update answers list with the new answer
function newAnswer(founded:any, student_answer:any){
    let updated_tab = founded.list
    //console.log(founded)
    for (const answer of student_answer.result.quiz) {
        if (answer && answer.name) {
            //console.log(answer)
            updated_tab[answer.index-1]= answer.count //here we add the 'now score' of the answers to the question
        }
    }
    //console.log('tdr list inititalized')
    return updated_tab;
}
function updateTDR(questionFounded:number[], date1:string, date2:string, nb_ajout:number):number[]{
    for (let i = 0; i < nb_ajout; i++) questionFounded.push(getSecondsDifference(new Date(date1), new Date(date2)))
    return questionFounded
}
function formatDateTime(date: Date): string {
    const year: number = date.getFullYear()
    const month: string = (date.getMonth() + 1).toString().padStart(2, '0')
    const day: string = date.getDate().toString().padStart(2, '0')
    const hours: string = date.getHours().toString().padStart(2, '0')
    const minutes: string = date.getMinutes().toString().padStart(2, '0')
    const seconds: string = date.getSeconds().toString().padStart(2, '0')
    const milliseconds: string = date.getMilliseconds().toString().padStart(3, '0')
    const offset: string = formatTimezoneOffset(date.getTimezoneOffset())

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${offset}`
}
function formatTimezoneOffset(offset: number): string {
    const sign: string = offset > 0 ? '-' : '+'
    const absOffset: number = Math.abs(offset)
    const hours: string = Math.floor(absOffset / 60).toString().padStart(2, '0')
    const minutes: string = (absOffset % 60).toString().padStart(2, '0')

    return `${sign}${hours}:${minutes}`
}
function getSecondsDifference(date1: Date, date2: Date): number {
    const differenceInSeconds: number = Math.abs((date2.getTime() - date1.getTime()) / 1000)
    return Math.round(differenceInSeconds)
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
            if(ids[i] === answer){tab_right_answers[i] = 1; break}
            else{tab_right_answers[i] = 0}
        }
    }
    return tab_right_answers
}




// INSERT DATA THERE, DEPEND ON THE TYPE OF DATA STORED
//session => store new course if they were just created
async function insertSession(str:any, verb:String, prisma:PrismaClient){
    if(str.context.actorStatus == "teacher" && str.object.type == "Course" && verb=="select"){
        //console.log("Step 1 create course")
        let usr = await prisma.user.findUnique({
            where : {
                id_user : str.actor
            }
        })
        if(usr){
            let course = await prisma.course.findUnique({
                where: {
                    id_course: str.object.id,
                    userId : usr.id_user
                }
            })

            if(!course){
                course = await prisma.course.create({
                    data:{
                        id_course : str.object.id,
                        userId : usr.id_user,
                        id_sessions : [],
                        date: getCurrentDateTime(),
                        name: str.object.title
                    }
                })
                //console.log("course created, id : " + course.id_course)
            }
        }
    }
    if(verb == "start"){
        let usr = await prisma.user.findUnique({
            where : {
                id_user : str.actor
            }
        })
        if(usr){
            let course = await prisma.course.findUnique({
                where: {
                    id_course: str.object.course.id,
                    userId : usr.id_user
                }
            })
            if(course){
                await prisma.course.update({
                    where:{
                        id: course.id
                    },
                    data:{
                        id_sessions: course.id_sessions.concat([str.object.id])
                    }
                })
                let session = await prisma.session.findUnique({
                    where:{
                        id_session: str.object.id,
                        id_course : course.id_course
                    }
                })
                if(!session){
                    //console.log("Step 2 create session")
                    session = await prisma.session.create({
                        data:{
                            id_session: str.object.id,
                            id_course: course.id_course,
                            name: "(" + course.id_sessions.length.toString()+") " +course.name,
                            nb_students : 0,
                            date: getCurrentDateTime(),
                            userId: usr.id_user,
                            current_slide: 1
                        }
                    })
                    await prisma.user.update({
                        where:{
                            id : usr.id
                        },
                        data:{
                            sessionsId : appendNewCourse(usr.sessionsId, session.id_session)
                        }
                    })
                    id_session = session.id_session
                    console.log("session created, id : " + session.id_session)
                    console.log("new Session")
                    console.log(session.id_session)
                }
            }
            
        }
    }
}

function appendNewCourse(id_sessions:string[], newSession:string){
    if(!id_sessions.includes(newSession)) id_sessions.push(newSession)
    return id_sessions
}
//QCM => 3 options,
//1 the question has just been create
//2 an answer from a student is coming
//3 a correction from the professor close the QCMS
async function insertQCM_QCU(str:any,verb:string, prisma:PrismaClient){
    let session = await prisma.session.findUnique({
        where: {
            id_session:str.courseSessionId
        }
    })
    //1
    if(verb == "submit" && session) {
        try {
            // Insert into the database using Prisma
            await prisma.data_Question.create({
                data: {
                    id_session: session.id_session,
                    id_question: str.object.id,
                    num_slide: session.current_slide,
                    id_slide: str.context.currentView.currentSection,
                    list:  [],
                    question_url:str.object.title,
                    list_tdr: [],
                    list_responses : [],
                    right_answers: [],
                    answers_id:[],
                    nb_response : 0,
                    type: str.object.quizType,
                    date: getCurrentDateTime()
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
            questionFounded = await prisma.data_Question.findUnique({
                where: {
                    id_question: str.object.id
                }
            });
        }catch(error){
            console.error('error getting question in bdd: '+error)
        }

        //2
        if (verb == "completed" && str.result.quiz && str.context.actorStatus == "group") {
            // If question founded
            if(questionFounded) {
                console.log(questionFounded.list.length)
                //initialize for the 1st time
                if(questionFounded.list.length==0){
                    questionFounded = await prisma.data_Question.update({
                        where: {
                            id: questionFounded.id
                        },
                        data: {
                            answers_id: extractIDs(str),
                            list: new Array(str.result.quiz.length).fill(0)
                        }
                    });
                }
                console.log("questionFounded" + questionFounded.list)
                let list_tdr_rep = update_list_responses(questionFounded.list, str)
                //get the student answer
                await prisma.data_Question.update({
                    where: {
                        id: questionFounded.id
                    },
                    data:{
                        list: newAnswer(questionFounded, str),
                        list_tdr: updateTDR(questionFounded.list_tdr, questionFounded.date, str.timestamp, list_tdr_rep.length),
                        list_responses: questionFounded.list_responses.concat(list_tdr_rep),
                        nb_response : questionFounded.nb_response + 1
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
function update_list_responses(founded:number[], student_answer:any):string[]{
    let updated_tab = founded
    let list:string[] = []
    //console.log(founded)
    for (const answer of student_answer.result.quiz) {
        if (answer && answer.name) {
            if(updated_tab[answer.index-1]!= answer.count){
                list.push(answer.name)
            }
        }
    }
    return list
}
//Sync beetween teacher/student => 2 cases, if teacher switch slide (1) or if student switch slide (2)
async function insertSync(str:any, prisma:PrismaClient){
    let session
    if(str.courseSessionId){
        session = await prisma.session.findFirst({
            where : {
                id_session : str.courseSessionId
            }
        })
    }
    let data
    //(1)
    if(str.context.actorStatus == "teacher" && session && isNumber(Number(str.object.currentSectionTitle))&&str.context.currentView.type != "Tab"){
        if(session){
            data = await prisma.data_Suivi_RT.findFirst({
                where:{
                    id_session : session.id_session,
                    num_slide: Number(str.object.currentSectionTitle)
                }
            })
        }
        if(!data && str.object.currentSection){
            await prisma.data_Suivi_RT.create({
                data:{
                    id_session : session.id_session,
                    id_slides : [str.object.currentSection],
                    num_slide : Number(str.object.currentSectionTitle),
                    id_slide : str.object.currentSection,
                    index : [Number(str.object.currentSectionTitle)],
                    list: [0]
                }
            })
        }
        await prisma.session.update({
            where:{
                id_session: session.id_session
            },
            data:{
                current_slide : Number(str.object.currentSectionTitle)
            }
        })
    }
    //(2)
    if(str.context.actorStatus == "student" && session && isNumber(Number(str.object.currentSectionTitle)) && (str.context.currentView.type != "ViewQuiz" &&str.context.currentView.type != "ViewWhiteBoard"&&str.context.currentView.type != "ViewNoteBook"&&str.context.currentView.type != "Tab")){
        data = await prisma.data_Suivi_RT.findFirst({
            where:{
                id_session : session.id_session,
                num_slide: session.current_slide
            }
        })
        console.log("found session and data for student")
        let firstConnexion = false
        if(str.context.currentView.type == "DialogSelectBag"){
            firstConnexion = true
        }
        let new_data
        if(data) new_data = updateData(data, str, firstConnexion)
        if(new_data)
        await prisma.data_Suivi_RT.update({
            where:{
                id : new_data.id
            },
            data:{
                list: new_data.list,
                id_slides: new_data.id_slides,
                index : new_data.index
            }
        })

    }
}

function updateData(data: any,str:any, firstConnexion:boolean):any{
    if(!data.id_slides.includes(str.object.currentSection)){
        data.index.push(Number(str.object.currentSectionTitle))
        data.id_slides.push(str.object.currentSection)
        data.list.push(0)
    }

    if(!firstConnexion){
        if(data.list[data.index.indexOf(Number(str.context.currentView.currentSectionTitle))] && data.list[data.index.indexOf(Number(str.context.currentView.currentSectionTitle))]!= 0)
            data.list[data.index.indexOf(Number(str.context.currentView.currentSectionTitle))] --
    }
    data.list[data.index.indexOf(Number(str.object.currentSectionTitle))] ++
    return data
}
