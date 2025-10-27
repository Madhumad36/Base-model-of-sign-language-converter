
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import Spinner from './Spinner';
import { BrainCircuitIcon } from './Icons';

const ComplexQuery: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('Provide a detailed breakdown of the linguistic origins and grammatical structure of Indian Sign Language (ISL) compared to American Sign Language (ASL). Include key differences in phonology, morphology, and syntax.');
    const [response, setResponse] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleQuery = async () => {
        if (!prompt) {
            setError('Please enter a prompt.');
            return;
        }
        setIsLoading(true);
        setError('');
        setResponse('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const result = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: prompt,
                config: {
                    thinkingConfig: {
                        thinkingBudget: 32768,
                    },
                },
            });
            
            setResponse(result.text);

        } catch (err) {
            console.error(err);
            setError('Failed to process the query. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="text-center mb-6">
                <BrainCircuitIcon className="w-12 h-12 mx-auto text-cyan-400 mb-2"/>
                <h2 className="text-xl font-bold text-cyan-400">Complex Query with Thinking Mode</h2>
                <p className="text-gray-400 mt-1 max-w-3xl mx-auto">
                    Ask a complex, multi-faceted question. Gemini Pro will use its maximum "thinking budget" to provide a deeply reasoned and structured response.
                </p>
            </div>
            
            <div className="flex flex-col flex-grow">
                <label htmlFor="complex-prompt" className="block text-sm font-medium text-gray-300 mb-2">Your Complex Prompt</label>
                <textarea
                    id="complex-prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={5}
                    className="w-full bg-gray-700 border-gray-600 rounded-md p-3 focus:ring-cyan-500 focus:border-cyan-500"
                    placeholder="Enter a detailed question that requires deep analysis..."
                />
                <button
                    onClick={handleQuery}
                    disabled={isLoading}
                    className="mt-4 w-full md:w-auto md:self-end bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-500 text-white font-bold py-2 px-6 rounded-md flex items-center justify-center"
                >
                    {isLoading ? <Spinner /> : 'Submit Query'}
                </button>

                <div className="mt-6 flex-grow bg-gray-900 rounded-lg p-4 overflow-y-auto border border-gray-700 min-h-[30vh]">
                     <h3 className="text-lg font-semibold text-gray-200 mb-2">AI Response</h3>
                    {isLoading && <div className="flex justify-center items-center h-full"><Spinner className="w-8 h-8"/></div>}
                    {error && <p className="text-red-500">{error}</p>}
                    {response && <p className="whitespace-pre-wrap">{response}</p>}
                    {!isLoading && !response && !error && <p className="text-gray-500">The detailed response will appear here...</p>}
                </div>
            </div>
        </div>
    );
};

export default ComplexQuery;
