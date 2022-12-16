import { useContext, useEffect, useRef, useState } from "react";
import { WebsocketContext } from "../WebsocketContext";
import '../../../styles/GameInstance.css';
import NavBar from '../../NavBar';
import { LobbyState } from "../LobbyState";
import { useRecoilValue } from "recoil";
import { ClientEvents } from "../../../shared/client/Client.Events";
import { Paddle, Ball } from "../GameConstant"
import { CANVASHEIGHT, CANVASWIDTH, BALLSPEED } from "../GameConstant"

export default function GameInstance()
{
    //? Variable declaration

    const socket = useContext(WebsocketContext);
    
    const CurrentLobbyState = useRecoilValue(LobbyState);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [SpectatorMode, SetSpectatorMode] = useState(false);
    const [numberOfSpectator, SetnumberOfSpectator] = useState(0);

    const Player1 : Paddle = {
        x : 0,
        y: 0,
        width: 0,
        height: 0,
        color: "#fff",
        speed: 0,
        gravity: 0,
        ready: false,
    }

    const Player2 : Paddle = ({
        x : 0,
        y: 0,  
        width: 0,
        height: 0,
        color: "#fff",
        speed: 0,
        gravity: 0,
        ready: false,
    })

    const Ball : Ball = ({
        x : 0,
        y: 0,
        width: 0,
        height: 0,
        color: "#fff",
        speed: 0,
        gravity: 0
    })

    let canvasWidth = 0;
    let canvasHeight = 0;
    let netWidth = 0;
    let netHeight = 0;

    let gameStart = false;
    let gameEnd = false;
    let endMessage : string;

    let scoreOne = 0;
    let scoreTwo = 0;

    let Player1Win = false;
    let Player2Win = false;

    let Player1UpArrow = false;
    let Player1DownArrow = false;
    let Player2UpArrow = false;
    let Player2DownArrow = false;







    //? Variable declaration


    //? Canvas Drawer









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
                context.fillRect(canvasWidth / 2, 0, netWidth, netHeight);
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
                context.fillText(scoreOne.toString(), canvasWidth / 2 - 60, 30);
                context.fillText(scoreTwo.toString(), canvasWidth / 2 + 60, 30);
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
                    context.fillText("Player 1 Won !", canvasWidth / 2 - 60, canvasHeight / 2);
                else if ( Player2Win === true )
                    context.fillText("Player 2 Won !", canvasWidth / 2 - 60, canvasHeight / 2);
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
                context.fillText(endMessage, canvasWidth / 2 - 60, canvasHeight / 2);
            }
        }
    });
    
    const clear = ( ( ) => {
        if (canvasRef.current)
        {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            if (context)
                context.clearRect(0, 0, canvasWidth, canvasHeight);
        }
    });












    //? Canvas Drawer


    //? Key Handler
    













    function Player1keyDownHandler( event : any )
    {
        if ( event.defaultPrevented ) 
            return ;

        if ( event.code === "ArrowUp" ) 
        {
            socket.emit(ClientEvents.Player1ArrowUpPress);
            Player1UpArrow = true;
        }

        else if ( event.code === "ArrowDown"  ) 
        {
            socket.emit(ClientEvents.Player1ArrowDownPress);
            Player1DownArrow = true;
        }
        
        event.preventDefault();
    }

    function Player2keyDownHandler( event : any )
    {
        if ( event.defaultPrevented ) 
            return ;

        if ( event.code === "ArrowUp")
        {
            socket.emit(ClientEvents.Player2ArrowUpPress);
            Player2UpArrow = true;
        }

        else if ( event.code === "ArrowDown"  )
        {
            socket.emit(ClientEvents.Player2ArrowDownPress);
            Player2DownArrow = true;
        }
        
        event.preventDefault();
    }

    function Player1keyUpHandler( event : any )
    {
        if ( event.defaultPrevented ) 
            return ;

        if ( event.code === "Space" && gameStart === false )
            socket.emit(ClientEvents.ReadyState);

        if ( event.code === "ArrowUp")
        {
            socket.emit(ClientEvents.Player1ArrowUpRelease);
            Player1UpArrow = false;
        }

        else if ( event.code === "ArrowDown"  )
        {
            socket.emit(ClientEvents.Player1ArrowDownRelease);
            Player1DownArrow = false;
        }
        
        event.preventDefault();
    }

    function Player2keyUpHandler( event : any )
    {
        if ( event.defaultPrevented ) 
            return ;

        if ( event.code === "Space" && gameStart === false )
            socket.emit(ClientEvents.ReadyState);

        if ( event.code === "ArrowUp" )
        {
            socket.emit(ClientEvents.Player2ArrowUpRelease);
            Player2UpArrow = false;
        }

        else if ( event.code === "ArrowDown" )
        {
            socket.emit(ClientEvents.Player2ArrowDownRelease);
            Player2DownArrow = false;
        }
        
        event.preventDefault();
    }










    //? Key Handler







    //? CLIENT PREDICTION 









    const BallBounce = ( ) =>
    {

        if ( Ball.y + Ball.gravity <= 0 ||  Ball.y +  Ball.gravity >= canvasHeight )
        {
            Ball.gravity = Ball.gravity * -1;
            Ball.y +=  Ball.gravity;
            Ball.x +=  Ball.speed;
            if ( Ball.speed < 0 )
                Ball.speed -= 0.2;
            else
                Ball.speed += 0.2;
        }
        else //! Doesn't bounce just move
        {
            Ball.y +=  Ball.gravity;
            Ball.x +=  Ball.speed;
        }
    }


    const BallCollision = ( ) =>
    {
        if ( ( ( Ball.y +  Ball.gravity <= Player2.y +  Player2.height &&  Ball.y +  Ball.gravity >=  Player2.y ) && 
            ( Ball.x +  Ball.width +  Ball.speed >=  Player2.x &&  Ball.x +  Ball.width +  Ball.speed <=  Player2.x +  Player2.width ) && 
            Ball.y +  Ball.gravity >  Player2.y ))
            {
                Ball.speed = Ball.speed * -1;
                if ( Ball.speed < 0 )
                    Ball.speed -= 0.4;
                else
                    Ball.speed += 0.4;
            }
        else if (  Ball.y +  Ball.gravity <=  Player1.y +  Player1.height && 
            (  Ball.x +  Ball.speed <=  Player1.x +  Player1.width &&  Ball.x +  Ball.speed >=  Player1.x ) && 
            Ball.y +  Ball.gravity >  Player1.y)
            {
                Ball.speed =  Ball.speed * -1;
                if ( Ball.speed < 0 )
                    Ball.speed -= 0.4;
                else
                    Ball.speed += 0.4;
            }
        else if (  Ball.x +  Ball.speed <  Player1.x - 100 )
        {
            Ball.x = CANVASWIDTH / 2;
            Ball.y = CANVASHEIGHT / 2;
            Ball.speed = BALLSPEED;
        }
        else if (  Ball.x +  Ball.speed >  Player2.x +  Player2.width + 100 )
        {
            Ball.x = CANVASWIDTH / 2;
            Ball.y = CANVASHEIGHT / 2;
            Ball.speed = BALLSPEED * -1;
        }
    }

    const updateVar = () =>
    {
        if ( Player1UpArrow && Player1.y - Player1.gravity > 0 ) 
            Player1.y -= Player1.gravity * 4;

        else if ( Player1DownArrow && Player1.y + Player1.height + Player1.gravity < CANVASHEIGHT ) 
            Player1.y += Player1.gravity * 4;

        else if ( Player2UpArrow && Player2.y - Player2.gravity > 0  ) 
            Player2.y -= Player2.gravity * 4;

        else if ( Player2DownArrow && Player2.y + Player2.height + Player2.gravity < CANVASHEIGHT ) 
            Player2.y += Player2.gravity * 4;
            
    }

    const clientPrediction = ( () => {

        if ( gameStart === true && gameEnd === false )
        {
            updateVar();
            BallBounce();
            BallCollision();
        }
    });









    //? CLIENT PREDICTION










    //? Client game loop







    const waitForOpponent = ( () => {

        if (canvasRef.current)
        {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            if (context)
            {
                context.font = "18px Arial";
                context.fillStyle = "#fff";
                if ( CurrentLobbyState )
                {
                    if ( CurrentLobbyState.Player1Ready === false  )
                        context.fillText("Waiting for player1....", canvasWidth / 10, 30);
                    if ( CurrentLobbyState.Player2Ready === false )
                        context.fillText("Waiting for player2....", canvasWidth - canvasWidth / 3, 30);
                    if ( ( CurrentLobbyState.Player1id === socket.id && CurrentLobbyState.Player1Ready === false ) || ( CurrentLobbyState.Player2id === socket.id && CurrentLobbyState.Player2Ready === false ) )
                            context.fillText("Press SPACE to play", canvasWidth / 2.5, canvasHeight / 2);
                }
            }
        }   
    })


    const serverloop = ( () => {

        if ( CurrentLobbyState )
        {
            SetnumberOfSpectator(CurrentLobbyState.numberOfSpectator);
            endMessage = CurrentLobbyState.endMessage;

            canvasHeight = CurrentLobbyState.canvasHeight;
            canvasWidth = CurrentLobbyState.canvasWidth;
            netHeight = CurrentLobbyState.netHeight;
            netWidth = CurrentLobbyState.netWidth;

            gameEnd = CurrentLobbyState.gameEnd;
            gameStart = CurrentLobbyState.gameStart;

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
        }

    });

    const gameloop = ( () => 
    {
        clientPrediction();
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

    useEffect( () => 
    {
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
            else { SetSpectatorMode(true); } //! Else go to spectator mode
        }

        let anim = requestAnimationFrame(gameloop);

        return () =>
        {
            cancelAnimationFrame(anim);
        }

    }, [CurrentLobbyState, gameloop, socket.id]);


    //? Client game loop









    return (
        <div>
                <NavBar/>
                <div>
                    {SpectatorMode ? (<span> You are watching as a Spectator </span>) : (<span> Number of Spectator : {numberOfSpectator} </span>)}
                </div>
                <div>
                    <canvas className="Canvas" ref={canvasRef} width={1000} height={600}></canvas> 
                </div>
        </div>
    );
}