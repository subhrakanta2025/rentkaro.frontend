import { useState } from 'react';
import { X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';


interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Thanks for your message! Our team will assist you shortly.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-2 sm:right-6 z-50 w-[calc(100vw-1rem)] max-w-[320px] sm:w-80 h-[400px] bg-background border border-border rounded-2xl shadow-2xl flex flex-col animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-border bg-primary rounded-t-2xl">
            <div className="flex items-center gap-2">
              <img src="/chatbot-bike.png" alt="Bot" className="w-14 h-14 object-contain" />
              <div>
                <h3 className="font-medium text-sm text-white">RentKaro Support</h3>
                <p className="text-xs text-white/80">We're here to help!</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-muted/30">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex',
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[75%] rounded-2xl px-4 py-2 shadow-sm',
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-background text-foreground border border-border rounded-bl-none'
                  )}
                >
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={cn(
                      'text-xs mt-1',
                      message.sender === 'user'
                        ? 'text-primary-foreground/70'
                        : 'text-muted-foreground'
                    )}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border bg-background rounded-b-2xl">
            <div className="flex gap-2">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button
                onClick={handleSend}
                size="icon"
                variant="hero"
                className="shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 transition-all duration-300 group',
          isOpen && 'rotate-0'
        )}
        aria-label="Open chat"
      >
        {isOpen ? (
          <div className="h-14 w-14 sm:h-[72px] sm:w-[72px] rounded-full bg-primary shadow-xl hover:shadow-2xl flex items-center justify-center">
            <X className="h-6 w-6 sm:h-8 sm:w-8 text-white transition-transform group-hover:scale-110" />
          </div>
        ) : (
          <img 
            src="/chatbot-bike.png" 
            alt="Chat Bot" 
            className="w-16 h-16 sm:w-24 sm:h-24 object-contain drop-shadow-2xl transition-transform group-hover:scale-110 animate-pulse" 
          />
        )}
      </button>
    </>
  );
}
