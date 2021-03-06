# BotCoin
BotCoin is an IDLE-MMO-RPG-IRC game in which you mine worthless virtual gold, designed by/for the #CBNA channel on Freenode.  

This page will change as new features are implemented or defined on paper, so make sure to take a look often  
The project is still WIP.

## Documentation

### TimeCredits
Used to make actions, you earn them by simply existing (and being registered to the irc server) for now.  
You earn one TimeCredit every minute you exist.  
You can see how many TimeCredits you have with the `!time` command.  

### Mine
Allows to mine gold, but costs time  
Example commands:  
  - `!mine`: mine as much time you can (consume all `TimeCredit`)
  - `!mine 42m`: mine for 42 minutes
  - `!mine 1h`: mine for 60 minutes
  - `!mine 1d`: mine for 1440 minutes
  - `!mine 1 day, 1 hour and 1 minute`: mine for 1501min (1d + 1h + 1min)
  - But this also works : `/me goes to the mine for 42 minutes`
  - Basically you must have the keywords `mine` to mine and you can specify or not for how long. Almost all features work like that

### Forex
I went a little crazy and implemented a forex connector using realtime data from the EUR/USD forex market  
You can now use your mined gold to create forex positions like a real trader !  
Positions are closed automaticaly when meeting required conditions (`profit|loss`)  

There are 4 commands for forex  

The first one `!forex`, will simply tell you the current rates for EUR/USD  

The second one is to create a forex position, the command itself has 4 components :
  - `buy|long` and `sell|short`: the direction of the position. Buy/long are the same, as for sell/short.
  - `gold` or `g`: how much gold you want to invest
  - `profit`: at which profit you want the position to auto close (min `0.01` max `0.5`, `0.5` by default)
  - `loss`: at which loss you want the position to auto close (min `0.01` max `0.5`, `0.5` by default)

Example commands to create positions:  
  - `!forex buy 1gold`: create a long position for 1 gold
  - `!forex long 1g lever 1000 profit 0.2 loss 0.4`: create a long position for 1gold with lever of 1000, auto closing when either +20% profit or -40% loss

You can also check your current positions with `!forex positions` or `!forex pos`  

Finally, you can close positions with `!forex close ID` where `ID` is the `rowid` of the position

# Features

## Existing features:
  - Temporal Actions : Each action takes a certain amount of time
    - Players have `Time Credits`, earned by just waiting, that can be used to do things
    - Each `Time Credit` represents `one minute`
  - Mining
    - Costs `Time Credits` and gives `Gold` that can be used to... Nothing, for now

## Planned features:

### Pickaxes
  - Increase chances of finding `Gold` when mining (increases minimum gold when mining)
  - Can be crafted (costs `1 Gold` && `24h of Time Credits`) or looted
  - Multiple rarities
    - Common : +[0-10]% minimum gold when mining
    - Uncommon(1/10 chances when crafting): +[11-20]% minimum gold when mining
    - Rare(1/100 chances when crafting) : +[21-40]% minimum gold when mining
    - Epic(1/1000 chances when crafting) : +[41-60]% minimum gold when mining
    - Legendary(1/10000 chances when crafting): +[61-80]% minimum gold when mining

### Player Homes
  - Players can build their own homes
  - It cost time and gold to build a home
  - Homes can be crafted in multiple steps
  - Homes are upgradable
    - Tiers:
      - Hut
      - Cottage
      - House
      - Mansion
      - Tower
      - Castle
  - Furnitures can be purchased
    - Safe : Store your Gold
    - PetHouse : Allow to house a Pet (see below)
    - Enchanting Table : Allow to enchant Pickaxes (see below)

### Pets
  - Can only be looted
  - Requires a Player Home
  - Needs to be fed (costs nothing except a little time)
  - Can DIE if owner does not take care of it
  - Occasionnaly finds `Gems` when mining

### Gems
  - Used to `Enchant` Pickaxes
  - Gem Types and bonus
    - Diamond : +1% critic
    - Ruby : +0.8% critic
    - Emerald: +0.6% critic
    - Sapphire : +0.4% critic
    - Topaz : +0.2% critic
    - Amethyst : +0.1% critic
    - Amber : +0.05% critic

### Enchantments
  - Players can enchant Pickaxes
  - Enchantments cost `Gems`
  - Each new Enchantment have a chance to **BREAK** the Pickaxe based on its rarity
    - Common : 1/4 chances to break
    - Uncommon : 1/8 chances to break
    - Rare : 1/16 chances to break
    - Epic : 1/32 chances to break
    - Legendary : 1/64 chances to break

### Repair broken Pickaxes
  - Your Legendary Pickaxe just broke when you enchanted it for the first time ? Bad luck...
  - Repair your Pickaxes with Gold !
  - Costs more for higher rarity Pickaxes
    - Common : 1 Gold and 1 Day of Time Credits
    - Uncommon : 2 Gold
    - Rare : 3 Gold
    - Epic : 4 Gold
    - Legendary : 5 Gold

### Trading
  - Give and receive money from others

### Events
  - At random intervals, events are thrown at the players
  - Event stay available for a certain duration only
  - Events cost a certain amount of `Time Credits` to participate
  - Players can register to available events if they have enough `Time Credits`

### Guilds !
  - Guild tax : Guild masters can define a tax percentage. Each time a guild member earn gold, a tax is deducted and added to the guilds bank
  - HeadQuarter : When you create a guild, you basically buy a headquarter that you can upgrade to unlock bonuses. Guild members are considered in the headquarter when they are available (have no temporal action in process)
    - Bank : Tax money is stored in here. You can upgrade its max durability and repair it when damaged. Repairing it is cheapest than upgrading it
    - Defenses : They defend your headquarter during attacks, dealing damages to opponents. They do not need a player operating it, and cannot be completely destroyed
    - War machines : They are used when attacking another guild, dealing damages to opponents. Every war machine require at least one player to operate it, and can be completely destroyed
  - Guild PvP : Guilds can attack other Guilds headquarters to steal their gold.
    - A guild master can order a war on a specified guild. Each available member then have 10 minutes to confirm that they participate
    - War machines are automatically used by attackers if enough members can operate them
    - The war takes form of attacks repeated periodically until one side is defeated or surrenders.
    - Defender guild automatically use all defenses
    - During an attack, each side inflict damages to the other at the same time, total damages is calculated by the base level of players, power of their pickaxes and power of war machines or defenses.
      - Damages are first applied respectively on war machines and defenses if any until they are destroyed
      - If there is no war machine anymore and the defenders does more damages than attackers, the defenders win the war
      - If attackers breaks all the defenses, they then damage the bank until open
      - When the bank is opened, attackers win the war and returns to their headquarter with all the banks gold