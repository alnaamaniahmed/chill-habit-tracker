import React, { useState } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';

const PasswordRequirements = ({ password, show }) => {
  if (!show || !password) return null;

  const requirements = [
    { text: "At least 8 characters", test: password.length >= 8 },
    { text: "Contains uppercase letter", test: /[A-Z]/.test(password) },
    { text: "Contains lowercase letter", test: /[a-z]/.test(password) },
    { text: "Contains number", test: /\d/.test(password) },
    { text: "Contains special character (!@#$%^&*)", test: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  return (
    <div className="mt-2 space-y-1">
      {requirements.map((req, index) => (
        <div key={index} className="flex items-center gap-2 text-xs">
          {req.test ? (
            <Check className="w-3 h-3 text-green-600" />
          ) : (
            <X className="w-3 h-3 text-red-400" />
          )}
          <span className={req.test ? "text-green-600" : "text-stone-500"}>
            {req.text}
          </span>
        </div>
      ))}
    </div>
  );
};

const PasswordInput = ({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder, 
  showRequirements = false,
  showMatchIndicator = false,
  matchValue = "",
  required = false,
  className = ""
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showReqs, setShowReqs] = useState(false);

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return minLength && hasUpper && hasLower && hasNumber && hasSpecial;
  };

  const isValid = showRequirements ? validatePassword(value) : true;
  const passwordsMatch = showMatchIndicator ? value === matchValue && value !== "" : true;

  const getBorderColor = () => {
    if (showMatchIndicator && value) {
      return passwordsMatch ? 'border-green-300 focus:ring-green-600' : 'border-red-300 focus:ring-red-600';
    }
    if (showRequirements && value) {
      return isValid ? 'border-green-300 focus:ring-green-600' : 'border-red-300 focus:ring-red-600';
    }
    return 'border-stone-300 focus:ring-amber-600';
  };

  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-stone-700 mb-2">
        {label}
      </label>
      
      <div className="relative">
        <input
          id={name}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          onFocus={() => showRequirements && setShowReqs(true)}
          placeholder={placeholder}
          className={`w-full px-4 py-3 pr-12 border rounded-2xl focus:outline-none focus:ring-2 focus:border-transparent bg-white text-stone-900 placeholder-stone-500 ${getBorderColor()}`}
          required={required}
        />
        
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      {showRequirements && (
        <PasswordRequirements password={value} show={showReqs} />
      )}

      {showMatchIndicator && value && (
        <div className="flex items-center gap-2 mt-2">
          {passwordsMatch ? (
            <>
              <Check className="w-3 h-3 text-green-600" />
              <span className="text-green-600 text-xs">Passwords match</span>
            </>
          ) : (
            <>
              <X className="w-3 h-3 text-red-500" />
              <span className="text-red-500 text-xs">Passwords do not match</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PasswordInput;