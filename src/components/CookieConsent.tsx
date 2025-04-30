
import { useState, useEffect } from 'react';
import { Button } from './ui/button';

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 p-4 bg-background border rounded-lg shadow-lg">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm">
          This website uses cookies to improve your experience.
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={declineCookies}>
            Decline
          </Button>
          <Button onClick={acceptCookies}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
