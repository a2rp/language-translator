const axios = require("axios");

const PROVIDER_URL = "https://google-translate113.p.rapidapi.com/api/v1/translator/text";
const PROVIDER_HOST = "google-translate113.p.rapidapi.com";
const MAX_TEXT_BYTES = 6000;
const MAX_PROVIDER_BODY_BYTES = 7500;

module.exports.translateText = async (req, res) => {
    const { from, to, text } = req.body || {};

    if (typeof from !== "string" || !/^[a-z]{2,3}$/i.test(from)
        || typeof to !== "string" || !/^[a-z]{2,3}$/i.test(to)) {
        return res.status(400).json({ success: false, error: "Choose valid source and target language codes." });
    }

    if (typeof text !== "string" || !text.trim()) {
        return res.status(400).json({ success: false, error: "Enter text to translate." });
    }

    if (Buffer.byteLength(text, "utf8") > MAX_TEXT_BYTES) {
        return res.status(413).json({ success: false, error: "Text must be 6,000 UTF-8 bytes or less." });
    }

    if (from.toLowerCase() === to.toLowerCase()) {
        return res.json({ success: true, translatedText: text });
    }

    const apiKey = process.env.X_RAPIDAPI_KEY;
    if (!apiKey) {
        return res.status(503).json({ success: false, error: "Translation service is not configured." });
    }

    const providerBody = new URLSearchParams({ from, to, text });
    if (Buffer.byteLength(providerBody.toString(), "utf8") > MAX_PROVIDER_BODY_BYTES) {
        return res.status(413).json({ success: false, error: "Text is too long for the translation service." });
    }

    try {
        const response = await axios.post(
            PROVIDER_URL,
            providerBody,
            {
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                    "X-RapidAPI-Key": apiKey,
                    "X-RapidAPI-Host": PROVIDER_HOST,
                },
                timeout: 15000,
            }
        );

        if (typeof response.data?.trans !== "string") {
            console.error("Translation provider returned an unexpected response shape.");
            return res.status(502).json({ success: false, error: "Translation service returned an invalid response." });
        }

        return res.json({ success: true, translatedText: response.data.trans });
    } catch (error) {
        const timedOut = error.code === "ECONNABORTED" || error.code === "ETIMEDOUT";
        const providerRateLimited = error.response?.status === 429;
        const status = timedOut ? 504 : providerRateLimited ? 503 : 502;

        console.error("Translation provider request failed:", {
            status: error.response?.status,
            code: error.code,
        });

        return res.status(status).json({
            success: false,
            error: timedOut
                ? "Translation service timed out. Please try again."
                : "Translation service is unavailable. Please try again.",
        });
    }
};
