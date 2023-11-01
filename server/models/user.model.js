import { Schema,model } from "mongoose";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const UserSchema=new Schema({
   fullname:{
    type:'String',
    required:[true,"Name is required"],
    lowercase:true,
    minLength:[3,"Name should be atleast 3 character"],
    maxLength:[20,"maximum 20 char name"],
    trim:true
   },
   email:{
    type:'String',
    required:true,
    lowercase:true,
    trim:true,
    unique:true,
    match:[/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,"please fill a valid email address"]
   },
   password:{
    type:'String',
    minLength:[8,"password should be atleast 8 characters"],
    required:[true,"password is required"],
    select:false
   },
   avatar:{
    public_id:{
        type:'String'
    },
    secure_url:{
        type:'String'
    }
   },
   role:{
    type:'String',
    enum:['USER','ADMIN'],
    default:'USER'
   },
   forgotPasswordToken:String,
   forgotPasswordExpiry:Date,
   subscription:{
    id:String,
    status:String
   }
},
{
    timestamps:true
})
UserSchema.pre('save',async function(next){
    if(!this.isModified('password'))
    {
       return next()
    }
    this.password=await bcrypt.hash(this.password,10)
})
UserSchema.methods={
    generateJWTToken:async function(){
        return await jwt.sign({
            id:this._id,email:this.email,subscription:this.subscription,role:this.role
        },process.env.JWT_SECRET,
        {
            expiresIn:process.env.JWT_EXPIRY
        })
    },
    comparePassword:async function(plainTextPassword){
        return await bcrypt.compare(plainTextPassword,this.password)
    },
    //generate Token for reset password
    generatePasswordResetToken:async function(){
       const resetToken=crypto.randomBytes(20).toString('hex');
        this.forgotPasswordToken=crypto
           .createHash('sha256')
           .update(resetToken)
           .digest('hex')

        this.forgotPasswordExpiry=Date.now() + 15*60*1000; //15 min from the current time
        return resetToken;
    }
}

const User=model('User',UserSchema)

export default User;