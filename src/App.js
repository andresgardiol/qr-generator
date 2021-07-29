import './App.css';
import {useEffect, useLayoutEffect, useState} from "react";
import QRCode from "react-qr-code";
import Editor from "react-simple-code-editor";
import {highlight, languages} from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";
import {createBrowserHistory} from 'history';

export const history = createBrowserHistory();

function App() {

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

export const useQueryParams = () => {
    const [queryParams, setQueryParams] = useState(getQueryParamsObject(history.location.search));

    useEffect(() => {
        function listener({location}) {
            setQueryParams(getQueryParamsObject(location.search));
        }

        let unlisten = history.listen(listener);

        return () => unlisten();
    });
    return queryParams;
}

export const getQueryParamsObject = (searchString) => {
    let pairs = searchString.substring(1).split("&");
    let obj = {};
    let pair;

    function getValue(valueString) {
        if (valueString.includes('[')) {
            valueString = valueString.replace('[', '');
            valueString = valueString.replace(']', '');
            return valueString.split(',').map(value => {
                function isNumeric(num) {
                    return !isNaN(num)
                }

                if (isNumeric(value)) return +value;
                return value;
            });
        }
        return pair[1];
    }

    for (let i in pairs) {
        if (pairs[i] === "") continue;

        pair = pairs[i].split("=");
        let value = getValue(decodeURIComponent(pair[1]));
        obj[decodeURIComponent(pair[0])] = value;
    }

    return obj;
}

export const setQueryParam = (key, value) => {
    history.push({search: `?${encodeURIComponent(key)}=${encodeURIComponent(value)}`, pathname: ''})
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
