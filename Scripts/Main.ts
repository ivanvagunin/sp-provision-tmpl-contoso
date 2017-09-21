import * as $ from "jquery";
import {polyfill} from "es6-promise";
import {HomePage} from "./HomePage";

polyfill();

$(() => {
    if(window.location.pathname.toLowerCase().startsWith("/sitepages/home.aspx")) {
        let home: HomePage = new HomePage();
        home.Main();
    }
});