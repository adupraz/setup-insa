import * as http from 'http';
import { pushIntoSharedValue } from '../sharedvalue';

export default defineNitroPlugin((nitroApp) => {
    let serverRunning = false
    async function getDataFromIN() {
        if (!serverRunning) {
            serverRunning = true
            const server = http.createServer();
            // Liste des mots clés à filtrer
            const keywordsToFilter: string[] = ['submit', 'corrected', 'completed', 'select','start', 'access'];

            server.on('request', (request: http.IncomingMessage, response: http.ServerResponse) => {
                let body: Buffer[] = [];

                request.on('data', (chunk: Buffer) => {
                    body.push(chunk);
                }).on('end', () => {
                    const requestBody: any = Buffer.concat(body).toString();
                    //Filtrage basé sur le contenu de "verb"
                    try {
                        const parsedBody = JSON.parse(requestBody) //parsing de la requête
                        const verb: string = parsedBody.verb.toLowerCase() //récupération du 'verb'
                        if (keywordsToFilter.some(keyword => verb.includes(keyword.toLowerCase()))) addToTreat(parsedBody) //tri en fonction du 'verb'
                        //console.log(parsedBody)
                    } catch (error) {
                        //console.error('Error parsing JSON:', error);
                    }
                    response.end();
                });
            });
            server.listen(443);
        }
    }

    setInterval(() => {
        getDataFromIN();
    }, 1000);
})

async function addToTreat(parsedBody:any) {
    if(parsedBody) await pushIntoSharedValue(parsedBody)
}