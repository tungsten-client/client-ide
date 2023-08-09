import { TreeView, TreeItem } from '@mui/lab';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { createTheme, ThemeProvider } from '@mui/material';


const Explorer = (props:any) => {
    /* TODO:
    get files from java on init
    for example
    useEffect(()=>{ //closure
        const loadJavaBridge = () => {
            if (window.JavaBridge) {
              // JavaBridge function is available, you can now call it
              window.JavaBridge.callJavaFunction('Hello from React!');
            } else {
              // JavaBridge function is not available yet, try again after a delay
              setTimeout(loadJavaBridge, 100);
            }
          };
          loadJavaBridge();
    },[]) //empty array esnure it is called in start up
    */
    interface RenderTree {
        name: string;
        type: string;
        items?: readonly RenderTree[];
    }
    const theme = createTheme({
      components: {
        // Name of the component
        MuiTreeItem: {
          styleOverrides: {
            // Name of the slot
            label: {
              fontSize: '20px', // size idk why i cant use sx prop..
              fontFamily: 'JetBrains Mono'
            }
          },
        },
      },
    });
    // sample data; TODO:REMOVE THIS SAMPLE DATA WHEN DONE
    const data: RenderTree = {
        name: "src", // this should be the base dir (ONLY ONE FILE IN BASE DIR)
        type: "folder", // folder or file 
        items:[ // contents if folder. undefined if file
            {
                name: "App.css",
                type: "file"
            },
            {
                name: "assets", 
                type: "folder", 
                items:[ 
                    {
                        name: "react.svg", 
                        type: "file"
                    }
                ]
            }
        ]
    }

    const handelClick = (path: String) => {
      console.log("Clicked: " + path) 
      props.setCode() // TODO: set code here (call getfile)
      //TODO: save code on switch
    }     

    const renderTree = (nodes: RenderTree, currentPath: string) => (
      <ThemeProvider theme = {theme}>
        <TreeItem key={nodes.name} nodeId={nodes.name} label={nodes.name} onClick={() => {handelClick(`${currentPath}/${nodes.name}`)}}>
          {Array.isArray(nodes.items)
            ? nodes.items.map((node) => renderTree(node, `${currentPath}/${node.name}`))
            : null}
        </TreeItem>
      </ThemeProvider>
      );
    

      return (
        <TreeView
          aria-label="rich object"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpanded={[data.name]} // this make the first item defualt expanded
          defaultExpandIcon={<ChevronRightIcon />}
          sx={{height: "auto", width: "25vw", flexGrow: 1, maxWidth: 400, overflowY: 'none', color: "#603fef", justifyContent: "right", alignContent: "right", backgroundColor: "#0c0642"}}
        >
          {renderTree(data, 'src')}
        </TreeView>
      )
}

export default Explorer