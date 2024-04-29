import { id_session } from "./fileFetch";
import { PrismaClient } from '@prisma/client';

export default defineNitroPlugin((nitroApp) => {
    const prisma = new PrismaClient();

    setInterval(() => {
        if(id_session != "undefined") update(prisma);
    }, 10000);
})

async function update(prisma:PrismaClient){
    let session = await prisma.session.findUnique({
        where:{
            id_session: id_session
        }
    })
    if(session){
        let dataRT = await prisma.data_Suivi_RT.findFirst({
            where:{
                id_session:id_session, 
                num_slide: session?.current_slide
            }
        })
        if(dataRT) prisma.data_Suivi_PS.create({
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

function getCurrentDateTime(): string {
    const now: Date = new Date();
    const date: string = now.toLocaleDateString();
    const time: string = now.toLocaleTimeString();
    return `${date} ${time}`;
}