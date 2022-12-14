import Conv from './conv.entity'
import { Friends } from './friends.entity'
import { GroupConv } from './groupConv.entity'
import { Message } from './message.entity'
import { User } from './user.entity'
import { BanEnity } from './ban.entity'

const entities = [User, Message, Friends, Conv, GroupConv, BanEnity]

export {User, Message, Friends, Conv, GroupConv, BanEnity}
export default entities
