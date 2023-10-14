import { TreeView, TreeItem } from '@mui/lab';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { createTheme, ThemeProvider } from '@mui/material';
import {useEffect, useState} from 'react';

declare const binders: {
  listDir(path: string): string;
  readFile(path: string): string | null;
  writeFile(path: string, content: string): void;
  log(message: string): void;
  // Add other properties if needed
};

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
   

    const [data, setData] = useState<RenderTree>({
      name: "root",
      type: "folder",
      items: [
        {
          name: "src",
          type: "folder",
          items: [
            {
              name: "App.css",
              type: "file",
            },
            {
              name: "assets",
              type: "folder",
              items: [
                {
                  name: "react.svg",
                  type: "file",
                },
                {
                  name: "logo.png",
                  type: "file",
                },
              ],
            },
            {
              name: "index.js",
              type: "file",
            },
          ],
        },
        {
          name: "public",
          type: "folder",
          items: [
            {
              name: "index.html",
              type: "file",
            },
            {
              name: "favicon.ico",
              type: "file",
            },
          ],
        },
        {
          name: "README.md",
          type: "file",
        },
        {
          name: "package.json",
          type: "file",
        },
      ],
    });

    useEffect(()=>{
      let temp:RenderTree = {
        name: "modules",
        type: "folder",
        items: parseRenderTree(binders.listDir('modules'))
      };
      if (temp) {
        setData(temp)
        if (temp.items && temp.items.length > 0 && temp.items[0].type) {
          // Now you can access temp.items[0].type safely
          const { instance, path } = findFirstInstanceWithPath(temp, "file");
          console.log(instance)
          props.setCode(binders.readFile(path.join("/")))
          props.setSelectedFile(path.join("/"));
        }
      }
      
    },[])

    function findFirstInstanceWithPath(
      tree: RenderTree,
      targetType: string,
      currentPath: string[] = []
    ): { instance: RenderTree | string, path: string[] } {
      if (tree.type === targetType) {
          return { instance: tree, path: [...currentPath, tree.name] };
      }
  
      if (tree.items) {
          for (const item of tree.items) {
              const { instance, path } = findFirstInstanceWithPath(item, targetType, [...currentPath, tree.name]);
              if (instance) {
                  return { instance, path };
              }
          }
      }
  
      return { instance: "Empty File", path: [] };
    }
  
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
              fontSize: '1.25rem', // size idk why i cant use sx prop..
              fontFamily: 'JetBrains Mono'
            }
          },
        },
      },
    });

    function parseRenderTree(jsonString: string): RenderTree[] {
      const jsonArray = JSON.parse(jsonString);
      const renderTree: RenderTree[] = [];

      jsonArray.forEach((item: any) => {
        const node: RenderTree = {
          name: item.name,
          type: item.type,
        };

        if (item.type === "folder") {
          node.items = item.items; // Assign the array directly, no need to parse -> good now
        }

        renderTree.push(node);
      });

      return renderTree;
    }
    // sample data; TODO:REMOVE THIS SAMPLE DATA WHEN DONE

    const handelClick = (path: string, type: string) => {
      console.log("Clicked: " + path) 
      //save code

      //get code
      if (type === "file") {
        props.setCode(binders.readFile(path))
        props.setSelectedFile(path)

      }
      //TODO: save code on switch
    }     

    const renderTree = (nodes: RenderTree, currentPath: string) => (
      <ThemeProvider theme = {theme}>
        <TreeItem key={nodes.name} nodeId={nodes.name} label={nodes.name} onClick={() => {handelClick(currentPath, nodes.type)}}>
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
          {renderTree(data, '/modules')}
        </TreeView>
      )
}

export default Explorer