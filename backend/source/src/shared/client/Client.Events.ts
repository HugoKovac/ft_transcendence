export enum ClientEvents
{
    Ping = 'client.ping',

    CreateLobby = 'client.createlobby',
    JoinLobby = 'client.joinlobby',
    LeaveLobby = 'client.leavelobby',

    JoinMatchmaking = 'client.joinmatchmaking',

    ReadyState = 'client.readystate',

    Player1ArrowUpRelease = 'client.player1arrowuprelease',
    Player1ArrowUpPress = 'client.player1arrowuppress',

    Player1ArrowDownRelease = 'client.player1arrowdownrelease',
    Player1ArrowDownPress = 'client.player1arrowdownpress',

    Player2ArrowUpRelease = 'client.player2arrowuprelease',
    Player2ArrowUpPress = 'client.player2arrowuppress',

    Player2ArrowDownRelease = 'client.player2arrowdownrelease',
    Player2ArrowDownPress = 'client.player2arrowdownpress',

    PlayerLeft = 'client.playerleft',

    PlayerLostConnection = 'client.playerlostconnection',
    PlayerRetrieveConnection = 'client.playerretrieveconnection',


    GameLoop = 'client.gameloop',
}