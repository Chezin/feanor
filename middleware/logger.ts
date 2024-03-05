import { format } from "date-fns";
import express from "express";
import { v4 as uuid } from "uuid";
import fs from "fs";
import path from "path";

export const logEvents = async (message: string) => {
	const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
	const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
	console.log(logItem);

	try {
		if (!fs.existsSync(path.join(__dirname, "../logs"))) {
			await fs.promises.mkdir(path.join(__dirname, "../logs"));
		}
		await fs.promises.appendFile(
			path.join(__dirname, "../logs", "eventLog.txt"),
			logItem
		);
	} catch (err) {
		console.error(err);
	}
};

export const logger = (
	req: express.Request,
	res: express.Response,
	next: any
) => {
	logEvents(
		`${req.method}\t${req.url}\t${
			req.headers.origin ? req.headers.origin : "Origin not defined"
		}`
	);
	console.log(`${req.method} ${req.path}`);
	next();
};
