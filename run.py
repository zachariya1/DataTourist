import os
import json
from pymongo import MongoClient
from flask import Flask, jsonify, request, render_template
from datetime import datetime
import threading

from utils import loc_nearby_and_theme, loc_all_and_theme
from config import Collection

app = Flask(__name__)

@app.route('/index.html')
def home():
    return render_template('index.html')


@app.route('/get-locations-alt', methods=['POST'])
def get_locations_alt():
    data = request.get_json()
    locations = loc_nearby_and_theme(Collection, data)
    return jsonify(locations)

@app.route('/get-locations-all', methods=['GET'])
def get_locations_all():
    locations = loc_all_and_theme(Collection)
    return jsonify(locations)

if __name__ == '__main__':
    app.run(debug=True, port=5005)
