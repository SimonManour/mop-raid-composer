from flask import Flask, request, jsonify

app = Flask(__name__)
from calculator.solver import solve


@app.route('/api/python', methods=['POST'])
def analyze_raid_comp():
    composition: list[str] = request.get_json()['composition']
    # Merge specs providing same buffs
    replacement = {
        'dk_unholy': 'dk_dps',
        'dk_frost': 'dk_dps',
        'warrior_arms': 'warrior_dps',
        'warrior_fury': 'warrior_dps'
    }
    composition = [replacement.get(cls, cls) for cls in composition]
    return jsonify(solve(composition))
