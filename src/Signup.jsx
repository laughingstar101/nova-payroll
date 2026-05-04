import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import TopBar from "./TopBar.jsx";
import './index.css'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <TopBar/>
    </StrictMode>
)