// import { useAchievementStore } from '@/stores/useAchievementStore'
import { useAnimalStore } from '@/stores/useAnimalStore'
import { useFarmStore } from '@/stores/useFarmStore'
// import { useFishingStore } from '@/stores/useFishingStore'
import { useGameStore } from '@/stores/useGameStore'
import { useHanhaiStore } from '@/stores/useHanhaiStore'
import { useHiddenNpcStore } from '@/stores/useHiddenNpcStore'
import { useHomeStore } from '@/stores/useHomeStore'
import { useInventoryStore } from '@/stores/useInventoryStore'
import { useMiningStore } from '@/stores/useMiningStore'
import { useNpcStore } from '@/stores/useNpcStore'
import { usePlayerStore } from '@/stores/usePlayerStore'
import { useQuestStore } from '@/stores/useQuestStore'
import { useSkillStore } from '@/stores/useSkillStore'
import { useWarehouseStore } from '@/stores/useWarehouseStore'
import { resetAllStoresForNewGame } from './useResetGame'
import { addLog } from './useGameLog'
// import { ACHIEVEMENTS } from '@/data/achievements'
import { HIDDEN_NPCS } from '@/data/hiddenNpcs'
import { NPCS } from '@/data/npcs'
// import { STORY_QUESTS } from '@/data/storyQuests'
import type { AnimalType, FarmMapType, Gender } from '@/types'
import { ANIMAL_DEFS } from '@/data'

const getAnimalName = (type: AnimalType): string => {
  return ANIMAL_DEFS.find(d => d.type === type)?.name ?? type
}

/**
 * 高级角色初始化逻辑
 * 提供高初始值和所有玩法解锁
 */
export const useAdvancedCharacter = () => {
  /**
   * 创建高级角色
   * @param playerName 玩家名称
   * @param gender 玩家性别
   * @param farmType 农场类型
   */
  const initializeAdvancedCharacter = (
    playerName: string,
    gender: Gender,
    farmType: FarmMapType
  ) => {
    // 重置所有游戏 store 到初始状态
    resetAllStoresForNewGame()

    // 初始化基本信息
    const gameStore = useGameStore()
    const playerStore = usePlayerStore()
    const inventoryStore = useInventoryStore()
    const farmStore = useFarmStore()
    const skillStore = useSkillStore()
    const animalStore = useAnimalStore()
    // const fishingStore = useFishingStore()
    const miningStore = useMiningStore()
    const warehouseStore = useWarehouseStore()
    // const achievementStore = useAchievementStore()
    const npcStore = useNpcStore()
    const questStore = useQuestStore()
    const homeStore = useHomeStore()
    const hiddenNpcStore = useHiddenNpcStore()
    const hanhaiStore = useHanhaiStore()

    // 设置玩家身份
    playerStore.setIdentity(playerName, gender)

    // 设置高初始属性
    playerStore.money = 1_000_000_000 // 大量铜钱
    playerStore.stamina = 300 // 高体力
    playerStore.maxStamina = 300 // 高体力上限
    playerStore.bonusMaxStamina = 180 // 高体力上限加成
    playerStore.hp = 1000 // 高生命值
    playerStore.baseMaxHp = 1000

    // 初始化游戏
    gameStore.startNewGame(farmType)

    // 工具升级
    inventoryStore.tools.forEach(tool => {
      tool.tier = 'iridium'
    })

    // 顶级装备
    inventoryStore.addWeapon('abyss_dragon_mace', 'fierce')
    inventoryStore.addRing('abyss_dragon_ring')
    inventoryStore.addRing('shadow_sovereign_ring')
    inventoryStore.addHat('abyss_dragon_horns')
    inventoryStore.addShoe('abyss_dragon_treads')

    // 农场设置 - 较大尺寸
    farmStore.resetFarm(8) // 8×8 大农场

    // 解锁温室
    homeStore.greenhouseUnlocked = true // 解锁温室
    farmStore.upgradeGreenhouse(20)

    // 添加稻草人、避雷针
    farmStore.scarecrows = 5
    farmStore.lightningRods = 1

    // 背包和仓库扩容
    inventoryStore.capacity = 1_000 // 较大背包容量
    warehouseStore.maxChests = 100 // 较大仓库容量
    warehouseStore.unlocked = true // 解锁仓库

    // 技能满级
    skillStore.skills.forEach(skill => {
      skill.level = 10
      skill.exp = 99999

      // 设置天赋
      switch (skill.type) {
        case 'farming':
          skill.perk5 = 'harvester'
          skill.perk10 = 'intensive'
          break
        case 'foraging':
          skill.perk5 = 'herbalist'
          skill.perk10 = 'botanist'
          break
        case 'fishing':
          skill.perk5 = 'fisher'
          skill.perk10 = 'angler'
          break
        case 'mining':
          skill.perk5 = 'miner'
          skill.perk10 = 'prospector'
          break
        case 'combat':
          skill.perk5 = 'fighter'
          skill.perk10 = 'warrior'
          break
      }
    })

    // 动物系统
    // 建造顶级鸡舍和牲口棚
    const coop = animalStore.buildings.find(b => b.type === 'coop')
    if (coop) {
      coop.built = true
      coop.level = 2 // 高级
    }

    const barn = animalStore.buildings.find(b => b.type === 'barn')
    if (barn) {
      barn.built = true
      barn.level = 2 // 高级
    }

    // 建造马厩
    const stable = animalStore.buildings.find(b => b.type === 'stable')
    if (stable) {
      stable.built = true
    }

    // 添加各种动物
    const animalTypes: AnimalType[] = ['chicken', 'peacock', 'cow', 'ostrich']
    animalTypes.forEach((type, index) => {
      for (let i = 0; i < 5; i++) {
        animalStore.animals.push({
          id: `advanced_${type}_${index}_${i}`,
          type: type,
          name: `${getAnimalName(type)}${i + 1}`,
          friendship: 500, // 高好感
          mood: 200, // 高心情
          daysOwned: 5,
          daysSinceProduct: 0,
          wasFed: false,
          fedWith: null,
          wasPetted: false,
          hunger: 0,
          sick: false,
          sickDays: 0,
        })
      }
    })

    // 添加马匹
    animalStore.animals.push({
      id: 'horse_advanced',
      type: 'horse',
      name: '千里驹',
      friendship: 500,
      mood: 200,
      daysOwned: 5,
      daysSinceProduct: 0,
      wasFed: false,
      fedWith: null,
      wasPetted: false,
      hunger: 0,
      sick: false,
      sickDays: 0,
    })

    // 添加宠物
    animalStore.adoptPet('cat', '招财猫')
    animalStore.pet!.friendship = 1000

    // 钓鱼系统
    inventoryStore.addItem('standard_bait', 500)
    inventoryStore.addItem('wild_bait', 500)
    inventoryStore.addItem('spinner', 50)

    // 采矿系统
    // 解锁矿洞进度
    miningStore.safePointFloor = 120

    // 添加高级采矿装备
    inventoryStore.addItem('bomb', 500)
    inventoryStore.addItem('mega_bomb', 500)

    // 添加矿石库存
    const ores = ['copper_ore', 'iron_ore', 'gold_ore', 'iridium_ore', 'quartz']
    ores.forEach(ore => {
      inventoryStore.addItem(ore, 500)
    })

    // 商店系统

    // 添加各种种子
    const seeds = [
      'seed_cabbage',
      'seed_wheat',
      'seed_corn',
      'seed_tomato',
      'seed_potato',
      'seed_carrot',
      'seed_strawberry',
      'seed_blueberry',
    ]
    seeds.forEach(seed => {
      inventoryStore.addItem(seed, 500)
    })

    // 添加各种材料
    const materials = ['wood', 'bamboo', 'fish_feed', 'nourishing_feed']
    materials.forEach(material => {
      inventoryStore.addItem(material, 2000)
    })

    // 添加各种肥料
    const fertilizers = [
      'basic_fertilizer',
      'quality_fertilizer',
      'speed_fertilizer',
    ]
    fertilizers.forEach(fertilizer => {
      inventoryStore.addItem(fertilizer, 500)
    })

    // 添加洒水器
    inventoryStore.addItem('gold_sprinkler', 10)

    // 成就系统
    // 解锁所有成就（设置成就已完成状态）
    // achievementStore.completedAchievements = ACHIEVEMENTS.map(a => a.id)

    // 普通NPC系统 - 设置所有普通NPC为满友好度
    NPCS.forEach(npc => {
      const state = npcStore.getNpcState(npc.id)
      if (state) {
        state.friendship = 2500 // 满友好度（10心）
      }
    })

    // 隐藏NPC（仙灵）系统 - 解锁所有隐藏NPC并设置高缘分
    HIDDEN_NPCS.forEach(npc => {
      const state = hiddenNpcStore.getHiddenNpcState(npc.id)
      if (state) {
        state.discoveryPhase = 'revealed' // 解锁发现阶段
        state.affinity = 2500 // 高缘分值
        // 解锁所有能力
        npc.abilities.forEach(ability => {
          if (!state.unlockedAbilities.includes(ability.id)) {
            state.unlockedAbilities.push(ability.id)
          }
        })
      }
    })

    // 任务系统
    // 完成所有主线任务
    // questStore.completedMainQuests = STORY_QUESTS.map(q => q.id)
    questStore.completedQuestCount = 100 // 大量已完成任务

    // 房屋系统
    homeStore.farmhouseLevel = 3 // 升级酒窖宅院

    // 瀚海系统 - 直接解锁
    hanhaiStore.unlocked = true

    // 日志
    addLog('高级角色创建成功！所有玩法已解锁，祝您游戏愉快！')

    return true
  }

  return {
    initializeAdvancedCharacter,
  }
}
