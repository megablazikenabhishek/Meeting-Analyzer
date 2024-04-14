from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
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
        self.story.append(Paragraph(heading, heading_style))

        # adding a spacer
        self.story.append(Spacer(1, 12))

        # adding the body text
        body_style = ParagraphStyle(
            "BodyText",
            parent=getSampleStyleSheet()["BodyText"],
            fontName="Helvetica",
            fontSize=15,
            textColor=colors.black,
        )
        for i in data:
            self.story.append(Paragraph(f"{i['name']} : {i['text']}", body_style))
            self.story.append(Spacer(1, 5))
    
    def save(self, file_name):
        doc = SimpleDocTemplate(file_name, pagesize=A4)
        doc.build(self.story)

class SummaryPDF:
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
        self.story.append(Paragraph(heading, heading_style))

        # adding a spacer
        self.story.append(Spacer(1, 12))

        # adding the body text
        body_style = ParagraphStyle(
            "BodyText",
            parent=getSampleStyleSheet()["BodyText"],
            fontName="Helvetica",
            fontSize=15,
            textColor=colors.black,
        )
        self.story.append(Paragraph(data, body_style))
    
    def save(self, file_name):
        doc = SimpleDocTemplate(file_name, pagesize=A4)
        doc.build(self.story)

class DetailedAnalysis:
    def __init__(self):
        self.story = []

    def clean_and_format(self, data):
        return data.replace("*", "").split("\n")

    def drawSentimentReport(self, data):
        heading_style = ParagraphStyle(
            "Heading",
            parent=getSampleStyleSheet()["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=25,
            textColor=colors.blue,
        )
        self.story.append(Paragraph("Sentitment Report", heading_style))

        # adding a spacer
        self.story.append(Spacer(1, 12))

        # adding the body text
        body_style = ParagraphStyle(
            "BodyText",
            parent=getSampleStyleSheet()["BodyText"],
            fontName="Helvetica",
            fontSize=15,
            textColor=colors.black,
        )

        for i in self.clean_and_format(data):
            self.story.append(Paragraph(i, body_style))

    def drawAnalysisReport(self, data):
        self.story.append(PageBreak())
        heading_style = ParagraphStyle(
            "Heading",
            parent=getSampleStyleSheet()["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=25,
            textColor=colors.blue,
        )
        self.story.append(Paragraph("Analysis Report", heading_style))

        # adding a spacer
        self.story.append(Spacer(1, 12))

        # adding the body text
        body_style = ParagraphStyle(
            "BodyText",
            parent=getSampleStyleSheet()["BodyText"],
            fontName="Helvetica",
            fontSize=15,
            textColor=colors.black,
        )

        for i in self.clean_and_format(data):
            self.story.append(Paragraph(i, body_style))

    def save(self, file_name):
        doc = SimpleDocTemplate(file_name, pagesize=A4)
        doc.build(self.story)