import { id_sessions } from "./fileFetch";
import { PrismaClient } from '@prisma/client';

export default defineNitroPlugin(() => {
    const prisma = new PrismaClient();

    setInterval(() => {
        if(id_sessions.length != 0) {
            console.log(id_sessions);update(prisma)}; //ligne 236 => def of id_session when a session is created 
    }, 10000);
})

async function update(prisma:PrismaClient){
    for(let id_session of id_sessions){
        let session = await prisma.session.findUnique({
            where:{
                id_session: id_session
            }
        })
        if(session){
            let dataRT = await prisma.data_Suivi_RT.findFirst({
                where:{
                    id_session:id_session, 
                    num_slide: session.current_slide
                }
            })
            if(dataRT) {
                await prisma.data_Suivi_PS.create({
                    data:{
                        id_session: id_session,
                        num_slide: dataRT.num_slide,
                        index: dataRT.index,
                        list : dataRT.list,
                        date: getCurrentDateTime()
                    }
                })
            }
        }
    }
}

export function getCurrentDateTime(): string {
    const now: Date = new Date();
    const date: string = now.toLocaleDateString();
    const time: string = now.toLocaleTimeString();
    return `${date} ${time}`;
}