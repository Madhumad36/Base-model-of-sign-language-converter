
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import Spinner from './Spinner';
import { ImageIcon } from './Icons';

const ImageAnalyzer: React.FC = () => {
    const [image, setImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState<string>('Describe this sign language gesture. What does it mean?');
    const [analysis, setAnalysis] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const analyzeImage = async () => {
        if (!image || !prompt) {
            setError('Please upload an image and provide a prompt.');
            return;
        }
        setIsLoading(true);
        setError('');
        setAnalysis('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const imagePart = {
                inlineData: {
                    mimeType: image.split(';')[0].split(':')[1],
                    data: image.split(',')[1],
                },
            };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: { parts: [imagePart, { text: prompt }] },
            });
            
            setAnalysis(response.text);

        } catch (err) {
            console.error(err);
            setError('Failed to analyze image. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-full gap-6">
            <div className="md:w-1/2 flex flex-col">
                <h2 className="text-xl font-bold text-cyan-400 mb-2">Analyze a Gesture</h2>
                <p className="text-gray-400 mb-4">Upload an image of a hand gesture and ask the AI to analyze it for you.</p>

                <div className="flex-grow bg-gray-900 rounded-lg p-4 flex flex-col justify-center items-center border-2 border-dashed border-gray-600">
                    {image ? (
                        <img src={image} alt="Uploaded gesture" className="max-h-64 rounded-lg object-contain" />
                    ) : (
                        <div className="text-center text-gray-500">
                            <ImageIcon className="w-16 h-16 mx-auto mb-2" />
                            <p>Upload an image to start</p>
                        </div>
                    )}
                </div>
                
                <div className="mt-4">
                    <label htmlFor="image-upload" className="block text-sm font-medium text-gray-300 mb-2">Upload Image</label>
                    <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-700"/>
                </div>

                <div className="mt-4">
                    <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">Your Question</label>
                    <textarea id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3} className="w-full bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500"/>
                </div>

                <button onClick={analyzeImage} disabled={isLoading || !image} className="mt-4 w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-500 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center">
                    {isLoading ? <Spinner /> : 'Analyze'}
                </button>
            </div>

            <div className="md:w-1/2 flex flex-col">
                 <h3 className="text-lg font-semibold text-gray-200 mb-2">AI Analysis</h3>
                <div className="flex-grow bg-gray-900 rounded-lg p-4 overflow-y-auto border border-gray-700">
                    {isLoading && <div className="flex justify-center items-center h-full"><Spinner className="w-8 h-8"/></div>}
                    {error && <p className="text-red-500">{error}</p>}
                    {analysis && <p className="whitespace-pre-wrap">{analysis}</p>}
                    {!isLoading && !analysis && !error && <p className="text-gray-500">Analysis will appear here...</p>}
                </div>
            </div>
        </div>
    );
};

export default ImageAnalyzer;
