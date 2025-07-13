import subprocess
import tempfile
import os

def convert_to_mono(audio_file_path):
    """
    Converts an audio file to mono using ffmpeg.
    Returns the path to the converted mono audio file.
    """
    # Create a temporary file with a .wav extension
    fd, mono_file_path = tempfile.mkstemp(suffix=".wav")
    os.close(fd)

    command = [
        "ffmpeg",
        "-y", # Overwrite output file if it exists
        "-i", audio_file_path,
        "-ac", "1", # Set audio channels to 1 (mono)
        mono_file_path
    ]
    try:
        # It's good practice to log the command being executed
        print(f"Executing ffmpeg command: {' '.join(command)}")
        result = subprocess.run(command, check=True, capture_output=True, text=True)
        print(f"ffmpeg stdout: {result.stdout}")
        if result.stderr:
            print(f"ffmpeg stderr: {result.stderr}")
        return mono_file_path
    except FileNotFoundError:
        print("Error: ffmpeg is not installed or not in the system's PATH.")
        os.remove(mono_file_path)
        return None
    except subprocess.CalledProcessError as e:
        print(f"Error converting to mono: {e}")
        print(f"ffmpeg stderr: {e.stderr}")
        # Clean up the empty temporary file if ffmpeg fails
        os.remove(mono_file_path)
        return None

def get_sample_rate(audio_file_path):

    """
    Gets the sample rate of an audio file using ffprobe.
    """
    command = [
        "ffprobe",
        "-v", "error",
        "-select_streams", "a:0",
        "-show_entries", "stream=sample_rate",
        "-of", "default=noprint_wrappers=1:nokey=1",
        audio_file_path,
    ]
    try:
        result = subprocess.run(command, capture_output=True, text=True, check=True)
        return int(result.stdout.strip())
    except (subprocess.CalledProcessError, FileNotFoundError, ValueError) as e:
        print(f"Error getting sample rate: {e}")
        return None

def transcribe_audio(audio_file):
    # This function will be mocked in the tests.
    pass

def process_with_llm(transcribed_text, user_prompt):
    # This function will also be mocked.
    pass
