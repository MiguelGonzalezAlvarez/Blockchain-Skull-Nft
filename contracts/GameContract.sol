// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract SkullGameContract is ERC721, Ownable, ReentrancyGuard, Pausable {
    // ================================== Declaraciones iniciales ========================================
    uint256 private skullCounter;
    uint256 public mintCost = 0.01 ether;
    uint256 public maxSkullsPerUser = 10;
    
    mapping(address => uint256) public userSkullCount;
    mapping(address => bool) public whitelistedMinters;
    mapping(uint256 => uint256) public lastAttackTime;
    
    uint256 public attackCooldown = 1 minutes;
    uint256 public levelUpCostBase = 0.001 ether;
    uint256 public reviveCostBase = 0.005 ether;
    uint256 public attackCostBase = 0.0001 ether;

    // ================================== Estructuras de datos ========================================
    struct Skull {
        uint256 id;
        string name;
        uint256 dna;
        uint8 level;
        uint8 rarity;
        uint256 maxHpPoints;
        uint256 hpPoints;
        uint256 attackPoints;
        uint256 experience;
        uint256 lastBattleTime;
    }

    struct TreeBoss {
        string name;
        uint256 maxHpPoints;
        uint256 hpPoints;
        uint256 attackPoints;
        string imageURI;
        uint256 reward;
    }

    // ================================== Storage ========================================
    Skull[] public skulls;
    TreeBoss public treeBoss;
    address public winnerAddress;
    bool public gameActive = true;

    // ================================== Eventos ========================================
    event SkullMinted(address indexed owner, uint256 indexed id, uint256 dna, uint8 rarity);
    event SkullLevelUp(address indexed owner, uint256 indexed id, uint8 newLevel);
    event SkullRevived(address indexed owner, uint256 indexed id);
    event BossAttacked(address indexed owner, uint256 indexed skullId, uint256 damage, bool isBossDefeated);
    event BossSpawned(string name, uint256 hp, uint256 reward);
    event RewardClaimed(address indexed winner, uint256 amount);
    event GamePaused(address indexed owner);
    event GameResumed(address indexed owner);
    event WhitelistUpdated(address indexed account, bool status);

    // ================================== Modificadores ========================================
    modifier whenGameActive() {
        require(gameActive, "Game is paused");
        _;
    }

    modifier onlySkullOwner(uint256 _skullId) {
        require(ownerOf(_skullId) == msg.sender, "Not the skull owner");
        _;
    }

    modifier withinCooldown(uint256 _skullId) {
        require(
            block.timestamp >= lastAttackTime[_skullId] + attackCooldown,
            "Attack on cooldown"
        );
        _;
    }

    // ================================== Constructor ========================================
    constructor(
        string memory _name,
        string memory _symbol,
        string memory _bossName,
        uint256 _bossMaxHp,
        uint256 _bossAttack,
        string memory _bossImageURI,
        uint256 _bossReward
    ) ERC721(_name, _symbol) {
        treeBoss = TreeBoss({
            name: _bossName,
            maxHpPoints: _bossMaxHp,
            hpPoints: _bossMaxHp,
            attackPoints: _bossAttack,
            imageURI: _bossImageURI,
            reward: _bossReward
        });
        emit BossSpawned(_bossName, _bossMaxHp, _bossReward);
    }

    // ================================== Funciones de emergencia ========================================
    function pause() external onlyOwner whenNotPaused {
        _pause();
        gameActive = false;
        emit GamePaused(msg.sender);
    }

    function unpause() external onlyOwner whenPaused {
        _unpause();
        gameActive = true;
        emit GameResumed(msg.sender);
    }

    // ================================== Funciones de configuración ========================================
    function setMintCost(uint256 _cost) external onlyOwner {
        mintCost = _cost;
    }

    function setMaxSkullsPerUser(uint256 _max) external onlyOwner {
        maxSkullsPerUser = _max;
    }

    function setAttackCooldown(uint256 _cooldown) external onlyOwner {
        attackCooldown = _cooldown;
    }

    function setWhitelistStatus(address _account, bool _status) external onlyOwner {
        whitelistedMinters[_account] = _status;
        emit WhitelistUpdated(_account, _status);
    }

    // ================================== Funciones de usuario ========================================
    function createSkull(string memory _name) 
        external 
        payable 
        whenGameActive 
        whenNotPaused 
        nonReentrant 
    {
        require(msg.value >= mintCost, "Insufficient payment");
        require(userSkullCount[msg.sender] < maxSkullsPerUser, "Max skulls reached");
        
        uint256 randomRarity = _createRandomNumber(100);
        uint256 randomDna = _createRandomNumber(10**16);
        uint256 baseHp = _createRandomNumber(100);
        
        uint256 maxHp = baseHp * (randomRarity + 10);
        uint256 attack = (_createRandomNumber(20) + 5) * (randomRarity / 10 + 1);

        Skull memory newSkull = Skull({
            id: skullCounter,
            name: _name,
            dna: randomDna,
            level: 1,
            rarity: uint8(randomRarity),
            maxHpPoints: maxHp,
            hpPoints: maxHp,
            attackPoints: attack,
            experience: 0,
            lastBattleTime: 0
        });

        skulls.push(newSkull);
        _safeMint(msg.sender, skullCounter);
        
        userSkullCount[msg.sender]++;
        
        emit SkullMinted(msg.sender, skullCounter, randomDna, uint8(randomRarity));
        
        skullCounter++;
    }

    function levelUpSkull(uint256 _skullId) 
        external 
        payable 
        whenGameActive 
        nonReentrant 
        onlySkullOwner(_skullId) 
    {
        Skull storage skull = skulls[_skullId];
        
        uint256 cost = _calculateLevelUpCost(skull.level, skull.rarity);
        require(msg.value >= cost, "Insufficient payment");
        
        skull.level++;
        skull.maxHpPoints += 500;
        skull.attackPoints += 50;
        skull.hpPoints = skull.maxHpPoints;
        skull.experience += 100;
        
        emit SkullLevelUp(msg.sender, _skullId, skull.level);
    }

    function reviveSkull(uint256 _skullId) 
        external 
        payable 
        whenGameActive 
        nonReentrant 
        onlySkullOwner(_skullId) 
    {
        Skull storage skull = skulls[_skullId];
        require(skull.hpPoints == 0, "Skull is alive");
        
        uint256 cost = _calculateReviveCost(skull.rarity);
        require(msg.value >= cost, "Insufficient payment");
        
        skull.hpPoints = skull.maxHpPoints;
        
        emit SkullRevived(msg.sender, _skullId);
    }

    function attackBoss(uint256 _skullId) 
        external 
        payable 
        whenGameActive 
        nonReentrant 
        onlySkullOwner(_skullId) 
        withinCooldown(_skullId) 
    {
        Skull storage skull = skulls[_skullId];
        
        require(skull.hpPoints > 0, "Skull is dead");
        require(treeBoss.hpPoints > 0, "Boss already defeated");
        
        uint256 cost = _calculateAttackCost(skull.rarity, skull.level);
        require(msg.value >= cost, "Insufficient payment");
        
        lastAttackTime[_skullId] = block.timestamp;
        skull.lastBattleTime = block.timestamp;
        
        // Player attacks boss
        if (treeBoss.hpPoints <= skull.attackPoints) {
            treeBoss.hpPoints = 0;
            winnerAddress = msg.sender;
            emit BossAttacked(msg.sender, _skullId, skull.attackPoints, true);
        } else {
            treeBoss.hpPoints -= skull.attackPoints;
            emit BossAttacked(msg.sender, _skullId, skull.attackPoints, false);
            
            // Boss counterattacks
            if (skull.hpPoints <= treeBoss.attackPoints) {
                skull.hpPoints = 0;
            } else {
                skull.hpPoints -= treeBoss.attackPoints;
            }
        }
        
        skull.experience += 10;
    }

    function withdrawWinner() 
        external 
        payable 
        nonReentrant 
    {
        require(winnerAddress == msg.sender, "Not the winner");
        require(treeBoss.hpPoints == 0, "Boss not defeated");
        
        uint256 reward = address(this).balance;
        require(reward > 0, "No reward available");
        
        winnerAddress = address(0);
        treeBoss.hpPoints = treeBoss.maxHpPoints;
        
        (bool success, ) = payable(msg.sender).call{value: reward}("");
        require(success, "Transfer failed");
        
        emit RewardClaimed(msg.sender, reward);
    }

    // ================================== Funciones de consulta ========================================
    function getUserSkulls(address _owner) 
        external 
        view 
        returns (Skull[] memory) 
    {
        uint256 balance = balanceOf(_owner);
        Skull[] memory result = new Skull[](balance);
        uint256 index = 0;
        
        for (uint256 i = 0; i < skulls.length && index < balance; i++) {
            if (ownerOf(i) == _owner) {
                result[index] = skulls[i];
                index++;
            }
        }
        
        return result;
    }

    function getSkull(uint256 _skullId) 
        external 
        view 
        returns (Skull memory) 
    {
        require(_skullId < skulls.length, "Invalid skull ID");
        return skulls[_skullId];
    }

    function getBossInfo() 
        external 
        view 
        returns (TreeBoss memory) 
    {
        return treeBoss;
    }

    function getContractBalance() 
        external 
        view 
        returns (uint256) 
    {
        return address(this).balance;
    }

    // ================================== Funciones internas ========================================
    function _createRandomNumber(uint256 _mod) 
        internal 
        view 
        returns (uint256) 
    {
        return uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,
                    msg.sender,
                    skullCounter
                )
            )
        ) % _mod;
    }

    function _calculateLevelUpCost(uint256 _level, uint256 _rarity) 
        internal 
        pure 
        returns (uint256) 
    {
        return levelUpCostBase * _level * (_rarity / 10 + 1);
    }

    function _calculateReviveCost(uint256 _rarity) 
        internal 
        pure 
        returns (uint256) 
    {
        return reviveCostBase * (_rarity / 10 + 1);
    }

    function _calculateAttackCost(uint256 _rarity, uint256 _level) 
        internal 
        pure 
        returns (uint256) 
    {
        return attackCostBase * (_rarity / 10 + 1) * _level;
    }

    // ================================== Funciones de propietario ========================================
    function withdraw() 
        external 
        onlyOwner 
        nonReentrant 
    {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Transfer failed");
    }

    function setNewBoss(
        string memory _name,
        uint256 _maxHp,
        uint256 _attack,
        string memory _imageURI,
        uint256 _reward
    ) 
        external 
        onlyOwner 
    {
        treeBoss = TreeBoss({
            name: _name,
            maxHpPoints: _maxHp,
            hpPoints: _maxHp,
            attackPoints: _attack,
            imageURI: _imageURI,
            reward: _reward
        });
        winnerAddress = address(0);
        emit BossSpawned(_name, _maxHp, _reward);
    }

    receive() external payable {}
}
