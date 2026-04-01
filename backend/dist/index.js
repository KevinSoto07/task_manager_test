"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const tasks_1 = __importDefault(require("./routes/tasks"));
const auth_1 = __importDefault(require("./routes/auth"));
const app = (0, express_1.default)();
const port = 3000;
app.use((0, cors_1.default)({ origin: 'https://task-manager-test-phi.vercel.app' }));
app.use(express_1.default.json()); //Para leer JSON en las peticiones
app.get('/', (req, res) => {
    res.json({ message: 'Servidor Funcionando' });
});
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
app.use('/tasks', tasks_1.default);
app.use('/auth', auth_1.default);
