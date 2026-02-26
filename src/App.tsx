import React, { useState } from 'react';

const styles = {
  container: {
    minHeight: '100vh',
    background: '#0a0a0a',
    color: '#fff',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    background: 'rgba(0,0,0,0.5)',
    borderBottom: '1px solid #333',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold' as const,
    color: '#FFB533',
  },
  nav: {
    display: 'flex',
    gap: '24px',
  },
  navButton: {
    background: 'none',
    border: 'none',
    color: '#b0b0b0',
    fontSize: '16px',
    cursor: 'pointer' as const,
  },
  main: {
    padding: '40px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: {
    fontSize: '48px',
    fontWeight: 'bold' as const,
    textAlign: 'center' as const,
    marginBottom: '16px',
  },
  subtitle: {
    fontSize: '20px',
    color: '#b0b0b0',
    textAlign: 'center' as const,
    marginBottom: '32px',
  },
  button: {
    padding: '16px 32px',
    fontSize: '18px',
    fontWeight: 'bold' as const,
    background: 'linear-gradient(135deg, #FFB533, #FF9500)',
    color: '#0a0a0a',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer' as const,
  },
  card: {
    background: '#121212',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #2a2a2a',
    marginBottom: '24px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '16px',
    marginBottom: '16px',
  },
};

function App() {
  const [page, setPage] = useState<'home' | 'mint' | 'inventory'>('home');
  const [wallet, setWallet] = useState<string | null>(null);

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts',
        });
        setWallet(accounts[0]);
      } catch (err) {
        console.error('Failed to connect:', err);
        alert('Failed to connect wallet');
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const renderPage = () => {
    switch (page) {
      case 'mint':
        return <MintPage wallet={wallet} />;
      case 'inventory':
        return <InventoryPage wallet={wallet} />;
      default:
        return (
          <div style={styles.main}>
            <h1 style={styles.title}>Skull NFT Game</h1>
            <p style={styles.subtitle}>Collect, Battle, and Earn with your NFT Skulls</p>

            {wallet ? (
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                <button style={styles.button} onClick={() => setPage('mint')}>
                  Mint New Skull
                </button>
                <button
                  style={{
                    ...styles.button,
                    background: 'linear-gradient(135deg, #33FFF9, #33A1FF)',
                  }}
                  onClick={() => setPage('inventory')}
                >
                  View Collection
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <button style={styles.button} onClick={connectWallet}>
                  Connect Wallet to Start
                </button>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logo}>💀 Skull NFT</div>
        <nav style={styles.nav}>
          <button style={styles.navButton} onClick={() => setPage('home')}>
            Home
          </button>
          <button style={styles.navButton} onClick={() => setPage('mint')}>
            Mint
          </button>
          <button style={styles.navButton} onClick={() => setPage('inventory')}>
            Inventory
          </button>
        </nav>
        <div>
          {wallet ? (
            <span style={{ color: '#FFB533', fontFamily: 'monospace' }}>
              {wallet.slice(0, 6)}...{wallet.slice(-4)}
            </span>
          ) : (
            <button
              style={{ ...styles.button, padding: '8px 16px', fontSize: '14px' }}
              onClick={connectWallet}
            >
              Connect
            </button>
          )}
        </div>
      </header>
      {renderPage()}
    </div>
  );
}

function MintPage({ wallet }: { wallet: string | null }) {
  const [name, setName] = useState('Skull NFT');
  const [minting, setMinting] = useState(false);

  const handleMint = async () => {
    if (!wallet) {
      alert('Please connect wallet first!');
      return;
    }

    setMinting(true);
    setTimeout(() => {
      alert('Skull minted successfully! (Demo)');
      setMinting(false);
    }, 2000);
  };

  return (
    <div style={styles.main}>
      <h2 style={{ ...styles.title, fontSize: '32px', marginBottom: '24px' }}>
        Mint Your Skull NFT
      </h2>

      <div style={styles.card}>
        <label style={{ display: 'block', marginBottom: '8px', color: '#b0b0b0' }}>
          Skull Name
        </label>
        <input
          style={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter skull name"
          maxLength={20}
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '16px',
            background: 'rgba(255,181,51,0.1)',
            borderRadius: '12px',
            marginBottom: '24px',
          }}
        >
          <span style={{ fontWeight: 'bold' }}>Minting Cost</span>
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFB533' }}>0.01 BNB</span>
        </div>

        <button
          style={{ ...styles.button, width: '100%', opacity: wallet ? 1 : 0.5 }}
          onClick={handleMint}
          disabled={!wallet || minting}
        >
          {minting ? 'Minting...' : 'Mint Skull'}
        </button>

        {!wallet && (
          <p style={{ textAlign: 'center', color: '#666', marginTop: '12px' }}>
            Connect your wallet to mint
          </p>
        )}
      </div>
    </div>
  );
}

function InventoryPage({ wallet }: { wallet: string | null }) {
  const skulls = [
    { id: 1, name: 'Skull NFT', level: 5, rarity: 85 },
    { id: 2, name: 'Dark Skull', level: 3, rarity: 62 },
  ];

  return (
    <div style={styles.main}>
      <h2 style={{ ...styles.title, fontSize: '32px', marginBottom: '8px' }}>Your Collection</h2>
      <p style={{ color: '#b0b0b0', marginBottom: '32px' }}>
        {skulls.length} skull{skulls.length !== 1 ? 's' : ''} in your inventory
      </p>

      {skulls.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px' }}>
          <p style={{ color: '#666', fontSize: '18px' }}>No Skulls Found</p>
          <p style={{ color: '#666', marginTop: '8px' }}>You don't have any skulls yet!</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '24px',
          }}
        >
          {skulls.map((skull) => (
            <div key={skull.id} style={styles.card}>
              <div
                style={{
                  width: '100%',
                  aspectRatio: '1',
                  background: '#1a1a1a',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px',
                }}
              >
                💀
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                {skull.name} #{skull.id}
              </h3>
              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  color: '#b0b0b0',
                  fontSize: '14px',
                  marginBottom: '12px',
                }}
              >
                <span>Level: {skull.level}</span>
                <span>Rarity: {skull.rarity}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: '#42FF33',
                    color: '#0a0a0a',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  Level Up
                </button>
                <button
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: '#e04428',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  Fight
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
