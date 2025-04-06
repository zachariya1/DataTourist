import os
import json
from pymongo import MongoClient, GEOSPHERE
from datetime import datetime
import threading

try:
    myclient = MongoClient("mongodb://localhost:27017/")
    myclient.list_database_names()
    print("MongoDB connection successful!")
    db = myclient.DatatouristUCZ
    Collection = db.Tourism
except Exception as e:
    print(f"MongoDB connection failed: {str(e)}")

files_added = 0

def isexpired(contenu):
    date = contenu.get('schema:endDate', [{}])[0]
    if date:
        date_formattee = datetime.strptime(date, "%Y-%m-%d")
        date_du_jour = datetime.now()
        if date_formattee > date_du_jour:
            return True
        else:
            return False
    else:
        return True
    
def update_coordinates(item):
    location = item.get('isLocatedAt', [{}])[0].get('schema:geo', {})
    latitude = location.get('schema:latitude', '')
    longitude = location.get('schema:longitude', '')
    if latitude and longitude:
        loc = [float(longitude), float(latitude)]
        item['loc'] = loc
        del item['isLocatedAt'][0]['schema:geo']['schema:latitude']
        del item['isLocatedAt'][0]['schema:geo']['schema:longitude']

def valid_coordinates(item):
    longitude = item.get('loc', [])[0]
    latitude = item.get('loc', [])[1]
    return (-180 <= longitude <= 180) and (-90 <= latitude <= 90)

def importer_fichier_json(fichier_json):
    global files_added  # Declare files_added as a global variable
    with open(fichier_json, 'r', encoding='utf-8') as f:
        contenu_json = json.load(f)
        
        if isexpired(contenu_json):
            if isinstance(contenu_json, list):
                for item in contenu_json:
                    update_coordinates(item)
                    if valid_coordinates(item):
                        Collection.insert_one(item)
                        files_added += 1
            else:
                update_coordinates(contenu_json)
                if valid_coordinates(contenu_json):
                    Collection.insert_one(contenu_json)
                    files_added += 1

def traiter_fichiers(dossier_racine):
    for dossier_parent, sous_dossiers, fichiers in os.walk(dossier_racine):
        for fichier in fichiers:
            if fichier.endswith('.json'):
                chemin_fichier = os.path.join(dossier_parent, fichier)
                print(f"Processing: {chemin_fichier} - Files added: {files_added}")
                importer_fichier_json(chemin_fichier)

dossier_racine = "data_sample"
thread = threading.Thread(target=traiter_fichiers, args=(dossier_racine,))
thread.start()
thread.join()

print("Extraction et organisation terminées.")
Collection.create_index([("loc", GEOSPHERE)], name="loc_2dsphere")
