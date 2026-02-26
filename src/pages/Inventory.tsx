import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid3X3, Filter, Search, SortAsc, SortDesc, Empty } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  setUserSkulls,
  setSelectedSkull,
  startBattle,
  setCurrentScreen,
} from '@/store/slices/gameSlice';
import { getUserSkulls, getBossInfo } from '@/services/web3';
import { Container, MainContent, Title, Text, Card, Button, Input, Select, Spacer } from '@/styles';
import NFTCard from '@/components/Game/NFTCard';
import SkullRenderer from '@/components/Renderers/SkullRenderer';
import Modal from '@/components/UI/Modal';
import type { Skull } from '@/types';

type SortOption = 'id' | 'level' | 'rarity' | 'hp';
type FilterOption = 'all' | 'alive' | 'dead';

const InventoryPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { account, gameContract, isConnected } = useAppSelector((state) => state.blockchain);
  const { userSkulls, selectedSkull, boss } = useAppSelector((state) => state.game);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('id');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Skull | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isConnected && gameContract && account) {
      loadUserSkulls();
    }
  }, [isConnected, gameContract, account]);

  const loadUserSkulls = async () => {
    if (!gameContract || !account) return;

    setIsLoading(true);
    try {
      const skulls = await getUserSkulls(gameContract, account);
      dispatch(setUserSkulls(skulls as unknown as Skull[]));

      const bossInfo = await getBossInfo(gameContract);
      dispatch({ type: 'game/setBoss', payload: bossInfo });
    } catch (error) {
      console.error('Failed to load skulls:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSkulls = userSkulls
    .filter((skull) => {
      if (filterBy === 'alive') return Number(skull.hpPoints) > 0;
      if (filterBy === 'dead') return Number(skull.hpPoints) === 0;
      return true;
    })
    .filter(
      (skull) =>
        skull.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(skull.id).includes(searchQuery)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'level':
          return b.level - a.level;
        case 'rarity':
          return b.rarity - a.rarity;
        case 'hp':
          return Number(b.hpPoints) - Number(a.hpPoints);
        default:
          return a.id - b.id;
      }
    });

  const handleSelectSkull = (skull: Skull) => {
    setSelectedCard(skull);
    setIsModalOpen(true);
  };

  const handleStartBattle = (skull: Skull) => {
    dispatch(setSelectedSkull(skull));
    dispatch(startBattle(skull));
    dispatch(setCurrentScreen('bossFight'));
    setIsModalOpen(false);
  };

  const handleLevelUp = async (skull: Skull) => {
    // Implement level up logic
    console.log('Level up:', skull);
  };

  const handleRevive = async (skull: Skull) => {
    // Implement revive logic
    console.log('Revive:', skull);
  };

  return (
    <Container>
      <MainContent>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ marginBottom: 32 }}>
            <Title $size="h2">Your Collection</Title>
            <Spacer $size="xs" />
            <Text $color="secondary">
              {userSkulls.length} skull{userSkulls.length !== 1 ? 's' : ''} in your inventory
            </Text>
          </div>

          <Card $variant="outlined" style={{ marginBottom: 24 }}>
            <div
              style={{
                display: 'flex',
                gap: 16,
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
                <Search
                  size={18}
                  style={{
                    position: 'absolute',
                    left: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#666',
                  }}
                />
                <Input
                  type="text"
                  placeholder="Search by name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: 40 }}
                />
              </div>

              <Select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                style={{ width: 'auto', minWidth: 120 }}
              >
                <option value="all">All Status</option>
                <option value="alive">Alive</option>
                <option value="dead">Dead</option>
              </Select>

              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                style={{ width: 'auto', minWidth: 140 }}
              >
                <option value="id">Sort by ID</option>
                <option value="level">Sort by Level</option>
                <option value="rarity">Sort by Rarity</option>
                <option value="hp">Sort by HP</option>
              </Select>
            </div>
          </Card>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: 80 }}>
              <Text $color="muted">Loading your skulls...</Text>
            </div>
          ) : filteredSkulls.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: 'center', padding: 80 }}
            >
              <Empty size={64} color="#666" style={{ marginBottom: 16 }} />
              <Title $size="h3">No Skulls Found</Title>
              <Spacer $size="sm" />
              <Text $color="muted">
                {userSkulls.length === 0
                  ? "You don't have any skulls yet. Mint your first one!"
                  : 'No skulls match your filters.'}
              </Text>
            </motion.div>
          ) : (
            <Grid $columns={4} $gap="lg">
              <AnimatePresence mode="popLayout">
                {filteredSkulls.map((skull, index) => (
                  <motion.div
                    key={skull.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                  >
                    <NFTCard
                      skull={skull}
                      onSelect={handleSelectSkull}
                      onLevelUp={handleLevelUp}
                      onRevive={handleRevive}
                      onFight={handleStartBattle}
                      isSelected={selectedSkull?.id === skull.id}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </Grid>
          )}
        </motion.div>
      </MainContent>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCard?.name || 'Skull Details'}
        size="md"
      >
        {selectedCard && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: 24 }}>
              <SkullRenderer skull={selectedCard} size={180} />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 16,
                marginBottom: 24,
              }}
            >
              <Card $variant="outlined">
                <Text $color="muted" $size="sm">
                  Level
                </Text>
                <Text $size="xl" $weight={700}>
                  {selectedCard.level}
                </Text>
              </Card>
              <Card $variant="outlined">
                <Text $color="muted" $size="sm">
                  Rarity
                </Text>
                <Text $size="xl" $weight={700} $color="primary">
                  {selectedCard.rarity}
                </Text>
              </Card>
              <Card $variant="outlined">
                <Text $color="muted" $size="sm">
                  Attack
                </Text>
                <Text $size="xl" $weight={700}>
                  {selectedCard.attackPoints}
                </Text>
              </Card>
              <Card $variant="outlined">
                <Text $color="muted" $size="sm">
                  HP
                </Text>
                <Text $size="xl" $weight={700}>
                  {selectedCard.hpPoints} / {selectedCard.maxHpPoints}
                </Text>
              </Card>
            </div>

            {Number(selectedCard.hpPoints) > 0 ? (
              <Button
                $variant="danger"
                $fullWidth
                $size="lg"
                onClick={() => handleStartBattle(selectedCard)}
              >
                Fight Boss
              </Button>
            ) : (
              <Button
                $variant="outline"
                $fullWidth
                $size="lg"
                onClick={() => handleRevive(selectedCard)}
              >
                Revive Skull
              </Button>
            )}
          </div>
        )}
      </Modal>
    </Container>
  );
};

export default InventoryPage;
