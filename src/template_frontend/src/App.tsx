import { useEffect, useState } from 'react';
import { createActor } from './declarations/backend';
import { _SERVICE } from './declarations/backend/backend.did';

import { HttpAgent, Identity, AnonymousIdentity, ActorSubclass } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import ModalProviderSelect from './components/ModalProviderSelect';

const canisterId = process.env.CANISTER_ID as string
const host =  "http://localhost:4943/?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai" // localhost
// const hots = "https://identity.ic0.app";  //Mainnet

function App() {
  const [showModallConnect, setShowModalConnect] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [identity, setIdentity] = useState<Identity>(new AnonymousIdentity());
  const [connectButtonText, setConnectButtonText] = useState("Conectar");
  const [name, setName] = useState<string>("");
  const [backend, setBackend] = useState<ActorSubclass<_SERVICE>>(
    createActor(canisterId, {
      agentOptions: { identity: new AnonymousIdentity(), host }
    })
  );

  const handleSelectProvider = async (provider: string) => {
    setShowModalConnect(false);
    const authClient = await AuthClient.create();
    await authClient.login({
      identityProvider: provider,
      onSuccess: () => {
        const identity: Identity = authClient.getIdentity();
        setIdentity(identity);
        setIsAuthenticated(true);
        setBackend(createActor(canisterId, { agentOptions: { identity, host } }));
      },
      onError: (err) => console.error("Error al iniciar sesión:", err),
    });
  }

  useEffect(() => {
    init();
  }, []);

  async function init() {
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    setIdentity(identity);

    if (!identity.getPrincipal().isAnonymous()) {
      setIsAuthenticated(true);
    };
  };

  useEffect(() => {
    console.log({identity: identity.getPrincipal().toString()});
    const setupAgent = async () => {
      const agent = await HttpAgent.create({
        identity,
        host,
      });
      setBackend(createActor(canisterId, { agent }));
    };
    setupAgent();
  }, [identity]);

  useEffect(() => {
    console.log(identity.getPrincipal().toString());
    if(isAuthenticated) {
      setConnectButtonText("Desconectar")
    } else {
      setConnectButtonText("Conectar")
      setIdentity(new AnonymousIdentity())
      setName("Anonimo")

    };

  },[isAuthenticated])

  const handleClickConnect = () => {
    if(isAuthenticated) {
      setConnectButtonText("Conectar")
      setIdentity(new AnonymousIdentity())
      setIsAuthenticated(false)
    } else {
      setShowModalConnect(true);
    }
  }

  const handleQuienSoy = async () => {
    if (!backend || identity instanceof AnonymousIdentity) {
      console.warn("Backend no está listo o la identidad es anónima.");
      return;
    }
  
    try {
      const _name = await backend.quienSoy();
      console.log({ name: _name });
      setName(_name);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main>
      <button onClick={handleClickConnect } style={{padding: "10px", borderRadius: "15px", margin: "10px", width:"200px"}}>
        {connectButtonText}
      </button>
      <div>
        <button style={{ padding: "10px", width:"200px", margin: "10px", borderRadius: "15px"}}>
          Principal ID: 
        </button>
        <span> {identity.getPrincipal().toString()}</span>
      </div>
      <button 
        style={{ padding: "10px", width:"200px", margin: "10px", borderRadius: "15px"}} 
        onClick={handleQuienSoy}>Como me ve el backend???</button> 
      <span> {name} </span>

      {showModallConnect && 
        <ModalProviderSelect
          internetIdentityUrl= {host}
          isOpen={showModallConnect}
          onClose={() => setShowModalConnect(false)}
          onSelectProvider={handleSelectProvider}
        />}
    </main>
  );
}

export default App;
