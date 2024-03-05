import mongoose from "mongoose";

interface UserModel {
	id: Number;
	username: String;
	password: String;
	roles: String[];
	active: Boolean;
}

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	roles: [
		{
			type: String,
			default: "User",
		},
	],
	active: {
		type: Boolean,
		default: true,
	},
});

export default mongoose.model<UserModel>("User", UserSchema);
