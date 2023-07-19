import CodeMirror from '@uiw/react-codemirror';
import {java} from '@codemirror/lang-java'
import { duotoneDark } from '@uiw/codemirror-theme-duotone';

const CodeText = (props:any) => {
  return (
    <div className=''>
      <CodeMirror
        height='95vh'
        width='70vw'
        basicSetup={{lineNumbers: true}}
        value={props.code}
        theme = {duotoneDark} // TODO: add theme selection functionlity using useState() and mui buttons
        extensions={[java()]}
        style={{fontSize: '15px'}}
      />
    </div>
  )
  //potential terminal expansion
}

export default CodeText