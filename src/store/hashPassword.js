
   
//bcryptjs is used by strapi to hash passwords https://forum.strapi.io/t/what-is-the-encryption-used-by-strapi-in-the-password-fields/4149
//before upadting the password in the db, it has to be hashed


const bcrypt = require("bcryptjs");


export async function hashPassword(password) {

    const hashPassword = await bcrypt.hash(password, 10);
    return hashPassword;

}
