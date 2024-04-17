import React, { useEffect, useState } from 'react'
import styles from "./styles.module.scss";
import languages from "./languages.json";
import { FaCopy } from "react-icons/fa";
import { GiSpeaker } from "react-icons/gi";
import { Button, CircularProgress, Typography } from '@mui/material';
import { FaAngleDoubleRight } from "react-icons/fa";
import { toast } from 'react-toastify';
import axios from 'axios';
import CopyToClipboard from 'react-copy-to-clipboard';

const LanguageTranslator = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [inputText, setInputText] = useState("");
    const [outputText, setOutputText] = useState("");
    const [selectedLanguageFrom, setSelectedLanguageFrom] = useState("en");
    const [selectedLanguageTo, setSelectedLanguageTo] = useState("hi");

    useEffect(() => {
        // console.log(selectedLanguageFrom, "setSelectedLanguageFrom");
    }, [selectedLanguageFrom]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const options = {
                url: "/translate",
                method: "POST",
                data: {
                    from: selectedLanguageFrom,
                    to: selectedLanguageTo,
                    text: inputText
                }
            };
            setIsLoading(true);
            const response = await axios(options);
            // console.log(response, "response rranslate");
            if (response.data.success === true) {
                setOutputText(response.data.translatedText);
            }
        } catch (error) {
            // console.log(error, "error");
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const readText = (place) => {
        let utterance = "";
        if (place === "from") {
            utterance = new SpeechSynthesisUtterance(inputText);
            utterance.lang = selectedLanguageFrom;
        } else if (place === "to") {
            utterance = new SpeechSynthesisUtterance(outputText);
            utterance.lang = selectedLanguageTo;
        }
        speechSynthesis.speak(utterance);
    };

    return (
        <div className={styles.container}>
            <div className={styles.main}>
                <div className={styles.heading}>Language Translator</div>
                <form onSubmit={handleSubmit} className={styles.contentSection}>
                    <div className={styles.textSection}>
                        <div className={styles.inputSection}>
                            <textarea
                                required
                                cols="30" rows="10"
                                className={styles.inputTextarea}
                                placeholder="Write something here"
                                value={inputText}
                                onChange={event => setInputText(event.target.value)}
                            ></textarea>
                        </div>
                        <div className={styles.outputSection}>
                            <textarea
                                disabled
                                cols="30" rows="10"
                                className={styles.outputTextarea}
                                placeholder="Translation"
                                value={outputText}
                                onChange={event => setOutputText(event.target.value)}
                            ></textarea>
                        </div>
                    </div>

                    <div className={styles.controlsSection}>
                        <div className={styles.leftSection}>
                            <Typography className={styles.fromText}>Select from language</Typography>
                            <select
                                className={styles.languageSelectFrom}
                                value={selectedLanguageFrom}
                                onChange={event => setSelectedLanguageFrom(event.target.value)}
                            >
                                {Object.keys(languages).map((key, index) => {
                                    const language = languages[key];
                                    return (
                                        <option key={index} value={key}>{language.name}</option>
                                    );
                                })}
                            </select>
                            <GiSpeaker className={styles.audioIconFrom} onClick={() => readText("from")} />
                            <CopyToClipboard text={inputText}>
                                <FaCopy className={styles.copyIconFrom} />
                            </CopyToClipboard>
                        </div>

                        <div className={styles.rightSection}>
                            <Typography className={styles.toText}>Select to language</Typography>
                            <select
                                className={styles.languageSelectTo}
                                value={selectedLanguageTo}
                                onChange={event => setSelectedLanguageTo(event.target.value)}
                            >
                                {Object.keys(languages).map((key, index) => {
                                    const language = languages[key];
                                    return (
                                        <option key={index} value={key}>{language.name}</option>
                                    );
                                })}
                            </select>
                            <GiSpeaker className={styles.audioIconTo} onClick={() => readText("to")} />
                            <CopyToClipboard text={outputText}>
                                <FaCopy className={styles.copyIconTo} />
                            </CopyToClipboard>
                        </div>
                    </div>
                    <Button
                        type="submit"
                        variant="contained"
                        className={styles.translateButton}
                        disabled={isLoading}
                    >
                        {isLoading
                            ? <CircularProgress sx={{ padding: "10px" }} />
                            : "Translate text"}
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default LanguageTranslator

