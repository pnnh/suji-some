import ReactDOM from "react-dom";
import React from "react";
import UserMenu from "@/views/user/menu";
import "@/utils/fluentui";

const rootElement = document.getElementById('user-menu');
if (rootElement) {
    ReactDOM.render(<UserMenu />, rootElement);
}
