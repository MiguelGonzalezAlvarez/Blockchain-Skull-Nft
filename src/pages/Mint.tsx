import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, Info } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setLoading, addNotification } from '@/store/slices/gameSlice';
import { createSkull } from '@/services/web3';
import {
  Container,
  MainContent,
  Title,
  Text,
  Card,
  Spacer,
  Button,
  Input,
  InputGroup,
  Label,
} from '@/styles';

const MINT_COST = '0.01';

interface MintPageProps {
  onNavigate: (page: string) => void;
}

const MintPage: React.FC<MintPageProps> = ({ onNavigate }) => {
  const dispatch = useAppDispatch();
  const { account, gameContract, isConnected } = useAppSelector((state) => state.blockchain);
  const { isLoading } = useAppSelector((state) => state.game);
  const [skullName, setSkullName] = useState('Skull NFT');
  const [isMinting, setIsMinting] = useState(false);

  const handleMint = async () => {
    if (!isConnected || !gameContract || !account) {
      dispatch(
        addNotification({
          type: 'error',
          title: 'Wallet Not Connected',
          message: 'Please connect your wallet first',
        })
      );
      return;
    }

    setIsMinting(true);
    dispatch(setLoading(true));

    try {
      const web3 = await import('@/services/web3').then((m) => m.getWeb3Instance());
      const valueInWei = web3.utils.toWei(MINT_COST, 'ether');

      await createSkull(gameContract, account, skullName, valueInWei);

      dispatch(
        addNotification({
          type: 'success',
          title: 'Minting Complete!',
          message: `Your ${skullName} has been minted successfully!`,
        })
      );

      onNavigate('inventory');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Minting failed';
      dispatch(
        addNotification({
          type: 'error',
          title: 'Minting Failed',
          message,
        })
      );
    } finally {
      setIsMinting(false);
      dispatch(setLoading(false));
    }
  };

  const rarityInfo = [
    { range: '0-49', rarity: 'Common', color: '#808080', chance: '50%' },
    { range: '50-79', rarity: 'Rare', color: '#33FFF9', chance: '30%' },
    { range: '80-94', rarity: 'Legendary', color: '#FFB533', chance: '15%' },
    { range: '95-99', rarity: 'Mythic', color: '#e04428', chance: '5%' },
  ];

  return (
    <Container>
      <MainContent>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <Sparkles
                  size={60}
                  color="#FFB533"
                  style={{
                    filter: 'drop-shadow(0 0 20px rgba(255, 181, 51, 0.5))',
                  }}
                />
              </motion.div>
              <Spacer $size="md" />
              <Title $size="h2" $align="center">
                Mint Your Skull NFT
              </Title>
              <Spacer $size="sm" />
              <Text $color="secondary" $align="center">
                Create a unique skull with randomly generated traits and rarity
              </Text>
            </div>

            <Card $variant="elevated">
              <InputGroup>
                <Label>Skull Name</Label>
                <Input
                  type="text"
                  value={skullName}
                  onChange={(e) => setSkullName(e.target.value)}
                  placeholder="Enter skull name"
                  maxLength={20}
                />
              </InputGroup>

              <Spacer $size="md" />

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  background: 'rgba(255, 181, 51, 0.1)',
                  borderRadius: 12,
                }}
              >
                <Text $weight={600}>Minting Cost</Text>
                <Text $size="xl" $color="primary" $weight={700}>
                  {MINT_COST} BNB
                </Text>
              </div>

              <Spacer $size="lg" />

              <Button
                $variant="primary"
                $fullWidth
                $size="lg"
                $loading={isMinting}
                onClick={handleMint}
                disabled={!isConnected || isMinting}
              >
                {isMinting ? (
                  <>
                    <Loader2 size={20} className="spin" />
                    Minting...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Mint Skull
                  </>
                )}
              </Button>

              {!isConnected && (
                <Text $color="muted" $size="sm" $align="center" style={{ marginTop: 12 }}>
                  Connect your wallet to mint
                </Text>
              )}
            </Card>

            <Spacer $size="lg" />

            <Card $variant="outlined">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Info size={20} color="#33FFF9" />
                <Title $size="h4">Rarity System</Title>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {rarityInfo.map((info) => (
                  <div
                    key={info.rarity}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 12px',
                      background: `${info.color}10`,
                      borderRadius: 8,
                      borderLeft: `3px solid ${info.color}`,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          background: info.color,
                        }}
                      />
                      <Text>{info.rarity}</Text>
                    </div>
                    <div style={{ display: 'flex', gap: 24 }}>
                      <Text $size="sm" $color="muted">
                        DNA: {info.range}
                      </Text>
                      <Text $size="sm" $color="secondary">
                        {info.chance}
                      </Text>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </motion.div>
      </MainContent>
    </Container>
  );
};

export default MintPage;
