import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, ChevronLeft, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useGroqChatMutation } from '@/state/api';
import { useAppDispatch, useAppSelector } from '@/app/redux';
import { addMessageToChat } from '@/state/chatSlice';
import ReactMarkdown, { Components } from 'react-markdown';
import { customComponents, menuOptions } from '@/constants/markdown';
import { Discuss } from 'react-loader-spinner';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const ChatBot = () => {
  const dispatch = useAppDispatch();

  const messages = useAppSelector((state) => state.chat.messages);

  const [sendMessage, { isLoading }] = useGroqChatMutation();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentSection, setCurrentSection] = useState<string>('home');
  const [inputText, setInputText] = useState<string>('');

  const toggleChat = () => setIsOpen(!isOpen);



  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    try {
      const response = await sendMessage({ message }).unwrap();
      dispatch(addMessageToChat({ role: 'user', content: message }));
      dispatch(addMessageToChat({ role: 'bot', content: response.response }));
      setInputText('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleSubmit  = async (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  const renderContent = () => {
    if (currentSection === 'home') {
      return (
        <>
          <div className="w-full flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-200 dark:bg-blue-700 rounded-full animate-pulse"></div>
              <div className="relative p-2 bg-white dark:bg-dark-secondary rounded-full border-2 border-blue-500">
                <Sparkles className="size-4 text-blue-500" />
              </div>
            </div>
            <div className='w-full flex flex-col gap-2 border dark:border-gray-500 p-2 rounded-md'>
              <h2 className="text-base font-semibold dark:text-gray-50">Ask AI</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">How can I assist you today?</p>
            </div>
          </div>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
            Select an option below or type your question:
          </p>
          <div className="grid grid-cols-1 gap-3">
            {menuOptions.map(option => {
              const Icon = option.icon;
              return (
                <Button
                  key={option.id}
                  onClick={() => setCurrentSection(option.id)}
                  className="flex items-center justify-start gap-3 font-normal text-left bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg p-3 
                  dark:bg-dark-secondary dark:text-gray-50 dark:border dark:border-gray-500 dark:hover:bg-gray-700"
                >
                  <Icon className="h-5 w-5" />
                  <span>{option.label}</span>
                </Button>
              );
            })}
          </div>
        </>
      );
    };
   
    const section = menuOptions.find(option => option.id === currentSection);
    
    return (
      <div className="flex flex-col w-full space-y-3">
        {section && section.subOptions.map((subOption, index) => (
          <Button
            key={index}
            variant="outline"
            className="flex text-left min-h-min border justify-start hover:bg-gray-100 text-gray-800 rounded-lg p-3 
            dark:border-gray-500 dark:hover:bg-gray-700 dark:text-gray-50 break-words whitespace-normal"
            onClick={() => {handleSendMessage(subOption)}}
          >
            {subOption}
          </Button>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.3 }}
            transition={{ type: 'spring', damping: 25, stiffness: 500 }}
            className="dark:bg-dark-secondary bg-white shadow-xl w-[300px] md:w-[400px] h-[80vh] mb-2 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 rounded-t-xl dark:bg-dark-secondary bg-gray-50 border-b">
              <div className="flex items-center gap-3">
                {currentSection !== 'home' && (
                  <Button variant="ghost" size="icon" onClick={() => setCurrentSection('home')} className="p-1">
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                )}
                <span className="flex items-center gap-2 font-semibold text-lg">
                  <p className="dark:text-gray-50 text-gray-800">Proto</p>
                  <p className="text-blue-500">AI</p>
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={toggleChat} className="text-gray-500 dark:text-gray-50 hover:text-gray-700">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="w-full flex-1 flex-wrap overflow-y-auto p-4 bg-white dark:bg-dark-secondary dark:text-gray-50">
              {renderContent()}
              <div className="w-full space-y-4 mt-4">
                {messages.map((message, index) => (
                  <div key={index} className={`w-full flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {message.role === 'bot' && (
                      <div className="w-min relative size-8 p-2 bg-white dark:bg-dark-secondary rounded-full border-2 border-blue-500">
                        <Sparkles className="size-4 text-blue-500" />
                      </div>
                    )}
                    <div className={`w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 ${
                        message.role === 'user' ? 'bg-blue-100 dark:bg-transparent ml-auto' : 'bg-gray-100 dark:bg-transparent'
                      }`}>
                         <div className="overflow-hidden w-[240px] md:w-[320px]">
                          <ReactMarkdown 
                            className="markdown prose w-full" 
                            components={customComponents} 
                            remarkPlugins={[remarkGfm]} 
                            rehypePlugins={[rehypeRaw]}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex mt-4 gap-2">
                    <div className="relative p-2 bg-white dark:bg-dark-secondary rounded-full border-2 border-blue-500">
                      <Sparkles className="size-4 text-blue-500" />
                    </div>
                    <Discuss
                      visible={true}
                      height="30"
                      width="30"
                      ariaLabel="discuss-loading"
                      wrapperStyle={{}}
                      wrapperClass="discuss-wrapper"
                      colors={['#3b82f6', '#3b82f6']} 
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 dark:bg-dark-secondary bg-gray-50 border-t rounded-b-xl">
              <form className="flex items-center gap-2">
                <textarea
                  placeholder="Type your message. Press Shift + Enter key to enter a new line..."
                  className="flex-grow bg-white dark:bg-dark-secondary dark:text-gray-50 
                             border border-gray-500 dark:border-gray-700 p-2 rounded-md resize-none
                             focus:outline-none"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) { 
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  rows={3} 
                />
                 <Button
                    size="icon"
                    onClick={() => handleSendMessage(inputText)}
                    className="bg-blue-700 hover:bg-blue-600 text-white p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!inputText.trim()}
                    >
                    <Send className="h-5 w-5" />
                    </Button>
              </form>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="bg-blue-700 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleChat}
      >
        <MessageCircle className="h-6 w-6" />
      </motion.button>
    </div>
  );
  
};

export default ChatBot;