from pymongo import MongoClient

try:
    myclient = MongoClient("mongodb://localhost:27017/")
    # Attempt to access a database to check if the connection is successful
    myclient.list_database_names()
    print("MongoDB connection successful!")
    db = myclient.DatatouristUCZ
    Collection = db.Tourism
except Exception as e:
    print(f"MongoDB connection failed: {str(e)}")
