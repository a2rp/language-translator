const axios = require("axios");

module.exports.translateText = async (req, res) => {
    try {
        const options = {
            method: 'POST',
            url: 'https://google-translate113.p.rapidapi.com/api/v1/translator/text',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'X-RapidAPI-Key': process.env.X_RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'google-translate113.p.rapidapi.com'
            },
            data: {
                "from": req.body.from,
                "to": req.body.to,
                "text": req.body.text
            },
        };
        const response = await axios.request(options);
        const translatedText = response.data;
        res.json({
            success: true,
            message: "translation successful",
            translatedText: translatedText.trans
        });
    } catch (error) {
        console.log(error, "translate error");
        res.json({ success: false, error: error.message });
    }
};


