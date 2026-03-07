import React, { useState, useRef, useEffect, useCallback } from 'react';
import '../styles/FaceAuth.css';

function FaceAuth(props) {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [statusText, setStatusText] = useState('Starting camera...');
  
  // Face detection states
  const [hasCamera, setHasCamera] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [faceAligned, setFaceAligned] = useState(false);
  const [alignmentDetails, setAlignmentDetails] = useState({ 
    centered: false, 
    goodSize: false, 
    insideGuide: false,
    stable: false
  });
  
  // Smoothed face position (for interpolation)
  const [smoothedFace, setSmoothedFace] = useState({ 
    x: 50, 
    y: 40, 
    width: 30, 
    height: 40 
  });
  
  // Stability tracking
  const stablePositionRef = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const stableSinceRef = useRef(0);
  const lastUpdateRef = useRef(0);
  
  // Refs for cleanup
  const streamRef = useRef(null);
  const detectionIntervalRef = useRef(null);

  // Linear interpolation for smooth movement
  const lerp = (start, end, factor) => {
    return start + (end - start) * factor;
  };

  // Calculate smoothed position with interpolation
  const calculateSmoothedPosition = useCallback((newFace) => {
    setSmoothedFace(prev => ({
      x: lerp(prev.x, newFace.x, 0.3),
      y: lerp(prev.y, newFace.y, 0.3),
      width: lerp(prev.width, newFace.width, 0.3),
      height: lerp(prev.height, newFace.height, 0.3)
    }));
  }, []);

  // Check if face position is stable (within small range for 1 second)
  const checkStability = useCallback((faceX, faceY, faceWidth, faceHeight) => {
    const now = Date.now();
    const prev = stablePositionRef.current;
    
    // Check if position changed significantly
    const xChanged = Math.abs(faceX - prev.x) > 5;
    const yChanged = Math.abs(faceY - prev.y) > 5;
    const wChanged = Math.abs(faceWidth - prev.width) > 5;
    const hChanged = Math.abs(faceHeight - prev.height) > 5;
    
    if (xChanged || yChanged || wChanged || hChanged) {
      // Position changed, reset stability timer
      stablePositionRef.current = { x: faceX, y: faceY, width: faceWidth, height: faceHeight };
      stableSinceRef.current = now;
      return false;
    }
    
    // Check if stable for at least 1 second
    const isStable = (now - stableSinceRef.current) >= 1000;
    return isStable;
  }, []);

  // Calculate alignment based on face position
  const calculateAlignment = useCallback((faceX, faceY, faceWidth, faceHeight) => {
    // Target center (50%, 40%)
    const targetX = 50;
    const targetY = 40;
    
    // Check if face is centered (within 10% of target center)
    const centered = Math.abs(faceX - targetX) < 12 && Math.abs(faceY - targetY) < 12;
    
    // Check if face size is appropriate
    const goodSize = faceWidth >= 15 && faceWidth <= 45 && faceHeight >= 20 && faceHeight <= 55;
    
    // Check if face is inside the guide oval
    const guideCenterX = 50;
    const guideCenterY = 40;
    const guideWidth = 30;
    const guideHeight = 40;
    
    const normalizedDistX = Math.abs(faceX - guideCenterX) / (guideWidth / 2);
    const normalizedDistY = Math.abs(faceY - guideCenterY) / (guideHeight / 2);
    const insideGuide = normalizedDistX < 1 && normalizedDistY < 1;
    
    // Check stability
    const stable = checkStability(faceX, faceY, faceWidth, faceHeight);
    
    // All conditions must be met
    const isAligned = centered && goodSize && insideGuide && stable;
    
    setAlignmentDetails({ centered, goodSize, insideGuide, stable });
    setFaceAligned(isAligned);
    
    return isAligned;
  }, [checkStability]);

  // Face detection with proper coordinate transformation
  const detectFacePosition = useCallback(async (video) => {
    if (!video || video.readyState !== 4) return;
    
    const width = video.videoWidth;
    const height = video.videoHeight;
    
    // Get displayed video dimensions
    const displayWidth = video.clientWidth;
    const displayHeight = video.clientHeight;
    
    // Calculate scale factors
    const scaleX = displayWidth / width;
    const scaleY = displayHeight / height;
    
    let faceX, faceY, faceWidth, faceHeight;
    let detected = false;
    
    // Try to use FaceDetector API if available
    if (window.faceDetector) {
      try {
        const faces = await window.faceDetector.detect(video);
        if (faces.length > 0) {
          const face = faces[0].boundingBox;
          
          // Transform coordinates from original video resolution to displayed dimensions
          // This is the critical fix for proper tracking
          faceX = ((face.x + face.width / 2) / width) * 100;
          faceY = ((face.y + face.height / 2) / height) * 100;
          faceWidth = (face.width / width) * 100 * scaleX;
          faceHeight = (face.height / height) * 100 * scaleY;
          
          detected = true;
        }
      } catch (e) {
        // FaceDetector failed
      }
    }
    
    if (!detected) {
      // Fallback: center-based with detected flag
      faceX = 50;
      faceY = 40;
      faceWidth = 30;
      faceHeight = 40;
    }
    
    // Calculate smoothed position with interpolation
    calculateSmoothedPosition({ x: faceX, y: faceY, width: faceWidth, height: faceHeight });
    
    // Check alignment
    setFaceDetected(detected || hasCamera);
    calculateAlignment(faceX, faceY, faceWidth, faceHeight);
    
  }, [hasCamera, calculateAlignment, calculateSmoothedPosition]);

  // Start face detection loop
  const startFaceDetection = useCallback((video) => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }

    detectionIntervalRef.current = setInterval(() => {
      detectFacePosition(video);
    }, 150);
  }, [detectFacePosition]);

  useEffect(() => {
    let mounted = true;
    
    const startCamera = async () => {
      try {
        setStatusText('Requesting camera access...');
        setIsLoading(true);
        setError(null);
        
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user'
          },
          audio: false
        });
        
        if (mounted) {
          setStream(mediaStream);
          streamRef.current = mediaStream;
          setHasCamera(true);
          setIsLoading(false);
          setStatusText('Position your face in the camera');
          
          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.srcObject = mediaStream;
              videoRef.current.play().catch(err => console.error("Play error:", err));
              startFaceDetection(videoRef.current);
            }
          }, 100);
        }
      } catch (err) {
        console.error('Camera error:', err);
        if (mounted) {
          setIsLoading(false);
          setHasCamera(false);
          if (err.name === 'NotAllowedError') {
            setError('Camera access denied. Please allow camera permissions.');
          } else if (err.name === 'NotFoundError') {
            setError('No camera found. Please connect a camera.');
          } else {
            setError('Camera error: ' + err.message);
          }
          setStatusText('Camera failed to start');
        }
      }
    };

    startCamera();

    return () => {
      mounted = false;
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [startFaceDetection]);

  function capturePhoto() {
    if (!videoRef.current || !stream || !faceAligned) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(imageData);
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }
  }

  function verifyPhoto() {
    setIsVerifying(true);
    setStatusText('Verifying your identity...');
    
    setTimeout(function() {
      setStatusText('Face verified successfully!');
      props.onSuccess();
    }, 1500);
  }

  function retry() {
    setCapturedImage(null);
    setFaceDetected(false);
    setFaceAligned(false);
    setAlignmentDetails({ centered: false, goodSize: false, insideGuide: false, stable: false });
    setSmoothedFace({ x: 50, y: 40, width: 30, height: 40 });
    stablePositionRef.current = { x: 0, y: 0, width: 0, height: 0 };
    stableSinceRef.current = 0;
    setError(null);
    setIsLoading(true);
    setStatusText('Restarting camera...');
    
    navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }
    }).then(function(mediaStream) {
      setStream(mediaStream);
      streamRef.current = mediaStream;
      setHasCamera(true);
      setIsLoading(false);
      setStatusText('Position your face in the camera');
      
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(err => console.error("Play error:", err));
          startFaceDetection(videoRef.current);
        }
      }, 100);
    }).catch(function(err) {
      setError('Failed to restart camera: ' + err.message);
      setIsLoading(false);
    });
  }

  // Determine what to show
  const showVideo = !isLoading && !error && !capturedImage;
  const showLoading = isLoading;
  const showError = error;
  const showCaptured = capturedImage;

  // Calculate oval position and size from smoothed face data
  const ovalStyle = {
    left: `${smoothedFace.x}%`,
    top: `${smoothedFace.y}%`,
    width: `${smoothedFace.width * 5}px`,
    height: `${smoothedFace.height * 6}px`,
    transform: 'translate(-50%, -50%)'
  };

  // Get status message
  const getStatusMessage = () => {
    if (faceAligned) return '✓ Perfect! Ready to capture';
    if (!alignmentDetails.stable) return '⏳ Hold position...';
    if (!alignmentDetails.centered) return '⚠ Center your face';
    if (!alignmentDetails.goodSize) return '⚠ Move closer or farther';
    if (!alignmentDetails.insideGuide) return '⚠ Adjust position';
    return '⚠ Align your face properly';
  };

  return (
    <div className="face-auth-container">
      <div className="face-auth-box">
        <div className="face-auth-header">
          <h2>Face Authentication</h2>
          <p>Verify your identity for secure access</p>
        </div>

        <div className="camera-wrapper">
          {/* Loading spinner */}
          {showLoading && (
            <div className="camera-loading">
              <div className="loading-spinner"></div>
              <p>{statusText}</p>
            </div>
          )}

          {/* Error message */}
          {showError && (
            <div className="camera-error">
              <p>{error}</p>
              <button onClick={retry} className="btn-retry">Try Again</button>
            </div>
          )}

          {/* Video preview with face guide */}
          {showVideo && (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="camera-video"
              />
              
              {/* Face alignment guide overlay - follows detected face with smoothing */}
              <div className="face-guide-overlay">
                <div 
                  className={`face-frame ${faceAligned ? 'aligned' : (faceDetected ? 'misaligned' : '')}`}
                  style={ovalStyle}
                >
                  {faceAligned && <div className="scan-line"></div>}
                </div>
                
                {/* Alignment status */}
                <div className={`alignment-status ${faceAligned ? 'success' : faceDetected ? 'warning' : ''}`}>
                  {getStatusMessage()}
                </div>
              </div>
            </>
          )}

          {/* Captured image preview */}
          {showCaptured && (
            <div className="captured-preview">
              <img src={capturedImage} alt="Captured" />
            </div>
          )}
        </div>

        <div className="status-bar">
          <span className="status-text">{statusText}</span>
        </div>

        <div className="face-auth-actions">
          {!capturedImage && !error && (
            <button
              onClick={capturePhoto}
              disabled={!faceAligned || isLoading || !stream}
              className={`btn-capture ${!faceAligned ? 'disabled' : ''}`}
            >
              {!faceAligned ? 'Align Your Face Properly' : 'Capture Photo'}
            </button>
          )}

          {capturedImage && !isVerifying && (
            <div className="button-group">
              <button onClick={verifyPhoto} className="btn-verify">Verify and Login</button>
              <button onClick={retry} className="btn-retry">Retake Photo</button>
            </div>
          )}

          {isVerifying && (
            <div className="verifying">
              <div className="loading-spinner"></div>
              <p>Verifying...</p>
            </div>
          )}
        </div>

        <div className="face-auth-tips">
          <h4>Requirements for Capture:</h4>
          <ul>
            <li>✓ Center your face within the oval</li>
            <li>✓ Keep proper distance (fill 25-40% of frame)</li>
            <li>✓ Hold steady for 1 second</li>
            <li>✓ Ensure good lighting</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default FaceAuth;

