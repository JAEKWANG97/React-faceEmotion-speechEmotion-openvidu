import { LocalVideoTrack, RemoteVideoTrack } from "livekit-client";
import "./VideoComponent.css";
import { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";

interface VideoComponentProps {
    track: LocalVideoTrack | RemoteVideoTrack;
    participantIdentity: string;
    local?: boolean;
}

function VideoComponent({ track, participantIdentity, local = false }: VideoComponentProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null); // 비디오 요소를 참조하기 위한 useRef 훅
    const canvasRef = useRef<HTMLDivElement | null>(null); // 캔버스 요소를 참조하기 위한 useRef 훅

    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = "/models"; // 모델이 위치한 URL 설정
            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
            ]);
            console.log("모델 로드 완료");
        };
        loadModels(); // 모델 로드 함수 호출
    }, []);

    

    useEffect(() => {
        if (videoRef.current) {
            track.attach(videoRef.current);
            console.log(videoRef);
            videoRef.current.onloadeddata = () => {
                if (videoRef.current) {
                    handleVideoPlay();
                }
            };
        }
    
        return () => {
            if (videoRef.current) {
                track.detach(videoRef.current);
                videoRef.current.onloadeddata = null; // 이벤트 리스너 제거
            }
        };
    }, [track]);
    
    const handleVideoPlay = () => {
        if (!videoRef.current || !canvasRef.current) return;
    
        // Creating the canvas from the video and appending it to the DOM
        const canvas = faceapi.createCanvasFromMedia(videoRef.current);
        canvasRef.current.appendChild(canvas);
    
        // Set the willReadFrequently attribute for optimization
        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (!context) return;
    
        const displaySize = {
            width: videoRef.current.videoWidth,
            height: videoRef.current.videoHeight,
        };
    
        faceapi.matchDimensions(canvas, displaySize);
    
        // Setting up an interval to periodically run face detection
        const intervalId = setInterval(async () => {
            if (!videoRef.current) return; // 비디오가 여전히 존재하는지 확인
        
            // 얼굴 감지 및 랜드마크, 표정 인식
            const detections = await faceapi
                .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceExpressions();
        
            // 감지된 결과 조정 (크기 조절)
            const resizedDetections = faceapi.resizeResults(detections, displaySize);
        
            // 감지된 얼굴과 표정 정보를 콘솔에 출력
            resizedDetections.forEach((detection, index) => {
                // console.log(`Detection ${index + 1}:`, detection);
                if (detection.expressions) {
                    // console.log(`Expressions:`, detection.expressions);
                }
            });
        }, 100);
        
    
        return () => clearInterval(intervalId); // Cleaning up on component unmount
    };
    
    
    

    return (
        <div id={"camera-" + participantIdentity} className="video-container">
            <div className="participant-data">
                <p>{participantIdentity + (local ? " (You)" : "")}</p>
            </div>
            <video ref={videoRef} autoPlay playsInline muted={local}></video> // 자동 재생, 인라인 재생, 로컬일 경우 음소거
            
        </div>
    );
}

export default VideoComponent;
