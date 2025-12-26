import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiClient } from '@/services/api';

type UserRole = 'customer' | 'agency' | 'admin';

interface User {
  id: string;
  email: string;
  role: UserRole;
  canListVehicles?: boolean;
}

interface Profile {
  fullName: string | null;
  email: string | null;
  phone: string | null;
  avatarUrl: string | null;
  avatarLocked?: boolean;
}

interface KYCVerification {
  id: string;
  userId: string;
  aadhaarNumber: string | null;
  aadhaarVerified: boolean;
  drivingLicenseNumber: string | null;
  dlVerified: boolean;
  dlExpiryDate: string | null;
  verificationStatus: 'pending' | 'verified' | 'rejected';
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  userRole: UserRole | null;
  kycStatus: KYCVerification | null;
  isLoading: boolean;
  signUp: (email: string, password: string, fullName: string, phone: string, role?: UserRole) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  activateAccount: (email: string, otp: string) => Promise<{ error: any }>;
  resendOTP: (email: string) => Promise<{ error: any }>;
  refreshProfile: () => Promise<void>;
  refreshKYC: () => Promise<void>;
  isKYCVerified: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [kycStatus, setKycStatus] = useState<KYCVerification | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const response = await apiClient.getCurrentUser();
      if (response.user) {
        setUser(response.user);
        setProfile(response.user.profile || null);
        setUserRole(response.user.role);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchKYC = async () => {
    try {
      const response = await apiClient.getKYCStatus();
      if (response.kyc) {
        setKycStatus(response.kyc);
      }
    } catch (error) {
      console.error('Error fetching KYC:', error);
    }
  };

  const refreshProfile = async () => {
    await fetchCurrentUser();
  };

  const refreshKYC = async () => {
    await fetchKYC();
  };

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('access_token');
    if (token) {
      apiClient.setToken(token);
      fetchCurrentUser()
        .then(() => fetchKYC())
        .catch((err) => console.error('Error loading auth:', err))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const signUp = async (email: string, password: string, fullName: string, phone: string, role: UserRole = 'customer') => {
    try {
      await apiClient.register(email, password, fullName, phone, role);
      // Account remains inactive until OTP verification, so we do not set user state yet
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await apiClient.login(email, password);
      if (response.user) {
        setUser(response.user);
        setUserRole(response.user.role);
        await fetchCurrentUser();
        await fetchKYC();
      }
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
    setUser(null);
    setProfile(null);
    setUserRole(null);
    setKycStatus(null);
  };

  const activateAccount = async (email: string, otp: string) => {
    try {
      const response = await apiClient.activateAccount(email, otp);
      if (response.user) {
        setUser(response.user);
        return { error: null };
      }
      return { error: response.error || 'Failed to activate account' };
    } catch (error) {
      return { error };
    }
  };

  const resendOTP = async (email: string) => {
    try {
      const response = await apiClient.resendOTP(email);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const isKYCVerified = kycStatus?.verificationStatus === 'verified' && 
                        kycStatus?.aadhaarVerified === true && 
                        kycStatus?.dlVerified === true;

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      userRole,
      kycStatus,
      isLoading,
      signUp,
      signIn,
      signOut,
      activateAccount,
      resendOTP,
      refreshProfile,
      refreshKYC,
      isKYCVerified,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
