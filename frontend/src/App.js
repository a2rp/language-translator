import React from "react";
import LanguageTranslator from "./languageTranslator";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
    return (
        <>
            <LanguageTranslator />
            <ToastContainer />
        </>
    );
};

export default App;

