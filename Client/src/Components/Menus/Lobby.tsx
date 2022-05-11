import * as signalR from '@microsoft/signalr'
import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { GameType, ILobby, IPlayerConnection } from '../../Interfaces/ILobby'
import styled from 'styled-components'
import { HiOutlineDocumentDuplicate } from 'react-icons/hi'
import Popup from '../Popup'
import { IGameState } from '../../Interfaces/IGameState'
import { AnimatePresence, motion } from 'framer-motion'
import LobbyPlayer from './LobbyPlayer'
import CopyableText from '../CopyableText'
import { IDailyResults } from '../../Interfaces/IDailyResults'

interface Props {
    connection: signalR.HubConnection | undefined
    playerId: string | undefined
    roomId: string | undefined
    gameState: IGameState | undefined
    onBack: () => void
}

const Lobby = ({ connection, playerId, roomId, gameState, onBack }: Props) => {
    let navigate = useNavigate()
    const [lobbyData, setLobbyData] = useState<ILobby>()
    const [dailyResults, setDailyResults] = useState<IDailyResults>()
    const [inLobby, setInLobby] = useState<boolean>(false)
    const [myPlayerName, setMyPlayerName] = useState<string>(() =>
        JSON.parse(localStorage.getItem('playerName') ?? `"Player"`)
    )
    const [searchParams, setSearchParams] = useSearchParams()
    const [waitingForPlayers, setWaitingForPlayers] = useState(true)
    const [activePlayers, setActivePlayers] = useState<string[]>([])
    const [spectating, setSpectating] = useState<boolean>(false)

    useEffect(() => {
        if (!connection) return
        console.log("connection.on('UpdateLobbyState', UpdateLobbyData)")
        connection.on('UpdateLobbyState', UpdateLobbyData)
        connection.on('UpdateDailyResults', UpdateDailyResults)

        return () => {
            connection.off('UpdateLobbyState', UpdateLobbyData)
            connection.off('UpdateDailyResults', UpdateDailyResults)
        }
    }, [connection])

    useEffect(() => {
        if (!inLobby) return
        console.log('updating name', myPlayerName)
        // Update our name on the server
        connection?.invoke('UpdateName', roomId, myPlayerName)
    }, [myPlayerName, inLobby])

    useEffect(() => {
        let activePlayers = (gameState?.players.filter((p) => p.id !== '0') ?? []).map((p) => p.id)
        setActivePlayers(activePlayers)
        setSpectating(activePlayers.length >= 2 && !activePlayers.find((p) => p === playerId))
    }, [gameState])

    const UpdateLobbyData = (updatedLobby: ILobby) => {
        console.log(updatedLobby)
        setLobbyData(updatedLobby)
        setInLobby(updatedLobby !== null)
    }

    const UpdateDailyResults = (data: any) => {
        let dailyResultsData: IDailyResults = JSON.parse(data)
        setDailyResults(dailyResultsData)
    }

    useEffect(() => {
        setWaitingForPlayers(lobbyData == null || lobbyData.connections?.length < 2)
    }, [lobbyData])

    const onStartGame = () => {
        connection?.invoke('StartGame', roomId)
    }

    const UpdateName = (newName: string) => {
        // Save it to local storage
        localStorage.setItem('playerName', JSON.stringify(newName))

        // Locally set our name
        setMyPlayerName(newName)
    }

    const ShowLobby = () => {
        return !gameState || !connection || activePlayers.length < 2 || spectating || !lobbyData?.gameStarted
    }

    if (!ShowLobby()) {
        return <></>
    }
    return (
        <Popup
            id={'lobbyPopup'}
            onBackButton={() => {
                onBack()
                navigate(`/`)
            }}
        >
            <LobbyWrapper>
                <Header2>Lobby</Header2>
                <Group>
                    <GameCodeTitle>Game Code:</GameCodeTitle>
                    <CopyableText
                        displayText={roomId}
                        copyText={window.location.href}
                        messageText={'Copied url to clipboard'}
                    />
                </Group>
                <Group>
                    <PlayersTitle>Players:</PlayersTitle>
                    <PlayersContainer>
                        {lobbyData != null && !!playerId ? (
                            <>
                                {lobbyData?.connections?.map((p, i) =>
                                    LobbyPlayer(playerId, myPlayerName, p, UpdateName, i)
                                )}
                            </>
                        ) : (
                            <div>Connecting to room..</div>
                        )}
                    </PlayersContainer>
                </Group>
                {waitingForPlayers && !!lobbyData && (
                    <p style={{ marginTop: -10, height: 0 }}>Waiting for another player to join..</p>
                )}
                {spectating ? (
                    <p>Game in progress</p>
                ) : (
                    lobbyData != null &&
                    !!playerId && (
                        <StartButton disabled={waitingForPlayers} onClick={() => onStartGame()}>
                            Start Game
                        </StartButton>
                    )
                )}
            </LobbyWrapper>
        </Popup>
    )
}

export default Lobby

const LobbyWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

const StartButton = styled.button`
    margin-top: 20px;
`

const Group = styled.div`
    width: 175px;
    display: flex;
    flex-direction: column;
    margin-bottom: 30px;
    align-items: flex-start;
`

const PlayersTitle = styled.p`
    margin-bottom: 8px;
`
const PlayersContainer = styled.div`
    justify-content: flex-start;
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    min-height: 65px;
`

const GameCodeTitle = styled.p`
    margin-bottom: 5px;
`

const Header2 = styled.h2`
    width: 250px;
    margin-bottom: 0px;
`
