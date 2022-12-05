import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsNumberString, IsString, MaxLength, MinLength, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class newConvDTO{
	@IsNotEmpty()
	@IsNumberString()
	user_id_2: number
}

export class newMsgDTO{
	@IsNotEmpty()
	@IsNumber()
	conv_id: number
	
	@IsNotEmpty()
	@IsString()
	@MaxLength(300)
	message: string
}

export class newGroupConvDTO{
	@IsArray()
	@ArrayMinSize(2)
	user_ids:number[]
	
	@IsNotEmpty()
	@IsString()
	@MaxLength(35)
	group_name:string
}

export class newGroupMsgDTO{
	@IsNotEmpty()
	@IsNumber()
	sender_id:number
	
	@IsNotEmpty()
	@IsNumber()
	group_conv_id:number
	
	@IsNotEmpty()
	@IsString()
	@MaxLength(300)
	message: string
}

export class getConvMsgDTO{
	@IsNotEmpty()
	@IsNumber()
	conv_id:number
}

export class getGroupConvMsgDTO{
	@IsNotEmpty()
	@IsNumber()
	group_conv_id:number
}

export class addUserToGroupDTO{
	@IsNotEmpty()
	@IsNumber()
	group_conv_id:number

	@IsNotEmpty()
	@IsNumber()
	new_user_ids:number[]
}

export class delUserToGroupDTO{
	@IsNotEmpty()
	@IsNumber()
	group_conv_id:number

	@IsNotEmpty()
	@IsNumber()
	del_user_ids:number[]
}

export class changeGroupNameDTO{
	@IsNotEmpty()
	@IsNumber()
	group_conv_id:number

	@IsNotEmpty()
	@IsString()
	@MaxLength(35)
	new_name:string
}
