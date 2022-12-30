import Conv from './conv.entity'
import { Friends } from './friends.entity'
import { GroupConv } from './groupConv.entity'
import { Message } from './message.entity'
import { User } from './user.entity'
import { BanEnity } from './ban.entity'
import { MuteEntity } from './mute.entity'
import { GameRanked } from './gameranked.entity'
import { BlockPeople } from './blockPeople.entity'
import { ReqFriend } from './ReqFriend.entity'
import { ActiveGame } from './activegame.entity'
import { Game } from './game.entity'

const entities = [User, Message, Friends, Conv, GroupConv, BanEnity, MuteEntity, ReqFriend, BlockPeople, GameRanked, ActiveGame, Game]

export {User, Message, Friends, Conv, GroupConv, BanEnity, MuteEntity, ReqFriend, BlockPeople, GameRanked, ActiveGame, Game}
export default entities
