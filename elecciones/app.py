
import os
from flask import Flask, render_template, request, jsonify, session

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "your-secret-key")

# Simple in-memory storage for votes by location
votes = {
    'Sarah Johnson': 0,
    'Michael Roberts': 0,
    'Emily Chen': 0
}

# Mock candidate data by location
candidates_by_location = {
    'San José-Central-Zona 1': [
        {'name': 'Sarah Johnson', 'party': 'Democratic Party'},
        {'name': 'Michael Roberts', 'party': 'Republican Party'},
        {'name': 'Emily Chen', 'party': 'Independent'}
    ]
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/vote', methods=['POST'])
def vote():
    # Check if user has already voted
    if session.get('has_voted'):
        return jsonify({'error': 'You have already voted'}), 403

    data = request.get_json()
    candidate = data.get('candidate')

    if not candidate or candidate not in votes:
        return jsonify({'error': 'Invalid candidate'}), 400

    # Record the vote
    votes[candidate] += 1
    # Mark user as voted in session
    session['has_voted'] = True
    session['voted_for'] = candidate

    return jsonify({
        'success': True, 
        'message': 'Vote recorded successfully',
        'voted_for': candidate
    }), 200

@app.route('/static/<path:filename>')
def serve_static(filename):
    return app.send_static_file(filename)
