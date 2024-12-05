"use client";
 
import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"; // Import Firebase Auth
import { useState } from "react";
import { useRouter } from "next/navigation";
 
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
 
// Function to add data to Firestore
async function addDataToFireStore(email, password) {
  try {
    const q = query(collection(db, "messages"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
 
    if (!querySnapshot.empty) {
      console.error("Email already exists");
      return { success: false, error: "Email already registered. Please use a different email." };
    }
 
    const encryptedPassword = caesarCipherEncrypt(password, 3);
    const docRef = await addDoc(collection(db, "messages"), {
      email: email,
      password: encryptedPassword,
    });
    console.log("Document written with ID: ", docRef.id);
    return { success: true };
  } catch (error) {
    console.error("Error adding document: ", error);
    return { success: false, error: "Failed to register. Please try again." };
  }
}
 
export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    if (!email || !password || !confirmPassword) {
      setError("Please fill out all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
 
    setError(""); // Clear previous errors
 
    const result = await addDataToFireStore(email, password);
 
    if (result.success) {
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setSuccess(true);
      alert("Registration Successful!");
 
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } else {
      setError(result.error);
    }
  };
 
  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
 
      // Check if user already exists in Firestore
      const q = query(collection(db, "messages"), where("email", "==", user.email));
      const querySnapshot = await getDocs(q);
 
      if (querySnapshot.empty) {
        // Add the Google user to Firestore with a placeholder password
        await addDoc(collection(db, "messages"), {
          email: user.email,
          password: caesarCipherEncrypt("google_default_password", 3), // Placeholder encrypted password
        });
      }
 
      alert("Google Sign-Up Successful!");
      router.push("/");
    } catch (error) {
      console.error("Error during Google Sign-Up:", error);
      setError("Failed to sign up with Google. Please try again.");
    }
  };
 
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Register</h2>
        <form onSubmit={handleSubmit} className="mt-6">
          {error && (
            <div className="mb-4 text-red-600 text-sm text-center">{error}</div>
          )}
          {success && (
            <div className="mb-4 text-green-600 text-sm text-center">
              Registration successful! Redirecting to login...
            </div>
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
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Register
          </button>
        </form>
 
        {/* Google Sign Up Button */}
        <div className="mt-4 text-center">
          <button
            onClick={handleGoogleSignUp}
            className="w-full py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            aria-label="Sign up with Google"
          >
            Sign up with Google
          </button>
        </div>
 
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}