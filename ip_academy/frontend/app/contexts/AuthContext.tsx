"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { canisterId, createActor } from '../utils/dfx_generated/hello_world';
import { showErrorToast, showInfoToast, showSuccessToast } from '../utils/toast';

interface AuthContextType {
  authClient: AuthClient | null;
  identity: any;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isRegistered: boolean;
  checkRegistration: () => Promise<void>;
  registerStudent: (name: string, email: string, skills: string[]) => Promise<boolean>;
  userRole: 'student' | 'instructor' | null;
  setUserRole: (role: 'student' | 'instructor') => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [identity, setIdentity] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userRole, setUserRole] = useState<'student' | 'instructor' | null>(null);
  
  // function to check registration status
  const checkRegistration = async () => {
    if (!authClient || !(await authClient.isAuthenticated())) return;
    
    const actor = createActor(canisterId, {
      agentOptions: { identity }
    });
    try {
      // Check instructor status 
      const createdCourses = await actor.getCoursesCreatedByUser();
      if (createdCourses.length > 0) {
        setUserRole('instructor');
        setIsRegistered(true);
        return;
      }
      
      //  check student registration
      const enrolledCourses = await actor.getCoursesEnrolledByUser();
      if (enrolledCourses.length > 0) {
        setUserRole('student');
        setIsRegistered(true);
        return;
      }
      
      // If neither, clear status
      setUserRole(null);
      setIsRegistered(false);
    } catch (error) {
      console.error("Registration check failed:", error);
      setUserRole(null);
      setIsRegistered(false);
    }
  };

  // Add registration function
  const registerStudent = async (name: string, email: string, skills: string[]) => {
    if (!authClient) return false;

    try {
      const actor = createActor(canisterId, {
        agentOptions: { identity }
      });
      await actor.registerStudent(name, email, skills);
      setIsRegistered(true);
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    }
  };

  // Initialize AuthClient and check auth state
  useEffect(() => {
    const initAuth = async () => {
      const client = await AuthClient.create();
      setAuthClient(client);
      const isAuth = await client.isAuthenticated();
      setIsAuthenticated(isAuth);
      if (isAuth) setIdentity(client.getIdentity()); // Set identity if already authenticated
    };
    initAuth();
  }, []);

  const login = async () => {
    if (!authClient) return;
    await authClient.login({
      identityProvider: process.env.NEXT_PUBLIC_IDENITY_PROVIDER || "https://identity.ic0.app",
      onSuccess: async () => {
        showSuccessToast('Logged in successfully');
        const isAuth = await authClient.isAuthenticated();
        setIsAuthenticated(isAuth);
        setIdentity(authClient.getIdentity()); // Update identity after login
        await checkRegistration(); // Check immediately after login
      },
      onError : (e)=>{
        showErrorToast('Login failed');
        console.log(e)
      }
    });
  };

  const logout = async () => {
    if (!authClient) return;
    await authClient.logout();
    showInfoToast('Logged out successfully');
    setIsAuthenticated(false);
    setIdentity(null);
  };

  return (
    <AuthContext.Provider value={{
      authClient, identity, isAuthenticated,
      login, logout, checkRegistration, registerStudent,
       isRegistered,userRole,setUserRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};