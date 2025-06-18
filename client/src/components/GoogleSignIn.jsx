import React, { useEffect, useRef, useState } from "react";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const GoogleSignIn = ({ onSuccess, onError, disabled = false }) => {
  const googleButtonRef = useRef(null);
  const [error, setError] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      setError("Missing VITE_GOOGLE_CLIENT_ID in .env file");
      return;
    }

    if (disabled) return;

    const handleCredentialResponse = (response) => {
      try {
        console.log("Google sign in successful");
        onSuccess(response.credential);
      } catch (error) {
        console.error("Google Sign In Error:", error);
        onError(error);
      }
    };

    const initializeGoogle = () => {
      if (window.google && googleButtonRef.current) {
        try {
          console.log("Initializing Google with ref:", googleButtonRef.current);

          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: "outline",
            size: "large",
            // Removed width: "100%" - this was causing the error
            text: "continue_with",
            shape: "rectangular",
            logo_alignment: "left",
          });

          console.log("Google button rendered successfully");
          setIsReady(true);
        } catch (err) {
          console.error("Error rendering Google button:", err);
          setError("Failed to render Google button");
        }
      }
    };

    const loadGoogleScript = () => {
      if (window.google) {
        console.log("Google already loaded, initializing...");
        setTimeout(initializeGoogle, 100);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.onload = () => {
        console.log("Google script loaded");
        setTimeout(initializeGoogle, 100);
      };
      script.onerror = () => {
        console.error("Failed to load Google script");
        setError("Failed to load Google script");
      };
      document.head.appendChild(script);
    };

    const timer = setTimeout(loadGoogleScript, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [disabled, onSuccess, onError]);

  useEffect(() => {
    if (googleButtonRef.current && window.google && !isReady && !error) {
      console.log("Ref became available, retrying initialization...");

      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => {
            try {
              onSuccess(response.credential);
            } catch (error) {
              onError(error);
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "rectangular",
          logo_alignment: "left",
        });

        setIsReady(true);
      } catch (err) {
        console.error("Error in ref effect:", err);
        setError("Failed to initialize Google Sign In");
      }
    }
  });

  if (disabled) {
    return (
      <div className="w-full p-4 border border-stone-300 rounded-2xl bg-stone-100 text-stone-500 text-center font-medium">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4 border border-red-300 rounded-2xl bg-red-50 text-red-600 text-center font-medium text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        ref={googleButtonRef}
        className="w-full flex justify-center"
        style={{ minHeight: "44px" }}
      />
      {!isReady && (
        <div className="w-full p-4 border border-stone-300 rounded-2xl bg-stone-50 text-stone-500 text-center font-medium">
          Loading Google Sign In...
        </div>
      )}
    </div>
  );
};

export default GoogleSignIn;
