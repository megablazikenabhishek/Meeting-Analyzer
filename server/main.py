from flask import Flask, request
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

tokenizer = AutoTokenizer.from_pretrained("knkarthick/MEETING_SUMMARY", model_max_length=5000)
model = AutoModelForSeq2SeqLM.from_pretrained("knkarthick/MEETING_SUMMARY")

# intializing app
app = Flask(__name__)

@app.route("/", methods=['GET'])
def home():
	return {'sucess': True, 'message': 'Hello World!!'}

@app.route("/generateSummary", methods=['GET', 'POST'])
def summary():
	req = request.get_json()
	text = req['text']
	
	inputs = tokenizer(text, return_tensors="pt", max_length=5000, truncation=True)
	summary_ids = model.generate(inputs["input_ids"], max_length=500, min_length=250, length_penalty=0.5, num_beams=4, early_stopping=False)
	summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)

	return {'sucess': True, 'summary': summary}

if __name__ == '__main__':
	app.run(host='0.0.0.0',port=5000)
