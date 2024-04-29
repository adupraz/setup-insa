import { couldStartTrivia } from "typescript"
import * as http from 'http';
import * as fs from 'fs';

export default defineNitroPlugin((nitroApp) => {
    let serverRunning = false
    async function getDataFromIN() {
        if (!serverRunning) {
            serverRunning = true
            const server = http.createServer();
            // Liste des mots clés à filtrer
            const keywordsToFilter: string[] = ['submit', 'corrected', 'completed'];

            server.on('request', (request: http.IncomingMessage, response: http.ServerResponse) => {
                let body: Buffer[] = [];

                request.on('data', (chunk: Buffer) => {
                    body.push(chunk);
                }).on('end', () => {
                    const requestBody: any = Buffer.concat(body).toString();

                    // console.log(`==== ${request.method} ${request.url}`);
                    // console.log('> Headers');
                    // console.log(request.headers);

                    // console.log('> Body');
                    // console.log(requestBody);

                    // Filtrage basé sur le contenu de "verb"
                    try {
                        const parsedBody = JSON.parse(requestBody);
                        if (parsedBody.verb) {
                            const verb: string = parsedBody.verb.toLowerCase();
                            if (keywordsToFilter.some(keyword => verb.includes(keyword.toLowerCase()))) {
                                // Écriture dans un fichier texte
                                fs.promises.appendFile('..\\filtered_requests.log', `==== ${request.method} ${request.url}\n`)
                                    .then(() => fs.promises.appendFile('.\\filtered_requests.log', '> Headers\n'))
                                    .then(() => fs.promises.appendFile('.\\filtered_requests.log', JSON.stringify(request.headers) + '\n'))
                                    .then(() => fs.promises.appendFile('.\\filtered_requests.log', '> Body\n'))
                                    .then(() => fs.promises.appendFile('.\\filtered_requests.log', requestBody + '\n\n'))
                                    .catch(err => console.error(err));
                            }
                        }
                    } catch (error) {
                        console.error('Error parsing JSON:', error);
                    }
                    response.end();
                });
            });
            server.listen(8000);
        }
    }

    setInterval(() => {
        getDataFromIN();
    }, 1000);
})
