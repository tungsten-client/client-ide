import CodeMirror, {ReactCodeMirrorRef} from '@uiw/react-codemirror';
import { java } from '@codemirror/lang-java';
import { duotoneDark } from '@uiw/codemirror-theme-duotone';
import { languageServer } from './lsp-impl';

import { useEffect, useState, useRef } from 'react';
import sampleRust from "../workspace/test-project/src/main/java/org/example/Main.java?raw";


const CodeText = (props:any) => {

  const [ls, setLS] = useState<any>(null)
  const [curpos, setCurpos] = useState(0);
  const [selection, setSelection] = useState('')
  const serverUri = "ws://localhost:9999"


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
  },[])

  const handleKeyDown = (event:any) => {
    if (event.ctrlKey && event.which === 83) {
      event.preventDefault();
      console.log('save')
    }
    else if (event.ctrlKey && event.which === 67 ) {
      console.log(selection)
    }
    else if (event.ctrlKey && event.which === 86 ) {
      event.preventDefault();
      const item = "hello";
      const first = props.code.slice(0,curpos);
      const last = props.code.slice(curpos+item.length+1,props.code.length);
      const lines_f = (first.match(/\n/g) || '').length
      const lines_l = (last.match(/\n/g) || '').length
      console.log("1 ",props.code.slice(0,curpos+lines_f), "2 ", item, "3 ", props.code.slice(curpos+item.length+1-lines_l,props.code.length), "Lines: ", lines_l )
      props.setCode(props.code.slice(0,curpos) + item + props.code.slice(curpos,props.code.length))
      console.log(curpos)
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
        extensions={[java(), ls]}
        style={{fontSize: '40px'}}
        onStatistics={handleStats}
        onKeyDown={handleKeyDown}
        onChange={(value)=>props.setCode(value)}
      />
    </div>
  )
  //potential terminal expansion
}

export default CodeText