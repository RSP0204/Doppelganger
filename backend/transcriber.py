from google.cloud import speech
from backend.audio_processing import get_sample_rate

def transcribe_audio(audio_file_path):
    client = speech.SpeechClient()
    print("[Transcriber] SpeechClient initialized.")

    # Get the sample rate of the audio file
    sample_rate = get_sample_rate(audio_file_path)
    if not sample_rate:
        raise ValueError("Could not determine sample rate of the audio file.")

    with open(audio_file_path, "rb") as audio_file:
        content = audio_file.read()

    audio = speech.RecognitionAudio(content=content)
    print("[Transcriber] RecognitionAudio created.")
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,  # Assuming WAV is LINEAR16
        sample_rate_hertz=sample_rate,
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
