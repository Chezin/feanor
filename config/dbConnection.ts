import mongoose from "mongoose";

const connectDB = async (DATABASE_URI: string) => {
	try {
		await mongoose.connect(DATABASE_URI);
	} catch (err) {
		console.error(err);
	}
};

export default connectDB;
