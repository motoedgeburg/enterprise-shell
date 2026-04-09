/**
 * Aggregates every messages file into a single id→defaultMessage map
 * for IntlProvider.  Both index.jsx and renderUtils.jsx import from here
 * so new messages files only need to be added in one place.
 */
import appLayoutMessages from '../components/AppLayout/messages.js';
import dashboardMessages from '../pages/Dashboard/messages.js';
import loginMessages from '../pages/LoginPage/messages.js';
import callbackMessages from '../pages/OktaCallback/messages.js';
import recordDetailMessages from '../pages/RecordDetail/messages.js';
import certificationsMessages from '../pages/RecordDetail/sections/History/Certifications/messages.js';
import emergencyContactsMessages from '../pages/RecordDetail/sections/History/EmergencyContacts/messages.js';
import historyMessages from '../pages/RecordDetail/sections/History/messages.js';
import personalInfoMessages from '../pages/RecordDetail/sections/PersonalInfo/messages.js';
import preferencesMessages from '../pages/RecordDetail/sections/Preferences/messages.js';
import summaryMessages from '../pages/RecordDetail/sections/Summary/messages.js';
import workInfoMessages from '../pages/RecordDetail/sections/WorkInfo/messages.js';
import resultsMessages from '../pages/Results/messages.js';
import searchMessages from '../pages/Search/messages.js';
import validatorMessages from '../utils/validatorMessages.js';

const allDescriptors = [
  appLayoutMessages,
  dashboardMessages,
  loginMessages,
  callbackMessages,
  recordDetailMessages,
  historyMessages,
  emergencyContactsMessages,
  certificationsMessages,
  personalInfoMessages,
  preferencesMessages,
  summaryMessages,
  workInfoMessages,
  resultsMessages,
  searchMessages,
  validatorMessages,
];

const appMessages = {};
for (const descriptors of allDescriptors) {
  for (const descriptor of Object.values(descriptors)) {
    appMessages[descriptor.id] = descriptor.defaultMessage;
  }
}

export default appMessages;
