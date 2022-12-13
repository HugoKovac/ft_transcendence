import { useContext, useEffect, useRef, useState } from "react";
import { WebsocketContext } from "./WebsocketContext";
import '../../styles/GameInstance.css';
import NavBar from '../../componenets/NavBar';
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
    let gameEnd = false;
    let endMessage : string;
    let PauseGame = false;
    let gameFinish = false;

    let scoreOne = 0;
    let scoreTwo = 0;

    let Player1Win = false;
    let Player2Win = false;

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

    const drawFinalScore = ( ( ) => {
        if (canvasRef.current)
        {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            if (context) 
            {
                context.font = "18px Arial";
                context.fillStyle = "#fff";
                if ( Player1Win === true )
                    context.fillText("Player 1 Won !", canvas.width / 2 - 60, canvas.height / 2);
                else if ( Player2Win === true )
                    context.fillText("Player 2 Won !", canvas.width / 2 - 60, canvas.height / 2);
            }
        }
    });

    const drawEndGame = ( ( ) => {
        if (canvasRef.current)
        {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            if (context) 
            {
                context.font = "18px Arial";
                context.fillStyle = "#fff";
                context.fillText(endMessage, canvas.width / 2 - 60, canvas.height / 2);
            }
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
                if ( Player1.ready === false )
                    context.fillText("Waiting for player1....", canvas.width / 10, 30);
                if ( Player2.ready === false )
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

        if ( event.code === "Space" && gameStart === false )
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

        if ( event.code === "Space" && gameStart === false )
            socket.emit(ClientEvents.ReadyState);

        if ( event.code === "ArrowUp") 
            socket.emit(ClientEvents.Player2ArrowUpRelease);

        else if ( event.code === "ArrowDown"  ) 
            socket.emit(ClientEvents.Player2ArrowDownRelease);
            
        event.preventDefault();
    }

    const serverloop = ( () => {

        socket.emit(ClientEvents.GameLoop);

        if ( CurrentLobbyState )
        {
            endMessage = CurrentLobbyState.endMessage;

            gameEnd = CurrentLobbyState.gameEnd;
            gameStart = CurrentLobbyState.gameStart;
            PauseGame = CurrentLobbyState.PauseGame;

            scoreOne = CurrentLobbyState.scoreOne;
            scoreTwo = CurrentLobbyState.scoreTwo;

            Player1Win = CurrentLobbyState.Player1Win;
            Player2Win = CurrentLobbyState.Player2Win;

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
        if ( gameStart === true && gameEnd === false )
        {
            drawLine();
            drawBall(Ball);
        }
        else if ( Player1Win === true || Player2Win === true )
            drawFinalScore();
        else if ( gameEnd === true )
            drawEndGame();
        else
            waitForOpponent();
    });

    useEffect( () => {

        if ( CurrentLobbyState )
        {
            if ( CurrentLobbyState.Player1id === socket.id )
            {
                window.addEventListener('keydown', Player1keyDownHandler);
                window.addEventListener('keyup', Player1keyUpHandler);
            }
            else if ( CurrentLobbyState.Player2id === socket.id )
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

    }, [CurrentLobbyState, gameloop, socket.id]);

    return (
        <div>
                <NavBar/>
                <div>
                    <canvas className="Canvas" ref={canvasRef} width={700} height={400}></canvas> 
                </div>
        </div>
    );
}