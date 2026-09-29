import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  getCurrentUser, 
  signIn as amplifySignIn, 
  signUp as amplifySignUp, 
  signOut as amplifySignOut,
  confirmSignUp as amplifyConfirmSignUp,
  resetPassword as amplifyResetPassword,
  confirmResetPassword as amplifyConfirmResetPassword,
  fetchUserAttributes,
  AuthUser
} from 'aws-amplify/auth';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  confirmSignUp: (email: string, code: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  confirmResetPassword: (email: string, code: string, newPassword: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Convert Amplify user to our User type
  const convertAmplifyUser = async (amplifyUser: AuthUser): Promise<User> => {
    try {
      const attributes = await fetchUserAttributes();
      
      // Check if user is admin (Okan University students)
      const isAdmin = attributes.email?.endsWith('@stu.okan.edu.tr') || false;
      
      return {
        id: amplifyUser.userId,
        email: attributes.email || '',
        name: attributes.name || attributes.email?.split('@')[0] || 'User',
        role: isAdmin ? 'admin' : 'user',
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error fetching user attributes:', error);
      return {
        id: amplifyUser.userId,
        email: 'unknown@example.com',
        name: 'User',
        role: 'user',
        createdAt: new Date().toISOString(),
      };
    }
  };

  // Check current authentication status
  const checkAuthState = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const amplifyUser = await getCurrentUser();
      const user = await convertAmplifyUser(amplifyUser);
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  // Sign in
  const signIn = async (email: string, password: string) => {
    try {
      const { isSignedIn } = await amplifySignIn({
        username: email,
        password,
      });

      if (isSignedIn) {
        await checkAuthState();
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(error.message || 'Failed to sign in');
    }
  };

  // Sign up
  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { isSignUpComplete } = await amplifySignUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            name,
          },
        },
      });

      if (!isSignUpComplete) {
        // User needs to confirm their email
        throw new Error('CONFIRMATION_REQUIRED');
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      if (error.message === 'CONFIRMATION_REQUIRED') {
        throw error;
      }
      throw new Error(error.message || 'Failed to sign up');
    }
  };

  // Confirm sign up
  const confirmSignUp = async (email: string, code: string) => {
    try {
      const { isSignUpComplete } = await amplifyConfirmSignUp({
        username: email,
        confirmationCode: code,
      });

      if (!isSignUpComplete) {
        throw new Error('Failed to confirm sign up');
      }
    } catch (error: any) {
      console.error('Confirm sign up error:', error);
      throw new Error(error.message || 'Failed to confirm sign up');
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await amplifySignOut();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error(error.message || 'Failed to sign out');
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      await amplifyResetPassword({ username: email });
    } catch (error: any) {
      console.error('Reset password error:', error);
      throw new Error(error.message || 'Failed to reset password');
    }
  };

  // Confirm reset password
  const confirmResetPassword = async (email: string, code: string, newPassword: string) => {
    try {
      await amplifyConfirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword,
      });
    } catch (error: any) {
      console.error('Confirm reset password error:', error);
      throw new Error(error.message || 'Failed to confirm reset password');
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    await checkAuthState();
  };

  // Check auth state on mount
  useEffect(() => {
    checkAuthState();
  }, []);

  const value: AuthContextType = {
    ...authState,
    signIn,
    signUp,
    signOut,
    confirmSignUp,
    resetPassword,
    confirmResetPassword,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;