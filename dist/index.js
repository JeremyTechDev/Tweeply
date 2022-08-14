"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const next_1 = __importDefault(require("next"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_1 = __importDefault(require("./routes/auth"));
const tweets_1 = __importDefault(require("./routes/tweets"));
const auth_2 = __importDefault(require("./middlewares/auth"));
const isDev = process.env.NODE_ENV !== 'production';
const PORT = Number(process.env.PORT) || 3000;
const HOSTNAME = process.env.HOSTNAME || 'localhost';
const COOKIE_SECRET = process.env.COOKIE_SECRET;
const app = (0, next_1.default)({ dev: isDev, hostname: HOSTNAME, port: PORT });
const appHandler = app.getRequestHandler();
app.prepare().then(() => {
    const server = (0, express_1.default)();
    server.use(express_1.default.json());
    server.use((0, cookie_parser_1.default)(COOKIE_SECRET));
    // give all Next.js's requests to Next.js server
    if (appHandler) {
        server.get('/_next/*', (req, res) => {
            return appHandler(req, res);
        });
        server.get('/static/*', (req, res) => {
            return appHandler(req, res);
        });
    }
    // API routes
    server.use('/api/auth', auth_1.default);
    server.use('/api/tweets', auth_2.default, tweets_1.default);
    // let next handle the default route
    if (appHandler) {
        server.get('*', (req, res) => {
            return appHandler(req, res);
        });
    }
    server.listen(PORT, () => {
        console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
    });
    return server;
});
