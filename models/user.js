import mongoose from "mongoose";
const {Schema} = mongoose;


const userSchema = new Schema({
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true,},
    fullname : {type : String},
    gender : {type : String, enum:["male","female"]},
    city:{type:String},
    country:{type:String},
    dob:{type:String},
    isprofilecompletd:{type:Boolean},
},
{timestamps:true}
);

const User = mongoose.model('user', userSchema);

export default User;