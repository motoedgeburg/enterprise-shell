const messages = {
  // ─── Dashboard ────────────────────────────────────────────────────────────
  DASHBOARD_WELCOME_TITLE: {
    id: 'DASHBOARD_WELCOME_TITLE',
    defaultMessage: 'Welcome back, {name} \uD83D\uDC4B',
  },
  DASHBOARD_USER_FALLBACK: { id: 'DASHBOARD_USER_FALLBACK', defaultMessage: 'User' },
  DASHBOARD_STAT_TOTAL_RECORDS: {
    id: 'DASHBOARD_STAT_TOTAL_RECORDS',
    defaultMessage: 'Total Records',
  },
  DASHBOARD_STAT_ACTIVE: { id: 'DASHBOARD_STAT_ACTIVE', defaultMessage: 'Active' },
  DASHBOARD_STAT_PENDING: { id: 'DASHBOARD_STAT_PENDING', defaultMessage: 'Pending' },
  DASHBOARD_STAT_INACTIVE: { id: 'DASHBOARD_STAT_INACTIVE', defaultMessage: 'Inactive' },
  DASHBOARD_SESSION_CARD_TITLE: {
    id: 'DASHBOARD_SESSION_CARD_TITLE',
    defaultMessage: 'Session Information',
  },
  DASHBOARD_SESSION_SUB: { id: 'DASHBOARD_SESSION_SUB', defaultMessage: 'Subject (sub):' },
  DASHBOARD_SESSION_EMAIL: { id: 'DASHBOARD_SESSION_EMAIL', defaultMessage: 'Email:' },
  DASHBOARD_SESSION_GROUPS: { id: 'DASHBOARD_SESSION_GROUPS', defaultMessage: 'Groups:' },
  DASHBOARD_NO_GROUPS: {
    id: 'DASHBOARD_NO_GROUPS',
    defaultMessage: 'No groups assigned',
  },
  DASHBOARD_VALUE_FALLBACK: { id: 'DASHBOARD_VALUE_FALLBACK', defaultMessage: '\u2014' },

  // ─── Login page ───────────────────────────────────────────────────────────
  LOGIN_PAGE_TITLE: { id: 'LOGIN_PAGE_TITLE', defaultMessage: 'Enterprise Application' },
  LOGIN_SSO_DESCRIPTION: {
    id: 'LOGIN_SSO_DESCRIPTION',
    defaultMessage: "Sign in using your organization\u2019s Single Sign-On (SSO) account.",
  },
  LOGIN_BUTTON: { id: 'LOGIN_BUTTON', defaultMessage: 'Sign in with Okta' },

  // ─── Okta callback page ───────────────────────────────────────────────────
  CALLBACK_AUTH_FAILED_TITLE: {
    id: 'CALLBACK_AUTH_FAILED_TITLE',
    defaultMessage: 'Authentication Failed',
  },
  CALLBACK_RETURN_TO_LOGIN: {
    id: 'CALLBACK_RETURN_TO_LOGIN',
    defaultMessage: 'Return to Login',
  },
  CALLBACK_COMPLETING_SIGN_IN: {
    id: 'CALLBACK_COMPLETING_SIGN_IN',
    defaultMessage: 'Completing sign-in\u2026',
  },
};

export default messages;
