import { throws } from "assert";
import { Lobby } from "../lobby/Lobby";
import { BALLGRAVITY, BALLSPEED, CANVASHEIGHT, CANVASWIDTH, PADDLEHEIGHT, PADDLEWIDTH, WINCONDITION } from "./gameConstant";

interface Paddle
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

interface Ball
{
    x : number;
    y : number;
    width : number;
    height : number;
    color : string;
    speed : number;
    gravity : number;
}

export class Instance 
{
    public Player1Online : boolean = false;
 
    public Player2Online : boolean = false;

    public Player1Ready : boolean = false;

    public Player2Ready : boolean = false;

    public Player1Win : boolean = false;

    public Player2Win : boolean = false;

    public Player1id : string = null;

    public Player2id : string = null;

    public gameEnd = false;
    public gameStart = false;
    public PauseGame = false;

    public Player1UpArrow = false;
    public Player1DownArrow = false;

    public Player2UpArrow = false;
    public Player2DownArrow = false;

    public scoreOne = 0;
    public scoreTwo = 0;

    public numberOfSpectator = 0;

    public endMessage : string = null;


    public Player1 : Paddle = ({
        x : 10,
        y: CANVASHEIGHT / 2 - PADDLEHEIGHT / 2,
        width: PADDLEWIDTH,
        height: PADDLEHEIGHT,
        color: "#fff",
        speed: 1,
        gravity: 3,
        ready: false,
    })

    public Player2 : Paddle = ({
        x : CANVASWIDTH - (PADDLEWIDTH + 10),
        y: CANVASHEIGHT / 2 - PADDLEHEIGHT / 2,  
        width: PADDLEWIDTH,
        height: PADDLEHEIGHT,
        color: "#fff",
        speed: 1,
        gravity: 3,
        ready: false,
    })

    public Ball : Ball = ({
        x : CANVASWIDTH / 2,
        y: CANVASHEIGHT / 2,
        width: 5,
        height: 15,
        color: "#fff",
        speed: BALLSPEED,
        gravity: BALLGRAVITY
    })

    constructor ( private readonly lobby : Lobby ) {}

    public BallBounce( )
    {

        if ( this.Ball.y +  this.Ball.gravity <= 0 ||  this.Ball.y +  this.Ball.gravity >= CANVASHEIGHT )
        {
            this.Ball.gravity = this.Ball.gravity * -1;
            this.Ball.y +=  this.Ball.gravity;
            this.Ball.x +=  this.Ball.speed;
            if ( this.Ball.speed < 0 )
                this.Ball.speed -= 0.2;
            else
                this.Ball.speed += 0.2;
        }
        else //! Doesn't bounce just move
        {
            this.Ball.y +=  this.Ball.gravity;
            this.Ball.x +=  this.Ball.speed;
        }
    }


    public BallCollision( )
    {
        if ( ( (  this.Ball.y +  this.Ball.gravity <= this.Player2.y +  this.Player2.height &&  this.Ball.y +  this.Ball.gravity >=  this.Player2.y ) && 
            ( this.Ball.x +  this.Ball.width +  this.Ball.speed >=  this.Player2.x &&  this.Ball.x +  this.Ball.width +  this.Ball.speed <=  this.Player2.x +  this.Player2.width ) && 
            this.Ball.y +  this.Ball.gravity >  this.Player2.y ))
            {
                this.Ball.speed = this.Ball.speed * -1;
                if ( this.Ball.speed < 0 )
                    this.Ball.speed -= 0.4;
                else
                    this.Ball.speed += 0.4;
            }
        else if (  this.Ball.y +  this.Ball.gravity <=  this.Player1.y +  this.Player1.height && 
            (  this.Ball.x +  this.Ball.speed <=  this.Player1.x +  this.Player1.width &&  this.Ball.x +  this.Ball.speed >=  this.Player1.x ) && 
            this.Ball.y +  this.Ball.gravity >  this.Player1.y)
            {
                this.Ball.speed =  this.Ball.speed * -1;
                if ( this.Ball.speed < 0 )
                    this.Ball.speed -= 0.4;
                else
                    this.Ball.speed += 0.4;
            }
        else if (  this.Ball.x +  this.Ball.speed <  this.Player1.x - 100 )
        {
            this.scoreTwo += 1;
            this.Ball.x = CANVASWIDTH / 2;
            this.Ball.y = CANVASHEIGHT / 2;
            this.Ball.speed = BALLSPEED;
        }
        else if (  this.Ball.x +  this.Ball.speed >  this.Player2.x +  this.Player2.width + 100 )
        {
            this.scoreOne += 1;
            this.Ball.x = CANVASWIDTH / 2;
            this.Ball.y = CANVASHEIGHT / 2;
            this.Ball.speed = BALLSPEED * -1;
        }
    }

    public updateVar()
    {
        if ( this.Player1UpArrow && this.Player1.y - this.Player1.gravity > 0 ) 
            this.Player1.y -= this.Player1.gravity * 4;

        else if ( this.Player1DownArrow && this.Player1.y + this.Player1.height + this.Player1.gravity < CANVASHEIGHT ) 
            this.Player1.y += this.Player1.gravity * 4;

        else if ( this.Player2UpArrow && this.Player2.y - this.Player2.gravity > 0  ) 
            this.Player2.y -= this.Player2.gravity * 4;

        else if ( this.Player2DownArrow && this.Player2.y + this.Player2.height + this.Player2.gravity < CANVASHEIGHT ) 
            this.Player2.y += this.Player2.gravity * 4;
            
    }

    public toggleReadyState( clientId : string )
    {
        if ( clientId === this.Player1id && this.Player1Ready == false )
            this.Player1Ready = true;
        else if ( clientId === this.Player2id && this.Player2Ready == false )
            this.Player2Ready = true;

        else if ( clientId === this.Player1id && this.Player1Ready == true )
            this.Player1Ready = false;
        else if ( clientId === this.Player2id && this.Player2Ready == true )
            this.Player2Ready = false;
        
        if ( this.Player2Ready == true  && this.Player1Ready == true )
            this.gameStart = true;
        
        this.lobby.refreshLobby();
    }

    public Player1ArrowUpRelease()
    {
        this.Player1UpArrow = false;

        this.lobby.refreshLobby();
    }

    public Player1ArrowUpPress()
    {
        this.Player1UpArrow = true;

        this.lobby.refreshLobby();
    }

    public Player1ArrowDownRelease()
    {
        this.Player1DownArrow = false;

        this.lobby.refreshLobby();
    }

    public Player1ArrowDownPress()
    {
        this.Player1DownArrow = true;

        this.lobby.refreshLobby();
    }

    public Player2ArrowUpRelease()
    {
        this.Player2UpArrow = false;

        this.lobby.refreshLobby();
    }

    public Player2ArrowUpPress()
    {
        this.Player2UpArrow = true;

        this.lobby.refreshLobby();
    }

    public Player2ArrowDownRelease()
    {
        this.Player2DownArrow = false;

        this.lobby.refreshLobby();
    }

    public Player2ArrowDownPress()
    {
        this.Player2DownArrow = true;

        this.lobby.refreshLobby();
    }

    public PlayerRetrieveConnection()
    {
        this.PauseGame = false;
    }

    public PlayerLostConnection()
    {
        this.PauseGame = true;
    }

    public finishGame( endMessage: string )
    {
        this.gameEnd = true;
        this.endMessage = endMessage;
    }

    public checkFinish()
    {
        if ( this.scoreOne >= WINCONDITION )
        {
            this.Player1Win = true;
            this.gameEnd = true;
        }
        else if ( this.scoreTwo >= WINCONDITION )
        {
            this.Player2Win = true;
            this.gameEnd = true;
        }
    }

    public gameLoop()
    {
        if ( this.gameStart == true && this.PauseGame == false && this.gameEnd == false )
        {
            this.BallBounce();
            this.BallCollision();
            this.updateVar();
            this.checkFinish();
        }
        this.lobby.refreshLobby();
        // setImmediate(() => {this.gameLoop()} );
    }
}


//*! Tout les calculs de distance, hit, doit se faire cote serveur
//*! Le client doit simplement pouvoir envoyer les requete, et ne doit faire aucun calcul de son cote