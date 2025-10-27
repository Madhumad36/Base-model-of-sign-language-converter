
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI, LiveSession, LiveServerMessage, Modality } from "@google/genai";
import { MicIcon, StopIcon } from './Icons';
import Spinner from './Spinner';

// Helper functions for audio encoding/decoding as per Gemini documentation
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

type SessionStatus = 'IDLE' | 'CONNECTING' | 'CONNECTED' | 'ERROR' | 'CLOSED';
type Transcription = { speaker: 'user' | 'model'; text: string };

const LiveConversation: React.FC = () => {
    const [status, setStatus] = useState<SessionStatus>('IDLE');
    const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
    const sessionRef = useRef<LiveSession | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    
    const nextStartTimeRef = useRef<number>(0);
    const currentInputTranscriptionRef = useRef<string>('');
    const currentOutputTranscriptionRef = useRef<string>('');

    const stopSession = useCallback(() => {
        if (sessionRef.current) {
            sessionRef.current.close();
            sessionRef.current = null;
        }
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }
        if (scriptProcessorRef.current) {
            scriptProcessorRef.current.disconnect();
            scriptProcessorRef.current = null;
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
            outputAudioContextRef.current.close();
            outputAudioContextRef.current = null;
        }
        setStatus('IDLE');
    }, []);
    
    // Ensure cleanup on unmount
    useEffect(() => {
        return () => {
            stopSession();
        };
    }, [stopSession]);

    const startSession = async () => {
        setStatus('CONNECTING');
        setTranscriptions([]);
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

            const sessionPromise = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        setStatus('CONNECTED');
                        const source = audioContextRef.current!.createMediaStreamSource(stream);
                        const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current = scriptProcessor;

                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const l = inputData.length;
                            const int16 = new Int16Array(l);
                            for (let i = 0; i < l; i++) {
                                int16[i] = inputData[i] * 32768;
                            }
                            const pcmBlob = {
                                data: encode(new Uint8Array(int16.buffer)),
                                mimeType: 'audio/pcm;rate=16000',
                            };
                            sessionPromise.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(audioContextRef.current!.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (base64Audio && outputAudioContextRef.current) {
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContextRef.current.currentTime);
                            const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContextRef.current, 24000, 1);
                            const source = outputAudioContextRef.current.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputAudioContextRef.current.destination);
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;
                        }

                        if (message.serverContent?.inputTranscription) {
                           currentInputTranscriptionRef.current += message.serverContent.inputTranscription.text;
                        }
                         if (message.serverContent?.outputTranscription) {
                           currentOutputTranscriptionRef.current += message.serverContent.outputTranscription.text;
                        }

                        if(message.serverContent?.turnComplete) {
                            const userInput = currentInputTranscriptionRef.current.trim();
                            const modelOutput = currentOutputTranscriptionRef.current.trim();
                            if (userInput) {
                                setTranscriptions(prev => [...prev, { speaker: 'user', text: userInput }]);
                            }
                            if (modelOutput) {
                                setTranscriptions(prev => [...prev, { speaker: 'model', text: modelOutput }]);
                            }
                            currentInputTranscriptionRef.current = '';
                            currentOutputTranscriptionRef.current = '';
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Session error:', e);
                        setStatus('ERROR');
                        stopSession();
                    },
                    onclose: (e: CloseEvent) => {
                        setStatus('CLOSED');
                        stopSession();
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
                    },
                    systemInstruction: 'You are an expert in sign language. Briefly and clearly answer questions about sign language or have a friendly conversation. When asked, describe how to perform a sign.',
                },
            });

            sessionRef.current = await sessionPromise;

        } catch (error) {
            console.error("Failed to start session:", error);
            setStatus('ERROR');
            stopSession();
        }
    };


    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-700">
                <h2 className="text-xl font-bold text-cyan-400">Real-time Conversation</h2>
                <p className="text-gray-400 mt-1">
                    Talk to an AI assistant specialized in sign language. Ask it how to sign a word, or just have a chat!
                </p>
            </div>

            <div className="flex-grow p-4 overflow-y-auto space-y-4">
                {transcriptions.map((t, i) => (
                    <div key={i} className={`flex ${t.speaker === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xl px-4 py-2 rounded-lg ${t.speaker === 'user' ? 'bg-cyan-600 text-white' : 'bg-gray-600 text-white'}`}>
                            <span className="font-bold capitalize">{t.speaker}: </span>{t.text}
                        </div>
                    </div>
                ))}
                 {status === 'CONNECTED' && <div className="text-center text-gray-400 animate-pulse">Listening...</div>}
            </div>
            
            <div className="p-4 border-t border-gray-700 flex flex-col items-center justify-center">
                {status === 'IDLE' || status === 'CLOSED' || status === 'ERROR' ? (
                     <button onClick={startSession} className="flex items-center justify-center bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300 transform hover:scale-105">
                        <MicIcon className="w-6 h-6 mr-2" /> Start Conversation
                    </button>
                ) : status === 'CONNECTING' ? (
                    <div className="flex items-center text-gray-400">
                        <Spinner className="w-6 h-6 mr-3" /> Connecting...
                    </div>
                ) : (
                     <button onClick={stopSession} className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300 transform hover:scale-105">
                        <StopIcon className="w-6 h-6 mr-2" /> Stop Conversation
                    </button>
                )}
                {status === 'ERROR' && <p className="text-red-500 mt-2">An error occurred. Please try again.</p>}
            </div>
        </div>
    );
};

export default LiveConversation;
