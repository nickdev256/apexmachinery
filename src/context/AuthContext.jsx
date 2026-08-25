import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import axios from 'axios';


const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';


// ============================================================
// AXIOS CLIENT
// ============================================================

export const api = axios.create({

  baseURL: API_URL,

  headers: {
    'Content-Type': 'application/json',
  },

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
// LOAD USER
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


    return JSON.parse(
      stored
    );

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

function saveStoredToken(
  token
) {

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

  const [user, setUser] =
    useState(
      loadStoredUser
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

    if (
      authenticatedUser
    ) {

      setUser(
        authenticatedUser
      );


      localStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify(
          authenticatedUser
        )
      );

    }


    if (accessToken) {

      saveStoredToken(
        accessToken
      );

    }

  }


  // ==========================================================
  // CLEAR AUTHENTICATION
  // ==========================================================

  function clearAuthentication() {

    setUser(null);

    removeStoredAuthentication();

  }



  useEffect(() => {

    const interceptor =
      api.interceptors.request.use(
        (config) => {

          const token =
            loadStoredToken();


          if (token) {

            config.headers =
              config.headers || {};


            config.headers.Authorization =
              `Bearer ${token}`;

          }


          return config;

        },

        (error) =>
          Promise.reject(
            error
          )

      );


    return () => {

      api.interceptors.request.eject(
        interceptor
      );

    };

  }, []);


  // ==========================================================
  // AXIOS RESPONSE INTERCEPTOR
  // ==========================================================
  //
  // If the backend says the session is invalid:
  //
  // 401 Unauthorized
  //
  // automatically clear the local session.
  //
  // ==========================================================

  useEffect(() => {

    const interceptor =
      api.interceptors.response.use(

        (response) =>
          response,

        (error) => {

          if (
            error.response?.status ===
            401
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
  //
  // Runs whenever the application starts.
  //
  // The frontend sends the stored Supabase access token
  // to the backend.
  //
  // Backend verifies the token.
  //
  // ==========================================================

  useEffect(() => {

    let mounted = true;


    async function restoreSession() {

      const token =
        loadStoredToken();


      // ------------------------------------------------------
      // NO TOKEN
      // ------------------------------------------------------

      if (!token) {

        if (mounted) {

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
          response.data?.success &&
          response.data?.user
        ) {

          if (mounted) {

            setUser(
              response.data.user
            );


            localStorage.setItem(
              USER_STORAGE_KEY,
              JSON.stringify(
                response.data.user
              )
            );

          }

        } else {

          clearAuthentication();

        }

      } catch (error) {

        console.error(
          '[Apex Auth] Session restoration failed:',
          error
        );


        clearAuthentication();

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
        String(
          email || ''
        )
          .trim()
          .toLowerCase();


      const cleanPassword =
        String(
          password || ''
        );


      // ------------------------------------------------------
      // VALIDATION
      // ------------------------------------------------------

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


      // ------------------------------------------------------
      // BACKEND REQUEST
      // ------------------------------------------------------

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


      // ------------------------------------------------------
      // CHECK RESPONSE
      // ------------------------------------------------------

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


      if (
        !authenticatedUser
      ) {

        throw new Error(
          'The server did not return user information.'
        );

      }


      if (!accessToken) {

        throw new Error(
          'The server did not return an authentication token.'
        );

      }


      // ------------------------------------------------------
      // SAVE SESSION
      // ------------------------------------------------------

      saveAuthentication(
        authenticatedUser,
        accessToken
      );


      return authenticatedUser;

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
        String(
          name || ''
        ).trim();


      const cleanCompany =
        String(
          company || ''
        ).trim();


      const cleanEmail =
        String(
          email || ''
        )
          .trim()
          .toLowerCase();


      const cleanPassword =
        String(
          password || ''
        );


      // ------------------------------------------------------
      // VALIDATION
      // ------------------------------------------------------

      if (!cleanName) {

        throw new Error(
          'Please enter your full name.'
        );

      }


      if (!cleanCompany) {

        throw new Error(
          'Please enter your company name.'
        );

      }


      if (!cleanEmail) {

        throw new Error(
          'Please enter your email address.'
        );

      }


      if (
        cleanPassword.length < 6
      ) {

        throw new Error(
          'Password must contain at least 6 characters.'
        );

      }


      // ------------------------------------------------------
      // BACKEND REQUEST
      // ------------------------------------------------------

      const response =
        await api.post(
          '/auth/register',
          {

            name:
              cleanName,

            company:
              cleanCompany,

            email:
              cleanEmail,

            password:
              cleanPassword,

          }
        );


      // ------------------------------------------------------
      // CHECK RESPONSE
      // ------------------------------------------------------

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


      if (
        !authenticatedUser
      ) {

        throw new Error(
          'The server did not return the new user.'
        );

      }


      // ------------------------------------------------------
      // SAVE SESSION IF SUPABASE RETURNED TOKEN
      // ------------------------------------------------------

      if (accessToken) {

        saveAuthentication(
          authenticatedUser,
          accessToken
        );

      } else {

        // Some Supabase configurations require
        // email confirmation before issuing a session.

        setUser(
          authenticatedUser
        );


        localStorage.setItem(
          USER_STORAGE_KEY,
          JSON.stringify(
            authenticatedUser
          )
        );

      }


      return authenticatedUser;

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

      const token =
        loadStoredToken();


      if (token) {

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
  // GET CURRENT USER
  // ==========================================================

  async function refreshUser() {

    try {

      const response =
        await api.get(
          '/auth/me'
        );


      if (
        response.data?.success &&
        response.data?.user
      ) {

        const currentUser =
          response.data.user;


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

      }


      clearAuthentication();

      return null;

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
  // ROLE HELPERS
  // ==========================================================

  const isAuthenticated =
    Boolean(user);


  const isAdmin =
    user?.role === 'admin' ||
    user?.role === 'administrator';


  const isCustomer =
    user?.role === 'customer';


  // ==========================================================
  // CONTEXT VALUE
  // ==========================================================

  const value = {

    user,

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