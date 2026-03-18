import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  IconButton,
  Divider,
  Paper,
} from '@mui/material';
import {
  Close as CloseIcon,
  TextFields as TextIcon,
  Contrast as ContrastIcon,
  Speed as SpeedIcon,
  RecordVoiceOver as VoiceIcon,
} from '@mui/icons-material';

function AccessibilitySettings({ accessibility, setAccessibility, onClose }) {
  const handleChange = (key, value) => {
    setAccessibility({ ...accessibility, [key]: value });
  };

  const handleSave = () => {
    localStorage.setItem('accessibility', JSON.stringify(accessibility));
    onClose();
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>Accessibility Settings</Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Divider />
      
      <DialogContent>
        <Paper sx={{ p: 2, mb: 2, bgcolor: 'primary.light', color: 'white' }}>
          <Typography variant="body2">
            Customize the interface to improve your experience. Your preferences will be saved automatically.
          </Typography>
        </Paper>

        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, mt: 1 }}>
          Text & Display
        </Typography>

        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={accessibility.largeText}
                onChange={(e) => handleChange('largeText', e.target.checked)}
                color="primary"
              />
            }
            label={
              <Box>
                <Typography variant="body1">Large Text Size</Typography>
                <Typography variant="caption" color="text.secondary">Increases font size across the application</Typography>
              </Box>
            }
            sx={{ mb: 1, alignItems: 'flex-start' }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={accessibility.highContrast}
                onChange={(e) => handleChange('highContrast', e.target.checked)}
                color="primary"
              />
            }
            label={
              <Box>
                <Typography variant="body1">High Contrast Mode</Typography>
                <Typography variant="caption" color="text.secondary">Enhanced contrast between text and background</Typography>
              </Box>
            }
            sx={{ mb: 1, alignItems: 'flex-start' }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={accessibility.simplifiedUI}
                onChange={(e) => handleChange('simplifiedUI', e.target.checked)}
                color="primary"
              />
            }
            label={
              <Box>
                <Typography variant="body1">Simplified Interface</Typography>
                <Typography variant="caption" color="text.secondary">Remove visual clutter and animations</Typography>
              </Box>
            }
            sx={{ mb: 1, alignItems: 'flex-start' }}
          />
        </Box>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Font Size</InputLabel>
          <Select
            value={accessibility.fontSize}
            onChange={(e) => handleChange('fontSize', e.target.value)}
            label="Font Size"
          >
            <MenuItem value="normal">Normal</MenuItem>
            <MenuItem value="large">Large</MenuItem>
            <MenuItem value="xl">Extra Large</MenuItem>
          </Select>
        </FormControl>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
          Audio & Voice
        </Typography>

        <FormControlLabel
          control={
            <Checkbox
              checked={accessibility.voiceGuidance}
              onChange={(e) => handleChange('voiceGuidance', e.target.checked)}
              color="primary"
            />
          }
          label={
            <Box>
              <Typography variant="body1">Voice Guidance</Typography>
              <Typography variant="caption" color="text.secondary">Audio descriptions for all actions</Typography>
            </Box>
          }
          sx={{ alignItems: 'flex-start' }}
        />
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save Settings
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AccessibilitySettings;

