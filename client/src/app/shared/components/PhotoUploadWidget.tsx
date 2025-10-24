import { CloudUpload } from "@mui/icons-material";
import { Box, Grid2, Typography } from "@mui/material";
import { useCallback } from "react";
import {useDropzone} from 'react-dropzone'

export default function PhotoUploadWidget() {
    const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles);
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <Grid2 container spacing={3}>
        <Grid2 size={4}>
            <Typography variant="overline" color="secondary">Step 1 - Add Photo</Typography>
            <Box {...getRootProps()}
                 sx={{border: 'dashed 3px #eee',
                      borderColor: isDragActive ? 'green' : '#eee',
                      borderRadius: '5px',
                      paddingTop: '30px',
                      textAlign: 'center',
                      height: '280px'
                 }}
            >
                <input {...getInputProps()} />
                <CloudUpload sx={{fontSize: 80}}/>
                <Typography variant="h5">Click or Drop Image Here</Typography>
            </Box>
        </Grid2>
        <Grid2 size={4}>
            <Typography variant="overline" color="secondary">Step 2 - Resize Image</Typography>
        </Grid2>
        <Grid2 size={4}>
            <Typography variant="overline" color="secondary">Step 3 - Preview and Upload</Typography>
        </Grid2>
    </Grid2>
  )
}