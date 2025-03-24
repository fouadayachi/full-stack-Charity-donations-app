import mongoose from 'mongoose';


const messagesSchema = new mongoose.Schema({
    fullName : {type : String, required : true},
    email : {type : String, required : true},
    message : {type : String, required : true},
    isRead : {type : Boolean , default : false}  
},{timestamps : true});


const Messages = mongoose.model("Message", messagesSchema);

export default Messages;