import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sword, Shield, Trophy, X, Loader2, Zap } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  endBattle,
  setBossDefeated,
  resetGame,
  setCurrentScreen,
  addBattleLog,
} from '@/store/slices/gameSlice';
import { attackBoss, claimReward } from '@/services/web3';
import { Container, MainContent, Title, Text, Card, Button, Spacer } from '@/styles';
import SkullRenderer from '@/components/Renderers/SkullRenderer';
import BossRenderer from '@/components/Renderers/BossRenderer';
import HealthBar from '@/components/Game/HealthBar';

const BattlePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { account, gameContract } = useAppSelector((state) => state.blockchain);
  const { selectedSkull, boss, isBossDefeated, isInBattle, battleLog } = useAppSelector(
    (state) => state.game
  );

  const [isAttacking, setIsAttacking] = useState(false);
  const [isBossHurt, setIsBossHurt] = useState(false);
  const [isPlayerHurt, setIsPlayerHurt] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [turn, setTurn] = useState(0);

  const handleAttack = async () => {
    if (!gameContract || !account || !selectedSkull || !boss) return;

    setIsAttacking(true);

    try {
      const web3 = await import('@/services/web3').then((m) => m.getWeb3Instance());
      const cost = (selectedSkull.rarity * selectedSkull.level) / 10000;
      const valueInWei = web3.utils.toWei(cost.toString(), 'ether');

      const result = await attackBoss(gameContract, account, selectedSkull.id, valueInWei);

      setIsBossHurt(true);
      setTimeout(() => setIsBossHurt(false), 500);

      dispatch(
        addBattleLog({
          turn,
          attacker: 'player',
          damage: Number(selectedSkull.attackPoints),
          targetHp: Number(boss.hpPoints) - Number(selectedSkull.attackPoints),
          isCritical: Math.random() > 0.8,
          timestamp: Date.now(),
        })
      );

      if (result && typeof result === 'object' && 'events' in result) {
        const event = (result as { events: unknown[] }).events.find(
          (e: unknown) =>
            e &&
            typeof e === 'object' &&
            'event' in e &&
            (e as { event: string }).event === 'BossAttacked'
        );
        if (event && typeof event === 'object' && 'returnValues' in event) {
          const returnValues = (event as { returnValues: { isBossDefeated: boolean } })
            .returnValues;
          if (returnValues.isBossDefeated) {
            dispatch(setBossDefeated(true));
            dispatch(endBattle({ victory: true, winner: account || undefined }));
          }
        }
      }

      setTurn((prev) => prev + 1);

      if (!isBossDefeated && boss.hpPoints > 0) {
        setTimeout(() => {
          setIsPlayerHurt(true);
          setTimeout(() => setIsPlayerHurt(false), 500);

          const newHp = Math.max(0, Number(selectedSkull.hpPoints) - Number(boss.attackPoints));
          dispatch(
            addBattleLog({
              turn,
              attacker: 'boss',
              damage: Number(boss.attackPoints),
              targetHp: newHp,
              isCritical: Math.random() > 0.8,
              timestamp: Date.now(),
            })
          );

          if (newHp === 0) {
            dispatch(endBattle({ victory: false }));
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Attack failed:', error);
    } finally {
      setIsAttacking(false);
    }
  };

  const handleClaimReward = async () => {
    if (!gameContract || !account) return;

    setIsClaiming(true);
    try {
      await claimReward(gameContract, account);
      dispatch(resetGame());
      dispatch(setCurrentScreen('inventory'));
    } catch (error) {
      console.error('Claim failed:', error);
    } finally {
      setIsClaiming(false);
    }
  };

  const handleLeave = () => {
    dispatch(resetGame());
    dispatch(setCurrentScreen('inventory'));
  };

  if (!selectedSkull || !boss) {
    return (
      <Container>
        <MainContent>
          <div style={{ textAlign: 'center', padding: 80 }}>
            <Text>No skull selected</Text>
          </div>
        </MainContent>
      </Container>
    );
  }

  const playerHpPercent =
    (Number(selectedSkull.hpPoints) / Number(selectedSkull.maxHpPoints)) * 100;
  const bossHpPercent = (Number(boss.hpPoints) / Number(boss.maxHpPoints)) * 100;

  return (
    <Container>
      <MainContent>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Title $size="h1">{isBossDefeated ? 'Victory!' : 'Boss Fight!'}</Title>
            <Text $color="secondary">
              {isBossDefeated
                ? 'Congratulations! You defeated the boss!'
                : `Turn ${turn + 1} - ${turn % 2 === 0 ? 'Your Turn' : "Boss's Turn"}`}
            </Text>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 48,
              maxWidth: 900,
              margin: '0 auto',
            }}
          >
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card $variant="elevated" style={{ textAlign: 'center' }}>
                <Title $size="h3" $align="center" style={{ marginBottom: 16 }}>
                  Your Skull
                </Title>

                <div style={{ position: 'relative', marginBottom: 24 }}>
                  <motion.div
                    animate={isPlayerHurt ? { x: [-10, 10, -10, 10, 0] } : {}}
                    transition={{ duration: 0.4 }}
                  >
                    <SkullRenderer skull={selectedSkull} size={180} animated={false} />
                  </motion.div>

                  {isPlayerHurt && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(224, 68, 40, 0.3)',
                        borderRadius: 12,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Sword size={48} color="#e04428" />
                    </motion.div>
                  )}
                </div>

                <Text $weight={600} style={{ marginBottom: 8 }}>
                  {selectedSkull.name} #{selectedSkull.id}
                </Text>

                <div style={{ marginBottom: 16 }}>
                  <HealthBar
                    current={Number(selectedSkull.hpPoints)}
                    max={Number(selectedSkull.maxHpPoints)}
                    label="HP"
                    size="lg"
                    critical={playerHpPercent <= 25}
                  />
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 24,
                    marginBottom: 24,
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <Sword size={20} color="#FFB533" />
                    <Text $size="lg" $weight={700}>
                      {selectedSkull.attackPoints}
                    </Text>
                    <Text $size="xs" $color="muted">
                      Attack
                    </Text>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <Shield size={20} color="#33FFF9" />
                    <Text $size="lg" $weight={700}>
                      Lv. {selectedSkull.level}
                    </Text>
                    <Text $size="xs" $color="muted">
                      Level
                    </Text>
                  </div>
                </div>

                {!isBossDefeated && Number(selectedSkull.hpPoints) > 0 && (
                  <Button
                    $variant="danger"
                    $fullWidth
                    $size="lg"
                    $glow
                    onClick={handleAttack}
                    disabled={isAttacking}
                  >
                    {isAttacking ? (
                      <>
                        <Loader2 size={20} className="spin" />
                        Attacking...
                      </>
                    ) : (
                      <>
                        <Zap size={20} />
                        Attack!
                      </>
                    )}
                  </Button>
                )}
              </Card>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card $variant="elevated" style={{ textAlign: 'center' }}>
                <Title $size="h3" $align="center" style={{ marginBottom: 16 }}>
                  {boss.name}
                </Title>

                <div style={{ position: 'relative', marginBottom: 24 }}>
                  <BossRenderer
                    boss={boss}
                    size={180}
                    isAttacking={isAttacking}
                    isHurt={isBossHurt}
                  />

                  {isBossHurt && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [1.5, 1], opacity: [1, 0] }}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: 48,
                        fontWeight: 700,
                        color: '#e04428',
                        textShadow: '0 0 20px #e04428',
                      }}
                    >
                      -{selectedSkull.attackPoints}
                    </motion.div>
                  )}
                </div>

                <div style={{ marginBottom: 16 }}>
                  <HealthBar
                    current={Number(boss.hpPoints)}
                    max={Number(boss.maxHpPoints)}
                    label="HP"
                    size="lg"
                  />
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 24,
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <Sword size={20} color="#e04428" />
                    <Text $size="lg" $weight={700}>
                      {boss.attackPoints}
                    </Text>
                    <Text $size="xs" $color="muted">
                      Attack
                    </Text>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <Trophy size={20} color="#FFB533" />
                    <Text $size="lg" $weight={700}>
                      High
                    </Text>
                    <Text $size="xs" $color="muted">
                      Difficulty
                    </Text>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          <Spacer $size="xl" />

          {isBossDefeated && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <Card
                $variant="elevated"
                style={{
                  textAlign: 'center',
                  background:
                    'linear-gradient(135deg, rgba(255, 181, 51, 0.2), rgba(66, 255, 51, 0.2))',
                  border: '2px solid #FFB533',
                }}
              >
                <Trophy size={64} color="#FFB533" style={{ marginBottom: 16 }} />
                <Title $size="h2">Congratulations!</Title>
                <Spacer $size="sm" />
                <Text $size="lg">You have defeated the boss and earned the reward!</Text>
                <Spacer $size="lg" />
                <Button
                  $variant="success"
                  $size="lg"
                  $glow
                  onClick={handleClaimReward}
                  disabled={isClaiming}
                >
                  {isClaiming ? (
                    <>
                      <Loader2 size={20} className="spin" />
                      Claiming...
                    </>
                  ) : (
                    <>
                      <Trophy size={20} />
                      Claim Reward
                    </>
                  )}
                </Button>
              </Card>
            </motion.div>
          )}

          <Spacer $size="lg" />

          <div style={{ textAlign: 'center' }}>
            <Button $variant="ghost" $size="sm" onClick={handleLeave}>
              <X size={16} />
              Leave Battle
            </Button>
          </div>
        </motion.div>
      </MainContent>
    </Container>
  );
};

export default BattlePage;
