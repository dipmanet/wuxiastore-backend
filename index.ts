import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import express from "express";
import Connect from "connect-pg-simple";
import session from "express-session";
require("dotenv").config();

const PORT = process.env.SERVER_PORT || 5000;

const DEFAULT_ADMIN = {
	email: "dipmanet2021@gmail.com",
	password: "password",
};

const authenticate = async (email: string, password: string) => {
	if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
		return Promise.resolve(DEFAULT_ADMIN);
	}
	return null;
};

const start = async () => {
	const app = express();

	const admin = new AdminJS({});

	const ConnectSession = Connect(session);
	const sessionStore = new ConnectSession({
		conObject: {
			connectionString: `postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
			ssl: process.env.NODE_ENV === "development",
		},
		tableName: "session",
		createTableIfMissing: true,
	});
	console.log("test", JSON.stringify(sessionStore));

	const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
		admin,
		{
			authenticate,
			cookieName: "adminjs",
			cookiePassword: "sessionsecret",
		},
		null,
		{
			store: sessionStore,
			resave: true,
			saveUninitialized: true,
			secret: "sessionsecret",
			cookie: {
				httpOnly: process.env.NODE_ENV === "production",
				secure: process.env.NODE_ENV === "production",
			},
			name: "adminjs",
		}
	);
	app.use(admin.options.rootPath, adminRouter);

	app.listen(PORT, () => {
		console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`);
	});
};

start();
