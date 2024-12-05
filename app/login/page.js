"use client";
 
import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"; // Firebase Auth
 
// Function to encrypt the password using Caesar cipher
function caesarCipherEncrypt(text, shift) {
  return text
    .split("")
    .map((char) => {
      if (char.match(/[a-z]/i)) {
        const code = char.charCodeAt(0);
        const base = code >= 65 && code <= 90 ? 65 : 97; // Check if uppercase or lowercase
        return String.fromCharCode(((code - base + shift) % 26) + base);
      }
      return char; // Keep non-alphabetic characters unchanged
    })
    .join("");
}
 
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter(); // Initialize useRouter hook
  const auth = getAuth(); // Initialize Firebase Auth
  const provider = new GoogleAuthProvider(); // Google Auth Provider
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    if (!email || !password) {
      setError("Please fill out both fields.");
      return;
    }
 
    try {
      const q = query(collection(db, "messages"), where("email", "==", email));
      const querySnapshot = await getDocs(q);
 
      if (querySnapshot.empty) {
        setError("Invalid email or password.");
        return;
      }
 
      const userDoc = querySnapshot.docs[0];
      const storedPassword = userDoc.data().password;
 
      const encryptedInputPassword = caesarCipherEncrypt(password, 3);
 
      if (encryptedInputPassword === storedPassword) {
        localStorage.setItem("isLoggedIn", "true");
        alert("Login successful!");
        router.push("/");
      } else {
        setError("Invalid email or password.");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("An error occurred. Please try again later.");
    }
  };
 
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
 
      // Check if the user exists in Firestore
      const q = query(collection(db, "messages"), where("email", "==", user.email));
      const querySnapshot = await getDocs(q);
 
      if (querySnapshot.empty) {
        setError("No account found for this Google account. Please register first.");
        return;
      }
 
      // Successful login
      localStorage.setItem("isLoggedIn", "true");
      alert("Google Sign-In successful!");
      router.push("/");
    } catch (err) {
      console.error("Error during Google Sign-In:", err);
      setError("Failed to sign in with Google. Please try again.");
    }
  };
 
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
        <form onSubmit={handleSubmit} className="mt-6">
          {error && (
            <div className="mb-4 text-red-600 text-sm text-center">{error}</div>
          )}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Login
          </button>
        </form>
 
        {/* Google Sign In Button */}
        <div className="mt-4 text-center">
          <button
            onClick={handleGoogleSignIn}
            className="w-full py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            aria-label="Sign in with Google"
          >
            Sign in with Google
          </button>
        </div>
 
        <p className="mt-4 text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}