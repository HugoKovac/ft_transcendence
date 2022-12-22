export enum ServerEvents
{
    Pong = 'server.pong',

    LobbyState = 'server.lobby.state',
    LobbyCall = 'server.lobby.call',
    LobbyCreation = 'server.lobby.creation',
    LobbyTimedOut = 'LobbyTimedOut',
    LobbyClear = 'LobbyClear',
}