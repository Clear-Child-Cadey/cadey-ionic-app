import React, { createContext, useState, useContext, ReactNode } from 'react';
// Interfaces
import { PathEntity } from '../api/Paths';

interface PathContextProps {
    pathId: number | null;
    setPathId: React.Dispatch<React.SetStateAction<number | null>>;
    pathEntity: PathEntity | null;
    setPathEntity: React.Dispatch<React.SetStateAction<PathEntity | null>>;
    nextPathEntity: PathEntity | null;
    setNextPathEntity: React.Dispatch<React.SetStateAction<PathEntity | null>>;
    pathPlaylist: PathEntity[];
    setPathPlaylist: React.Dispatch<React.SetStateAction<PathEntity[]>>;
    pathPlaylistPosition: number;
    setPathPlaylistPosition: React.Dispatch<React.SetStateAction<number>>;
}

const PathContext = createContext<PathContextProps | undefined>(undefined);

interface PathProviderProps {
    children: ReactNode;
}

const PathProvider: React.FC<PathProviderProps> = ({ children }) => {
    const [pathId, setPathId]                               = useState<number | null>(null);
    const [pathEntity, setPathEntity]                       = useState<PathEntity | null>(null);
    const [nextPathEntity, setNextPathEntity]                = useState<PathEntity | null>(null);
    const [pathPlaylist, setPathPlaylist]                   = useState<PathEntity[]>([]);
    const [pathPlaylistPosition, setPathPlaylistPosition]   = useState<number>(0);

    const contextValue = {
        pathId,
        setPathId,
        pathEntity,
        setPathEntity,
        nextPathEntity,
        setNextPathEntity,
        pathPlaylist,
        setPathPlaylist,
        pathPlaylistPosition,
        setPathPlaylistPosition,
    };

    return (
        <PathContext.Provider value={contextValue}>
            {children}
        </PathContext.Provider>
    );
};

function usePathContext() {
    const context = useContext(PathContext);
    if (!context) throw new Error("PathContext must be used within a PathProvider");
    return context;
}

export { PathProvider, usePathContext };
