# for summarization
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM


def generateSummary(text):
    tokenizer = AutoTokenizer.from_pretrained("knkarthick/MEETING_SUMMARY", model_max_length=5000)
    model = AutoModelForSeq2SeqLM.from_pretrained("knkarthick/MEETING_SUMMARY")
    
    inputs = tokenizer(text, return_tensors="pt", max_length=5000, truncation=True)
    summary_ids = model.generate(inputs["input_ids"], max_length=500, min_length=250, length_penalty=0.5, num_beams=4, early_stopping=False)
    summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)

    return summary
