import React, { useState } from 'react';

import GameCard from '../GameCard';
import Level from './Level';
import GamePlay from './GamePlay';
import Result from './Result';

import img1vs1 from '../../assets/personPlay.png';
import imgvsai from '../../assets/robot_play.png';

export default function TicTacToe() {
	// where stat
	const [gameType, setGameType] = useState();
	const [level, setLevel] = useState();
	const [winner, setWinner] = useState();

	function resetLevel() {
		setWinner();
		setLevel();
	}

	return !gameType ? (
		<>
			<GameCard bgImg={img1vs1} setter={setGameType} name='VS Person' />
			<GameCard bgImg={imgvsai} setter={setGameType} name='VS AI' />
		</>
	) : gameType === 'VS AI' && !level ? (
		<Level setLevel={setLevel} />
	) : !winner ? (
		<GamePlay
			level={level || 'person'}
			resetLevel={resetLevel}
			winner={winner}
			setWinner={setWinner}
		/>
	) : (
		<Result
			res={winner}
			resetLevel={resetLevel}
			resetBoard={() => setWinner()}
			typeGame={'tic_tac_toe'}
			isOnline={gameType !== 'VS AI'}
			level={level}
		/>
	);
}
