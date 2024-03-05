var express = require("express");
import path from "path";

const router = express.Router();
router.get("^/$|/index(.html)?", (req: any, res: any) => {
	res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

module.exports = router;
