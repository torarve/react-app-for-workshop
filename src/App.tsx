import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { MsalAuthenticationTemplate, useMsal } from '@azure/msal-react';
import { AccountInfo, InteractionRequiredAuthError, InteractionStatus, InteractionType, IPublicClientApplication } from '@azure/msal-browser';


const authRequest = {
  scopes: ["User.Read"],
};


type GraphData = {
  businessPhones: string[];
  displayName: string;
  givenName: string;
  jobTitle: string;
  mail: string;
  mobilePhone: string;
  officeLocation: string;
  preferredLanguage: string;
  surname: string;
  userPrincipalName: string;
  id: string;
}

const me_url = 'https://graph.microsoft.com/v1.0/me/';
const me_photo_url = 'https://graph.microsoft.com/v1.0/me/photo/$value';

async function callMsGraph(url: string, msalInstance: IPublicClientApplication) {
  const account = msalInstance.getActiveAccount();
  if (!account) {
      throw Error("No active account! Verify a user has been signed in and setActiveAccount has been called.");
  }

  const response = await msalInstance.acquireTokenSilent({
      ...authRequest,
      account: account
  });

  const headers = new Headers();
  const bearer = `Bearer ${response.accessToken}`;

  headers.append("Authorization", bearer);

  const options = {
      method: "GET",
      headers: headers
  };

  return await fetch(url, options);
}

async function getMe(msalInstance: IPublicClientApplication) {
  const response = await callMsGraph(me_url, msalInstance);
  return await response.json();
}

async function getPhoto(msalInstance: IPublicClientApplication) {
  const response = await callMsGraph(me_photo_url, msalInstance);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}


function App() {
  const { instance, inProgress } = useMsal();
  const [ graphData, setGraphData ] = useState<GraphData | null>(null);
  const [ photo, setPhoto ] = useState<string | null>(null);

  useEffect(() => {
    const acquireToken = () => {
      instance.acquireTokenRedirect({
        ...authRequest,
        account: instance.getActiveAccount() as AccountInfo
      });
    }
    if (!graphData && inProgress=== InteractionStatus.None) {
      getMe(instance)
        .then(setGraphData)
        .catch((e) => { if (e instanceof InteractionRequiredAuthError) acquireToken(); });
      getPhoto(instance)
        .then(setPhoto)
        .catch((e) => { if (e instanceof InteractionRequiredAuthError) acquireToken(); });
    }
  }, [instance, graphData, photo, inProgress])

  useEffect(() => {
    console.log(graphData)
  }, [graphData]);

  return (
    <MsalAuthenticationTemplate
      interactionType={InteractionType.Redirect}
      authenticationRequest={authRequest}
    >
      <div className="App">
        <header className="App-header">
          <img src={photo || logo} className="App-logo" alt="currently logged in user" />
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
