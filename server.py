import json
import random
import re
import sys

from flask import Flask, redirect, url_for
from flask import render_template
from flask import Response, request, jsonify
from markupsafe import Markup


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


if __name__ == '__main__':
    app.run(debug=True, port=3200)
