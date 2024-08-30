const {connect}=require('mongoose')

const connectToDB=async(db_url)=>{
    try {
        await connect(db_url);
    } catch (error) {
        console.log(error)
    }

}

module.exports=connectToDB;