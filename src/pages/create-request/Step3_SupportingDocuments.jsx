import React from 'react';
import { 
    Box, 
    Typography, 
    Button, 
    List, 
    ListItem, 
    ListItemText, 
    ListItemIcon,
    IconButton,
    Paper,
    Alert
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';

const Step3_SupportingDocuments = ({ files, setFiles, error }) => {

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFiles(prev => [...prev, ...Array.from(e.target.files)]);
        }
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const [isDragging, setIsDragging] = React.useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
        }
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Supporting Documents
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
                Please upload any supporting documents (invoices, receipts, etc.).
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Paper 
                variant="outlined" 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                sx={{ 
                    p: 4, 
                    borderStyle: 'dashed', 
                    borderWidth: 2, 
                    borderColor: isDragging ? 'primary.main' : 'divider',
                    backgroundColor: isDragging ? 'action.hover' : 'background.default',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    mb: 3,
                    transition: 'border-color 0.2s, background-color 0.2s',
                    cursor: 'pointer'
                }}
            >
                <CloudUploadIcon sx={{ fontSize: 48, color: isDragging ? 'primary.main' : 'text.secondary' }} />
                <Typography variant="body1" fontWeight="medium" color={isDragging ? 'primary.main' : 'text.primary'}>
                    {isDragging ? 'Drop files here' : 'Drag and drop files here or click to browse'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Supported files: PDF, JPG, PNG, DOCX
                </Typography>
                <Button 
                    component="label" 
                    variant="contained" 
                    startIcon={<CloudUploadIcon />}
                >
                    Upload Files
                    <input
                        type="file"
                        hidden
                        multiple
                        onChange={handleFileChange}
                    />
                </Button>
            </Paper>

            {files.length > 0 && (
                <Box>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        Selected Files ({files.length})
                    </Typography>
                    <List dense>
                        {files.map((file, index) => (
                            <ListItem 
                                key={index}
                                secondaryAction={
                                    <IconButton edge="end" aria-label="delete" onClick={() => removeFile(index)}>
                                        <DeleteIcon />
                                    </IconButton>
                                }
                                sx={{ 
                                    border: '1px solid', 
                                    borderColor: 'divider', 
                                    borderRadius: 1, 
                                    mb: 1 
                                }}
                            >
                                <ListItemIcon>
                                    <InsertDriveFileIcon />
                                </ListItemIcon>
                                <ListItemText 
                                    primary={file.name} 
                                    secondary={`${(file.size / 1024).toFixed(1)} KB`} 
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}
        </Box>
    );
};

export default Step3_SupportingDocuments;
