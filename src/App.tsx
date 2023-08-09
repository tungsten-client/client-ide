/** @jsxImportSource theme-ui */
import './App.css';
import CodeText from './CodeText';
import Explorer from './Explorer';
import { Stack, Box } from '@mui/material';
import type { } from '@mui/lab/themeAugmentation';
import "@fontsource/jetbrains-mono";
import {useState} from 'react'

function App() {
  const [code, setCode] = useState('init');
  const [selectedFile, setSelectedFile] = useState('')
  return (
    <Stack direction = "row" spacing = {2}>
      <Box sx = {{mx:"auto"}}>
        <Stack flexDirection="column" spacing={2}>
          <h1 sx = {{color: "#603fef", fontFamily: "JetBrains Mono", mx:'auto', my: "auto", h:"25vh"}}>Explorer</h1>
          <Explorer setCode = {setCode} setSelectedFile = {setSelectedFile}></Explorer>
        </Stack>
      </Box>
      <Box>
        <CodeText code = {code} setCode = {setCode} selectedFile = {selectedFile}/>
      </Box>
    </Stack>
  )
}

export default App
