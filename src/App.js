import './App.css';
import {useEffect, useState} from "react";
import QRCode from "react-qr-code";
import Editor from "react-simple-code-editor";
import {highlight, languages} from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";
import {createBrowserHistory} from 'history';
import {setQueryParam, useQueryParams, useWindowSize} from "./utils";

export const history = createBrowserHistory();

export default function App() {

    let [text, setText] = useState(``);
    let [width] = useWindowSize();
    let queryParams = useQueryParams();

    useEffect(() => {
        let defaultText = 'Enter your text here...';
        let queryParam = queryParams['text'];
        if (queryParam) defaultText = decodeURIComponent(queryParam);
        setText(defaultText);
    }, []);

    useEffect(() => {
        setQueryParam('text', text);
    }, [text]);


    function handleChangeInput(text) {
        setText(text);
    }

    return (
        <div className="App">
            <QRCode className="qr" value={text} size={getSize(width)}/>
            <Editor className="editor"
                    value={text}
                    onValueChange={handleChangeInput}
                    highlight={(code) => highlight(code, {}, languages.json)}
                    padding={10}
                    style={{
                        fontFamily: '"Fira code", "Fira Mono", monospace',
                        fontSize: 12,
                    }}
            />
        </div>
    );
}

function getSize(width) {
    if (!width) return 100;
    if (width > 500) return 500;
    return width - 100;
}
