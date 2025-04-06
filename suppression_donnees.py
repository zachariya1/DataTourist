import os
import json
from pymongo import MongoClient
from datetime import datetime
import threading

try:
    myclient = MongoClient("mongodb://localhost:27017/")
    # Attempt to access a database to check if the connection is successful
    myclient.list_database_names()
    print("MongoDB connection successful!")
    db = myclient.DatatouristUCZ
    Collection = db.Tourism
except Exception as e:
    print(f"MongoDB connection failed: {str(e)}")

Collection.drop_index("loc_2d")
result = Collection.delete_many({})
print(f"{result.deleted_count} documents ont été supprimés de la collection.")