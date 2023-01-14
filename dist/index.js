"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adminjs_1 = __importDefault(require("adminjs"));
const express_1 = __importDefault(require("@adminjs/express"));
const express_2 = __importDefault(require("express"));
const connect_pg_simple_1 = __importDefault(require("connect-pg-simple"));
const express_session_1 = __importDefault(require("express-session"));
require("dotenv").config();
const PORT = process.env.SERVER_PORT || 5000;
const DEFAULT_ADMIN = {
    email: "dipmanet2021@gmail.com",
    password: "password",
};
const authenticate = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
        return Promise.resolve(DEFAULT_ADMIN);
    }
    return null;
});
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_2.default)();
    const admin = new adminjs_1.default({});
    const ConnectSession = (0, connect_pg_simple_1.default)(express_session_1.default);
    const sessionStore = new ConnectSession({
        conObject: {
            connectionString: `postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
            ssl: process.env.NODE_ENV === "development",
        },
        tableName: "session",
        createTableIfMissing: true,
    });
    console.log("test", JSON.stringify(sessionStore));
    const adminRouter = express_1.default.buildAuthenticatedRouter(admin, {
        authenticate,
        cookieName: "adminjs",
        cookiePassword: "sessionsecret",
    }, null, {
        store: sessionStore,
        resave: true,
        saveUninitialized: true,
        secret: "sessionsecret",
        cookie: {
            httpOnly: process.env.NODE_ENV === "production",
            secure: process.env.NODE_ENV === "production",
        },
        name: "adminjs",
    });
    app.use(admin.options.rootPath, adminRouter);
    app.listen(PORT, () => {
        console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`);
    });
});
start();
