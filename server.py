import json
import random
import re
import sys

from flask import Flask, redirect, url_for
from flask import render_template
from flask import Response, request, jsonify
from markupsafe import Markup


def load_wines():
    """
    Load wines from the JSON file.
    :return: a python dictionary mapping wine name to image, pairing list, description, and next wine.

    """
    with open('wines.json') as file:
        data = json.load(file)
    return data


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
    return render_template('wine_info.html', wine=wine_to_render)
if __name__ == '__main__':
    app.run(debug=True)
