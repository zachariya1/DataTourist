from pymongo import MongoClient

try:
    myclient = MongoClient("mongodb://localhost:27017/")
    myclient.list_database_names()
    db = myclient.DatatouristUCZ
    Collection = db.Tourism
    print("MongoDB connection successful!")
except Exception as e:
    print(f"MongoDB connection failed: {str(e)}")


def loc_nearby_and_theme(Col, data):
    coordinates = data['coordinates']
    maxDist = data['maxDistance']
    query = {
        'loc': {
            '$near': {
                '$geometry': {
                    'type': 'Point', 
                    'coordinates': [
                        coordinates[1], coordinates[0]
                    ]
                },
                '$maxDistance': maxDist
            }
        }
    }
    projection = {
        'rdfs:label.fr' : 1,  # nom du lieu
        'loc': 1,   # localisation
        "hasDescription.shortDescription.fr": 1,  # description en français
        '@type' : 1, # liste des thèmes
        'hasContact': 1,
        'isLocatedAt' : 1
    }
    cursor = Col.find(query, projection).limit(10)
    result = []
    for doc in cursor:
        doc['_id'] = str(doc['_id'])  # Convert the ObjectId to a string
        result.append(doc)
    return result

def loc_all_and_theme(Col):
    try:
        # Utilisez une projection pour inclure uniquement les champs spécifiés
        projection = {
            'rdfs:label.fr': 1,  # Include the 'name' field in the result (French label)
            'loc': 1,  # Include the 'loc' field in the result
            "hasDescription.shortDescription.fr": 1,  # Include the 'description' field in the result
            '@type': 1,
            'hasContact': 1,
            'isLocatedAt.schema:address.schema:postalCode' : 1,
            'isLocatedAt.schema:address.schema:streetAddress':1,
            'isLocatedAt.schema:address.schema:addressLocality':1

        }
        cursor = Col.find({}, projection)  # Utilisez la projection dans la méthode find
        result = list(cursor)
        for doc in result:
            doc['_id'] = str(doc['_id'])  # Convert the ObjectId to a string
        return result
    except Exception as e:
        return {"error": str(e)}

def supprimer_donnees():
    result = Collection.delete_many({})
    print(f"{result.deleted_count} documents ont été supprimés de la collection.")



