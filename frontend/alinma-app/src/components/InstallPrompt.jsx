import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Show the prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      // We no longer need the prompt. Clear it up.
      setDeferredPrompt(null);
      setShowInstall(false);
    }
  };

  const handleDismiss = () => {
    setShowInstall(false);
  };

  if (!showInstall) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="flex-1 ml-3">
          <h3 className="text-sm font-medium text-gray-900">
            تثبيت تطبيق الإنماء
          </h3>
          <p className="text-sm text-gray-600">
            أضف التطبيق إلى الشاشة الرئيسية للوصول السريع
          </p>
        </div>
        <div className="flex space-x-2 space-x-reverse">
          <Button
            onClick={handleInstallClick}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            تثبيت
          </Button>
          <Button
            onClick={handleDismiss}
            variant="ghost"
            size="sm"
          >
            لاحقاً
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
