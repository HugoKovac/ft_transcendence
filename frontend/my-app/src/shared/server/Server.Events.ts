export enum ServerEvents
{
    Pong = 'server.pong',

    ServerMessage = 'server.Message',

    LobbyState = 'server.lobby.state',
    LobbyCall = 'server.lobby.call',
    LobbyCreation = 'server.lobby.creation',
    LobbyTimedOut = 'LobbyTimedOut',
    LobbyClear = 'LobbyClear',
    LobbyJoin = 'LobbyJoin',
}