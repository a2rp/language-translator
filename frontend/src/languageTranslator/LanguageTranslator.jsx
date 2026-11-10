import React, { useState } from 'react';
import { Button, CircularProgress, IconButton } from '@mui/material';
import { FaCopy } from 'react-icons/fa';
import { GiSpeaker } from 'react-icons/gi';
import { FaAngleDoubleRight } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import CopyToClipboard from 'react-copy-to-clipboard';
import languages from './languages.json';
import styles from './styles.module.scss';

const API_BASE_URL = (
    process.env.REACT_APP_TRANSLATION_API_URL || 'http://localhost:1198/api/v1'
).replace(/\/+$/, '');
const MAX_TEXT_LENGTH = 6000;

const LanguageTranslator = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [selectedLanguageFrom, setSelectedLanguageFrom] = useState('en');
    const [selectedLanguageTo, setSelectedLanguageTo] = useState('hi');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!inputText.trim()) return;

        setIsLoading(true);
        setOutputText('');

        try {
            const response = await axios.post(`${API_BASE_URL}/translate`, {
                from: selectedLanguageFrom,
                to: selectedLanguageTo,
                text: inputText,
            }, { timeout: 20000 });

            if (response.data?.success && typeof response.data.translatedText === 'string') {
                setOutputText(response.data.translatedText);
            } else {
                toast.error(response.data?.error || 'Translation could not be completed.');
            }
        } catch (error) {
            toast.error(
                error.response?.data?.error
                || (error.code === 'ECONNABORTED'
                    ? 'The request timed out. Please try again.'
                    : 'Could not reach the translation service.')
            );
        } finally {
            setIsLoading(false);
        }
    };

    const readText = (place) => {
        const text = place === 'from' ? inputText : outputText;
        const language = place === 'from' ? selectedLanguageFrom : selectedLanguageTo;

        if (!text.trim()) {
            toast.info('There is no text to read yet.');
            return;
        }

        if (typeof window === 'undefined' || !window.speechSynthesis || !window.SpeechSynthesisUtterance) {
            toast.error('Speech playback is not supported in this browser.');
            return;
        }

        window.speechSynthesis.cancel();
        const utterance = new window.SpeechSynthesisUtterance(text);
        utterance.lang = language;
        window.speechSynthesis.speak(utterance);
    };

    const clearResultOnChange = (setter) => (event) => {
        setter(event.target.value);
        setOutputText('');
    };

    return (
        <main className={styles.container}>
            <section className={styles.main} aria-labelledby="translator-title">
                <h1 id="translator-title" className={styles.heading}>Language Translator</h1>
                <form onSubmit={handleSubmit} className={styles.contentSection}>
                    <div className={styles.textSection}>
                        <div className={styles.inputSection}>
                            <label className={styles.visuallyHidden} htmlFor="source-text">Text to translate</label>
                            <textarea
                                id="source-text"
                                required
                                maxLength={MAX_TEXT_LENGTH}
                                rows={10}
                                className={styles.inputTextarea}
                                placeholder="Write something here"
                                value={inputText}
                                disabled={isLoading}
                                onChange={clearResultOnChange(setInputText)}
                            />
                            <div className={styles.characterCount} aria-live="polite">
                                {inputText.length}/{MAX_TEXT_LENGTH}
                            </div>
                        </div>
                        <div className={styles.outputSection}>
                            <label className={styles.visuallyHidden} htmlFor="translated-text">Translation</label>
                            <textarea
                                id="translated-text"
                                readOnly
                                rows={10}
                                className={styles.outputTextarea}
                                placeholder="Translation"
                                value={outputText}
                            />
                        </div>
                    </div>

                    <div className={styles.controlsSection}>
                        <div className={styles.leftSection}>
                            <label className={styles.fromText} htmlFor="source-language">Translate from</label>
                            <select
                                id="source-language"
                                className={styles.languageSelectFrom}
                                value={selectedLanguageFrom}
                                disabled={isLoading}
                                onChange={clearResultOnChange(setSelectedLanguageFrom)}
                            >
                                {Object.entries(languages).map(([code, language]) => (
                                    <option key={code} value={code}>{language.name}</option>
                                ))}
                            </select>
                            <IconButton
                                type="button"
                                className={styles.audioIconFrom}
                                aria-label="Read source text aloud"
                                title="Read source text aloud"
                                disabled={!inputText || isLoading}
                                onClick={() => readText('from')}
                            >
                                <GiSpeaker />
                            </IconButton>
                            <CopyToClipboard text={inputText} onCopy={() => toast.success('Source text copied.')}>
                                <IconButton
                                    type="button"
                                    className={styles.copyIconFrom}
                                    aria-label="Copy source text"
                                    title="Copy source text"
                                    disabled={!inputText || isLoading}
                                >
                                    <FaCopy />
                                </IconButton>
                            </CopyToClipboard>
                        </div>

                        <div className={styles.directionIcon} aria-hidden="true">
                            <FaAngleDoubleRight />
                        </div>

                        <div className={styles.rightSection}>
                            <label className={styles.toText} htmlFor="target-language">Translate to</label>
                            <select
                                id="target-language"
                                className={styles.languageSelectTo}
                                value={selectedLanguageTo}
                                disabled={isLoading}
                                onChange={clearResultOnChange(setSelectedLanguageTo)}
                            >
                                {Object.entries(languages).map(([code, language]) => (
                                    <option key={code} value={code}>{language.name}</option>
                                ))}
                            </select>
                            <IconButton
                                type="button"
                                className={styles.audioIconTo}
                                aria-label="Read translation aloud"
                                title="Read translation aloud"
                                disabled={!outputText || isLoading}
                                onClick={() => readText('to')}
                            >
                                <GiSpeaker />
                            </IconButton>
                            <CopyToClipboard text={outputText} onCopy={() => toast.success('Translation copied.')}>
                                <IconButton
                                    type="button"
                                    className={styles.copyIconTo}
                                    aria-label="Copy translation"
                                    title="Copy translation"
                                    disabled={!outputText || isLoading}
                                >
                                    <FaCopy />
                                </IconButton>
                            </CopyToClipboard>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        variant="contained"
                        className={styles.translateButton}
                        disabled={isLoading || !inputText.trim()}
                    >
                        {isLoading
                            ? <><CircularProgress size={18} color="inherit" /> Translating…</>
                            : 'Translate text'}
                    </Button>
                </form>
            </section>
        </main>
    );
};

export default LanguageTranslator;
