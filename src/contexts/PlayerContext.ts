import { createContext } from 'react';

type Episode = {
    title: string;
    thumbnail: string;
    members: string;
    duration: number;
    url: string;
}

type PlayerContextData = {
    episodeList: Array<Episode>;
    currentEpisodeIndex: number; 
    isPlaying: boolean;
    togglePlay: () => void;
    setPlayingState: (state:boolean) => void;
    play: (episode: Episode) => void;
}

export const PlayerContext = createContext({} as PlayerContextData); //iniciando os valores com a estrutura que ele terá