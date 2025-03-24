// frontend/src/components/ImageUpload.js
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import axios from '../api/axios';

const ImageUpload = ({ propertyId }) => {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);

  const onDrop = useCallback(acceptedFiles => {
    setFiles(acceptedFiles.map(file => 
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
    ));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png']
    },
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  const handleUpload = async () => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    try {
      const response = await axios.post(
        `/properties/${propertyId}/upload-images/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: progressEvent => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent);
          }
        }
      );

      if (response.status === 201) {
        setFiles([]);
        setUploadProgress(0);
      }
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <div>
      <div
        {...getRootProps()}
        style={{
          border: '2px dashed #ccc',
          borderRadius: '4px',
          padding: '20px',
          textAlign: 'center',
          backgroundColor: isDragActive ? '#f0f0f0' : 'white',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        <input {...getInputProps()} />
        <Typography>
          {isDragActive ? 'Drop images here' : 'Drag & drop property images, or click to select'}
        </Typography>
      </div>

      {files.length > 0 && (
        <div>
          <List dense>
            {files.map((file, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <InsertDriveFileIcon />
                </ListItemIcon>
                <ListItemText
                  primary={file.name}
                  secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                />
              </ListItem>
            ))}
          </List>

          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={uploadProgress > 0}
          >
            {uploadProgress > 0 ? `Uploading... ${uploadProgress}%` : 'Upload Images'}
          </Button>

          {uploadError && (
            <Typography color="error" sx={{ mt: 1 }}>
              {uploadError}
            </Typography>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;