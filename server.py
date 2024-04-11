import json
import random
import re
import sys

from flask import Flask, redirect, url_for
from flask import render_template
from flask import Response, request, jsonify
from markupsafe import Markup

app = Flask(__name__)

# ROUTES
@app.route('/')
def home():
    return render_template('home.html')


if __name__ == '__main__':
   app.run(debug = True)




