import { logEvents } from "./logger";
import express from "express";

export const errorHandler = (
	err: any,
	req: express.Request,
	res: express.Response,
	next: any
) => {
	logEvents(
		`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${
			req.headers.origin ? req.headers.origin : "Origin not defined"
		}`
	);
	console.error(err.stack);

	const status = res.statusCode ? res.statusCode : 500;
	res.status(status);

	res.json({ message: err.message });
};
