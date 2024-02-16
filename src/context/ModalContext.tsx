import React, { createContext, useState, useContext, ReactNode } from "react";
import { QuizModalData } from "../components/Modals/QuizModal/QuizModal";
// Interfaces
import { PopularSymptomVideo } from "../components/SymptomsList/PopularSymptomsList";
import { GenericModalData } from "../components/Modals/GenericModal";

interface ModalContextProps {
  genericModalData: GenericModalData | undefined;
  isGenericModalOpen: boolean;
  setGenericModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isVideoModalOpen: boolean;
  setVideoModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isArticleDetailModalOpen: boolean;
  setArticleDetailModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isAgeGroupModalOpen: boolean;
  setAgeGroupModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isQuizModalOpen: boolean;
  setQuizModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  quizModalData: QuizModalData | null;
  setQuizModalData: React.Dispatch<React.SetStateAction<QuizModalData | null>>;
  setGenericModalData: React.Dispatch<React.SetStateAction<GenericModalData>>;
  currentArticleId: number | null;
  setCurrentArticleId: React.Dispatch<React.SetStateAction<number | null>>;
  currentVimeoId: string | null;
  setCurrentVimeoId: React.Dispatch<React.SetStateAction<string | null>>;
  currentVideoType: string;
  setCurrentVideoType: React.Dispatch<React.SetStateAction<string>>;
  popularSymptomId: number | null;
  setPopularSymptomId: React.Dispatch<React.SetStateAction<number | null>>;
  isPopularSymptomVideoModalOpen: boolean;
  setIsPopularSymptomVideoModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  popularSymptomVideo: PopularSymptomVideo | null;
  setPopularSymptomVideo: React.Dispatch<
    React.SetStateAction<PopularSymptomVideo | null>
  >;
  nextPopularSymptomVideo: PopularSymptomVideo | null;
  setNextPopularSymptomVideo: React.Dispatch<
    React.SetStateAction<PopularSymptomVideo | null>
  >;
  popularSymptomPlaylist: PopularSymptomVideo[];
  setPopularSymptomPlaylist: React.Dispatch<
    React.SetStateAction<PopularSymptomVideo[]>
  >;
  popularSymptomPlaylistPosition: number;
  setPopularSymptomPlaylistPosition: React.Dispatch<
    React.SetStateAction<number>
  >;
  isWelcomeModalOpen: boolean;
  setWelcomeModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

interface ModalProviderProps {
  children: ReactNode;
}

const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [genericModalData, setGenericModalData] = useState<
    GenericModalData | undefined
  >(undefined);
  const [isGenericModalOpen, setGenericModalOpen] = useState<boolean>(false);
  const [isVideoModalOpen, setVideoModalOpen] = useState<boolean>(false);
  const [isArticleDetailModalOpen, setArticleDetailModalOpen] =
    useState<boolean>(false);
  const [isAgeGroupModalOpen, setAgeGroupModalOpen] = useState<boolean>(false);
  const [isQuizModalOpen, setQuizModalOpen] = useState<boolean>(false);
  const [quizModalData, setQuizModalData] = useState<QuizModalData | null>(
    null,
  );
  const [currentArticleId, setCurrentArticleId] = useState<number | null>(null);
  const [currentVimeoId, setCurrentVimeoId] = useState<string | null>(null);
  const [currentVideoType, setCurrentVideoType] = useState<string>("");
  const [popularSymptomId, setPopularSymptomId] = useState<number | null>(null);
  const [isPopularSymptomVideoModalOpen, setIsPopularSymptomVideoModalOpen] =
    useState<boolean>(false);
  const [popularSymptomVideo, setPopularSymptomVideo] =
    useState<PopularSymptomVideo | null>(null);
  const [nextPopularSymptomVideo, setNextPopularSymptomVideo] =
    useState<PopularSymptomVideo | null>(null);
  const [popularSymptomPlaylist, setPopularSymptomPlaylist] = useState<
    PopularSymptomVideo[]
  >([]);
  const [popularSymptomPlaylistPosition, setPopularSymptomPlaylistPosition] =
    useState<number>(0);
  const [isWelcomeModalOpen, setWelcomeModalOpen] = useState<boolean>(false);

  const contextValue = {
    setGenericModalData,
    genericModalData,
    isGenericModalOpen,
    setGenericModalOpen,
    isVideoModalOpen,
    setVideoModalOpen,
    isArticleDetailModalOpen,
    setArticleDetailModalOpen,
    isAgeGroupModalOpen,
    setAgeGroupModalOpen,
    isQuizModalOpen,
    setQuizModalOpen,
    quizModalData,
    setQuizModalData,
    currentArticleId,
    setCurrentArticleId,
    currentVimeoId,
    setCurrentVimeoId,
    currentVideoType,
    setCurrentVideoType,
    popularSymptomId,
    setPopularSymptomId,
    isPopularSymptomVideoModalOpen,
    setIsPopularSymptomVideoModalOpen,
    popularSymptomVideo,
    setPopularSymptomVideo,
    nextPopularSymptomVideo,
    setNextPopularSymptomVideo,
    popularSymptomPlaylist,
    setPopularSymptomPlaylist,
    popularSymptomPlaylistPosition,
    setPopularSymptomPlaylistPosition,
    isWelcomeModalOpen,
    setWelcomeModalOpen,
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  );
};

function useModalContext() {
  const context = useContext(ModalContext);
  if (!context)
    throw new Error("useModalContext must be used within a ModalProvider");
  return context;
}

export { ModalProvider, useModalContext };
