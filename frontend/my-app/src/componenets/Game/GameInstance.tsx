import { useContext, useEffect, useRef, useState } from "react";
import { WebsocketContext } from "./WebsocketContext";
import '../../styles/GameInstance.css';
import NavBar from '../../componenets/NavBar';

interface Paddle
{
    x : number;
    y : number;
    width : number;
    height : number;
    color : string;
    speed : number;
    gravity : number;
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
    // const socket = useContext(WebsocketContext);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [Player1] = useState<Paddle>({
        x : 10,
        y: CANVASHEIGHT / 2 - PADDLEHEIGHT / 2,
        width: PADDLEWIDTH,
        height: PADDLEHEIGHT,
        color: "#fff",
        speed: 1,
        gravity: 3,
    })

    const [Player2] = useState<Paddle>({
        x : CANVASWIDTH - (PADDLEWIDTH + 10),
        y: CANVASHEIGHT / 2 - PADDLEHEIGHT / 2,  
        width: PADDLEWIDTH,
        height: PADDLEHEIGHT,
        color: "#fff",
        speed: 1,
        gravity: 3
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

    let upArrow = false;
    let downArrow = false;

    let keyW = false;
    let keyS = false;


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
                context.fillRect(CANVASWIDTH / 2, 0, NETWIDTH, NETHEIGHT);
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

    const updateVar = ( () =>
    {
        let canvasHeight = 0;
        if (canvasRef.current)
            canvasHeight = canvasRef.current.height;

        if ( keyW && Player2.y - Player2.gravity > 0 ) 
            Player2.y -= Player2.gravity * 4;

        else if ( keyS && Player2.y + Player2.height + Player2.gravity < canvasHeight ) 
            Player2.y += Player2.gravity * 4;

        else if ( upArrow && Player1.y - Player1.gravity > 0 ) 
            Player1.y -= Player1.gravity * 4;

        else if ( downArrow && Player1.y + Player1.height + Player1.gravity < canvasHeight ) 
            Player1.y += Player1.gravity * 4;
    });

    const gameloop = ( ( ) => {
        clear();
        drawPaddle(Player1);
        drawPaddle(Player2);
        BallBounce(Ball);
        BallCollision(Ball);
        drawBall(Ball);
        drawScore();
        updateVar();
        requestAnimationFrame(gameloop);
    });

    useEffect( () => {

        let anim = requestAnimationFrame(gameloop)

        return () =>
        {
            console.log("Quitted animation frame ?");
            cancelAnimationFrame(anim);
        }

    }, []);

    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('keyup', keyUpHandler);

    function keyDownHandler( event : any )
    {
        if ( event.defaultPrevented ) 
            return ;

        if ( event.code === "Escape" )
        {
            Ball.speed = 0;
            Ball.gravity = 0;
        }

        if ( event.code === "KeyW" ) 
            keyW = true;

        else if ( event.code === "KeyS" ) 
            keyS = true;

        else if ( event.code === "ArrowUp") 
            upArrow = true;

        else if ( event.code === "ArrowDown"  ) 
            downArrow = true;
        
        event.preventDefault();
    }

    function keyUpHandler( event : any )
    {
        if ( event.defaultPrevented ) 
            return ;

        if ( event.code === "Escape" )
        {
            Ball.speed = 0;
            Ball.gravity = 0;
        }

        if ( event.code === "KeyW" ) 
            keyW = false;

        else if ( event.code === "KeyS" ) 
            keyS = false;

        else if ( event.code === "ArrowUp") 
            upArrow = false;

        else if ( event.code === "ArrowDown"  ) 
            downArrow = false;
            
        event.preventDefault();
    }

    return (
        <div>
                <NavBar/>
                <div>
                    <canvas className="Canvas" ref={canvasRef} width={700} height={400}></canvas> 
                </div>
        </div>
    );
}