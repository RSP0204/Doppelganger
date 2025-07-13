from google.cloud import speech

def transcribe_audio(audio_file):
    client = speech.SpeechClient()
    print("[Transcriber] SpeechClient initialized.")

    # Read the audio file in chunks
    def generate_audio_chunks():
        print("[Transcriber] Starting to generate audio chunks...")
        while True:
            chunk = audio_file.read(4096)  # Read in 4KB chunks
            if not chunk:
                print("[Transcriber] Finished generating audio chunks.")
                break
            yield chunk

    audio_content = b"".join(generate_audio_chunks())
    print(f"[Transcriber] Audio content length: {len(audio_content)} bytes.")
    audio = speech.RecognitionAudio(content=audio_content)
    print("[Transcriber] RecognitionAudio created.")
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,  # Assuming WAV is LINEAR16
        sample_rate_hertz=16000,  # Adjust based on your audio file's sample rate
        language_code="en-US",
    )
    print("[Transcriber] RecognitionConfig created.")

    try:
        print("[Transcriber] Calling client.recognize...")
        response = client.recognize(config=config, audio=audio)
        print("[Transcriber] client.recognize call successful.")
    except Exception as e:
        print(f"[Transcriber] Error during Google Cloud Speech-to-Text API call: {e}")
        raise  # Re-raise the exception to be caught by the app.py error handler

    return " ".join([result.alternatives[0].transcript for result in response.results])
