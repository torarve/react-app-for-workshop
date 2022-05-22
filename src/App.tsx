import React from 'react';
import logo from './logo.svg';
import './App.css';
import { MsalAuthenticationTemplate, useMsal } from '@azure/msal-react';
import { InteractionType } from '@azure/msal-browser';

function App() {
  const authRequest = {
    scopes: ["openid", "profile"]
  };

  const { instance } = useMsal();

  return (
    <MsalAuthenticationTemplate
      interactionType={InteractionType.Redirect}
      authenticationRequest={authRequest}
    >
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <p>Logged in as { instance.getActiveAccount()?.username || 'none' }</p>
          <button
            className="App-link"
            onClick={() => instance.logoutRedirect()}
          >
            Log out
          </button>
        </header>
      </div>
    </MsalAuthenticationTemplate>
  );
}

export default App;
