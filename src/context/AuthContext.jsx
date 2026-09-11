import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import axios from 'axios';


// ============================================================
// API URL
// ============================================================
//
// Local development:
// VITE_API_URL=http://localhost:5000/api
//
// Production:
// VITE_API_URL=https://apexmachinery.onrender.com/api
//
// Production fallback intentionally points to Render so that
// mobile phones and live-site users never call localhost.
// ============================================================

const API_URL = (
  import.meta.env.VITE_API_URL ||
  'https://apexmachinery.onrender.com/api'
).replace(/\/+$/, '');


// ============================================================
// AXIOS CLIENT
// ============================================================

export const api = axios.create({
  baseURL: API_URL,

  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },

  timeout: 30000,
});


// ============================================================
// AUTH CONTEXT
// ============================================================

const AuthContext =
  createContext(null);


// ============================================================
// LOCAL STORAGE KEYS
// ============================================================

const USER_STORAGE_KEY =
  'apex_auth_user';

const TOKEN_STORAGE_KEY =
  'apex_access_token';


// ============================================================
// ROLE HELPERS
// ============================================================

function normalizeRole(role) {
  return String(role || '')
    .trim()
    .toLowerCase();
}


function isAdminRole(role) {
  const normalized =
    normalizeRole(role);

  return (
    normalized === 'admin' ||
    normalized === 'administrator'
  );
}


function isCustomerRole(role) {
  return (
    normalizeRole(role) === 'customer'
  );
}


// ============================================================
// LOAD STORED USER
// ============================================================

function loadStoredUser() {
  try {
    const stored =
      localStorage.getItem(
        USER_STORAGE_KEY
      );

    if (!stored) {
      return null;
    }

    const parsed =
      JSON.parse(stored);

    return {
      ...parsed,

      role:
        normalizeRole(
          parsed?.role
        ),
    };
  } catch (error) {
    console.error(
      '[Apex Auth] Invalid stored user:',
      error
    );

    localStorage.removeItem(
      USER_STORAGE_KEY
    );

    return null;
  }
}


// ============================================================
// LOAD TOKEN
// ============================================================

function loadStoredToken() {
  try {
    return localStorage.getItem(
      TOKEN_STORAGE_KEY
    );
  } catch {
    return null;
  }
}


// ============================================================
// SAVE TOKEN
// ============================================================

function saveStoredToken(token) {
  if (!token) {
    return;
  }

  localStorage.setItem(
    TOKEN_STORAGE_KEY,
    token
  );
}


// ============================================================
// REMOVE AUTH DATA
// ============================================================

function removeStoredAuthentication() {
  localStorage.removeItem(
    USER_STORAGE_KEY
  );

  localStorage.removeItem(
    TOKEN_STORAGE_KEY
  );
}


// ============================================================
// AUTH PROVIDER
// ============================================================

export function AuthProvider({
  children,
}) {
  // ==========================================================
  // STATE
  // ==========================================================

  const [user, setUser] =
    useState(
      loadStoredUser
    );

  const [token, setToken] =
    useState(
      loadStoredToken
    );

  const [loading, setLoading] =
    useState(true);


  // ==========================================================
  // SAVE AUTHENTICATION
  // ==========================================================

  function saveAuthentication(
    authenticatedUser,
    accessToken
  ) {
    if (!authenticatedUser) {
      return;
    }

    const normalizedRole =
      normalizeRole(
        authenticatedUser.role
      );

    if (
      !isCustomerRole(normalizedRole) &&
      !isAdminRole(normalizedRole)
    ) {
      throw new Error(
        `Invalid account role "${normalizedRole || 'unknown'}".`
      );
    }

    const normalizedUser = {
      ...authenticatedUser,

      role:
        normalizedRole,
    };

    setUser(
      normalizedUser
    );

    localStorage.setItem(
      USER_STORAGE_KEY,
      JSON.stringify(
        normalizedUser
      )
    );

    if (accessToken) {
      setToken(
        accessToken
      );

      saveStoredToken(
        accessToken
      );
    }

    return normalizedUser;
  }


  // ==========================================================
  // CLEAR AUTHENTICATION
  // ==========================================================

  function clearAuthentication() {
    setUser(null);

    setToken(null);

    removeStoredAuthentication();
  }


  // ==========================================================
  // REQUEST INTERCEPTOR
  // ==========================================================

  useEffect(() => {
    const interceptor =
      api.interceptors.request.use(
        (config) => {
          const currentToken =
            loadStoredToken();

          if (currentToken) {
            config.headers =
              config.headers || {};

            config.headers.Authorization =
              `Bearer ${currentToken}`;
          }

          return config;
        },

        (error) =>
          Promise.reject(error)
      );

    return () => {
      api.interceptors.request.eject(
        interceptor
      );
    };
  }, []);


  // ==========================================================
  // RESPONSE INTERCEPTOR
  // ==========================================================

  useEffect(() => {
    const interceptor =
      api.interceptors.response.use(
        (response) =>
          response,

        (error) => {
          if (
            error.response?.status === 401
          ) {
            clearAuthentication();
          }

          return Promise.reject(
            error
          );
        }
      );

    return () => {
      api.interceptors.response.eject(
        interceptor
      );
    };
  }, []);


  // ==========================================================
  // RESTORE SESSION
  // ==========================================================

  useEffect(() => {
    let mounted =
      true;

    async function restoreSession() {
      const currentToken =
        loadStoredToken();

      if (!currentToken) {
        if (mounted) {
          setUser(null);

          setToken(null);

          setLoading(false);
        }

        return;
      }

      try {
        const response =
          await api.get(
            '/auth/me'
          );

        if (
          !response.data?.success ||
          !response.data?.user
        ) {
          throw new Error(
            'Unable to restore authentication session.'
          );
        }

        const restoredUser = {
          ...response.data.user,

          role:
            normalizeRole(
              response.data.user.role
            ),
        };

        if (
          !isCustomerRole(
            restoredUser.role
          ) &&
          !isAdminRole(
            restoredUser.role
          )
        ) {
          throw new Error(
            'This account does not have a valid access role.'
          );
        }

        if (mounted) {
          setUser(
            restoredUser
          );

          setToken(
            currentToken
          );

          localStorage.setItem(
            USER_STORAGE_KEY,
            JSON.stringify(
              restoredUser
            )
          );
        }
      } catch (error) {
        console.error(
          '[Apex Auth] Session restoration failed:',
          error
        );

        if (mounted) {
          clearAuthentication();
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      mounted = false;
    };
  }, []);


  // ==========================================================
  // LOGIN
  // ==========================================================

  async function login({
    email,
    password,
  }) {
    setLoading(true);

    try {
      const cleanEmail =
        String(email || '')
          .trim()
          .toLowerCase();

      const cleanPassword =
        String(password || '');

      if (!cleanEmail) {
        throw new Error(
          'Please enter your email address.'
        );
      }

      if (!cleanPassword) {
        throw new Error(
          'Please enter your password.'
        );
      }

      const response =
        await api.post(
          '/auth/login',
          {
            email:
              cleanEmail,

            password:
              cleanPassword,
          }
        );

      if (
        !response.data?.success
      ) {
        throw new Error(
          response.data?.message ||
          'Login failed.'
        );
      }

      const authenticatedUser =
        response.data?.user;

      const accessToken =
        response.data?.session
          ?.accessToken ||
        response.data?.accessToken;

      if (!authenticatedUser) {
        throw new Error(
          'The server did not return user information.'
        );
      }

      if (!accessToken) {
        throw new Error(
          'The server did not return an authentication token.'
        );
      }

      const normalizedRole =
        normalizeRole(
          authenticatedUser.role
        );

      if (
        !isCustomerRole(
          normalizedRole
        ) &&
        !isAdminRole(
          normalizedRole
        )
      ) {
        throw new Error(
          `Account role "${normalizedRole || 'unknown'}" is not authorized.`
        );
      }

      const normalizedUser = {
        ...authenticatedUser,

        role:
          normalizedRole,
      };

      saveAuthentication(
        normalizedUser,
        accessToken
      );

      return normalizedUser;
    } catch (error) {
      console.error(
        '[Apex Auth] Login failed:',
        error
      );

      const message =
        error.response?.data?.message ||
        error.message ||
        'Unable to sign in.';

      throw new Error(
        message
      );
    } finally {
      setLoading(false);
    }
  }


  // ==========================================================
  // REGISTER
  // ==========================================================

  async function register({
    name,
    company,
    email,
    password,
  }) {
    setLoading(true);

    try {
      const cleanName =
        String(name || '')
          .trim();

      const cleanCompany =
        String(company || '')
          .trim();

      const cleanEmail =
        String(email || '')
          .trim()
          .toLowerCase();

      const cleanPassword =
        String(password || '');

      if (!cleanName) {
        throw new Error(
          'Please enter your full name.'
        );
      }

      if (
        cleanName.length < 2
      ) {
        throw new Error(
          'Your name must contain at least 2 characters.'
        );
      }

      if (!cleanCompany) {
        throw new Error(
          'Please enter your company name.'
        );
      }

      if (
        cleanCompany.length < 2
      ) {
        throw new Error(
          'Please enter a valid company name.'
        );
      }

      if (!cleanEmail) {
        throw new Error(
          'Please enter your email address.'
        );
      }

      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailPattern.test(
          cleanEmail
        )
      ) {
        throw new Error(
          'Please enter a valid email address.'
        );
      }

      if (!cleanPassword) {
        throw new Error(
          'Please create a password.'
        );
      }

      if (
        cleanPassword.length < 6
      ) {
        throw new Error(
          'Password must contain at least 6 characters.'
        );
      }

      const payload = {
        name:
          cleanName,

        company:
          cleanCompany,

        email:
          cleanEmail,

        password:
          cleanPassword,
      };

      const response =
        await api.post(
          '/auth/register',
          payload
        );

      if (
        !response.data?.success
      ) {
        throw new Error(
          response.data?.message ||
          'Unable to create account.'
        );
      }

      const authenticatedUser =
        response.data?.user;

      const accessToken =
        response.data?.session
          ?.accessToken ||
        response.data?.accessToken;

      if (!authenticatedUser) {
        throw new Error(
          'The server did not return the new customer.'
        );
      }

      const normalizedRole =
        normalizeRole(
          authenticatedUser.role
        );

      if (
        normalizedRole !==
        'customer'
      ) {
        clearAuthentication();

        throw new Error(
          'Public registration can only create customer accounts.'
        );
      }

      const normalizedUser = {
        ...authenticatedUser,

        role:
          'customer',
      };

      if (accessToken) {
        saveAuthentication(
          normalizedUser,
          accessToken
        );
      } else {
        setUser(null);

        setToken(null);

        removeStoredAuthentication();
      }

      return normalizedUser;
    } catch (error) {
      console.error(
        '[Apex Auth] Registration failed:',
        error
      );

      const message =
        error.response?.data?.message ||
        error.message ||
        'Unable to create account.';

      throw new Error(
        message
      );
    } finally {
      setLoading(false);
    }
  }


  // ==========================================================
  // LOGOUT
  // ==========================================================

  async function logout() {
    try {
      const currentToken =
        loadStoredToken();

      if (currentToken) {
        await api.post(
          '/auth/logout'
        );
      }
    } catch (error) {
      console.error(
        '[Apex Auth] Backend logout failed:',
        error
      );
    } finally {
      clearAuthentication();
    }
  }


  // ==========================================================
  // REFRESH CURRENT USER
  // ==========================================================

  async function refreshUser() {
    try {
      const currentToken =
        loadStoredToken();

      if (!currentToken) {
        clearAuthentication();

        return null;
      }

      const response =
        await api.get(
          '/auth/me'
        );

      if (
        !response.data?.success ||
        !response.data?.user
      ) {
        clearAuthentication();

        return null;
      }

      const currentUser = {
        ...response.data.user,

        role:
          normalizeRole(
            response.data.user.role
          ),
      };

      if (
        !isCustomerRole(
          currentUser.role
        ) &&
        !isAdminRole(
          currentUser.role
        )
      ) {
        clearAuthentication();

        throw new Error(
          'This account does not have a valid access role.'
        );
      }

      setUser(
        currentUser
      );

      localStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify(
          currentUser
        )
      );

      return currentUser;
    } catch (error) {
      console.error(
        '[Apex Auth] Failed to refresh user:',
        error
      );

      clearAuthentication();

      return null;
    }
  }


  // ==========================================================
  // AUTH STATE
  // ==========================================================

  const isAuthenticated =
    Boolean(
      user &&
      token
    );


  // ==========================================================
  // CURRENT ROLE
  // ==========================================================

  const currentRole =
    normalizeRole(
      user?.role
    );

  const isAdmin =
    isAdminRole(
      currentRole
    );

  const isCustomer =
    isCustomerRole(
      currentRole
    );


  // ==========================================================
  // CONTEXT VALUE
  // ==========================================================

  const value = {
    user,

    token,

    loading,

    login,

    register,

    logout,

    refreshUser,

    isAuthenticated,

    isAdmin,

    isCustomer,
  };


  // ==========================================================
  // PROVIDER
  // ==========================================================

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}


// ============================================================
// USE AUTH
// ============================================================

export function useAuth() {
  const context =
    useContext(
      AuthContext
    );

  if (!context) {
    throw new Error(
      'useAuth must be used within AuthProvider'
    );
  }

  return context;
}