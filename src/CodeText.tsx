import CodeMirror from '@uiw/react-codemirror';
import {java} from '@codemirror/lang-java'
import { duotoneDark } from '@uiw/codemirror-theme-duotone';
import { languageServer } from './lsp-impl';

import { useEffect, useState } from 'react';


declare const binders: {
  listDir(path: string): string;
  readFile(path: string): string | null;
  writeFile(path: string, content: string): void;
  log(message: string): void;
  getCompletion(partial: string): string;
  getClipboardContents(): string;
  setClipboardContents(text: string): void;

  // Add other properties if needed
};

const CodeText = (props:any) => {
  const [ls, setLS] = useState<any>(null)
  const [curpos, setCurpos] = useState(0);
  const [selection, setSelection] = useState('')
  const serverUri = "ws://localhost:9999"
  useEffect(()=>{

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
      if (props.selectedFile === ''){return}
      console.log(props.code)
      binders.writeFile(props.selectedFile, props.code)
    }
    else if (event.ctrlKey && event.which === 67 ) {
      //copy
      binders.setClipboardContents(selection)
    }
    else if (event.ctrlKey && event.which === 86 ) {
      //paste
      const item = binders.getClipboardContents();
      props.setCode(props.code.slice(0,curpos) + item + props.code.slice(curpos,props.code.length))
    }
  }

  const handleStats = (stats:any) => {
    setCurpos(stats.ranges[0].head)
    if (stats.selectedText){
      setSelection(stats.selectionCode)
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
        extensions={[java(),ls]}
        style={{fontSize: '40px'}}
        onKeyDown={handleKeyDown}
        onStatistics={handleStats}
        onChange={(value)=>props.setCode(value)}
      />
    </div>
  )
  //potential terminal expansion
}

export default CodeText