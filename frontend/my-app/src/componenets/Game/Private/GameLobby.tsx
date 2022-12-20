import { useContext, useEffect, useRef, useState } from 'react';
import { ClientEvents } from '../../../shared/client/Client.Events'
import NavBar from '../../NavBar';
import { WebsocketContext } from './../WebsocketContext';
import { useSearchParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Ball, CANVASHEIGHT, CANVASWIDTH, Paddle, PADDLEHEIGHT, PADDLEWIDTH } from '../GameConstant';

export default function GameLobby() {

    const Paddle1 = useRef<Paddle> ({
        x : 10,
        y: CANVASHEIGHT / 2 - PADDLEHEIGHT / 2,
        width: PADDLEWIDTH,
        height: PADDLEHEIGHT,
        color: "#fff",
        speed: 1,
        gravity: 3,
        ready: false,
    })

    const Paddle2 = useRef<Paddle> ({
        x : CANVASWIDTH - (PADDLEWIDTH + 10),
        y: CANVASHEIGHT / 2 - PADDLEHEIGHT / 2,  
        width: PADDLEWIDTH,
        height: PADDLEHEIGHT,
        color: "#fff",
        speed: 1,
        gravity: 3,
        ready: false,
    })

    const Ball = useRef<Ball> ({
        x : CANVASWIDTH / 2,
        y: CANVASHEIGHT / 2,
        width: 5,
        height: 15,
        color: "#fff",
        speed: 6,
        gravity: 6
    })


    const socket = useContext(WebsocketContext);
    const requestRef = useRef(0);
    const [searchParams] = useSearchParams();
    const searchParamsString = searchParams.get('id');
    const [Paddle1Color, SetPaddle1Color] = useState("#fff"); 
    const [Paddle2Color, SetPaddle2Color] = useState("#fff"); 
    const [BallColor, SetBallColor] = useState("#fff");
    const [NetColor, SetNetColor] = useState("#fff");

    const Paddle1CPRef = useRef<any>();
    const Paddle2CPRef = useRef<any>();
    const BallCPRef = useRef<any>();
    const NetCPRef = useRef<any>();

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasWidth = 800;
    const canvasHeight = 500;
    const netWidth = 5;
    const netHeight = 600;


    useEffect( () => {


        if ( searchParamsString )
        {
            socket.emit(ClientEvents.JoinLobby, {
                lobbyId: searchParamsString,
          });
        }

        requestRef.current = requestAnimationFrame(previewloop);
        return () =>
            cancelAnimationFrame(requestRef.current);
    }, [searchParamsString, socket, Paddle1Color, Paddle2Color, BallColor, NetColor]);


    const previewloop = () =>
    {
        Paddle1CPRef.current = document.querySelector("#Paddle1CP");
        if (Paddle1CPRef.current)
            Paddle1CPRef.current.addEventListener("input", Paddle1ColorPicker, false);

        Paddle2CPRef.current = document.querySelector("#Paddle2CP");
        if (Paddle2CPRef.current)
            Paddle2CPRef.current.addEventListener("input", Paddle2ColorPicker, false);

        BallCPRef.current = document.querySelector("#BallCP");
        if (BallCPRef.current)
            BallCPRef.current.addEventListener("input", BallColorPicker, false);

        NetCPRef.current = document.querySelector("#NetCP");
        if (NetCPRef.current)
            NetCPRef.current.addEventListener("input", NetColorPicker, false);

        clear();
        BallBounce();
        BallCollision();
        drawLine();
        drawPaddle(Paddle1.current);
        drawPaddle(Paddle2.current);
        drawBall(Ball.current);

        Paddle1.current.color = Paddle1Color;
        Paddle2.current.color = Paddle2Color;
        Ball.current.color = BallColor;
        requestRef.current = requestAnimationFrame(previewloop);
    }


    const emitLobby = () => 
    {
        socket.emit(ClientEvents.CreateLobby, 
        {
            skin: "default",
        });
    }






    function Paddle1ColorPicker(event : any) 
    {
        SetPaddle1Color(event.target.value);
    }

    function Paddle2ColorPicker(event : any) 
    {
        SetPaddle2Color(event.target.value);
    }

    function BallColorPicker(event : any) 
    {
        SetBallColor(event.target.value);
    }

    function NetColorPicker(event : any) 
    {
        SetNetColor(event.target.value);
    }

    



















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
                context.fillStyle = NetColor;
                context.fillRect(canvasWidth / 2, 0, netWidth, netHeight);
            }
        }
    })

    
    const clear = ( ( ) => {
        if (canvasRef.current)
        {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            if (context)
                context.clearRect(0, 0, canvasWidth, canvasHeight);
        }
    });



    const BallBounce = ( ) =>
    {

        if ( Ball.current.y + Ball.current.gravity <= 0 ||  Ball.current.y +  Ball.current.gravity >= canvasHeight )
        {
            Ball.current.gravity = Ball.current.gravity * -1;
            Ball.current.y +=  Ball.current.gravity;
            Ball.current.x +=  Ball.current.speed;
        }
        else
        {
            Ball.current.y +=  Ball.current.gravity;
            Ball.current.x +=  Ball.current.speed;
        }
    }


    const BallCollision = ( ) =>
    {
        if ( ( ( Ball.current.y +  Ball.current.gravity <= Paddle2.current.y +  Paddle2.current.height &&  Ball.current.y +  Ball.current.gravity >=  Paddle2.current.y ) && 
            ( Ball.current.x +  Ball.current.width +  Ball.current.speed >=  Paddle2.current.x &&  Ball.current.x +  Ball.current.width +  Ball.current.speed <=  Paddle2.current.x +  Paddle2.current.width ) && 
            Ball.current.y +  Ball.current.gravity >  Paddle2.current.y ))
            {
                Ball.current.speed = Ball.current.speed * -1;
            }
        else if (  Ball.current.y +  Ball.current.gravity <=  Paddle1.current.y +  Paddle1.current.height && 
            (  Ball.current.x +  Ball.current.speed <=  Paddle1.current.x +  Paddle1.current.width &&  Ball.current.x +  Ball.current.speed >=  Paddle1.current.x ) && 
            Ball.current.y +  Ball.current.gravity >  Paddle1.current.y)
            {
                Ball.current.speed =  Ball.current.speed * -1;
            }
            else if (  Ball.current.x +  Ball.current.speed <  Paddle1.current.x )
            {
                Ball.current.speed = Ball.current.speed * -1;
            }
          else if (  Ball.current.x +  Ball.current.speed >  Paddle2.current.x +  Paddle2.current.width )
            {
                Ball.current.speed = Ball.current.speed * -1;
            }
    }

    return (
        <div className='GameMenu'>
            <NavBar />
            <div className="ColorPicker">
                <label> Player 1 <input type="color" id="Paddle1CP" className="Paddle1ColorPicker"/></label>
                <label> Ball <input type="color" id="BallCP" className="BallColorPicker"/></label>
                <label> Net <input type="color" id="NetCP" className="NetColorPicker"/></label>
                <label> Player 2 <input type="color" id="Paddle2CP" className="Paddle2ColorPicker"/></label>
            </div>
            <div>
                <canvas className="CanvasPreview" ref={canvasRef} width={800} height={500}></canvas> 
            </div>
            <div className="SkinSelector">
                <label> Skins
                <select name="skin"> 
                        <option value="default">Default</option>
                        <option value="neonsunsetoverdrive">Neon Sunset Overdrive</option>
                        <option value="gotham">Gotham City</option>
                </select>
                </label>
            </div>
            <div className="CreateLobby">
                <button className="btn" onClick={() => emitLobby()}>Create Lobby</button>
            </div>
            <ToastContainer />
        </div>
    );

}

