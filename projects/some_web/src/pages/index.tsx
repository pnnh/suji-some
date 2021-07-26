import ReactDOM from "react-dom";
import React from "react";
import UserMenu from "@/views/user/menu";

const rootElement = document.getElementById('user-menu');
if (rootElement) {
    ReactDOM.render(<UserMenu />, rootElement);
}
