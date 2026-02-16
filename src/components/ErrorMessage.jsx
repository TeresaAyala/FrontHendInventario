import React from 'react';
import { Alert, AlertTitle, List, ListItem, ListItemText, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const ErrorMessage = ({ errors }) => {
  if (!errors || errors.length === 0) return null;

  return (
    <Alert 
      severity="error" 
      variant="filled" 
      icon={<ErrorOutlineIcon fontSize="inherit" />}
      sx={{ mb: 3, width: '100%' }}
    >
      <AlertTitle sx={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.875rem' }}>
        Errores de validación
      </AlertTitle>
      
      <List sx={{ p: 0, listStyleType: 'disc', pl: 2 }}>
        {errors.map((error, index) => (
          <ListItem 
            key={index} 
            disablePadding 
            sx={{ display: 'list-item', mb: 0.5 }}
          >
            <ListItemText
              primary={
                <Typography variant="body2">
                  <strong>{error.campo}:</strong> {error.mensaje}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Alert>
  );
};

export default ErrorMessage;