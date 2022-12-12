import { useContext, useEffect, useRef, useState } from "react";
import { WebsocketContext } from "./WebsocketContext";
import '../../styles/GameInstance.css';
import NavBar from '../../componenets/NavBar';
import { clearInterval } from "timers";
import { ServerEvents } from "../../shared/server/Server.Events";
import { LobbyState } from "./LobbyState";
import { useRecoilValue } from "recoil";
import { ClientEvents } from "../../shared/client/Client.Events";

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


const CANVASHEIGHT = 400;
const CANVASWIDTH = 700;

const NETWIDTH = 5;
const NETHEIGHT = CANVASHEIGHT;

const PADDLEHEIGHT = 100;
const PADDLEWIDTH = 10;

const BALLSPEED = 8;
const BALLGRAVITY = 4;

export default function GameInstance()
{
    const CurrentLobbyState = useRecoilValue(LobbyState);
    const socket = useContext(WebsocketContext);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [Player1] = useState<Paddle>({
        x : 10,
        y: CANVASHEIGHT / 2 - PADDLEHEIGHT / 2,
        width: PADDLEWIDTH,
        height: PADDLEHEIGHT,
        color: "#fff",
        speed: 1,
        gravity: 3,
        ready: false,
    })

    const [Player2] = useState<Paddle>({
        x : CANVASWIDTH - (PADDLEWIDTH + 10),
        y: CANVASHEIGHT / 2 - PADDLEHEIGHT / 2,  
        width: PADDLEWIDTH,
        height: PADDLEHEIGHT,
        color: "#fff",
        speed: 1,
        gravity: 3,
        ready: false,
    })

    const [Ball] = useState<Ball>({
        x : CANVASWIDTH / 2,
        y: CANVASHEIGHT / 2,
        width: 5,
        height: 15,
        color: "#fff",
        speed: BALLSPEED,
        gravity: BALLGRAVITY
    })

    let gameStart = false;

    let Player1UpArrow = false;
    let Player1DownArrow = false;

    let Player2UpArrow = false;
    let Player2DownArrow = false;

    let scoreOne = 0;
    let scoreTwo = 0;

    const drawPaddle = ( ( config : Paddle ) => {

        if (canvasRef.current)
        {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            if (context) 
            {   
                context.fillStyle = config.color;
                context.fillRect(config.x, config.y, config.width, config.height);
            }
        }
    });

    const drawBall = ( ( config : Ball ) => {
        if (canvasRef.current)
        {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            if (context) 
            {
                context.fillStyle = config.color;
                context.beginPath();
                context.arc(config.x, config.y, config.width, 0, Math.PI * 2, true);
                context.closePath();
                context.fill();
            }
        }   
    });

    const drawLine = ( () => {

        if (canvasRef.current)
        {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            if (context) 
            {
                context.font = "18px Arial";
                context.fillStyle = "#fff";
                context.fillRect(CANVASWIDTH / 2, 0, NETWIDTH, NETHEIGHT);
            }
        }
    })

    const drawScore = ( ( ) => {
        if (canvasRef.current)
        {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            if (context) 
            {
                context.font = "18px Arial";
                context.fillStyle = "#fff";
                context.fillText(scoreOne.toString(), canvas.width / 2 - 60, 30);
                context.fillText(scoreTwo.toString(), canvas.width / 2 + 60, 30);
            }
        }
    });

    const BallBounce = ( ( Ball : Ball ) => {

        let canvasHeight = 0;
        if (canvasRef.current)
            canvasHeight = canvasRef.current.height;

        if ( Ball.y + Ball.gravity <= 0 || Ball.y + Ball.gravity >= canvasHeight )
        {
            Ball.gravity = Ball.gravity * -1;
            Ball.y += Ball.gravity;
            Ball.x += Ball.speed;
        }
        else
        {
            Ball.y += Ball.gravity;
            Ball.x += Ball.speed;
        }
    });

    const BallCollision = ( ( Ball : Ball ) => {
        if ( ( ( Ball.y + Ball.gravity <= Player2.y + Player2.height && Ball.y + Ball.gravity >= Player2.y ) && 
            (Ball.x + Ball.width + Ball.speed >= Player2.x && Ball.x + Ball.width + Ball.speed <= Player2.x + Player2.width ) && 
            Ball.y + Ball.gravity > Player2.y ))
            {
                Ball.speed = Ball.speed * -1;
            }
        else if ( Ball.y + Ball.gravity <= Player1.y + Player1.height && 
            ( Ball.x + Ball.speed <= Player1.x + Player1.width && Ball.x + Ball.speed >= Player1.x ) && 
            Ball.y + Ball.gravity > Player1.y)
            {
                Ball.speed = Ball.speed * -1;
            }
        else if ( Ball.x + Ball.speed < Player1.x - 100 )
        {
            scoreTwo += 1;
            Ball.x = CANVASWIDTH / 2;
            Ball.y = CANVASHEIGHT / 2;
            Ball.speed = BALLSPEED;
        }
        else if ( Ball.x + Ball.speed > Player2.x + Player2.width + 100 )
        {
            scoreOne += 1;
            Ball.x = CANVASWIDTH / 2;
            Ball.y = CANVASHEIGHT / 2;
            Ball.speed = BALLSPEED * -1;
        }
    });
    
    const clear = ( ( ) => {
        if (canvasRef.current)
        {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            if (context)
                context.clearRect(0, 0, canvas.width, canvas.height);
        }
    });

    const waitForOpponent = ( () => {

        if (canvasRef.current)
        {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            if (context)
            {
                context.font = "18px Arial";
                context.fillStyle = "#fff";
                if ( Player1.ready == false )
                    context.fillText("Waiting for player1....", canvas.width / 10, 30);
                if ( Player2.ready == false )
                    context.fillText("Waiting for player2....", canvas.width - canvas.width / 3, 30);
            }
        }   
    })

    function Player1keyDownHandler( event : any )
    {
        if ( event.defaultPrevented ) 
            return ;

        if ( event.code === "ArrowUp" ) 
            socket.emit(ClientEvents.Player1ArrowUpPress);

        else if ( event.code === "ArrowDown"  ) 
            socket.emit(ClientEvents.Player1ArrowDownPress);
        
        event.preventDefault();
    }

    function Player2keyDownHandler( event : any )
    {
        if ( event.defaultPrevented ) 
            return ;

        if ( event.code === "ArrowUp") 
            socket.emit(ClientEvents.Player2ArrowUpPress);

        else if ( event.code === "ArrowDown"  ) 
            socket.emit(ClientEvents.Player2ArrowDownPress);
        
        event.preventDefault();
    }

    function Player1keyUpHandler( event : any )
    {
        if ( event.defaultPrevented ) 
            return ;

        console.log("PLAYER 1");
        console.log(event.code);

        if ( event.code === "Space" && gameStart == false )
            socket.emit(ClientEvents.ReadyState);

        if ( event.code === "ArrowUp") 
            socket.emit(ClientEvents.Player1ArrowUpRelease);

        else if ( event.code === "ArrowDown"  ) 
            socket.emit(ClientEvents.Player1ArrowDownRelease);
            
        event.preventDefault();
    }

    function Player2keyUpHandler( event : any )
    {
        if ( event.defaultPrevented ) 
            return ;

            console.log("PLAYER 2");
            console.log(event.code);

        if ( event.code === "Space" && gameStart == false )
            socket.emit(ClientEvents.ReadyState);

        if ( event.code === "ArrowUp") 
            socket.emit(ClientEvents.Player2ArrowUpRelease);

        else if ( event.code === "ArrowDown"  ) 
            socket.emit(ClientEvents.Player2ArrowDownRelease);
            
        event.preventDefault();
    }

    const updateVar = ( () =>
    {
        let canvasHeight = 0;
        if (canvasRef.current)
            canvasHeight = canvasRef.current.height;

        if ( Player1UpArrow && Player1.y - Player1.gravity > 0 ) 
            Player1.y -= Player1.gravity * 4;

        else if ( Player1DownArrow && Player1.y + Player1.height + Player1.gravity < canvasHeight ) 
            Player1.y += Player1.gravity * 4;

        else if ( Player2UpArrow && Player2.y - Player2.gravity > 0  ) 
            Player2.y -= Player2.gravity * 4;

        else if ( Player2DownArrow && Player2.y + Player2.height + Player2.gravity < canvasHeight ) 
            Player2.y += Player2.gravity * 4;
            
    });

    const serverloop = ( () => {

        socket.emit(ClientEvents.GameLoop);

        if ( CurrentLobbyState )
        {
            gameStart = CurrentLobbyState.gameStart;
            scoreOne = CurrentLobbyState.scoreOne;
            scoreTwo = CurrentLobbyState.scoreTwo;

            Player1.x = CurrentLobbyState.Player1x;
            Player1.y = CurrentLobbyState.Player1y;
            Player1.width = CurrentLobbyState.Player1width;
            Player1.height = CurrentLobbyState.Player1height;
            Player1.color = CurrentLobbyState.Player1color;
            Player1.speed = CurrentLobbyState.Player1speed;
            Player1.gravity = CurrentLobbyState.Player1gravity;

            Player2.x = CurrentLobbyState.Player2x;
            Player2.y = CurrentLobbyState.Player2y;
            Player2.width = CurrentLobbyState.Player2width;
            Player2.height = CurrentLobbyState.Player2height;
            Player2.color = CurrentLobbyState.Player2color;
            Player2.speed = CurrentLobbyState.Player2speed;
            Player2.gravity = CurrentLobbyState.Player2gravity;

            Ball.x = CurrentLobbyState.Ballx;
            Ball.y = CurrentLobbyState.Bally;
            Ball.width = CurrentLobbyState.Ballwidth;
            Ball.height = CurrentLobbyState.Ballheight;
            Ball.color = CurrentLobbyState.Ballcolor;
            Ball.speed = CurrentLobbyState.Ballspeed;
            Ball.gravity = CurrentLobbyState.Ballgravity;

            if ( CurrentLobbyState.Player1Ready === true )
                Player1.ready = true;
            else
                Player1.ready = false;

            if ( CurrentLobbyState.Player2Ready === true )
                Player2.ready = true;
            else
                Player2.ready = false;
        }

    });

    const gameloop = ( ( ) => {
        serverloop();
        clear();
        drawScore();
        drawPaddle(Player1);
        drawPaddle(Player2);
        if ( gameStart != false )
        {
            drawLine();
            drawBall(Ball);
            // BallBounce(Ball);
            // BallCollision(Ball);
            // updateVar();
        }
        else
        {
            waitForOpponent();
        }
    });

    useEffect( () => {

        if ( CurrentLobbyState )
        {
            if ( CurrentLobbyState.Player1id == socket.id )
            {
                window.addEventListener('keydown', Player1keyDownHandler);
                window.addEventListener('keyup', Player1keyUpHandler);
            }
            else if ( CurrentLobbyState.Player2id == socket.id )
            {
                window.addEventListener('keydown', Player2keyDownHandler);
                window.addEventListener('keyup', Player2keyUpHandler);
            }
            else {} //! Else go to spectator mode
        }

        let anim = requestAnimationFrame(gameloop);

        return () =>
        {
            cancelAnimationFrame(anim);
        }

    }, [CurrentLobbyState]);

    return (
        <div>
                <NavBar/>
                <div>
                    <canvas className="Canvas" ref={canvasRef} width={700} height={400}></canvas> 
                </div>
        </div>
    );
}