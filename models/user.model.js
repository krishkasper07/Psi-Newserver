const mongoose=require('mongoose')

const Schema = mongoose.Schema;

const userSchema = new Schema({
	firstName:{
		type: String,
		required: true,
	},
	lastName:{
		type: String,
		required: true,
	},
	userName: {
		type: String,
		required: true,
    unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	roles: {
		type: [String],
		enum: ["user", "admin", "super_admin"],
		default: ["user"],
	},
});

const User = mongoose.model("User", userSchema);

module.exports=User;