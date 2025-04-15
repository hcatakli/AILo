import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState, LoginCredentials, RegisterCredentials, User } from '@/types/auth';

// Mock user data for demo purposes
const MOCK_USERS = [
  {
    id: '1',
    email: 'demo@example.com',
    password: 'password123',
    name: 'Demo User',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  }
];

interface AuthStore extends AuthState {
  isInitialized: boolean;
  initializeAuth: () => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (user: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isInitialized: false,

      initializeAuth: async () => {
        // This function ensures auth state is loaded from storage before app renders
        // We're using the persist middleware, so this is mostly just setting isInitialized
        // In a real app, you might validate tokens, refresh sessions, etc.
        try {
          await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
          set({ isInitialized: true });
        } catch (error) {
          console.error("Error initializing auth:", error);
          // Still mark as initialized to prevent app from hanging
          set({ isInitialized: true });
        }
      },

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Find user in mock data
          const user = MOCK_USERS.find(u => u.email === credentials.email);
          
          if (!user || user.password !== credentials.password) {
            throw new Error("Invalid email or password");
          }
          
          const { password, ...userWithoutPassword } = user;
          
          set({
            user: userWithoutPassword as User,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false,
          });
        }
      },
      
      register: async (credentials: RegisterCredentials) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if user already exists
          if (MOCK_USERS.some(u => u.email === credentials.email)) {
            throw new Error("Email already in use");
          }
          
          // Create new user
          const newUser = {
            id: String(MOCK_USERS.length + 1),
            email: credentials.email,
            password: credentials.password,
            name: credentials.name,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
          };
          
          MOCK_USERS.push(newUser);
          
          const { password, ...userWithoutPassword } = newUser;
          
          set({
            user: userWithoutPassword as User,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false,
          });
        }
      },
      
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },
      
      resetPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if user exists
          const user = MOCK_USERS.find(u => u.email === email);
          
          if (!user) {
            throw new Error("No account found with this email");
          }
          
          // In a real app, this would send a reset email
          set({ isLoading: false });
          
          return Promise.resolve();
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false,
          });
        }
      },
      
      updateProfile: async (userData: Partial<User>) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const currentUser = get().user;
          
          if (!currentUser) {
            throw new Error("Not authenticated");
          }
          
          const updatedUser = { ...currentUser, ...userData };
          
          set({
            user: updatedUser,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);