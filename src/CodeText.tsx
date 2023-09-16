import CodeMirror from '@uiw/react-codemirror';
import {java} from '@codemirror/lang-java'
import { rust } from '@codemirror/lang-rust';
import { duotoneDark } from '@uiw/codemirror-theme-duotone';
import { languageServerWithTransport, languageServer, LanguageServerClient } from './lsp-impl';

import { WebSocketTransport } from '@open-rpc/client-js';
import { useEffect, useState} from 'react';
import sampleRust from "../workspace/test-project/src/main/java/org/example/Main.java?raw"


const CodeText = (props:any) => {
    const [ls, setLS] = useState<any>(null)

    let port: number;
    const loadJavaBridge = () => {
        if(window.JavaBridge) {
            port = window.JavaBridge.callJavaFunction("getPort");
            return;
        }

        setTimeout(loadJavaBridge, 100);
    }
    loadJavaBridge();

    const serverUri = `ws://localhost:${port}`
    //const transport = new WebSocketTransport(serverUri)
    useEffect(()=>{
        props.setCode(sampleRust)
        const newls = languageServer({
            // WebSocket server uri and other client options.
            serverUri,
            rootUri: 'source://test-project',
            documentUri: 'source://test-project/src/main/java/org/example/Main.java',
            languageId: 'java', //TODO: Change to java
            workspaceFolders: null
        })
        setLS(newls)

        return () => {

        }
    },[])



    const handleKeyDown = (event:any) => {
        if (event.ctrlKey && event.which === 83) {
            event.preventDefault();
            console.log('save')
            // save here...
        }
    }
    return (
        <div className=''>
            <CodeMirror
                height='95vh'
                width='70vw'
                basicSetup={{lineNumbers: true}}
                value={props.code}
                theme = {duotoneDark} // TODO: add theme selection functionlity using useState() and mui buttons
                extensions={[java(), ls]}
                style={{fontSize: '40px'}}
                onKeyDown={handleKeyDown}
            />
        </div>
    )
    //potential terminal expansion
}

export default CodeText
