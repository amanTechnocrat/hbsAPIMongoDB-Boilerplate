const bcrypt = require('bcrypt');

const genhash = async (saltcount,plaintext) => {
    let salt = await bcrypt.genSalt(saltcount)
    const hash = await bcrypt.hash(plaintext,salt);
    return hash;
}

const verify =async(plaintext,hash)=>{
    const checkplaintext = await bcrypt.compare(plaintext,hash);
    return checkplaintext;
}
// verify("t","$2b$12$E4nlr7d7zCFrt1l8f5GB2.BDGZfUNqQ.vwzr8qbf14zngiD8vUGj6")
// genhash(10,"rr")

module.exports={genhash,verify}

