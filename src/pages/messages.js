const messages = {
  // ─── Dashboard ────────────────────────────────────────────────────────────
  DASHBOARD_WELCOME_TITLE:    { id: 'DASHBOARD_WELCOME_TITLE',    defaultMessage: 'Welcome back, {name}' },
  DASHBOARD_WELCOME_SUBTITLE: { id: 'DASHBOARD_WELCOME_SUBTITLE', defaultMessage: "Here's what's ready for you today." },
  DASHBOARD_USER_FALLBACK:    { id: 'DASHBOARD_USER_FALLBACK',    defaultMessage: 'User' },

  DASHBOARD_TILE_SEARCH_TITLE: { id: 'DASHBOARD_TILE_SEARCH_TITLE', defaultMessage: 'Search Records' },
  DASHBOARD_TILE_SEARCH_DESC:  { id: 'DASHBOARD_TILE_SEARCH_DESC',  defaultMessage: 'Filter records by name, email, department, status, or address.' },
  DASHBOARD_TILE_SEARCH_CTA:   { id: 'DASHBOARD_TILE_SEARCH_CTA',   defaultMessage: 'Get Started' },

  // ─── Login page ───────────────────────────────────────────────────────────
  LOGIN_PAGE_TITLE:      { id: 'LOGIN_PAGE_TITLE',      defaultMessage: 'Enterprise Application' },
  LOGIN_SSO_DESCRIPTION: { id: 'LOGIN_SSO_DESCRIPTION', defaultMessage: "Sign in using your organization\u2019s Single Sign-On (SSO) account." },
  LOGIN_BUTTON:          { id: 'LOGIN_BUTTON',          defaultMessage: 'Sign in with Okta' },

  // ─── Okta callback page ───────────────────────────────────────────────────
  CALLBACK_AUTH_FAILED_TITLE:  { id: 'CALLBACK_AUTH_FAILED_TITLE',  defaultMessage: 'Authentication Failed' },
  CALLBACK_RETURN_TO_LOGIN:    { id: 'CALLBACK_RETURN_TO_LOGIN',    defaultMessage: 'Return to Login' },
  CALLBACK_COMPLETING_SIGN_IN: { id: 'CALLBACK_COMPLETING_SIGN_IN', defaultMessage: 'Completing sign-in\u2026' },
};

export default messages;
