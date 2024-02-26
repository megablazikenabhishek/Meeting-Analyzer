from flask import Flask, request, send_file

# for summarization
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
tokenizer = AutoTokenizer.from_pretrained("knkarthick/MEETING_SUMMARY", model_max_length=5000)
model = AutoModelForSeq2SeqLM.from_pretrained("knkarthick/MEETING_SUMMARY")

# importing required files
from utils.cleanData import cleanData
from utils.generatePDF import TranscriptPDF

# intializing app
app = Flask(__name__)

@app.route("/", methods=['GET'])
def home():
	return {'sucess': True, 'message': 'Hello World!!'}

@app.route("/cleanData", methods=['GET', 'POST'])
def clean_data():
	try:
		req = request.get_json()
		data = req['data']

		# cleaning data
		result = cleanData(data)
		print(result)
		return {'sucess': True, 'data': result}
	except Exception as e:
		return {'sucess': False, 'message': str(e)}

@app.route("/generateSummary", methods=['GET', 'POST'])
def summary():
	try:
		req = request.get_json()
		text = req['text']
		
		inputs = tokenizer(text, return_tensors="pt", max_length=5000, truncation=True)
		summary_ids = model.generate(inputs["input_ids"], max_length=500, min_length=250, length_penalty=0.5, num_beams=4, early_stopping=False)
		summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)

		return {'sucess': True, 'summary': summary}
	except Exception as e:
		return {'sucess': False, 'message': str(e)}

@app.route('/downloadTranscript')
def download_transcript():
	try:
		req = request.get_json()
		data = req['data']

		# cleaning data
		result = cleanData(data)
		
		path = './file.pdf'
		t = TranscriptPDF()
		t.draw("This is your Transcript", result)
		t.save(path)

		return send_file(path)
	except Exception as e:
		return {'sucess': False, 'message': str(e)}

if __name__ == '__main__':
	app.run(host='0.0.0.0',port=5000)
