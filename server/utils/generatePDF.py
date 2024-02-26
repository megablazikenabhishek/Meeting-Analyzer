from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

class TranscriptPDF:
    def __init__(self):
        self.story = []

    def draw(self, heading, data):
        # drawing the heading
        heading_style = ParagraphStyle(
            "Heading",
            parent=getSampleStyleSheet()["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=25,
            textColor=colors.blue,
        )
        self.story.append(Paragraph(text, heading_style))

        # adding the body text
        body_style = getSampleStyleSheet()["BodyText"]
        for i in data:
            self.story.append(Paragraph(f"{i.name} : {i.text}"), body_style)
    
    def save(self, file_name):
        doc = SimpleDocTemplate(file_name, pagesize=letter)
        doc.build(self.story)