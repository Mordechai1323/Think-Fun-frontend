import React, { useState } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../../api/axios';

import GamePlay from './GamePlay';
import Result from '../games/Result';
import InviteFriend from '../games/inviteFriend';

import ChooseOptions from '../games/ChooseOptions';

export default function TicTacToe() {
	const { idRoom } = useParams();

	const [gameStatus, setGameStatus] = useState({
		gameType: '',
		level: '',
		winner: '',
	});

	const [gameObj, setGameObj] = useState();
	const [socket, setSocket] = useState();

	const { gameType, level, winner } = gameStatus;

	if (idRoom && !socket) setSocket(io.connect(BASE_URL));

	if (idRoom && socket && !gameObj)
		connectToRoom(socket, idRoom, gameStatus, setGameObj, setGameStatus);

	function resetLevel() {
		setGameStatus({
			...gameStatus,
			level: '',
			winner: '',
		});
	}

	return !gameType ? (
		<ChooseOptions
			firstOption={'VS AI'}
			secondOption={'random player'}
			thirdOption={'invite friend'}
			setter={gameType => setGameStatus({ ...gameStatus, gameType })}
		/>
	) : gameType === 'invite friend' ? (
		<InviteFriend
			game={'TicTacToe'}
			setGameObj={setGameObj}
			setIsRandomPlayer={() => setGameStatus({ ...gameStatus, gameType: 'VS Person' })}
			setSocket={setSocket}
			socket={socket}
		/>
	) : gameType === 'VS AI' && !level ? (
		<ChooseOptions
			firstOption={'Easy'}
			secondOption={'Medium'}
			thirdOption={'Hard'}
			setter={level => setGameStatus({ ...gameStatus, level })}
		/>
	) : !winner ? (
		<GamePlay
			level={level || 'person'}
			socketDetails={socket}
			resetLevel={resetLevel}
			setGameObj={setGameObj}
			gameObj={gameObj}
			winner={winner}
			setWinner={res => setGameStatus({ ...gameStatus, winner: res })}
		/>
	) : (
		<Result
			res={winner}
			resetLevel={gameType === 'VS AI' && resetLevel}
			resetBoard={() => setGameStatus({ ...gameStatus, winner: null })}
			typeGame={'tic_tac_toe'}
			isOnline={gameType !== 'VS AI'}
			level={level}
		/>
	);
}

function connectToRoom(socket, idRoom, gameStatus, setGameObj, setGameStatus) {
	socket.on('connect', () => console.log(socket.id));
	socket.emit('invitation-link', idRoom);
	socket.on('game-started', room => {
		setGameObj(room);
		setGameStatus({
			...gameStatus,
			gameType: 'VS Person',
			needToInviteFriend: false,
		});
		socket.emit('join-room', room.id_room);
	});
}
