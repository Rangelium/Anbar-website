const sql = require("mssql");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

const { connConfig } = require("./serverTools/connectionConfig");
const { sha256 } = require("./serverTools/sha256");

const multer = require("multer");
const upload = multer({
	storage: multer.diskStorage({
		destination(req, file, cb) {
			cb(null, `${__dirname}/transferFiles`);
		},
		filename(req, file, cb) {
			cb(null, `${req.body.title}${path.parse(file.originalname).ext}`);
		},
	}),
	limits: {
		fileSize: 10000000, // max file size 1MB = 1000000 bytes
	},
	fileFilter(req, file, cb) {
		if (file.originalname.match(/\.(exe)$/)) {
			return cb(new Error("exe files are not allowed"));
		}
		cb(undefined, true); // continue with upload
	},
});

const app = require("express")();
const port = 7000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(port, "0.0.0.0", () => {
	console.log(`Example app listening at http://localhost:${port}`);
});

app.post("/api/dbconnect", (req, res) => {
	sql.connect(connConfig, () => {
		let request = new sql.Request();

		if (req.body.data) {
			for (const [key, value] of Object.entries(req.body.data)) {
				request.input(key, value);
			}
		}
		request.execute(req.body.procedure, (err, result) => {
			try {
				if (err !== null) {
					return res
						.status(400)
						.json({ error: err, errText: err.originalError.info.message });
				}
				return res.status(200).json(result.recordset);
			} catch (error) {
				res.status(500).json({ error, errText: "Internal server error" });
			}
		});
	});
});

app.post("/api/login", (req, res) => {
	console.log("Request Login");
	sql.connect(connConfig, (err) => {
		if (err) console.log(err);
		let request = new sql.Request();
		let username = req.body.username;
		let password = sha256(req.body.password);

		request.input("username", username);
		request.input("password", password);
		request.execute("anbar.user_login_check", (err, result) => {
			if (err != null) console.log(err);
			res.json(result.recordset);
		});
	});
});

app.post(
	"/api/uploadTransferFile",
	upload.single("file"),
	async (req, res) => {
		res.status(200).send("File uploaded successfully");
	},
	(error, req, res, next) => {
		if (error) {
			console.log(error);
			res.status(500).send(error.message);
		}
	}
);
