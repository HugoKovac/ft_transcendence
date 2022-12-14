import { Socket } from 'socket.io'
import { ServerEvents } from 'src/shared/server/Server.Events';
import { Lobby } from './lobby/lobby';

export type AuthenticatedSocket = Socket & {

    data: {
      lobby: null | Lobby;
      userID: string;
    };
  
};

export type InQueuePlayer =
{
  joined_time: number,
  id: string,
  pref_skin: string
  socket: AuthenticatedSocket,
};

export type RankedGameData = 
{
  Player1ID : string,
  Player2ID : string,
  Player1Score: number,
  Player2Score: number,
  Player1Won: boolean,
  Player2Won: boolean,
  GameEndReason: string,
}

export type ServerPayload = {

  [ServerEvents.LobbyCreation]: {
    message: string;
    lobbyid: string;
    skin: string;
  };

  [ServerEvents.LobbyState]: {

    canvasWidth: number,
    canvasHeight: number,
    netWidth: number,
    netHeight: number,

    endMessage: string,
    message: string;
    skin: string;
    NetColor: string,
    lobbyid : string,
    numberOfSpectator: number,

    gameEnd: boolean,
    gameStart: boolean,

    scoreOne: number,
    scoreTwo: number,

    Player1id: string,
    Player2id: string,

    Player1Ready: boolean,
    Player2Ready: boolean,

    Player1Win: boolean,
    Player2Win: boolean,

    Player1x: number,
    Player1y: number,
    Player1width: number,
    Player1height: number,
    Player1color: string,
    Player1speed: number,
    Player1gravity: number,

    Player2x: number,
    Player2y: number,
    Player2width: number,
    Player2height: number,
    Player2color: string,
    Player2speed: number,
    Player2gravity: number,

    Ballx: number,
    Bally: number,
    Ballwidth: number,
    Ballheight: number,
    Ballcolor: string,
    Ballspeed: number,
    Ballgravity: number,
  };
};