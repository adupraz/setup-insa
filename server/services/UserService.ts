import {PrismaClient } from '@prisma/client';
import Session from '../data/Session';
import User from '../data/User';
import { compare, genSalt, hash } from "bcrypt-ts";

    
// Function to generate a unique session cookie id
function generateId() {
    // Random with 9 characters
    return Math.random().toString(36).substr(2, 9);
  }

const prisma = new PrismaClient();
class UserService{
    
    async signin(username: string, password: string) {

        try {
            const users = await prisma.user.findMany({
                where: {
                  nom : username
                }
            });
            if (!users) return null; 
            let res : User; 
            
            for(const user of users){
                if(await compare(password, user.password)){
                    const sessions = await prisma.session.findMany({
                        where: {
                          userId : user.id_user
                        }
                    });

                    const sessions_id = sessions.map(session => session.id_session)

                    res = new User(user.id_user, user.nom, user.password, sessions_id);
                    console.log("res :", res);
                    return res;
                }
                break; 
            }
           
            
        }catch (error: any) {
            throw new Error(`Une erreur s'est produite : ${error.message}`);
        }

    }

   
}

export default UserService;