from flask import Blueprint, render_template, jsonify, request
from flask_login import login_required, current_user
from extensions import db
from models import TypingResult

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/about')
def about():
    return render_template('about.html')

@main.route('/dashboard')
@login_required
def dashboard():
    # Fetch user results
    results = TypingResult.query.filter_by(user_id=current_user.id).order_by(TypingResult.date_created.desc()).all()
    
    # Calculate stats
    total_tests = len(results)
    best_wpm = max([r.wpm for r in results]) if results else 0
    avg_wpm = sum([r.wpm for r in results]) / total_tests if results else 0
    
    return render_template('dashboard.html', 
                           results=results, 
                           total_tests=total_tests, 
                           best_wpm=best_wpm, 
                           avg_wpm=round(avg_wpm, 1))

@main.route('/save_result', methods=['POST'])
@login_required
def save_result():
    data = request.json
    new_result = TypingResult(
        user_id=current_user.id,
        wpm=data.get('wpm'),
        accuracy=data.get('accuracy'),
        mistakes=data.get('mistakes'),
        total_characters=data.get('total_characters'),
        mode=data.get('mode'),
        duration=data.get('duration')
    )
    db.session.add(new_result)
    db.session.commit()
    return jsonify({'message': 'Result saved successfully!'})

@main.route('/clear_data', methods=['POST'])
@login_required
def clear_data():
    try:
        TypingResult.query.filter_by(user_id=current_user.id).delete()
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        # Optionally handle error
        pass
    return jsonify({'success': True})

