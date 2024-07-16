import { LocalAudioTrack, RemoteAudioTrack } from "livekit-client";
import { useEffect, useRef, useState } from "react";
import { useSpeechRecognition } from "react-speech-kit";
interface AudioComponentProps {
    track: LocalAudioTrack | RemoteAudioTrack;
}

function AudioComponent({ track }: AudioComponentProps) {
    const audioElement = useRef<HTMLAudioElement | null>(null);
    const [text, setText] = useState('');
    const [value, setValue] = useState('결과');
    
    const { listen, listening, stop } = useSpeechRecognition({
        onResult: result => {
            setValue(result);
        }
    });

    useEffect(() => {
        if (audioElement.current) {
            track.attach(audioElement.current);
        }

        return () => {
            track.detach();
        };
    }, [track]);

    return <audio ref={audioElement} id={track.sid} />;
}

export default AudioComponent;
