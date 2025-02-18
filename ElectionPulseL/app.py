import os
from flask import Flask, render_template, request, jsonify, session

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET")

# Simple in-memory storage for votes (in a real application, this would be a database)
# Sample election data by region
election_data = {
    'Norte': {
        'Piura': {
            'Piura': {'Sarah Johnson': 1200, 'Michael Roberts': 900, 'Emily Chen': 800},
            'Sullana': {'Sarah Johnson': 800, 'Michael Roberts': 1100, 'Emily Chen': 600}
        },
        'Tumbes': {
            'Tumbes': {'Sarah Johnson': 700, 'Michael Roberts': 800, 'Emily Chen': 500}
        }
    },
    'Sur': {
        'Arequipa': {
            'Arequipa': {'Sarah Johnson': 1500, 'Michael Roberts': 1300, 'Emily Chen': 1100},
            'Caylloma': {'Sarah Johnson': 600, 'Michael Roberts': 800, 'Emily Chen': 400}
        }
    }
}

votes = {
    'Sarah Johnson': 0,
    'Michael Roberts': 0,
    'Emily Chen': 0
}

@app.route('/search', methods=['GET'])
def search():
    region = request.args.get('region', '')
    province = request.args.get('province', '')
    district = request.args.get('district', '')
    
    results = {}
    
    if region and region in election_data:
        if province and province in election_data[region]:
            if district and district in election_data[region][province]:
                results = election_data[region][province][district]
            else:
                # Sum all districts in province
                results = {candidate: sum(district_data[candidate] 
                         for district_data in election_data[region][province].values())
                         for candidate in votes.keys()}
        else:
            # Sum all provinces in region
            results = {candidate: sum(sum(district_data[candidate] 
                     for district_data in province_data.values())
                     for province_data in election_data[region].values())
                     for candidate in votes.keys()}
    
    return jsonify(results)

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