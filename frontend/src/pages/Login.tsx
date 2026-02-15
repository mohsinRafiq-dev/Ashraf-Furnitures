import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import {
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Shield,
} from "lucide-react";

// Rate limiting configuration
const RATE_LIMIT_MAX_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_STORAGE_KEY = "login_attempts";

interface LoginAttempt {
  timestamp: number;
  email: string;
}

/**
 * Client-side rate limiting helper
 */
const checkRateLimit = (email: string): { allowed: boolean; remainingTime?: number } => {
  const stored = localStorage.getItem(RATE_LIMIT_STORAGE_KEY);
  const attempts: LoginAttempt[] = stored ? JSON.parse(stored) : [];
  
  // Filter out attempts older than the time window
  const now = Date.now();
  const recentAttempts = attempts.filter(
    attempt => now - attempt.timestamp < RATE_LIMIT_WINDOW_MS
  );
  
  // Count attempts for this email
  const emailAttempts = recentAttempts.filter(attempt => attempt.email === email);
  
  if (emailAttempts.length >= RATE_LIMIT_MAX_ATTEMPTS) {
    const oldestAttempt = emailAttempts[0];
    const remainingTime = RATE_LIMIT_WINDOW_MS - (now - oldestAttempt.timestamp);
    return { allowed: false, remainingTime };
  }
  
  return { allowed: true };
};

/**
 * Record a login attempt
 */
const recordLoginAttempt = (email: string) => {
  const stored = localStorage.getItem(RATE_LIMIT_STORAGE_KEY);
  const attempts: LoginAttempt[] = stored ? JSON.parse(stored) : [];
  
  // Add new attempt
  attempts.push({
    timestamp: Date.now(),
    email,
  });
  
  // Clean old attempts
  const now = Date.now();
  const recentAttempts = attempts.filter(
    attempt => now - attempt.timestamp < RATE_LIMIT_WINDOW_MS
  );
  
  localStorage.setItem(RATE_LIMIT_STORAGE_KEY, JSON.stringify(recentAttempts));
};

/**
 * Clear login attempts after successful login
 */
const clearLoginAttempts = (email: string) => {
  const stored = localStorage.getItem(RATE_LIMIT_STORAGE_KEY);
  const attempts: LoginAttempt[] = stored ? JSON.parse(stored) : [];
  
  // Remove attempts for this email
  const filteredAttempts = attempts.filter(attempt => attempt.email !== email);
  
  localStorage.setItem(RATE_LIMIT_STORAGE_KEY, JSON.stringify(filteredAttempts));
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitTime, setRateLimitTime] = useState(0);

  // Check for OAuth errors in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const oauthError = params.get('oauth_error');
    if (oauthError) {
      setError(decodeURIComponent(oauthError));
      // Clean up URL
      window.history.replaceState({}, '', '/login');
    }
  }, [location.search]);

  // Redirect if already authenticated (e.g., after Google OAuth redirect)
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/admin/dashboard";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Countdown timer for rate limiting
  useEffect(() => {
    if (!isRateLimited || rateLimitTime <= 0) return;

    const interval = setInterval(() => {
      setRateLimitTime((prev) => {
        const newTime = prev - 1000;
        if (newTime <= 0) {
          setIsRateLimited(false);
          setError("");
          return 0;
        }
        
        // Update error message with remaining time
        const minutes = Math.ceil(newTime / 60000);
        setError(
          `⚠️ Too many login attempts. Please try again in ${minutes} minute${minutes > 1 ? 's' : ''}.`
        );
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRateLimited, rateLimitTime]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      // Validate inputs
      if (!email.trim()) {
        setError("Email is required");
        setIsLoading(false);
        return;
      }

      if (!password) {
        setError("Password is required");
        setIsLoading(false);
        return;
      }

      // Check rate limiting
      const rateLimitCheck = checkRateLimit(email);
      if (!rateLimitCheck.allowed) {
        const minutes = Math.ceil((rateLimitCheck.remainingTime || 0) / 60000);
        setError(
          `⚠️ Too many login attempts. Please try again in ${minutes} minute${minutes > 1 ? 's' : ''}.`
        );
        setIsRateLimited(true);
        setRateLimitTime(rateLimitCheck.remainingTime || 0);
        setIsLoading(false);
        return;
      }

      // Record login attempt
      recordLoginAttempt(email);

      // Use authStore login (Firebase Auth)
      await login(email, password);

      // Clear login attempts on success
      clearLoginAttempts(email);
      setIsRateLimited(false);

      // Show success message
      setSuccess("✓ Login successful! Redirecting to dashboard...");

      // Redirect after short delay
      setTimeout(() => {
        const from = location.state?.from?.pathname || "/admin/dashboard";
        navigate(from, { replace: true });
      }, 1000);
    } catch (err: any) {

      let errorMessage = "Login failed. Please check your credentials.";

      if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      // Google OAuth doesn't provide email until after auth
      // But we'll use a generic identifier for rate limiting
      const googleIdentifier = "google_oauth";
      
      // Check rate limiting
      const rateLimitCheck = checkRateLimit(googleIdentifier);
      if (!rateLimitCheck.allowed) {
        const minutes = Math.ceil((rateLimitCheck.remainingTime || 0) / 60000);
        setError(
          `⚠️ Too many login attempts. Please try again in ${minutes} minute${minutes > 1 ? 's' : ''}.`
        );
        setIsRateLimited(true);
        setRateLimitTime(rateLimitCheck.remainingTime || 0);
        setIsLoading(false);
        return;
      }

      // Record attempt
      recordLoginAttempt(googleIdentifier);
      
      await useAuthStore.getState().loginWithGoogle();
      
      // Clear attempts on success
      clearLoginAttempts(googleIdentifier);
      setIsRateLimited(false);
      
      // Show success message
      setSuccess("✓ Google login successful! Redirecting to dashboard...");
      
      // Redirect will happen automatically via useEffect when isAuthenticated changes
    } catch (err: any) {
      
      let errorMessage = "Google login failed. Please try again.";
      if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        {/* Logo Section */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-4"
          >
            <span className="text-2xl">🛋️</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-white">Ashraf Furnitures</h1>
          <p className="text-gray-400 mt-2">Admin Portal Login</p>
        </div>

        {/* Login Form */}
        <motion.form
          onSubmit={handleLogin}
          className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-3 p-4 ${
                isRateLimited 
                  ? 'bg-orange-500/10 border border-orange-500/30' 
                  : 'bg-red-500/10 border border-red-500/30'
              } rounded-lg`}
            >
              {isRateLimited ? (
                <Shield className="w-5 h-5 text-orange-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              )}
              <p className={`${isRateLimited ? 'text-orange-400' : 'text-red-400'} text-sm`}>
                {error}
              </p>
            </motion.div>
          )}

          {/* Success Alert */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg"
            >
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <p className="text-green-400 text-sm">{success}</p>
            </motion.div>
          )}

          {/* Google Login Button */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading || isRateLimited}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {isRateLimited ? "Login Temporarily Blocked" : "Sign in with Google"}
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800/50 text-gray-400">Or</span>
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || isRateLimited}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="admin@furniture-mart.com"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || isRateLimited}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg pl-10 pr-10 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-300 transition-colors"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
              className="w-4 h-4 rounded border-gray-700 bg-gray-900/50 text-amber-500 cursor-pointer disabled:opacity-50"
            />
            <span className="text-sm text-gray-300">
              Remember me for 24 hours
            </span>
          </label>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: (isLoading || isRateLimited) ? 1 : 1.02 }}
            whileTap={{ scale: (isLoading || isRateLimited) ? 1 : 0.98 }}
            disabled={isLoading || isRateLimited}
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-amber-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
                Signing in...
              </span>
            ) : isRateLimited ? (
              <span className="flex items-center justify-center gap-2">
                <Shield className="w-4 h-4" />
                Login Temporarily Blocked
              </span>
            ) : (
              "Sign In to Admin Portal"
            )}
          </motion.button>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500">
            This is a secured admin portal. Unauthorized access is prohibited.
          </p>
        </motion.form>
      </motion.div>

      {/* Background Decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default Login;
