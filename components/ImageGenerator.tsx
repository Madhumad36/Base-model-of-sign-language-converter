
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import Spinner from './Spinner';
import { SparklesIcon } from './Icons';

const ImageGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('A stylized, minimalist vector illustration of the sign language gesture for "I love you".');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const generateImage = async () => {
        if (!prompt) {
            setError('Please enter a prompt to generate an image.');
            return;
        }
        setIsLoading(true);
        setError('');
        setGeneratedImage(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: prompt,
                config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/png',
                    aspectRatio: '1:1',
                },
            });
            
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            const imageUrl = `data:image/png;base64,${base64ImageBytes}`;
            setGeneratedImage(imageUrl);

        } catch (err) {
            console.error(err);
            setError('Failed to generate image. Please try a different prompt.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full items-center">
            <div className="w-full max-w-2xl text-center">
                <h2 className="text-xl font-bold text-cyan-400 mb-2">Gesture Image Generator</h2>
                <p className="text-gray-400 mb-4">
                    Describe a sign language gesture or a related concept, and the AI will create an image for you.
                </p>
            </div>
            
            <div className="w-full max-w-2xl flex items-center gap-2 mb-6">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., The sign for 'Thank you' in a watercolor style"
                    className="flex-grow bg-gray-700 border-gray-600 rounded-md p-3 focus:ring-cyan-500 focus:border-cyan-500"
                />
                <button
                    onClick={generateImage}
                    disabled={isLoading}
                    className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-500 text-white font-bold py-3 px-5 rounded-md flex items-center justify-center"
                >
                    {isLoading ? <Spinner /> : <SparklesIcon className="w-5 h-5 mr-2" />}
                    Generate
                </button>
            </div>
            
            <div className="flex-grow w-full max-w-2xl flex justify-center items-center bg-gray-900 rounded-lg border-2 border-dashed border-gray-700 p-4">
                {isLoading && (
                     <div className="text-center">
                        <Spinner className="w-12 h-12 mx-auto text-cyan-400" />
                        <p className="mt-4 text-gray-400">Generating your image...</p>
                    </div>
                )}
                {error && <p className="text-red-500">{error}</p>}
                {generatedImage && (
                    <img src={generatedImage} alt="Generated from prompt" className="max-h-96 w-auto rounded-lg shadow-lg" />
                )}
                {!isLoading && !generatedImage && !error && (
                    <p className="text-gray-500">Your generated image will appear here.</p>
                )}
            </div>
        </div>
    );
};

export default ImageGenerator;
