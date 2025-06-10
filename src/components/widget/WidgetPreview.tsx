import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send, Minimize2, Maximize2, Sun, Moon, Move } from 'lucide-react';
import { WidgetConfig } from './WidgetConfiguration';

interface WidgetPreviewProps {
  config: WidgetConfig;
  onConfigChange?: (updates: Partial<WidgetConfig>) => void;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const WidgetPreview = ({ config, onConfigChange }: WidgetPreviewProps) => {
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
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light');
  const [showPositionControls, setShowPositionControls] = useState(false);

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
      case 'bottom-left': return 'bottom-6 left-6';
      case 'top-right': return 'top-6 right-6';
      case 'top-left': return 'top-6 left-6';
      default: return 'bottom-6 right-6';
    }
  };

  const getThemeClasses = () => {
    const actualTheme = config.theme === 'auto' ? previewTheme : config.theme;
    return actualTheme === 'dark' ? 'dark' : '';
  };

  const handlePositionChange = (position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left') => {
    if (onConfigChange) {
      onConfigChange({ position });
    }
  };

  const positionOptions = [
    { id: 'top-left', label: 'Top Left', classes: 'top-6 left-6' },
    { id: 'top-right', label: 'Top Right', classes: 'top-6 right-6' },
    { id: 'bottom-left', label: 'Bottom Left', classes: 'bottom-6 left-6' },
    { id: 'bottom-right', label: 'Bottom Right', classes: 'bottom-6 right-6' },
  ] as const;

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Live Preview</CardTitle>
            <CardDescription>See how your widget will appear on your website</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {onConfigChange && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPositionControls(!showPositionControls)}
                className="flex items-center gap-2"
              >
                <Move className="h-4 w-4" />
                Position
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewTheme(previewTheme === 'light' ? 'dark' : 'light')}
              className="flex items-center gap-2"
            >
              {previewTheme === 'light' ? (
                <>
                  <Moon className="h-4 w-4" />
                  Dark
                </>
              ) : (
                <>
                  <Sun className="h-4 w-4" />
                  Light
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className={`relative rounded-lg overflow-hidden h-[600px] ${getThemeClasses()}`}>
          {/* Simulated website background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            {/* Website content mockup */}
            <div className="p-8 text-center pt-24">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Your Website
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                This is a preview of how the chat widget will appear on your website.
                {onConfigChange && showPositionControls && (
                  <span className="block mt-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                    Click the corner buttons to change widget position
                  </span>
                )}
              </p>
              <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-white/50 dark:bg-gray-700/50 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Position Control Buttons */}
          {onConfigChange && showPositionControls && (
            <>
              {positionOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handlePositionChange(option.id)}
                  className={`absolute z-20 w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 ${config.position === option.id
                      ? 'bg-blue-500 border-blue-600 shadow-lg scale-110'
                      : 'bg-white/90 dark:bg-gray-800/90 border-gray-300 dark:border-gray-600 hover:border-blue-400 shadow-md backdrop-blur-sm'
                    } ${option.classes}`}
                  title={`Move to ${option.label}`}
                >
                  {config.position === option.id && (
                    <div className="w-4 h-4 bg-white rounded-full mx-auto flex items-center justify-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                  )}
                </button>
              ))}
            </>
          )}

          {/* Widget */}
          <div className={`absolute ${getPositionClasses()} z-10`}>
            {/* Chat Button */}
            {!isOpen && (
              <Button
                onClick={() => setIsOpen(true)}
                className={`${getButtonSize()} rounded-full shadow-lg hover:scale-105 transition-all duration-200 border-2 border-white/20`}
                style={{ backgroundColor: config.primaryColor }}
              >
                <MessageCircle className="h-6 w-6 text-white" />
              </Button>
            )}

            {/* Chat Window */}
            {isOpen && (
              <div className={`${getWidgetSize()} bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden transition-all duration-300`}>
                {/* Header */}
                <div
                  className="p-4 flex items-center justify-between text-white"
                  style={{ backgroundColor: config.primaryColor }}
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">{config.title}</h4>
                    {config.subtitle && (
                      <p className="text-xs opacity-90 truncate">{config.subtitle}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-white hover:bg-white/20 transition-colors"
                      onClick={() => setIsMinimized(!isMinimized)}
                    >
                      {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-white hover:bg-white/20 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {!isMinimized && (
                  <>
                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-0">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[75%] p-3 rounded-lg text-sm leading-relaxed ${message.isUser
                                ? 'text-white rounded-br-sm'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-sm'
                              }`}
                            style={message.isUser ? { backgroundColor: config.primaryColor } : {}}
                          >
                            {message.text}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex space-x-2">
                        <Input
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder={config.placeholder}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          className="flex-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600"
                        />
                        <Button
                          onClick={sendMessage}
                          size="icon"
                          className="shrink-0 transition-all duration-200 hover:scale-105"
                          style={{ backgroundColor: config.primaryColor }}
                        >
                          <Send className="h-4 w-4 text-white" />
                        </Button>
                      </div>
                      {config.showBranding && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
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
