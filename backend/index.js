require("dotenv").config();

const cors = require("cors");
const express = require("express");
const { rateLimit } = require("express-rate-limit");
const translateRoutes = require("./src/routes/translate.route");

const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
const port = Number(process.env.PORT) || 1198;

app.disable("x-powered-by");
app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Origin is not allowed."));
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
}));
app.use(express.json({ limit: "16kb" }));

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/v1/translate", rateLimit({
    windowMs: 60 * 1000,
    limit: 20,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { success: false, error: "Too many requests. Please try again shortly." },
}));
app.use("/api/v1/translate", translateRoutes);

app.use((req, res) => {
    res.status(404).json({ success: false, error: "Route not found." });
});

app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);

    if (error.type === "entity.too.large") {
        return res.status(413).json({ success: false, error: "Request body is too large." });
    }

    if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
        return res.status(400).json({ success: false, error: "Request body must be valid JSON." });
    }

    if (error.message === "Origin is not allowed.") {
        return res.status(403).json({ success: false, error: "Origin is not allowed." });
    }

    console.error("Unhandled server error:", error.message);
    return res.status(500).json({ success: false, error: "An unexpected server error occurred." });
});

app.listen(port, () => {
    console.log(`Language Translator API listening on port ${port}`);
});
