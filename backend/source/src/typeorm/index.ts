import Conv from './conv.entity'
import { Friends } from './friends.entity'
import { GroupConv } from './groupConv.entity'
import { Message } from './message.entity'
import { User } from './user.entity'
import { BanEnity } from './ban.entity'
import { MuteEntity } from './mute.entity'

const entities = [User, Message, Friends, Conv, GroupConv, BanEnity, MuteEntity]

export {User, Message, Friends, Conv, GroupConv, BanEnity, MuteEntity}
export default entities
