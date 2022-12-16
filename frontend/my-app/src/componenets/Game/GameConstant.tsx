export interface Paddle
{
    x : number;
    y : number;
    width : number;
    height : number;
    color : string;
    speed : number;
    gravity : number;
    ready : boolean;
}

export interface Ball
{
    x : number;
    y : number;
    width : number;
    height : number;
    color : string;
    speed : number;
    gravity : number;
}

export const CANVASHEIGHT = 600;
export const CANVASWIDTH = 1000;

export const NETWIDTH = 5;
export const NETHEIGHT = CANVASHEIGHT;

export const PADDLEHEIGHT = 100;
export const PADDLEWIDTH = 10;

export const BALLSPEED = 3;
export const BALLGRAVITY = 3;

export const WINCONDITION = 10;