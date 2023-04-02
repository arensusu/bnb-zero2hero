// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./lpSusuToken.sol";
import "./SusuToken.sol";

struct UserInfo {
    uint256 amount;
    uint256 rewardDebt;
}

struct PoolInfo {
    ERC20 lpToken;
    uint256 allocPoint;
    uint256 lastRewardBlock; 
    uint256 accRewardPerShare;
}

contract StakingPool {
    bool public isInitialized = false;
    uint256 public totalAllocPoint = 0;
    uint256 public startBlock = 0;

    SusuToken public rewardToken;
    PoolInfo[] public poolInfo;
    mapping(uint256 => mapping(address => UserInfo)) public userInfo;

    event Deposit(address indexed user, uint256 indexed pid, uint256 amount);
    event Withdraw(address indexed user, uint256 indexed pid, uint256 amount);

    constructor() {}

    modifier initializer() {
        require(!isInitialized, 'Had been initialized');
        isInitialized = true;
        _;
    }

    function initialize(SusuToken _token) public { rewardToken = _token; }

    function add(ERC20 _lpToken) public {
        uint256 lastRewardBlock = block.number > startBlock ? block.number : startBlock;
        uint256 allocPoint = 1000;
        totalAllocPoint += allocPoint;
        poolInfo.push(PoolInfo({
            lpToken: _lpToken,
            allocPoint: allocPoint,
            lastRewardBlock: lastRewardBlock,
            accRewardPerShare: 0
        }));
    }

    function deposit(uint256 _pid, uint256 _amount) public {
        PoolInfo memory pool = poolInfo[_pid];
        UserInfo memory user = userInfo[_pid][msg.sender];

        if (user.amount > 0) {
            uint256 reward = user.amount * pool.accRewardPerShare - user.rewardDebt;
            rewardToken.transfer(msg.sender, reward);
        }

        pool.lpToken.transferFrom(msg.sender, address(this), _amount);
        user.amount += _amount;
        user.rewardDebt = user.amount * pool.accRewardPerShare;

        emit Deposit(msg.sender, _pid, _amount);
    }

    function withdraw(uint256 _pid, uint256 _amount) public {
        PoolInfo memory pool = poolInfo[_pid];
        UserInfo memory user = userInfo[_pid][msg.sender];

        require(user.amount > _amount, "No sufficient fund");
        uint256 reward = user.amount * pool.accRewardPerShare - user.rewardDebt;
        rewardToken.transfer(msg.sender, reward);

        rewardToken.transfer(msg.sender, _amount);
        user.amount -= _amount;
        user.rewardDebt = user.amount * pool.accRewardPerShare;

        emit Withdraw(msg.sender, _pid, _amount);
    }
}