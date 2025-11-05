from flask import Flask, request, jsonify, render_template
import PyPDF2
import io

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    if 'pdf' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['pdf']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    try:
        # Extract text from PDF
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file.read()))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        
        # Generate quiz: Split into sentences and create true/false questions
        sentences = [s.strip() for s in text.split('.') if s.strip()]
        questions = []
        for i in range(min(5, len(sentences))):  # Limit to 5 questions
            question = f"True or False: {sentences[i]}."
            questions.append({
                'question': question,
                'correct_answer': 'True'  # Assuming the sentence is factual; in reality, you'd analyze context
            })
        
        return jsonify({'quiz': questions})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)