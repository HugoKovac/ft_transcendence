import Conv from './conv.entity'
import { Friends } from './friends.entity'
import { GroupConv } from './groupConv.entity'
import { Message } from './message.entity'
import { ReqFriend } from './ReqFriend.entity'
import { User } from './user.entity'
import { BlockPeople } from './blockPeople.entity'

const entities = [User, Message, Friends, Conv, GroupConv, ReqFriend, BlockPeople]

export {User, Message, Friends, Conv, GroupConv, ReqFriend, BlockPeople}
export default entities
