import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { MsalProvider } from '@azure/msal-react';
import { AuthenticationResult, Configuration, EventMessage, EventType, PublicClientApplication } from '@azure/msal-browser';

const configuration: Configuration = {
  auth: {
    clientId: '1caeec3d-ac26-4bcd-b18c-9983f34b9525',
    authority: 'https://login.microsoftonline.com/7e793449-c4b5-4520-9737-0dcf3b24a192',
    redirectUri: 'http://localhost:3000'
  },
}

const pca = new PublicClientApplication(configuration);

const accounts = pca.getAllAccounts();
if (accounts.length > 0) {
    pca.setActiveAccount(accounts[0]);
}
pca.addEventCallback((event: EventMessage) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
      const payload = event.payload as AuthenticationResult;
      const account = payload.account;
      pca.setActiveAccount(account);
  }
});
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <MsalProvider instance={pca}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </MsalProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
