import { User } from '@/types/common';

class AuthService {
  /**
   * Get the current user ID
   */
  async getUserId(): Promise<string | null> {
    return new Promise((resolve) => {
      chrome.storage.local.get(['userId'], (result) => {
        resolve(result.userId || null);
      });
    });
  }

  /**
   * Get the current auth token
   */
  async getAuthToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ action: "getAuthToken" }, (response) => {
        if (chrome.runtime.lastError || !response.success) {
          console.error("❌ Error getting auth token:", response?.error || chrome.runtime.lastError);
          reject("Failed to retrieve token");
        } else {
          resolve(response.token);
        }
      });
    });
  }

  /**
   * Refresh the auth token
   */
  async refreshAuthToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ action: "refreshAuthToken" }, (response) => {
        if (chrome.runtime.lastError || !response.success) {
          console.error("❌ Failed to refresh token:", response?.error || chrome.runtime.lastError);
          reject("Failed to refresh token");
        } else {
          resolve(response.token);
        }
      });
    });
  }

  /**
   * Sign in with email and password
   */
  async signInWithEmail(email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      if (!email || !password) {
        return reject(new Error("Email and password are required"));
      }

      chrome.runtime.sendMessage(
        { action: "emailSignIn", email, password },
        (response) => {
          if (chrome.runtime.lastError) {
            return reject(chrome.runtime.lastError);
          }

          if (response.success) {
            resolve(response.user);
          } else {
            reject(new Error(response.error || "Failed to sign in"));
          }
        }
      );
    });
  }

  /**
   * Sign in with Google
   */
  async signInWithGoogle(): Promise<User> {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ action: "googleSignIn" }, (response) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }

        if (response.success) {
          resolve(response.user);
        } else {
          reject(new Error(response.error || "Google sign-in failed"));
        }
      });
    });
  }

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.remove(["access_token", "refresh_token", "token_expires_at", "userId"], () => {
        console.log("User signed out");
        resolve();
      });
    });
  }

  /**
   * Check if a user is signed in
   */
  async isSignedIn(): Promise<boolean> {
    const userId = await this.getUserId();
    return userId !== null;
  }
}

export const authService = new AuthService();
export default AuthService;