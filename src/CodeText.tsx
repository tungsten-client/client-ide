import CodeMirror from '@uiw/react-codemirror';
import {java} from '@codemirror/lang-java';
import { duotoneDark } from '@uiw/codemirror-theme-duotone';
import { autocompletion} from '@codemirror/autocomplete';




const CodeText = (props:any) => {

  function myCompletions(context:any) {
    let word = context.matchBefore(/[\w.]*$/);
    if (word.from == word.to && !context.explicit) return null;
  
    const partialString = word.text; // Get the partial string
    const computedCompletion = partialString+Date.now(); //TODO: replace the date.now() with the language server result
  
    return {
      from: 0,
      options: [
        { label: computedCompletion, type: "variable" }, // Use computed completion here
        // Other autocompletion options
      ],
    };
  }

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
        extensions={[java(), autocompletion({ override: [myCompletions] })
        ]}
        style={{fontSize: '15px'}}
        onKeyDown={handleKeyDown}
      />
    </div>
  )
  //potential terminal expansion
}

export default CodeText