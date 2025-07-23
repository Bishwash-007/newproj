import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { storeToken, getToken, removeToken, hasToken } from "../lib/token";

type User = {
  _id: string;
  fullName: string;
  email: string;
  avatar?: string;
  phoneNumber?: string;
  otp?: string;
};

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  otp?: string;

  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setFullName: (fullName: string) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  setOtp: (otp: string) => void;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
  register: (
    fullName: string,
    email: string,
    password: string,
    phoneNumber: string
  ) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  resetError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,

  email: "",
  password: "",
  fullName: "",
  phoneNumber: "",
  otp: "",

  setFullName: (fullName) => set({ fullName }),
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
  setOtp: (otp) => set({ otp }),

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      const { token, user } = res.data;
      await storeToken(token);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || "Login failed",
        isLoading: false,
      });
    }
  },

  register: async (fullName, email, password, phoneNumber) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.post("/auth/register", {
        name: fullName,
        email: email,
        password: password,
        phoneNumber: phoneNumber,
      });
      set({ isLoading: false });
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || "Registration failed",
        isLoading: false,
      });
    }
  },

  verifyOtp: async (email, otp) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.post("/auth/verify-otp", { email, otp });
      const { token, user } = res.data;

      await storeToken(token);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || "OTP Verification failed",
        isLoading: false,
      });
    }
  },

  logout: async () => {
    await removeToken();
    set({
      user: null,
      isAuthenticated: false,
      error: null,
      email: "",
      password: "",
      fullName: "",
      phoneNumber: "",
      otp: "",
    });
  },

  fetchCurrentUser: async () => {
    set({ isLoading: true });
    try {
      if (!(await hasToken())) {
        set({ isAuthenticated: false, isLoading: false });
        return;
      }
      const res = await axiosInstance.get("/auth/me");
      set({ user: res.data, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      await removeToken();
      set({
        user: null,
        isAuthenticated: false,
        error: err?.response?.data?.message || "Unable to fetch user",
        isLoading: false,
      });
    }
  },

  resetError: () => set({ error: null }),
}));
