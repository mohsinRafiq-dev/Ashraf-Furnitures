import React, { useState } from "react";
import { auth, db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";

const DebugAuth: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleDebug = async () => {
    setLoading(true);
    setDebugInfo(null);

    try {
      // Step 1: Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Step 2: Try to get admin document
      const adminDocRef = doc(db, 'admins', user.uid);
      const adminSnap = await getDoc(adminDocRef);

      // Prepare debug info
      const info = {
        authSuccess: true,
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        adminDocExists: adminSnap.exists(),
        adminDocData: adminSnap.exists() ? adminSnap.data() : null,
        collectionPath: `admins/${user.uid}`,
        troubleshooting: [] as Array<{ issue: string; solution: string; action: string }>
      };

      // Add troubleshooting tips
      if (!adminSnap.exists()) {
        info.troubleshooting.push({
          issue: "❌ Admin document NOT FOUND in Firestore",
          solution: `Create a document at: admins/${user.uid}`,
          action: "Go to Firestore Console → admins collection → Add document with ID: " + user.uid
        });
      } else {
        const data = adminSnap.data();
        
        if (!data.isActive) {
          info.troubleshooting.push({
            issue: "❌ isActive is false",
            solution: "Set isActive to true in Firestore",
            action: "Edit the document and change isActive: true"
          });
        }
        
        if (data.role !== 'admin' && data.role !== 'editor') {
          info.troubleshooting.push({
            issue: `❌ Invalid role: "${data.role}"`,
            solution: 'Set role to "admin" or "editor"',
            action: 'Edit the document and set role: "admin"'
          });
        }

        if (info.troubleshooting.length === 0) {
          info.troubleshooting.push({
            issue: "✅ Everything looks correct!",
            solution: "Try logging in again",
            action: "Go to /login and use these credentials"
          });
        }
      }

      setDebugInfo(info);
    } catch (error: any) {
      setDebugInfo({
        authSuccess: false,
        error: error.message,
        errorCode: error.code,
        troubleshooting: [{
          issue: "❌ Authentication failed",
          solution: error.message,
          action: "Check your email and password in Firebase Console → Authentication"
        }]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔍 Admin Auth Debugger
          </h1>
          <p className="text-gray-600 mb-8">
            Test your admin credentials and see exactly what's configured
          </p>

          {/* Input Form */}
          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@furnituremart.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              onClick={handleDebug}
              disabled={loading || !email || !password}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Checking..." : "🔍 Debug Authentication"}
            </button>
          </div>

          {/* Debug Results */}
          {debugInfo && (
            <div className="space-y-6">
              {/* Auth Status */}
              <div className={`p-4 rounded-lg border-2 ${debugInfo.authSuccess ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <h3 className="font-bold text-lg mb-2">
                  {debugInfo.authSuccess ? '✅ Authentication Success' : '❌ Authentication Failed'}
                </h3>
                {debugInfo.authSuccess && (
                  <div className="space-y-2 text-sm">
                    <p><span className="font-semibold">UID:</span> <code className="bg-white px-2 py-1 rounded border">{debugInfo.uid}</code></p>
                    <p><span className="font-semibold">Email:</span> {debugInfo.email}</p>
                    <p><span className="font-semibold">Email Verified:</span> {debugInfo.emailVerified ? '✅' : '❌'}</p>
                  </div>
                )}
                {!debugInfo.authSuccess && (
                  <div className="text-sm">
                    <p className="text-red-700"><span className="font-semibold">Error:</span> {debugInfo.error}</p>
                    <p className="text-red-600 text-xs mt-1">{debugInfo.errorCode}</p>
                  </div>
                )}
              </div>

              {/* Firestore Status */}
              {debugInfo.authSuccess && (
                <div className={`p-4 rounded-lg border-2 ${debugInfo.adminDocExists ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <h3 className="font-bold text-lg mb-2">
                    {debugInfo.adminDocExists ? '✅ Admin Document Found' : '❌ Admin Document Missing'}
                  </h3>
                  <p className="text-sm mb-3">
                    <span className="font-semibold">Looking at:</span> <code className="bg-white px-2 py-1 rounded border">{debugInfo.collectionPath}</code>
                  </p>
                  
                  {debugInfo.adminDocData && (
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-semibold mb-3">Document Data:</h4>
                      <pre className="text-xs bg-gray-50 p-3 rounded border overflow-x-auto">
{JSON.stringify(debugInfo.adminDocData, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* Troubleshooting */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <h3 className="font-bold text-lg mb-3">📋 Troubleshooting Steps</h3>
                <div className="space-y-4">
                  {debugInfo.troubleshooting.map((item: any, index: number) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-blue-200">
                      <p className="font-semibold text-gray-900 mb-1">{item.issue}</p>
                      <p className="text-sm text-gray-700 mb-2">{item.solution}</p>
                      <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded border border-blue-100">
                        💡 {item.action}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Fix Guide */}
              {debugInfo.authSuccess && !debugInfo.adminDocExists && (
                <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
                  <h3 className="font-bold text-lg mb-3">🚀 Quick Fix</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>Go to Firebase Console → <strong>Firestore Database</strong></li>
                    <li>Click <strong>"Start collection"</strong> or select existing <strong>"admins"</strong> collection</li>
                    <li>Add document with ID: <code className="bg-white px-2 py-1 rounded border font-mono">{debugInfo.uid}</code></li>
                    <li>Add these fields:
                      <pre className="bg-white p-3 rounded border mt-2 text-xs overflow-x-auto">
{`email: "${debugInfo.email}"
name: "Admin User"
role: "admin"
isActive: true
loginAttempts: 0
isLocked: false
createdAt: [timestamp]
updatedAt: [timestamp]`}
                      </pre>
                    </li>
                    <li>Click <strong>Save</strong></li>
                    <li>Try logging in at <a href="/login" className="text-blue-600 underline">/login</a></li>
                  </ol>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebugAuth;
