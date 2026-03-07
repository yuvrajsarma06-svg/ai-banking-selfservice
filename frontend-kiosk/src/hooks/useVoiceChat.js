import { useState, useEffect, useRef, useCallback } from 'react';

// Voice Chat Hook/Logic
const useVoiceChat = (onSendMessage, botReply) => {
    const [listening, setListening] = useState(false);
    const [input, setInput] = useState('');
    const recognitionRef = useRef(null);
    const activeListeningRef = useRef(false);
    const timeoutRef = useRef(null);
    const restartTimeoutRef = useRef(null);
    const onSendMessageRef = useRef(onSendMessage);

    useEffect(() => {
        onSendMessageRef.current = onSendMessage;
    }, [onSendMessage]);

    useEffect(() => {
        activeListeningRef.current = listening;
    }, [listening]);

    const stopMic = useCallback(() => {
        if (listening) {
            setListening(false);
            activeListeningRef.current = false;
        }
        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop();
            } catch (e) { }
        }
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
        window.speechSynthesis.cancel(); // Stop any pending or active TTS
    }, [listening]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopMic();
        };
    }, [stopMic]);

    // Initialize Speech Recognition
    useEffect(() => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = true;
        recognition.continuous = true;

        recognition.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            let combinedTranscript = finalTranscript || interimTranscript;
            if (combinedTranscript) setInput(combinedTranscript);

            if (finalTranscript.trim()) {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);

                // Debounce to prevent lag from rapid fires
                timeoutRef.current = setTimeout(() => {
                    if (onSendMessageRef.current) {
                        onSendMessageRef.current(finalTranscript.trim());
                    }
                    setInput('');
                }, 800);
            }
        };

        recognition.onend = () => {
            // Auto restart if still actively listening with slight delay
            if (activeListeningRef.current && recognitionRef.current) {
                restartTimeoutRef.current = setTimeout(() => {
                    if (activeListeningRef.current) {
                        try {
                            recognitionRef.current.start();
                        } catch (e) {
                            setListening(false);
                            activeListeningRef.current = false;
                        }
                    }
                }, 300);
            } else {
                setListening(false);
                activeListeningRef.current = false;
            }
        };

        recognitionRef.current = recognition;

        // Cleanup listener changes
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.onresult = null;
                recognitionRef.current.onend = null;
                try {
                    recognitionRef.current.stop();
                } catch (e) { }
            }
        };
    }, []);

    // Text-to-Speech for bot replies
    useEffect(() => {
        if (!botReply) return;
        const utterance = new SpeechSynthesisUtterance(botReply);
        window.speechSynthesis.speak(utterance);
    }, [botReply]);

    const startMic = useCallback(() => {
        if (!recognitionRef.current || listening) return;
        setListening(true);
        activeListeningRef.current = true;
        try {
            recognitionRef.current.start();
        } catch (e) {
            // Ignore
        }
    }, [listening]);

    const toggleMic = useCallback(() => {
        if (!recognitionRef.current) return;
        if (listening) {
            stopMic();
        } else {
            startMic();
        }
    }, [listening, startMic, stopMic]);

    return { input, setInput, listening, toggleMic, stopMic, startMic };
};

export default useVoiceChat;
