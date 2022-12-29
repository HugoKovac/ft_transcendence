import { useContext, useEffect, useRef, useState } from 'react';
import { ClientEvents } from '../../../shared/client/Client.Events'
import { WebsocketContext } from './../WebsocketContext';
import { useSearchParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import NavBar from '../../NavBar';
import { Ball, CANVASHEIGHT, CANVASWIDTH, NETHEIGHT, NETWIDTH, Paddle, PADDLEHEIGHT, PADDLEWIDTH } from '../GameConstant';

export default function GameLobby() {

    const socket = useContext(WebsocketContext);
    const [searchParams] = useSearchParams();
    const searchParamsString = searchParams.get('id');


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

    const requestRef = useRef(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const Paddle1CPRef = useRef<any>();
    const Paddle2CPRef = useRef<any>();
    const BallCPRef = useRef<any>();
    const NetCPRef = useRef<any>();
    const SkinListRef = useRef<any>();


    const [Paddle1Color, SetPaddle1Color] = useState("#fff");
    const [Paddle2Color, SetPaddle2Color] = useState("#fff");
    const [NetColor, SetNetColor] = useState("#fff");
    const [BallColor, SetBallColor] = useState("#fff");
    const [Skin, SetSkin] = useState("default");

    

    
    useEffect( () => {

        if ( searchParamsString )
        {
            socket.emit(ClientEvents.JoinLobby, {
                lobbyId: searchParamsString,
          });
        }
    }, [searchParamsString]);

    const emitLobby = () => 
    {
        socket.emit(ClientEvents.CreateLobby, 
        {
            skin: Skin,
            Paddle1color: Paddle1Color,
            Paddle2color: Paddle2Color,
            Ballcolor: BallColor,
            Netcolor: NetColor,
        });
    }  

    useEffect( () => {

        SkinListRef.current = document.getElementById('skin');
        SkinListRef.current.addEventListener('change', RetrieveSkin);

        Paddle1CPRef.current = document.querySelector("#Paddle1CP");
        Paddle1CPRef.current.addEventListener("input", Paddle1ColorPicker, false);

        Paddle2CPRef.current = document.querySelector("#Paddle2CP");
        Paddle2CPRef.current.addEventListener("input", Paddle2ColorPicker, false);

        BallCPRef.current = document.querySelector("#BallCP");
        BallCPRef.current.addEventListener("input", BallColorPicker, false);

        NetCPRef.current = document.querySelector("#NetCP");
        NetCPRef.current.addEventListener("input", NetColorPicker, false);

        requestRef.current = requestAnimationFrame(previewloop);
        return () =>
            cancelAnimationFrame(requestRef.current);

    }, [Paddle1Color, Paddle2Color, BallColor, NetColor, Skin])

    useEffect( () => {


        const ChooseSkin = localStorage.getItem('Skin');
        if ( ChooseSkin )
            SetSkin(ChooseSkin);
        
        const P1Color = localStorage.getItem('Paddle1Color');
        if ( P1Color )
            SetPaddle1Color(P1Color);

        const P2Color = localStorage.getItem('Paddle2Color');
        if ( P2Color )
            SetPaddle2Color(P2Color);

        const BColor = localStorage.getItem('BallColor');
        if ( BColor )
            SetBallColor(BColor);
                        
        const NColor = localStorage.getItem('NetColor');
        if ( NColor )
            SetNetColor(NColor);

    }, [])


    const previewloop = () =>
    {
        Paddle1.current.color = Paddle1Color;
        Paddle2.current.color = Paddle2Color;
        Ball.current.color = BallColor;

        clear();
        BallBounce();
        BallCollision();
        drawLine();
        drawPaddle(Paddle1.current);
        drawPaddle(Paddle2.current);
        drawBall(Ball.current);
        requestRef.current = requestAnimationFrame(previewloop);
    }
    


    

    function RetrieveSkin( event : any )
    {
        localStorage.setItem('Skin', event.target.value);
        const ChooseSkin = localStorage.getItem('Skin');
        if ( ChooseSkin )
            SetSkin(ChooseSkin);
    }

    function Paddle1ColorPicker(event : any) 
    {
        localStorage.setItem('Paddle1Color', event.target.value);
        const P1Color = localStorage.getItem('Paddle1Color');
        if ( P1Color )
            SetPaddle1Color(P1Color);
    }

    function Paddle2ColorPicker(event : any) 
    {
        localStorage.setItem('Paddle2Color', event.target.value);
        const P2Color = localStorage.getItem('Paddle2Color');
        if ( P2Color )
            SetPaddle2Color(P2Color);
    }

    function BallColorPicker(event : any) 
    {
        localStorage.setItem('BallColor', event.target.value);
        const BColor = localStorage.getItem('BallColor');
        if ( BColor )
            SetBallColor(BColor);
    }

    function NetColorPicker(event : any) 
    {
        localStorage.setItem('NetColor', event.target.value);
        const NColor = localStorage.getItem('NetColor');
        if ( NColor )
            SetNetColor(NColor);
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
                context.fillRect(CANVASWIDTH / 2, 0, NETWIDTH, NETHEIGHT);
            }
        }
    })

    
    const clear = ( ( ) => {
        if (canvasRef.current)
        {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            if (context)
                context.clearRect(0, 0, CANVASWIDTH, CANVASHEIGHT);
        }
    });



    const BallBounce = () =>
    {

        if ( Ball.current.y + Ball.current.gravity <= 0 ||  Ball.current.y +  Ball.current.gravity >= CANVASHEIGHT )
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
        <div className={Skin}>
            <NavBar />
            <div className="ColorPicker">
                <label> Player 1 <input type="color" value={Paddle1Color} id="Paddle1CP" className="Paddle1ColorPicker"/></label>
                <label> Ball <input type="color" value={BallColor} id="BallCP" className="BallColorPicker"/></label>
                <label> Net <input type="color" value={NetColor} id="NetCP" className="NetColorPicker"/></label>
                <label> Player 2 <input type="color" value={Paddle2Color} id="Paddle2CP" className="Paddle2ColorPicker"/></label>
            </div>
            <label className='SkinLabel'>Skin</label>
            <div className="SkinSelector">
                    <select id="skin" value={Skin} className="SkinList">
                            <option value="default">Default</option>
                            <option value="SpaceGIF">SpaceGIF</option>
                            <option value="BananaGIF">BananaGIF</option>
                            <option value="neonsunsetoverdrive">Neon Sunset Overdrive</option>
                            <option value="gotham">Gotham City</option>
                    </select>
            </div>
            <div>
                <canvas className="CanvasPreview" ref={canvasRef} width={CANVASWIDTH} height={CANVASHEIGHT}></canvas> 
            </div>
            
            <div className="CreateLobby">
                <button className="CreateLobbyBtn" onClick={() => emitLobby()}>Create Lobby</button>
            </div>
            <ToastContainer />
        </div>
    );

}

