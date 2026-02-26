import React from 'react';
import { motion } from 'framer-motion';
import { Hexagon, Sword, Trophy, Users, ArrowRight } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { Container, MainContent, Title, Text, Card, Grid, Spacer, Button } from '@/styles';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { isConnected } = useAppSelector((state) => state.blockchain);
  const { allSkulls, boss } = useAppSelector((state) => state.game);

  const features = [
    {
      icon: Sword,
      title: 'Battle System',
      description: 'Fight against powerful bosses and earn rewards',
    },
    {
      icon: Hexagon,
      title: 'NFT Collection',
      description: 'Collect unique skulls with different rarities',
    },
    {
      icon: Trophy,
      title: 'Earn Rewards',
      description: 'Defeat bosses to claim prize money',
    },
  ];

  const stats = [
    { label: 'Total NFTs', value: allSkulls.length, icon: Hexagon },
    { label: 'Active Boss', value: boss ? 'Yes' : 'No', icon: Sword },
    { label: 'Network', value: 'BSC Testnet', icon: Users },
  ];

  return (
    <Container>
      <MainContent>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            >
              <Hexagon
                size={80}
                color="#FFB533"
                style={{
                  marginBottom: 24,
                  filter: 'drop-shadow(0 0 20px rgba(255, 181, 51, 0.5))',
                }}
              />
            </motion.div>

            <Title $size="h1" $align="center">
              Skull NFT Game
            </Title>
            <Spacer $size="sm" />
            <Text $size="xl" $color="secondary" $align="center">
              Collect, Battle, and Earn with your NFT Skulls
            </Text>
            <Spacer $size="lg" />

            {!isConnected ? (
              <Button $variant="primary" $size="lg">
                Connect Wallet to Start
                <ArrowRight size={20} />
              </Button>
            ) : (
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                <Button $variant="primary" $size="lg" onClick={() => onNavigate('mint')}>
                  Mint New Skull
                </Button>
                <Button $variant="secondary" $size="lg" onClick={() => onNavigate('inventory')}>
                  View Collection
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        <Spacer $size="2xl" />

        <Grid $columns={3} $gap="lg">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              <Card $variant="elevated" $hoverable>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #FFB533, #FF9500)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                  }}
                >
                  <feature.icon size={24} color="#0a0a0a" />
                </div>
                <Title $size="h4">{feature.title}</Title>
                <Spacer $size="xs" />
                <Text $color="secondary">{feature.description}</Text>
              </Card>
            </motion.div>
          ))}
        </Grid>

        <Spacer $size="2xl" />

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <Title $size="h3">Game Stats</Title>
          <Spacer $size="md" />
          <Grid $columns={3} $gap="md">
            {stats.map((stat, index) => (
              <Card key={stat.label} $variant="outlined">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: 'rgba(255, 181, 51, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <stat.icon size={20} color="#FFB533" />
                  </div>
                  <div>
                    <Text $color="muted" $size="sm">
                      {stat.label}
                    </Text>
                    <Text $weight={700}>{stat.value}</Text>
                  </div>
                </div>
              </Card>
            ))}
          </Grid>
        </motion.div>
      </MainContent>
    </Container>
  );
};

export default HomePage;
