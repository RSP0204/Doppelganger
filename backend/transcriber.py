from google.cloud import speech

def transcribe_audio(audio_file):
    client = speech.SpeechClient()

    content = audio_file.read()

    audio = speech.RecognitionAudio(content=content)
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=16000,
        language_code="en-US",
    )

    response = client.recognize(config=config, audio=audio)

    return " ".join([result.alternatives[0].transcript for result in response.results])
