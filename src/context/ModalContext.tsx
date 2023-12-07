import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ModalContextProps {
    isVideoModalOpen: boolean;
    setVideoModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isArticleDetailModalOpen: boolean;
    setArticleDetailModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isAgeGroupModalOpen: boolean;
    setAgeGroupModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isQuizModalOpen: boolean;
    setQuizModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    currentArticleId: number | null;
    setCurrentArticleId: React.Dispatch<React.SetStateAction<number | null>>;
    currentVimeoId: string | null;
    setCurrentVimeoId: React.Dispatch<React.SetStateAction<string | null>>;
    currentVideoType: string;
    setCurrentVideoType: React.Dispatch<React.SetStateAction<string>>;    
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

interface ModalProviderProps {
    children: ReactNode;
}

const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
    const [isVideoModalOpen, setVideoModalOpen]                 = useState<boolean>(false);
    const [isArticleDetailModalOpen, setArticleDetailModalOpen] = useState<boolean>(false);
    const [isAgeGroupModalOpen, setAgeGroupModalOpen]           = useState<boolean>(false);
    const [isQuizModalOpen, setQuizModalOpen]                   = useState<boolean>(false);
    const [currentArticleId, setCurrentArticleId]               = useState<number | null>(null);
    const [currentVimeoId, setCurrentVimeoId]                   = useState<string | null>(null);
    const [currentVideoType, setCurrentVideoType]               = useState<string>('');

    const contextValue = {
        isVideoModalOpen,
        setVideoModalOpen,
        isArticleDetailModalOpen,
        setArticleDetailModalOpen,
        isAgeGroupModalOpen,
        setAgeGroupModalOpen,
        isQuizModalOpen,
        setQuizModalOpen,
        currentArticleId,
        setCurrentArticleId,
        currentVimeoId,
        setCurrentVimeoId,
        currentVideoType,
        setCurrentVideoType,
    };

    return (
        <ModalContext.Provider value={contextValue}>
            {children}
        </ModalContext.Provider>
    );
};

function useModalContext() {
    const context = useContext(ModalContext);
    if (!context) throw new Error("useModalContext must be used within a ModalProvider");
    return context;
}

export { ModalProvider, useModalContext };
