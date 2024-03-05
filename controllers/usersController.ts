import express from "express";
import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import User from "../models/User";
import Note from "../models/Note";

export const getAllUsers = asyncHandler(
	async (req: express.Request, res: express.Response) => {
		const users = await User.find().select("-password").lean();
		if (!users) {
			res.status(400).json({ message: "No users found" });
			return;
		}
		res.json(users);
		return;
	}
);
export const createUser = asyncHandler(
	async (req: express.Request, res: express.Response) => {
		const { username, password, roles } = req.body;
		if (!username || !password || !Array.isArray(roles) || !roles.length) {
			res.status(400).json({ message: "All fields are required" });
			return;
		}

		const duplicate = await User.findOne({ username }).lean().exec();

		if (duplicate) {
			res.status(409).json({ message: "Duplicate username" });
			return;
		}

		const hashedPwd = await bcrypt.hash(password, 10);
		const user = await User.create({
			username,
			password: hashedPwd,
			roles,
		});

		if (user) {
			res.status(201).json({ message: `New user ${username} created` });
		} else {
			res.status(400).json({ message: "Invalid user data received" });
		}

		return;
	}
);
export const updateUser = asyncHandler(
	async (req: express.Request, res: express.Response) => {
		const { id, username, roles, active, password } = req.body;
		if (
			!id ||
			!username ||
			!password ||
			!Array.isArray(roles) ||
			!roles.length ||
			typeof active !== "boolean"
		) {
			res.status(400).json({ message: "All fields are required" });
			return;
		}

		const user = await User.findById(id).exec();

		if (!user) {
			res.status(400).json({ message: "User not found" });
			return;
		}

		const duplicate = await User.findOne({ username }).lean().exec();
		if (duplicate && duplicate?._id?.toString !== id) {
			res.status(409).json({ message: "Duplicate username" });
			return;
		}

		user.username = username;
		user.active = active;
		user.roles = roles;

		if (password) {
			user.password = await bcrypt.hash(password, 10);
		}

		const updatedUser = await user.save();

		res.json({ message: `${updatedUser.username} updated` });
	}
);
export const deleteUser = asyncHandler(
	async (req: express.Request, res: express.Response) => {
		const { id } = req.body;

		if (!id) {
			res.status(400).json({ message: "User ID Required" });
			return;
		}

		const notes = await Note.findOne({ user: id }).lean().exec();
		if (notes) {
			res.status(400).json({ message: "User has tasks assigned" });
			return;
		}

		const user = await User.findById(id).exec();

		if (!user) {
			res.status(400).json({ message: "User not found" });
			return;
		}

		const reply = `Username ${user.username} with ID ${user._id} being deleted`;
		await user.deleteOne();

		res.json(reply);
	}
);
