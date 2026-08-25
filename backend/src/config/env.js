import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

// Carga backend/.env sin depender de la carpeta desde la que se inició Node.
dotenv.config({ path: fileURLToPath(new URL("../../.env", import.meta.url)) });
