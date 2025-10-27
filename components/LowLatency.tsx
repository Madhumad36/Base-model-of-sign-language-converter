
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import Spinner from './Spinner';
import { RabbitIcon } from './Icons';

const LowLatency: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('Quickly list 10 common phrases in Indian Sign Language.');
    const [response, setResponse] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const getFastResponse = async () => {
        if (!prompt) {
            setError('Please enter a prompt.');
            return;
        }
        setIsLoading(true);
        setError('');
        setResponse('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const stream = await ai.models.generateContentStream({
                model: 'gemini-flash-lite-latest',
                contents: prompt,
            });

            let fullResponse = '';
            for await (const chunk of stream) {
                fullResponse += chunk.text;
                setResponse(fullResponse);
            }

        } catch (err) {
            console.error(err);
            setError('Failed to get a response. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isLoading) {
            getFastResponse();
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="text-center mb-6">
                <RabbitIcon className="w-12 h-12 mx-auto text-cyan-400 mb-2"/>
                <h2 className="text-xl font-bold text-cyan-400">Low-Latency Responses</h2>
                <p className="text-gray-400 mt-1 max-w-3xl mx-auto">
                    Experience rapid, streaming text generation with Gemini Flash Lite, perfect for quick questions and answers.
                </p>
            </div>
            
            <div className="flex flex-col flex-grow">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter your prompt for a fast response"
                        className="flex-grow bg-gray-700 border-gray-600 rounded-md p-3 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                    <button
                        onClick={getFastResponse}
                        disabled={isLoading}
                        className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-500 text-white font-bold py-3 px-5 rounded-md flex items-center justify-center"
                    >
                        {isLoading ? <Spinner /> : 'Generate'}
                    </button>
                </div>
                
                <div className="mt-6 flex-grow bg-gray-900 rounded-lg p-4 overflow-y-auto border border-gray-700 min-h-[40vh]">
                     <h3 className="text-lg font-semibold text-gray-200 mb-2">AI Response (Streaming)</h3>
                    {error && <p className="text-red-500">{error}</p>}
                    {response ? <p className="whitespace-pre-wrap">{response}</p> : 
                        !isLoading && <p className="text-gray-500">The streaming response will appear here...</p>
                    }
                </div>
            </div>
        </div>
    );
};

export default LowLatency;
