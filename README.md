# Simple Discord Bot [![Build Status](https://travis-ci.com/vladdenisov/simple-discord-bot.svg?branch=master)](https://travis-ci.com/vladdenisov/simple-discord-bot) [![Greenkeeper badge](https://badges.greenkeeper.io/vladdenisov/simple-discord-bot.svg)](https://greenkeeper.io/)
## Installation
1.  `git clone https://github.com/vladdenisov/simple-discord-bot.git`
1.  `cd simple-discord-bot`
1. `npm i or yarn`
1. `Edit json/config.json`
1. `node .`

**If you have linux, before installation you need to run:**
`sudo apt install autoconf libtool g++ make`  
___(if you aren't on Ubuntu, use your package manager to install this packages)___

## MUSIC
### How does it work?
At first you need to run command `{prefix}init`
Bot will create channel called ***music_req***
 **DO NOT RENAME IT!**
 ***To listen to music you just simply need to send link to YouTube video to that channel.***
 You can contol music by adding and removing reactions to main message in **music_req** channel.
 **REACTIONS ARE GENERATED AUTOMATICALLY!**
 ### Music Commands
 #### Playlist 
 *Play playlist from YouTube or YTMusic*
 ##### Syntax 
 {prefix}playlist {link to playlist}
 #### Queue 
*Shows current player queue*
##### Syntax
If you want to see all queue: 
`{prefix}queue`
If you want to see specific position: 
`{prefix}queue {position}`
If you want to **swap** songs position: 
`{prefix}queue mv {position of song1} {position of song2}`


## Commands
**{prefix} is +  *by default***
### 8ball 
*Simple 8ball command*
#### Syntax
`{prefix}8ball {question}`
Also avalible in Russian.
`{prefix}8ball ru {question}`
### Kick 
*Will kick user, if you have right to do it*
#### Syntax
`{prefix}kick {mention a user to kick}`
### Weather 
*Shows weather in specific location*
#### Syntax
`{prefix}weather {zip-code} {two-letter country code}`
## Known Bugs
- Music can stop suddenly on first play on server
- Not showing all error messages 

# TODO
- Add link to embed message in *music_req*  channel
- Remove useless code 
- Rework some functions, that are somehow work
