// useGlobalAudio.ts
import useSWR from "swr";

export const useGlobalAudio = () => {
  const { data: audioBlob, mutate: setAudioBlob } = useSWR<Blob | null>(
    "global-audio",
    { fallbackData: null }
  );

  return {
    audioBlob,
    setAudioBlob,
  };
};
