import { MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ChatWidget() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load Chatwoot script
    const script = document.createElement('script');
    script.src = 'https://app.chatwoot.com/packs/js/sdk.js';
    script.async = true;
    
    script.onload = () => {
      if (window.chatwootSDK) {
        window.chatwootSDK.run({
          websiteToken: '7vbkNVt86qXJWQEQuH5wwNhV',
          baseUrl: 'https://app.chatwoot.com'
        });
        setIsLoaded(true);
      }
    };
    
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleClick = () => {
    if (isLoaded && window.$chatwoot) {
      window.$chatwoot.toggle();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-glow hover:opacity-90 transition-smooth flex items-center justify-center"
      aria-label="Abrir chat"
    >
      <MessageCircle className="h-6 w-6" />
    </button>
  );
}

// Type declarations for Chatwoot
declare global {
  interface Window {
    chatwootSDK?: {
      run: (config: { websiteToken: string; baseUrl: string }) => void;
    };
    $chatwoot?: {
      toggle: () => void;
    };
  }
}
