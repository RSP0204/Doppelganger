"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/registry/new-york-v4/ui/button";
import { Textarea } from "@/registry/new-york-v4/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select";
import { Input } from "@/registry/new-york-v4/ui/input";

export default function LiveStdQuestionsPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [isRecordingContext, setIsRecordingContext] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [conversationContext, setConversationContext] = useState("");
  const [wordChunkCount, setWordChunkCount] = useState("90");
  const [customWordChunkCount, setCustomWordChunkCount] = useState("");

  const socket = useRef<WebSocket | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const contextMediaRecorder = useRef<MediaRecorder | null>(null);
  const contextAudioChunks = useRef<Blob[]>([]);

  const handleStartRecording = async () => {
    setIsRecording(true);
    socket.current = new WebSocket("ws://localhost:8000/ws/live-std-questions");

    socket.current.onopen = () => {
      console.log("WebSocket connected");
      const settings = {
        type: "settings",
        conversationContext,
        wordChunkCount:
          wordChunkCount === "custom"
            ? parseInt(customWordChunkCount)
            : parseInt(wordChunkCount),
      };
      socket.current?.send(JSON.stringify(settings));
    };

    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "final_transcript") {
        setTranscript(message.data);
        setInterimTranscript("");
      } else if (message.type === "interim_transcript") {
        setInterimTranscript(message.data);
      } else if (message.type === "questions") {
        setQuestions((prevQuestions) => [...prevQuestions, ...message.data]);
      }
    };

    socket.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    mediaRecorder.current.ondataavailable = (event) => {
      if (event.data.size > 0 && socket.current?.readyState === WebSocket.OPEN) {
        socket.current.send(event.data);
      }
    };
    mediaRecorder.current.start(250); // Send data every 250ms
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
    }
    if (socket.current) {
      socket.current.close();
    }
  };

  const handleRecordContext = async () => {
    if (isRecordingContext) {
      // Stop recording context
      setIsRecordingContext(false);
      contextMediaRecorder.current?.stop();
    } else {
      // Start recording context
      setIsRecordingContext(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      contextMediaRecorder.current = new MediaRecorder(stream);
      contextAudioChunks.current = [];

      contextMediaRecorder.current.ondataavailable = (event) => {
        contextAudioChunks.current.push(event.data);
      };

      contextMediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(contextAudioChunks.current, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("file", audioBlob, "context.webm");

        try {
          const response = await fetch("http://localhost:8000/api/transcribe-context", {
            method: "POST",
            body: formData,
          });
          const data = await response.json();
          if (response.ok) {
            setConversationContext(data.transcript);
          } else {
            console.error("Failed to transcribe context:", data.detail);
          }
        } catch (error) {
          console.error("Error transcribing context:", error);
        }
      };

      contextMediaRecorder.current.start();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Live Speech-to-Text and Question Generation
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Controls</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="context">Meeting Context</label>
              <div className="flex items-center gap-2">
                <Textarea
                  id="context"
                  value={conversationContext}
                  onChange={(e) => setConversationContext(e.target.value)}
                  placeholder="Enter the context of the meeting or record it..."
                  disabled={isRecordingContext}
                />
                <Button onClick={handleRecordContext} variant="outline" className={isRecordingContext ? "bg-red-500" : ""}>
                  {isRecordingContext ? "Stop" : "Record"}
                </Button>
              </div>
            </div>
            <div>
              <label>Word Chunk Count</label>
              <Select
                value={wordChunkCount}
                onValueChange={setWordChunkCount}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select word chunk count" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="90">90 words</SelectItem>
                  <SelectItem value="120">120 words</SelectItem>
                  <SelectItem value="180">180 words</SelectItem>
                  <SelectItem value="240">240 words</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              {wordChunkCount === "custom" && (
                <Input
                  type="number"
                  value={customWordChunkCount}
                  onChange={(e) => setCustomWordChunkCount(e.target.value)}
                  placeholder="Enter custom word count"
                  className="mt-2"
                />
              )}
            </div>
            <div>
              <Button
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                className={isRecording ? "bg-red-500" : "bg-green-500"}
              >
                {isRecording ? "Stop Recording" : "Start Recording"}
              </Button>
            </div>
          </div>
        </div>
        <div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Live Transcript</h2>
            <div className="border p-4 h-64 overflow-y-auto">
              <p>{transcript} <span className="text-gray-500">{interimTranscript}</span></p>
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Generated Questions</h2>
            <div className="border p-4 h-64 overflow-y-auto">
              <ul>
                {questions.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
