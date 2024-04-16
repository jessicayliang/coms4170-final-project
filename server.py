import json
import random
import re
import sys

from flask import Flask, redirect, url_for
from flask import render_template
from flask import Response, request, jsonify
from markupsafe import Markup

user_learn_info = {
    'time_started': None,
    'wines_covered': []
}
user_quiz_info = {}

def load_wines() -> object:
    """
    Load wines from the JSON file.
    :return: a python dictionary mapping wine name to image, pairing list, description, and next wine.

    """
    with open('wines.json') as file:
        data = json.load(file)
    return data


def get_next_wine_id(cur_wine_id: int) -> str:
    """
    Wrap around the wine index if necessary.
    """
    if cur_wine_id >= len(wines):
        return "1"
    return str(cur_wine_id + 1)


# The variable wines holds the wine dict
wines = load_wines()

app = Flask(__name__)


# ROUTES
@app.route('/')
def home():
    return render_template('home.html')

@app.route('/learn/<wine_num>')
def learn(wine_num):
    wine_to_render = wines[wine_num]
    return render_template('wine_details.html', wine=wine_to_render, next_id=get_next_wine_id(int(wine_num)), prev_id=str(int(wine_num)-1))
@app.route('/quiz/<quiz_id>')
def quiz(quiz_id):
    return render_template('quiz.html')

@app.route('/record/<section>', methods=["POST"])
def record(section: str):
    """
    Internal route that records information about the user. Meant to be used for both the quiz and learn sections.
    """
    json_data = request.get_json()

    # the section can be either 'quiz' or 'learn'
    if section == 'quiz':
        # TODO: implement this
        pass
    elif section == 'learn':
        if 'wine_visited' in json_data:
            if json_data['wine_visited'] not in user_quiz_info['wines_covered']:
                user_learn_info['wines_covered'].append(json_data['wine_visited'])

        elif 'time_started' in json_data:
            user_learn_info['time_started'] = json_data['time_started']

        return jsonify(user_learn_info)


if __name__ == '__main__':
    app.run(debug=True, port=3200)
