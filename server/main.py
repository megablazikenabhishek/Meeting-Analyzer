from flask import Flask, request, send_file, Response
from flask_cors import CORS

# importing required files
from utils.cleanData import cleanData
from utils.generatePDF import TranscriptPDF, SummaryPDF
from utils.generateSummary import generateSummary

# intializing app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

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
		data = req['data']
		ratio = int(req['ratio'])


		# for summarization
		text = "\n".join([f"{i['name']} : {i['text']}" for i in data])
		
		if(len(text)*(ratio/100)<=100):
			return {'sucess': False, 'message': "Conversation is too small to generate a summary"}, 500
		if(ratio < 15):
			return {'sucess': False, 'message': "Very low percentage ratio"}, 500
		
		summary_text = generateSummary(text, ratio)

		path = './file.pdf'
		s = SummaryPDF()
		s.draw("This is your Summary", summary_text)
		s.save(path)

		return send_file(path)
	except Exception as e:
		return {'sucess': False, 'message': str(e)}

@app.route('/downloadTranscript', methods=['GET', 'POST'])
def download_transcript():
	try:
		req = request.get_json()
		data = req['data']

		# cleaning data
		# result = cleanData(data)
		
		path = './file.pdf'
		t = TranscriptPDF()
		t.draw("This is your Transcript", data)
		t.save(path)

		return send_file(path)
	except Exception as e:
		return {'sucess': False, 'message': str(e)}

if __name__ == '__main__':
	app.run(host='0.0.0.0',port=5000)
