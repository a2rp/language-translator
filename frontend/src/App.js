import React from "react"
import LanguageTranslator from "./languageTranslator"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const App = () => {
    axios.defaults.baseURL = "http://localhost:1198/api/v1"

    return (
        <div>
            <LanguageTranslator />

            <ToastContainer />
        </div>
    )
}

export default App

