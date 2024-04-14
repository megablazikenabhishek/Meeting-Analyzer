import google.generativeai as genai

import os

genai.configure(api_key="AIzaSyBhraHx_bfJEZbawIuk2vPpGz5enm2sDRU")
model = genai.GenerativeModel('gemini-pro')

def detailedAnalysis(text):
    chat = model.start_chat(history=[])

    sentiment = chat.send_message('''
    Give me overall mood and participation of each participant in the meet provided the transcript below also remember the output format is: 
    name 
        sentiment : this should mention the  mood with few comments
        participation: this should mention the participation with few comments
    '''+"\n"+text).text

    analysis = chat.send_message("Give Analysis like how many words each person has spoken, what was the most frequently used word/phrase based on the above transcript").text

    return sentiment, analysis
