import Conv from './conv.entity'
import { Friends } from './friends.entity'
import { GroupConv } from './groupConv.entity'
import { Message } from './message.entity'
import { ReqFriend } from './ReqFriend.entity'
import { User } from './user.entity'
import { BanEnity } from './ban.entity'
import { MuteEntity } from './mute.entity'
import { BlockPeople } from './blockPeople.entity'

const entities = [User, Message, Friends, Conv, GroupConv, BanEnity, MuteEntity, , ReqFriend, BlockPeople]

export {User, Message, Friends, Conv, GroupConv, ReqFriend, BlockPeople, BanEnity, MuteEntity}
export default entities
