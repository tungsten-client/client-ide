import CodeMirror from '@uiw/react-codemirror';
import {java} from '@codemirror/lang-java'
import { duotoneDark } from '@uiw/codemirror-theme-duotone';
import { autocompletion } from '@codemirror/autocomplete';

declare const binders: {
  listDir(path: string): string;
  readFile(path: string): string | null;
  writeFile(path: string, content: string): void;
  log(message: string): void;
  // Add other properties if needed
};

const CodeText = (props:any) => {
  const handleKeyDown = (event:any) => {
    if (event.ctrlKey && event.which === 83) {
      event.preventDefault();
      console.log('save')
      // save here... 
      if (props.selectedFile === ''){return}
      console.log(props.code)
      binders.writeFile(props.selectedFile, props.code)
    }
    //if we want to save on edit we can make a useeffect here that saves on every code update?
}
  return (
    <div className=''>
      <CodeMirror
        height='95vh'
        width='70vw'
        basicSetup={{lineNumbers: true}}
        value={props.code}
        theme = {duotoneDark} // TODO: add theme selection functionlity using useState() and mui buttons
        extensions={[java(), autocompletion()]}
        style={{fontSize: '15px'}}
        onKeyDown={handleKeyDown}
        onChange={(value)=>props.setCode(value)}
      />
    </div>
  )
  //potential terminal expansion
}

export default CodeText