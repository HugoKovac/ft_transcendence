import { createContext, useState } from "react"




type Customise = 
{
    Paddle1Color: string
	SetPaddle1Color: (state: string) => void,
	Paddle2Color: string
	SetPaddle2Color: (state: string) => void,
    BallColor: string
	SetBallColor: (state: string) => void,
    NetColor: string
	SetNetColor: (state: string) => void,
    Skin: string
	SetSkin: (state: string) => void,
}

export const CustomiseContext = createContext<Customise>({
	Paddle1Color: "#fff",
	SetPaddle1Color : () => {},
	Paddle2Color: "#fff",
	SetPaddle2Color : () => {},
    BallColor: "#fff",
    SetBallColor: () => {},
    NetColor : "#fff",
    SetNetColor : () => {},
    Skin : "#fff",
    SetSkin: () => {},
})



export const CustomiseProvider = ({children}:any) => {
    const [Paddle1Color, SetPaddle1Color] = useState("#fff"); 
    const [Paddle2Color, SetPaddle2Color] = useState("#fff"); 
    const [BallColor, SetBallColor] = useState("#fff");
    const [NetColor, SetNetColor] = useState("#fff");
    const [Skin, SetSkin] = useState("default");

    return (
        <CustomiseContext.Provider value={ {Paddle1Color, SetPaddle1Color, 
                                        Paddle2Color, SetPaddle2Color,
                                        BallColor, SetBallColor,
                                        NetColor, SetNetColor,
                                        Skin, SetSkin}}>
            {children}
        </CustomiseContext.Provider>
    )
}