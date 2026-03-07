import React from 'react';
import '../styles/AccessibilitySettings.css';

function AccessibilitySettings({ accessibility, setAccessibility, onClose }) {
  const handleChange = (key, value) => {
    setAccessibility({ ...accessibility, [key]: value });
  };

  const handleSave = () => {
    localStorage.setItem('accessibility', JSON.stringify(accessibility));
    onClose();
  };

  return (
    <div className="accessibility-settings-modal">
      <div className="modal-content">
        <button onClick={onClose} className="btn-close-modal">✕</button>
        <h2>♿ Accessibility Settings</h2>

        <div className="settings-group">
          <h3>Text & Display</h3>
          
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={accessibility.largeText}
                onChange={(e) => handleChange('largeText', e.target.checked)}
              />
              Large Text Size
            </label>
            <p className="setting-desc">Increases font size across the application</p>
          </div>

          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={accessibility.highContrast}
                onChange={(e) => handleChange('highContrast', e.target.checked)}
              />
              High Contrast Mode
            </label>
            <p className="setting-desc">Enhanced contrast between text and background</p>
          </div>

          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={accessibility.simplifiedUI}
                onChange={(e) => handleChange('simplifiedUI', e.target.checked)}
              />
              Simplified Interface
            </label>
            <p className="setting-desc">Remove visual clutter and animations</p>
          </div>

          <div className="setting-item">
            <label>Font Size:
              <select 
                value={accessibility.fontSize}
                onChange={(e) => handleChange('fontSize', e.target.value)}
                style={{ marginLeft: 'auto' }}
              >
                <option value="normal">Normal</option>
                <option value="large">Large</option>
                <option value="xl">Extra Large</option>
              </select>
            </label>
          </div>
        </div>

        <div className="settings-group">
          <h3>Audio & Voice</h3>
          
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={accessibility.voiceGuidance}
                onChange={(e) => handleChange('voiceGuidance', e.target.checked)}
              />
              Voice Guidance
            </label>
            <p className="setting-desc">Audio descriptions for all actions</p>
          </div>
        </div>

        <button onClick={handleSave} className="btn-save-accessibility">
          ✓ Save Settings
        </button>
      </div>
    </div>
  );
}

export default AccessibilitySettings;
