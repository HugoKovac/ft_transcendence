import { ArrayMinSize, IsArray, IsBoolean, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

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

export class newAdminDTO{
	@IsNotEmpty()
	@IsNumber()
	group_conv_id:number

	@IsArray()
	admin_ids:number[]
}

export class banUserDTO{
	@IsNotEmpty()
	@IsNumber()
	group_conv_id:number

	@IsNotEmpty()
	@IsNumber()
	user_id:number

	@IsNotEmpty()
	@IsNumber()
	to:number
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

export class newPrivateGroupMsgDTO{
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

	@IsNotEmpty()
	@IsString()
	@MaxLength(35)
	password: string
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

export class getGroupSecretConvMsgDTO{
	@IsNotEmpty()
	@IsNumber()
	group_conv_id:number

	@IsNotEmpty()
	@IsString()
	password:string
}

export class addUserToGroupDTO{
	@IsNotEmpty()
	@IsNumber()
	group_conv_id:number

	@IsOptional()
	@IsArray()
	new_user_ids:number[]
}

export class delUserToGroupDTO{
	@IsNotEmpty()
	@IsNumber()
	group_conv_id:number

	@IsOptional()
	@IsArray()
	del_user_ids:number[]
}

export class changeGroupNameDTO{
	@IsNotEmpty()
	@IsNumber()
	group_conv_id:number

	@IsOptional()
	@IsString()
	@MaxLength(35)
	new_name:string
}

export class refreshConvDTO{
	@IsNotEmpty()
	@IsNumber()
	group_conv_id:number
}

export class changeVisibilityDTO{
	@IsNotEmpty()
	@IsNumber()
	group_conv_id:number

	@IsOptional()
	@IsBoolean()
	isPrivate:boolean
}

export class groupVisibilityDTO{
	@IsNotEmpty()
	@IsNumber()
	group_conv_id:number
}

export class setPasswordDTO{
	@IsNotEmpty()
	@IsNumber()
	group_conv_id:number

	@IsNotEmpty()
	@IsString()
	@MaxLength(35)
	@MinLength(12)
	password:string
}
