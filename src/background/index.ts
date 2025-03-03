// Background service worker for Chrome extension

// Handle installation
chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.create({ url: 'welcome.html' });
  });
  
  // Listen for messages from content script or popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const actions: Record<string, () => void> = {
      googleSignIn: () => handleGoogleSignIn(sendResponse),
      emailSignIn: () => handleEmailSignIn(request.email, request.password, sendResponse),
      getAuthToken: () => getAuthToken(sendResponse),
      refreshAuthToken: () => refreshAuthToken(sendResponse),
    };
  
    if (actions[request.action]) {
      actions[request.action]();
      return true; // Indicates async response
    } else {
      sendResponse({ success: false, error: "Invalid action" });
      return false;
    }
  });
  
  /**
   * Handle Google sign-in flow
   */
  function handleGoogleSignIn(sendResponse: (response: any) => void) {
    const manifest = chrome.runtime.getManifest();
    const authUrl = new URL("https://accounts.google.com/o/oauth2/auth");
  
    authUrl.searchParams.set("client_id", manifest.oauth2?.client_id || '');
    authUrl.searchParams.set("response_type", "id_token");
    authUrl.searchParams.set("redirect_uri", `https://${chrome.runtime.id}.chromiumapp.org`);
    authUrl.searchParams.set("scope", manifest.oauth2?.scopes?.join(" ") || '');
  
    chrome.identity.launchWebAuthFlow({ url: authUrl.href, interactive: true }, async (redirectedUrl) => {
      if (chrome.runtime.lastError) {
        console.error("❌ Google Sign-In failed:", chrome.runtime.lastError);
        return sendResponse({ success: false, error: chrome.runtime.lastError.message });
      }
  
      if (!redirectedUrl) {
        return sendResponse({ success: false, error: "No redirect URL received" });
      }
  
      const url = new URL(redirectedUrl);
      const params = new URLSearchParams(url.hash.replace("#", "?"));
      const idToken = params.get("id_token");
  
      if (!idToken) {
        return sendResponse({ success: false, error: "No ID token received" });
      }
  
      console.log("🔹 Google ID Token:", idToken);
  
      try {
        const response = await fetch("http://127.0.0.1:8000/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_token: idToken }),
        });
  
        const data = await response.json();
        if (response.ok) {
          console.log("✅ User authenticated:", data);
          storeAuthSession(data.session);
          storeUserId(data.user.id);
          sendResponse({ success: true, user: data.user, access_token: data.session.access_token });
        } else {
          sendResponse({ success: false, error: data.error });
        }
      } catch (error) {
        console.error("❌ Error sending token to backend:", error);
        sendResponse({ success: false, error: "Error connecting to authentication server" });
      }
    });
  }
  
  /**
   * Handle email sign-in flow
   */
  async function handleEmailSignIn(email: string, password: string, sendResponse: (response: any) => void) {
    try {
      const response = await fetch("http://127.0.0.1:8000/auth/sign_in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log("✅ Email Sign-In successful:", data);
        storeAuthSession(data.session);
        storeUserId(data.user.id);
        sendResponse({ success: true, user: data.user, access_token: data.session.access_token });
      } else {
        sendResponse({ success: false, error: data.error });
      }
    } catch (error) {
      console.error("❌ Error in email sign-in:", error);
      sendResponse({ success: false, error: "Error connecting to authentication server" });
    }
  }
  
  /**
   * Get current auth token
   */
  function getAuthToken(sendResponse: (response: any) => void) {
    chrome.storage.local.get(["access_token", "refresh_token", "token_expires_at"], (result) => {
      const now = Math.floor(Date.now() / 1000);
  
      if (result.access_token && result.token_expires_at > now) {
        console.log("✅ Using valid auth token");
        sendResponse({ success: true, token: result.access_token });
      } else {
        console.warn("⚠️ Token expired. Refreshing...");
        refreshAuthToken(sendResponse);
      }
    });
  }
  
  /**
   * Refresh auth token
   */
  function refreshAuthToken(sendResponse: (response: any) => void) {
    chrome.storage.local.get(["refresh_token"], async (result) => {
      if (!result.refresh_token) {
        sendResponse({ success: false, error: "No refresh token available" });
        return;
      }
  
      try {
        const response = await fetch("http://127.0.0.1:8000/auth/refresh_token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: result.refresh_token }),
        });
  
        if (!response.ok) {
          console.error("❌ Token refresh failed:", await response.text());
          return sendResponse({ success: false, error: "Failed to refresh token" });
        }
  
        const data = await response.json();
        storeAuthSession(data.session);
        sendResponse({ success: true, token: data.session.access_token });
      } catch (error) {
        console.error("❌ Error refreshing access token:", error);
        sendResponse({ success: false, error: "Error refreshing token" });
      }
    });
  }
  
  /**
   * Store auth session in local storage
   */
  function storeAuthSession(session: { access_token: string; refresh_token: string; expires_at: number }) {
    if (!session) return;
    
    chrome.storage.local.set({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      token_expires_at: session.expires_at,
    });
    
    console.log("🔄 Stored new auth session.");
  }
  
  /**
   * Store user ID in local storage
   */
  function storeUserId(userId: string) {
    if (!userId) return;
    
    chrome.storage.local.set({ userId });
    console.log("👤 Stored user ID:", userId);
  }