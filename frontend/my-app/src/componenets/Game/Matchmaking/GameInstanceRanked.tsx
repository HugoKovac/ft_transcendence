import { useContext, useEffect, useRef, useState } from "react";
import { WebsocketContext } from "../WebsocketContext";
import '../../../styles/Game.css';
import NavBar from '../../NavBar';
import { LobbyState } from "../LobbyState";
import { useRecoilValue, useRecoilState } from "recoil";
import { ClientEvents } from "../../../shared/client/Client.Events";
import { Paddle, Ball } from "../GameConstant"
import { CANVASHEIGHT, CANVASWIDTH, BALLSPEED } from "../GameConstant"
import React from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function GameInstance()
{
    //? Variable declaration

    const socket = useContext(WebsocketContext);
    const navigate = useNavigate();
    const CurrentLobbyState = useRecoilValue(LobbyState);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [SpectatorMode, SetSpectatorMode] = useState(false);
    const [numberOfSpectator, SetnumberOfSpectator] = useState(0);
    const netcolor = React.useRef<string>("#fff");
    const [lobby, setLobby] = useRecoilState(LobbyState);

    const Player1 = useRef<Paddle> ({
        x : 0,
        y: 0,
        width: 0,
        height: 0,
        color: "#fff",
        speed: 0,
        gravity: 0,
        ready: false,
    })

    const Player2 = useRef<Paddle> ({
        x : 0,
        y: 0,  
        width: 0,
        height: 0,
        color: "#fff",
        speed: 0,
        gravity: 0,
        ready: false,
    })

    const Ball = useRef<Ball> ({
        x : 0,
        y: 0,
        width: 0,
        height: 0,
        color: "#fff",
        speed: 0,
        gravity: 0
    })

    const skin = React.useRef("default");
    const canvasWidth = React.useRef(0);
    const canvasHeight = React.useRef(0);
    const netWidth = React.useRef(0);
    const netHeight = React.useRef(0);
    
    let endMessage : string;

    const scoreOne = React.useRef(0);
    const scoreTwo = React.useRef(0);

    const Player1Win = React.useRef(false);
    const Player2Win = React.useRef(false);

    const Player1UpArrow = React.useRef(false);
    const Player1DownArrow = React.useRef(false);
    const Player2UpArrow = React.useRef(false);
    const Player2DownArrow = React.useRef(false);

    const [gameStart, setGameStart] = useState(false);
    const [gameEnd, setGameEnd] = useState(false);

    const requestRef = React.useRef(0);

    const startClock = React.useRef(0);
    const deltatime = React.useRef(0);





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
                context.font = "18px cursive";
                context.fillStyle = netcolor.current;
                context.fillRect(canvasWidth.current / 2, 0, netWidth.current, netHeight.current);
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
                context.font = "18px cursive";
                context.fillStyle = "#fff";
                context.fillText(scoreOne.current.toString(), canvasWidth.current / 2 - 60, 30);
                context.fillText(scoreTwo.current.toString(), canvasWidth.current / 2 + 60, 30);
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
                context.font = "18px cursive";
                context.fillStyle = "#fff";
                context.textAlign = 'center'
                context.fillText(endMessage, canvasWidth.current / 2, canvasHeight.current / 2);
            }
        }
    });
    
    const clear = ( ( ) => {
        if (canvasRef.current)
        {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            if (context)
                context.clearRect(0, 0, canvasWidth.current, canvasHeight.current);
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
            Player1UpArrow.current = true;
        }

        else if ( event.code === "ArrowDown"  ) 
        {
            socket.emit(ClientEvents.Player1ArrowDownPress);
            Player1DownArrow.current = true;
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
            Player2UpArrow.current = true;
        }

        else if ( event.code === "ArrowDown"  )
        {
            socket.emit(ClientEvents.Player2ArrowDownPress);
            Player2DownArrow.current = true;
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
            Player1UpArrow.current = false;
        }

        else if ( event.code === "ArrowDown"  )
        {
            socket.emit(ClientEvents.Player1ArrowDownRelease);
            Player1DownArrow.current = false;
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
            Player2UpArrow.current = false;
        }

        else if ( event.code === "ArrowDown" )
        {
            socket.emit(ClientEvents.Player2ArrowDownRelease);
            Player2DownArrow.current = false;
        }
        
        event.preventDefault();
    }










    //? Key Handler







    //? CLIENT PREDICTION 









    const BallBounce = ( ) =>
    {

        if ( Ball.current.y + Ball.current.gravity <= 0 ||  Ball.current.y +  Ball.current.gravity >= canvasHeight.current )
        {
            Ball.current.gravity = Ball.current.gravity * -1;
            Ball.current.y +=  Ball.current.gravity * deltatime.current;
            Ball.current.x +=  Ball.current.speed * deltatime.current;
            if ( Ball.current.speed < 0 )
                Ball.current.speed -= 0.2 * deltatime.current;
            else
                Ball.current.speed += 0.2 * deltatime.current;
        }
        else //! Doesn't bounce just move
        {
            Ball.current.y +=  Ball.current.gravity * deltatime.current;
            Ball.current.x +=  Ball.current.speed * deltatime.current;
        }
    }


    const BallCollision = ( ) =>
    {
        if ( ( ( Ball.current.y +  Ball.current.gravity <= Player2.current.y +  Player2.current.height &&  Ball.current.y +  Ball.current.gravity >=  Player2.current.y ) && 
            ( Ball.current.x +  Ball.current.width +  Ball.current.speed >=  Player2.current.x &&  Ball.current.x +  Ball.current.width +  Ball.current.speed <=  Player2.current.x +  Player2.current.width ) && 
            Ball.current.y +  Ball.current.gravity >  Player2.current.y ))
            {
                Ball.current.speed = Ball.current.speed * -1;
                if ( Ball.current.speed < 0 )
                    Ball.current.speed -= 0.4 * deltatime.current;
                else
                    Ball.current.speed += 0.4 * deltatime.current;
            }
        else if (  Ball.current.y +  Ball.current.gravity <=  Player1.current.y +  Player1.current.height && 
            (  Ball.current.x +  Ball.current.speed <=  Player1.current.x +  Player1.current.width &&  Ball.current.x +  Ball.current.speed >=  Player1.current.x ) && 
            Ball.current.y +  Ball.current.gravity >  Player1.current.y)
            {
                Ball.current.speed =  Ball.current.speed * -1;
                if ( Ball.current.speed < 0 )
                    Ball.current.speed -= 0.4 * deltatime.current;
                else
                    Ball.current.speed += 0.4 * deltatime.current;
            }
        else if (  Ball.current.x +  Ball.current.speed <  Player1.current.x - 100 )
        {
            Ball.current.x = CANVASWIDTH / 2;
            Ball.current.y = CANVASHEIGHT / 2;
            Ball.current.speed = BALLSPEED;
        }
      else if (  Ball.current.x +  Ball.current.speed >  Player2.current.x +  Player2.current.width + 100 )
        {
            Ball.current.x = CANVASWIDTH / 2;
            Ball.current.y = CANVASHEIGHT / 2;
            Ball.current.speed = BALLSPEED * -1;
        }
    }

    const updateVar = () =>
    {
        if ( Player1UpArrow && Player1.current.y - Player1.current.gravity > 0 ) 
            Player1.current.y -= Player1.current.gravity * 4 * deltatime.current;

        else if ( Player1DownArrow && Player1.current.y + Player1.current.height + Player1.current.gravity < CANVASHEIGHT ) 
            Player1.current.y += Player1.current.gravity * 4 * deltatime.current;

        else if ( Player2UpArrow && Player2.current.y - Player2.current.gravity > 0  ) 
            Player2.current.y -= Player2.current.gravity * 4 * deltatime.current;

        else if ( Player2DownArrow && Player2.current.y + Player2.current.height + Player2.current.gravity < CANVASHEIGHT ) 
            Player2.current.y += Player2.current.gravity * 4 * deltatime.current;
            
    }

    const clientPrediction = ( () => {

        if ( gameStart === true && gameEnd=== false )
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
                context.font = "18px cursive";
                context.fillStyle = "#fff";
                if ( CurrentLobbyState )
                {
                    if ( CurrentLobbyState.Player1Ready === false  )
                        context.fillText("Waiting for player1....", canvasWidth.current / 10, 30);
                    if ( CurrentLobbyState.Player2Ready === false )
                        context.fillText("Waiting for player2....", canvasWidth.current - canvasWidth.current / 3, 30);
                    if ( ( CurrentLobbyState.Player1id === socket.id && CurrentLobbyState.Player1Ready === false ) || ( CurrentLobbyState.Player2id === socket.id && CurrentLobbyState.Player2Ready === false ) )
                            context.fillText("Press SPACE to play", canvasWidth.current / 2.5, canvasHeight.current / 2);
                }
            }
        }   
    })


    const serverloop = ( () => {

        if ( CurrentLobbyState )
        {
            SetnumberOfSpectator(CurrentLobbyState.numberOfSpectator);
            endMessage = CurrentLobbyState.endMessage;

            skin.current = CurrentLobbyState.skin;
            netcolor.current = CurrentLobbyState.NetColor;
            canvasHeight.current = CurrentLobbyState.canvasHeight;
            canvasWidth.current = CurrentLobbyState.canvasWidth;
            netHeight.current = CurrentLobbyState.netHeight;
            netWidth.current = CurrentLobbyState.netWidth;

            setGameEnd(CurrentLobbyState.gameEnd);
            setGameStart(CurrentLobbyState.gameStart);
            
            scoreOne.current = CurrentLobbyState.scoreOne;
            scoreTwo.current = CurrentLobbyState.scoreTwo;

            Player1Win.current = CurrentLobbyState.Player1Win;
            Player2Win.current = CurrentLobbyState.Player2Win;

            Player1.current.x = CurrentLobbyState.Player1x;
            Player1.current.y = CurrentLobbyState.Player1y;
            Player1.current.width = CurrentLobbyState.Player1width;
            Player1.current.height = CurrentLobbyState.Player1height;
            Player1.current.color = CurrentLobbyState.Player1color;
            Player1.current.speed = CurrentLobbyState.Player1speed;
            Player1.current.gravity = CurrentLobbyState.Player1gravity;

            Player2.current.x = CurrentLobbyState.Player2x;
            Player2.current.y = CurrentLobbyState.Player2y;
            Player2.current.width = CurrentLobbyState.Player2width;
            Player2.current.height = CurrentLobbyState.Player2height;
            Player2.current.color = CurrentLobbyState.Player2color;
            Player2.current.speed = CurrentLobbyState.Player2speed;
            Player2.current.gravity = CurrentLobbyState.Player2gravity;

            Ball.current.x = CurrentLobbyState.Ballx;
            Ball.current.y = CurrentLobbyState.Bally;
            Ball.current.width = CurrentLobbyState.Ballwidth;
            Ball.current.height = CurrentLobbyState.Ballheight;
            Ball.current.color = CurrentLobbyState.Ballcolor;
            Ball.current.speed = CurrentLobbyState.Ballspeed;
            Ball.current.gravity = CurrentLobbyState.Ballgravity;
        }

    });

    
    const gameloop = ( () => 
    {
        startClock.current = Date.now();

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

        clientPrediction();
        serverloop();
        clear();
        drawScore();
        drawPaddle(Player1.current);
        drawPaddle(Player2.current);
        
        if ( gameStart === true && gameEnd === false )
        {
            drawLine();
            drawBall(Ball.current);
        }
        else if ( gameEnd === true )
            drawEndGame();
        else
            waitForOpponent();

        deltatime.current = Date.now() - startClock.current;
        requestRef.current = requestAnimationFrame(gameloop);
    });


    useEffect( () => 
    {
        requestRef.current = requestAnimationFrame(gameloop);
        return () =>
            cancelAnimationFrame(requestRef.current);
    }, [CurrentLobbyState, gameEnd, gameStart]);


    //? Client game loop



    const BackToLobby = () =>
    {
        socket.emit(ClientEvents.LeaveLobby);
        setLobby(null);
        navigate('/game/matchmaking');
    }

    return (
        <div className={skin.current}>
                <NavBar/>
                <div>
                    {SpectatorMode ? (<span className="Spectator"> You are watching as a Spectator </span>) : (<span className="Spectator"> Number of Spectator : {numberOfSpectator} </span>)}
                </div>
                <div>
                    <canvas className="Canvas" ref={canvasRef} width={800} height={500}></canvas> 
                </div>
                <div className="InstanceButton">
                    {gameEnd && <button className="BackToLobby" onClick={() => {BackToLobby()}}>{'Back To Lobby'}</button>}
                </div>
                <ToastContainer />
        </div>
        
    );  
}
