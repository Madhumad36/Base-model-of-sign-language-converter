
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat as GeminiChat } from "@google/genai";
import Spinner from './Spinner';
import { SendIcon } from './Icons';

interface Message {
    role: 'user' | 'model';
    text: string;
}

const Chat: React.FC = () => {
    const [chat, setChat] = useState<GeminiChat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initChat = () => {
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const newChat = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: {
                         systemInstruction: 'You are a helpful and friendly chatbot designed to assist with learning Indian Sign Language. Provide clear, concise answers.'
                    }
                });
                setChat(newChat);
                 setMessages([{ role: 'model', text: 'Hello! How can I help you with Indian Sign Language today?' }]);
            } catch (err) {
                console.error("Failed to initialize chat:", err);
                setError("Could not start the chat session. Please check your API key and refresh.");
            }
        };
        initChat();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || !chat) return;

        const userMessage: Message = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setError('');

        try {
            const stream = await chat.sendMessageStream({ message: input });
            let modelResponse = '';
            setMessages(prev => [...prev, { role: 'model', text: '...' }]);

            for await (const chunk of stream) {
                modelResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { role: 'model', text: modelResponse };
                    return newMessages;
                });
            }

        } catch (err) {
            console.error(err);
            const errorMessage = "Sorry, I couldn't get a response. Please try again.";
            setError(errorMessage);
            setMessages(prev => [...prev, { role: 'model', text: errorMessage }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isLoading) {
            sendMessage();
        }
    };

    return (
        <div className="flex flex-col h-[70vh]">
            <h2 className="text-xl font-bold text-cyan-400 mb-2 border-b border-gray-700 pb-2">Sign Language Chatbot</h2>
            <div className="flex-grow overflow-y-auto pr-4 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center font-bold text-white flex-shrink-0">AI</div>}
                        <div className={`px-4 py-2 rounded-lg max-w-lg ${msg.role === 'user' ? 'bg-gray-700' : 'bg-gray-600'}`}>
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    </div>
                ))}
                 <div ref={messagesEndRef} />
            </div>
            {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
            <div className="mt-4 pt-4 border-t border-gray-700 flex items-center">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask a question..."
                    disabled={isLoading}
                    className="flex-grow bg-gray-700 border-gray-600 rounded-l-md p-3 focus:ring-cyan-500 focus:border-cyan-500"
                />
                <button
                    onClick={sendMessage}
                    disabled={isLoading || !input.trim()}
                    className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-500 text-white font-bold p-3 rounded-r-md"
                >
                    {isLoading ? <Spinner className="w-6 h-6"/> : <SendIcon className="w-6 h-6" />}
                </button>
            </div>
        </div>
    );
};

export default Chat;
