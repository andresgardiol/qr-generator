import './App.css';
import {useLayoutEffect, useState} from "react";
import QRCode from "react-qr-code";
import Editor from "react-simple-code-editor";
import {highlight, languages} from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";

function App() {

    let [text, setText] = useState(`Enter your text here...`);
    let [width] = useWindowSize();

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
    if(!width) return 100;
    if(width > 500) return 500;
    return width - 100;

}

function useWindowSize() {
    let [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
        function updateSize() {
            setSize([(window.clientWidth || window.scrollWidth || window.innerWidth), (window.clientHeight || window.scrollHeight || window.innerHeight) - 8]);
        }

        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
}

export default App;
