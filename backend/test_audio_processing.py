import unittest
from unittest.mock import patch, MagicMock
import os
from backend.transcriber import transcribe_audio
from backend.agent import process_with_llm

class TestAudioProcessing(unittest.TestCase):

    def setUp(self):
        # Create a dummy audio file for testing
        self.audio_file_path = 'tests/audio/sample_audio.wav'
        os.makedirs(os.path.dirname(self.audio_file_path), exist_ok=True)
        with open(self.audio_file_path, 'wb') as f:
            f.write(b'RIFF\x00\x00\x00\x00WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00\x80>\x00\x00\x00\xfa\x00\x00\x02\x00\x10\x00data\x00\x00\x00\x00')

    def tearDown(self):
        # Clean up the dummy audio file
        os.remove(self.audio_file_path)
        os.rmdir('tests/audio')

    def test_audio_processing_pipeline(self):
        with patch('backend.test_audio_processing.transcribe_audio') as mock_transcribe_audio, patch('backend.agent.process_with_llm') as mock_process_with_llm:
            # 1. Mock the transcription and LLM functions
            mock_transcribe_audio.return_value = "This is a sample transcript."
            mock_process_with_llm.return_value = [
                "What is the target audience for this feature?",
                "Are there any specific KPIs you want to measure?",
                "What timeline do you expect for delivery?"
            ]

            # 2. Simulate file upload
            with open(self.audio_file_path, 'rb') as audio_file:
                # 3. Call the transcription function
                transcribed_text = transcribe_audio(audio_file)

                # 4. Define the user prompt
                user_prompt = "Act as a business analyst and suggest three questions to ask based on the transcript."

                # 5. Call the LLM processing function
                follow_up_questions = process_with_llm(transcribed_text, "business-analyst")

                # 6. Assertions
                self.assertIsInstance(follow_up_questions, list)
                self.assertNotEqual(len(follow_up_questions), 0)
                self.assertEqual(len(follow_up_questions), 3)
                for question in follow_up_questions:
                    self.assertIsInstance(question, str)
                    self.assertNotEqual(len(question), 0)

                # 7. Optionally, print the questions for verification
                print("Generated Questions:", follow_up_questions)

if __name__ == '__main__':
    unittest.main()
