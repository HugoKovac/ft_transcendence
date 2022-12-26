import Conv from './conv.entity'
import { Friends } from './friends.entity'
import { GroupConv } from './groupConv.entity'
import { Message } from './message.entity'
import { User } from './user.entity'
import { BanEnity } from './ban.entity'
import { MuteEntity } from './mute.entity'
import { GameHistory } from './gamehistory.entity'
import { GameRanked } from './gameranked.entity'
import { BlockPeople } from './blockPeople.entity'
import { ReqFriend } from './ReqFriend.entity'

const entities = [User, Message, Friends, Conv, GroupConv, BanEnity, MuteEntity, ReqFriend, BlockPeople, GameHistory, GameRanked]

export {User, Message, Friends, Conv, GroupConv, BanEnity, MuteEntity, ReqFriend, BlockPeople, GameHistory, GameRanked}
export default entities
