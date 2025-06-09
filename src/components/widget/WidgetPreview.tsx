
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send, Minimize2, Maximize2 } from 'lucide-react';
import { WidgetConfig } from './WidgetConfiguration';

interface WidgetPreviewProps {
  config: WidgetConfig;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const WidgetPreview = ({ config }: WidgetPreviewProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: config.welcomeMessage,
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for your message! This is a preview of how the AI will respond to user queries.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const getWidgetSize = () => {
    switch (config.size) {
      case 'small': return 'w-80 h-96';
      case 'large': return 'w-96 h-[32rem]';
      default: return 'w-80 h-[28rem]';
    }
  };

  const getButtonSize = () => {
    switch (config.size) {
      case 'small': return 'w-12 h-12';
      case 'large': return 'w-16 h-16';
      default: return 'w-14 h-14';
    }
  };

  const getPositionClasses = () => {
    switch (config.position) {
      case 'bottom-left': return 'bottom-4 left-4';
      case 'top-right': return 'top-4 right-4';
      case 'top-left': return 'top-4 left-4';
      default: return 'bottom-4 right-4';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Preview</CardTitle>
        <CardDescription>See how your widget will appear on your website</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 rounded-lg p-4 h-96 overflow-hidden">
          {/* Simulated website content */}
          <div className="text-center pt-16">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Your Website</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">The widget will appear as shown below</p>
          </div>

          {/* Widget */}
          <div className={`absolute ${getPositionClasses()}`}>
            {/* Chat Button */}
            {!isOpen && (
              <Button
                onClick={() => setIsOpen(true)}
                className={`${getButtonSize()} rounded-full shadow-lg hover:scale-105 transition-transform`}
                style={{ backgroundColor: config.primaryColor }}
              >
                <MessageCircle className="h-6 w-6 text-white" />
              </Button>
            )}

            {/* Chat Window */}
            {isOpen && (
              <div className={`${getWidgetSize()} bg-white dark:bg-gray-800 rounded-lg shadow-xl border flex flex-col`}>
                {/* Header */}
                <div 
                  className="p-4 rounded-t-lg flex items-center justify-between text-white"
                  style={{ backgroundColor: config.primaryColor }}
                >
                  <div>
                    <h4 className="font-semibold">{config.title}</h4>
                    {config.subtitle && (
                      <p className="text-xs opacity-90">{config.subtitle}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-white hover:bg-white/20"
                      onClick={() => setIsMinimized(!isMinimized)}
                    >
                      {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-white hover:bg-white/20"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {!isMinimized && (
                  <>
                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-3">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs p-3 rounded-lg text-sm ${
                              message.isUser
                                ? 'text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                            }`}
                            style={message.isUser ? { backgroundColor: config.primaryColor } : {}}
                          >
                            {message.text}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t">
                      <div className="flex space-x-2">
                        <Input
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder={config.placeholder}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          className="flex-1"
                        />
                        <Button
                          onClick={sendMessage}
                          size="icon"
                          style={{ backgroundColor: config.primaryColor }}
                        >
                          <Send className="h-4 w-4 text-white" />
                        </Button>
                      </div>
                      {config.showBranding && (
                        <p className="text-xs text-gray-500 mt-2 text-center">
                          Powered by ChatWidget Pro
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
