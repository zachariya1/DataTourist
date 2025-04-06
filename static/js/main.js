/*---------------------------------------------------------------- MAP ---------------------------------------------------------------------*/

const map= L.map('map').setView([46.731192, 2.810232], 6);

const mainLayer  = L.tileLayer('https://{s}.tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
	attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	minZoom: 0,
	maxZoom: 22,
	subdomains: 'abcd',
	accessToken: '6e4SA45FVeZ0HVxDD5IXyjp08lqeWk7lq3zA4gKGo2l5cjC4IfPKAWjN6FWrKpwD'
}).addTo(map);

var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
});

var osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'});

var baseMaps = {
  "OpenStreetMap": osm,
  "OpenStreetMap.HOT": osmHOT
};
  
var layerControl = L.control.layers(baseMaps).addTo(map);

var openTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: 'Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap (CC-BY-SA)'
});

layerControl.addBaseLayer(openTopoMap, "OpenTopoMap");

var Jawg_Streets = L.tileLayer('https://{s}.tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
	attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	minZoom: 0,
	maxZoom: 22,
	subdomains: 'abcd',
	accessToken: '6e4SA45FVeZ0HVxDD5IXyjp08lqeWk7lq3zA4gKGo2l5cjC4IfPKAWjN6FWrKpwD'
});

layerControl.addBaseLayer(Jawg_Streets, "JawgStreets");

/*---------------------------------------------------------- END MAP -----------------------------------------------------------------------*/

/* Liste de tous les thèmes avec le nom d'origine et le nom qu'on utilise */
const themeArr = [
    { renamedTheme: "Tout cocher/décocher", OGTheme: "" },
    { renamedTheme: "Site Culturel", OGTheme: "CulturalSite" },
    { renamedTheme: "Boutique Locale", OGTheme: "schema:LocalBusiness" },
    { renamedTheme: "Produit", OGTheme: "schema:Product" },
    { renamedTheme: "Balade", OGTheme: "olo:OrderedList" },
    { renamedTheme: "Évènement Culturel", OGTheme: "CulturalEvent" },
    { renamedTheme: "Relief", OGTheme: "schema:Landform" },
    { renamedTheme: "Marché", OGTheme: "Market"},
    { renamedTheme: "Service Pratique", OGTheme: "ConvenientService" },
    { renamedTheme: "Parc d'attraction", OGTheme: "schema:AmusementPark"},
    { renamedTheme: "Autre", OGTheme: ""}
];

var mapContainer = document.getElementById('map');
var leafletDiv = mapContainer.querySelector('.leaflet-top.leaflet-left');
const leaflet_top = document.getElementById('leaflet-top');
leaflet_top.appendChild(leafletDiv);

// Initialisation icones 
var startIcon = L.icon({
  iconUrl : 'static/img/Pin/startIcon.png',

  iconSize : [40,40],
  iconAnchor : [20,40]
});

var destinationIcon = L.icon({
  iconUrl : 'static/img/Pin/destinationIcon.png',

  iconSize : [40,40],
  iconAnchor : [20,40]
});

var middleIcon = L.icon({
  iconUrl : 'static/img/Pin/middleIcon.png',

  iconSize: [40,40],
  iconAnchor:  [20,40]
})

var control = L.Routing.control({
  waypoints: [],
  routeWhileDragging: true,
  createMarker: function (i, start, n)
  {
    var marker_icon = null
    if (i == 0) {
        // Premier marqueur
        marker_icon = startIcon
    } else if (i == n -1) {
        //Dernier marqueur
        marker_icon = destinationIcon
    } 
    if(i==0 || i== n-1) {
      var marker = L.marker (start.latLng, {
        draggable: true,
        bounceOnAdd: false,
        bounceOnAddOptions: {
            duration: 1000,
            height: 800, 
            function(){
                (bindPopup(myPopup).openOn(map))
            }
        },
        icon: marker_icon,
        isRouteMarker: true
      })
      return marker;
    } else { return;}
  },
  language: 'fr'
});

var boutonClique=false;
var adresseDepart="";
var adresseArrivee="";

document.getElementById("reverseBtn").addEventListener("click", function () {
  boutonClique = !boutonClique; 

  var temp = adresseDepart;
  adresseDepart = adresseArrivee;
  adresseArrivee = temp;

  var inputElement1 = document.getElementsByClassName('class_iti')[0];
  var inputElement2 = document.getElementsByClassName('class_iti')[1];

  inputElement1.value = adresseDepart;
  inputElement2.value = adresseArrivee;

  control.setWaypoints([control.getWaypoints()[control.getWaypoints().length - 1].latLng, control.getWaypoints()[0].latLng]);
  waypointsBefore = 2;
  
});

document.getElementById("deleteBtn_start").addEventListener("click", function () {
  var inputElement = document.getElementsByClassName('class_iti')[0];
  inputElement.value='';
});

document.getElementById("deleteBtn_arrival").addEventListener("click", function () {
  var inputElement = document.getElementsByClassName('class_iti')[1];
  inputElement.value='';
});

var geocoder = L.Control.Geocoder.nominatim();

control.on('routeselected', function (e) {
  var waypoints = control.getWaypoints();
  var inputDepart = document.getElementsByClassName('class_iti')[0];
  var inputArrivee = document.getElementsByClassName('class_iti')[1];

  if (waypoints.length >= 2) {
    // Récupérez l'adresse de départ du premier waypoint
    geocoder.reverse(waypoints[0].latLng, map.options.crs.scale(map.getZoom()), function (results) {
    if (results.length > 0) {
        inputDepart.value = results[0].name;
    }
    });

    // Récupérez l'adresse d'arrivée du dernier waypoint
    geocoder.reverse(waypoints[waypoints.length - 1].latLng, map.options.crs.scale(map.getZoom()), function (results) {
    if (results.length > 0) {
        inputArrivee.value = results[0].name;
    }
    });
  }
});

var start = L.Control.geocoder({
    defaultMarkGeocode: false,
    collapsed: false,
    placeholder: "Adresse de départ"
});
start.on('markgeocode',function(e){
    control.setWaypoints([e.geocode.center, control.getWaypoints()[1].latLng]);
    var inputElement = document.getElementsByClassName('class_iti')[0];
    var maVariable = e.geocode.name;
    inputElement.value = maVariable;
});

var finish = L.Control.geocoder({
    defaultMarkGeocode: false,
    collapsed: false,
    placeholder: "Adresse d'arrivée"
    
});
finish.on('markgeocode',function(e){
    control.setWaypoints([control.getWaypoints()[0].latLng, e.geocode.center]);
    var inputElement = document.getElementsByClassName('class_iti')[1];
    var maVariable = e.geocode.name;
    inputElement.value = maVariable;
});

start._map = map;
var startDiv = start.onAdd(map);
document.getElementById('start').appendChild(startDiv);


finish._map = map;
var finishDiv = finish.onAdd(map);
document.getElementById('arrival').appendChild(finishDiv);

control._map = map;
var controlDiv = control.onAdd(map);
document.getElementById('itinerary').appendChild(controlDiv);

var Layer = L.layerGroup([]);
var LayerCluster = L.markerClusterGroup();

var uniqueLocations = [];
var routeLocations = [];
var waypointsBefore = 0;
var maxConcurrentQueries = 10; // Set the maximum number of concurrent queries
var distanceValue = 300;

const distanceInput = document.getElementById("distance");

document.addEventListener("DOMContentLoaded", function() {
  var distanceInput = document.getElementById("distance");

  distanceInput.value = 1;
});

distanceInput.addEventListener("input", function () {
  var dist= parseInt(distanceInput.value);
  switch(dist){
    case 1:
      distanceValue=300;
      break;
    case 2:
      distanceValue=500;
      break;
    case 3:
      distanceValue=1000;
      break;
    case 4:
      distanceValue=2000;
      break;
    case 5:
      distanceValue=5000;
      break;
    case 6:
      distanceValue=10000;
      break;
    case 7:
      distanceValue=20000;
      break;
    default:
      distanceValue=200;
      break;
  }
});

async function getLocations() {
  try {
    map.setView([46.731192, 2.810232], 6);
    document.getElementById('loading-container1').style.display = 'block';
    // Effectuer une requête GET à la route Flask
    const response = await fetch('/get-locations-all', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Vérifier si la requête a réussi (statut 200)
    if (!response.ok) {
      throw new Error(`Erreur de la requête: ${response.status}`);
    }

    // Extraire les données JSON de la réponse
    uniqueLocations = await response.json();


    document.getElementById('loading-container1').style.display = 'none';
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error.message);
  }
};

function createLegend(checkboxes) {
    
  var existingLegend = document.querySelector('.legend');
  if (existingLegend) {
      existingLegend.parentNode.removeChild(existingLegend);
  }

  var legend = L.control({ position: 'topright' });

  legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'legend');

      for (var i = 0; i < checkboxes.length; i++) 
      {
        if(checkboxes[i].value != 'Tout cocher/décocher')
        {
          var item = checkboxes[i].value;
          var imgSrc = 'static/img/Pin/'+item+'.png';

          var legendItem = document.createElement('div');
          legendItem.className = 'legend-item';

          var img = document.createElement('img');
          img.src = imgSrc;
          img.alt = item;
          img.className = 'legend-image'; 
          legendItem.appendChild(img);

          var legendText = document.createElement('div');
          legendText.className = 'legend-text';
          legendText.innerHTML += item;

          legendItem.appendChild(legendText);
          div.appendChild(legendItem);
        }       
      }
      return div;
  };
  legend.addTo(map);
};


// Création des checkboxes  
var form = document.getElementById("checkbox-form");

for (var i = 0; i < themeArr.length; i++) {
  var theme = themeArr[i].renamedTheme;
  var checkbox = document.createElement("input"); 
  checkbox.type = "checkbox"; 
  checkbox.name = "items"; 
  checkbox.value = theme;
  checkbox.id = theme;

  const label = document.createElement("label");
  label.htmlFor = theme;
  
  label.appendChild(checkbox);  
  label.appendChild(document.createTextNode(theme)); 

  form.appendChild(label);
};
// Fin création des checkboxes


const toggleSwitch = document.getElementById('toggleSwitch');
var toggleState = false;
let lastReqTime = 0;

// Fonction pour que le toggle switch soit à faux à chaque actualisation de page 
window.onload = function () {
  var savedValue = false;
  toggleState = savedValue === 'false';
  toggleSwitch.checked = toggleState;
  toggleFun();
};

// Permet de modifier la valeur de toggleState si on appuie sur le toggle switch 
toggleSwitch.addEventListener('click', function () {
  toggleState = !toggleState;
  toggleSwitch.checked = toggleState;
  var checkboxes = form.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(function(checkbox) {
    checkbox.checked = false;
  });
  form.dispatchEvent(new Event('change'));

  localStorage.setItem('toggleState', toggleState.toString());

  toggleFun();
});

function toggleFun(){
  if(toggleState && uniqueLocations.length==0){
    getLocations();
  }else{
    control.on('routesfound', async function (e) {
      const now = Date.now();
      if(now - lastReqTime < 500) {
        return;
      }

      lastReqTime = now;
    
      if (!toggleState && control.getWaypoints().length == 2 && waypointsBefore < 3) {
        var maxDistanceInMeters = distanceValue;
        routeLocations = [];
        var route = e.routes[0];
        var distance = route.summary.totalDistance;
        var nbPoints = distance * 6 / maxDistanceInMeters;
        if(nbPoints>1000)
          nbPoints=1000;
        if(nbPoints<25)
          nbPoints=25;
            var incr = parseInt(route.coordinates.length / nbPoints);
        var i = 0;
        var waypoints = [];
    
        document.getElementById('loading-container2').style.display = 'block';
        
        var checkboxStates = [];
        var checkboxes = form.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(function(checkbox) {
          checkboxStates.push(checkbox.checked); // Stocker l'état avant de tout désactiver
          checkbox.checked = false;
        });
        form.dispatchEvent(new Event('change'));
    
        route.coordinates.forEach(function (coord) {
          if (i % incr == 0) {
            waypoints.push({ type: 'Point', coordinates: [coord.lat, coord.lng] });
          }
          i++;
        });
    
        async function queryLocationsNearWaypoint(coordinates, maxDistance) {
          var query = {
            coordinates: coordinates,
            maxDistance: maxDistance,
          };
    
          return fetch('/get-locations-alt', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(query),
          }).then(response => response.json());
        }

        async function processWaypoint(coordinates) {
          var locations = await queryLocationsNearWaypoint(coordinates, maxDistanceInMeters);
    
          locations.forEach(location => {
            const uniqueLocationInfo = {
              _id: location._id,
              name: location['rdfs:label'].fr,
              loc: location.loc,
              description: location.hasDescription,
              theme: location['@type'],
              tel: location.hasContact,
              located: location.isLocatedAt
            };
            
            const existingLocationIndex = routeLocations.findIndex(item => item._id === uniqueLocationInfo._id);
            if (existingLocationIndex === -1) {
              routeLocations.push(uniqueLocationInfo);
            } else {
              routeLocations[existingLocationIndex] = uniqueLocationInfo;
            }
          });
        }
    
        var tasks = [];
    
        for (let i = 0; i < waypoints.length; i++) {
          if (tasks.length >= maxConcurrentQueries) {
            await tasks[0];
            tasks.shift();
          }
          tasks.push(processWaypoint(waypoints[i].coordinates));
        }
    
        await Promise.all(tasks);
        document.getElementById('loading-container2').style.display = 'none';
        
        checkboxes.forEach(function(checkbox, index) {
          checkbox.checked = checkboxStates[index];
        });
        form.dispatchEvent(new Event('change'));
      }

      var sideItinerary = document.getElementById('sideItinerary');
      const sideLocations = document.getElementById('sideLocations');
      const openBtn = document.getElementById('openBtn_sideItinerary');
      const closeBtn = document.getElementById('closeBtn_sideItinerary');
      const doc_map = document.getElementById('map');
      
      if(!sideItinerary.classList.contains('open') && !sideLocations.classList.contains('open'))
      {
        sideItinerary.classList.add('open');
      }
      openBtn.style.display = 'block';
      doc_map.style.width = '79%';
      
      openBtn.addEventListener('click', function () {
        doc_map.style.width = '79%';
        sideItinerary.classList.add('open');
      }); 

      closeBtn.addEventListener('click', function () {     
        sideItinerary.classList.remove('open');
        doc_map.style.width = '100%';
      });
  });
}}

function renommage(theme) {
  const themeObject = themeArr.find(themeObject => {
    if (Array.isArray(themeObject.OGTheme)) {
      if (Array.isArray(theme)) {
        return themeObject.OGTheme.some(item => theme.includes(item));
      } else {
        return themeObject.OGTheme.includes(theme);
      }
    } else {
      if (Array.isArray(theme)) {
        return theme.includes(themeObject.OGTheme);
      } else {
        return themeObject.OGTheme === theme;
      }
    }
  });

  if (themeObject) {
    return themeObject.renamedTheme;
  }

  return "Autre";
};

L.Map.include({
    _onRouteChange: function() {
        this.fire('routechange');
    }
});

function displaySideLocations(checkboxes){
  if(checkboxes.length>0 && (routeLocations.length>0 || themesInsidePolygon.length>0 || themesInsideCircle.length>0)) 
  {
    const sideLocations = document.getElementById('sideLocations');
    const openBtnLoc = document.getElementById('openBtn_sideLocations');
    const closeBtnLoc = document.getElementById('closeBtn_sideLocations');
    const doc_map = document.getElementById('map');

    openBtnLoc.style.display= 'block';
    sideLocations.classList.add('open');
    document.getElementById('sideItinerary').classList.remove('open');

    doc_map.style.width = '77%';
    sideLocations.classList.add('open');
    
    
    openBtnLoc.addEventListener('click', function () {
      doc_map.style.width = '77%';
      sideLocations.classList.add('open');
    });

    closeBtnLoc.addEventListener('click', function () {
      sideLocations.classList.remove('open');
      doc_map.style.width = '100%';
    });

  }else{ 
    document.getElementById('sideLocations').classList.remove('open');
    document.getElementById('openBtn_sideLocations').style.display = 'none';
    document.getElementById('map').style.width= '100%';
  }
}

function addInfosLocations(location, theme,i) {
  const divTheme = document.getElementById("div_" + theme);

  const infosDiv = document.createElement('div');
  infosDiv.id = location.name;
  infosDiv.className = 'infosLocDiv'; 
  var X = location.loc[1];  
  infosDiv.setAttribute("data-lat", X);
  var Y = location.loc[0];  
  infosDiv.setAttribute("data-lng", Y);

  const title= document.createElement('p');

  if(i==0)
    title.textContent= location["rdfs:label"].fr;
  else
    title.textContent= location.name;
  
  title.style.fontSize= "15px";
  title.style.marginLeft = '5px';
  infosDiv.appendChild(title);

  const paragraphElement = document.createElement('p');
  
  paragraphElement.textContent = "";
  paragraphElement.style.fontSize= "13px";

  const imgTel = document.createElement('img');
  imgTel.src = 'static/img/phone.svg'; 
  imgTel.alt = 'Icône Téléphone';
  imgTel.style.marginRight = '5px'; 
  imgTel.style.marginLeft = '5px';
  imgTel.style.width = '20px';
  imgTel.style.height = '20px';
  imgTel.style.verticalAlign = 'middle';
  paragraphElement.appendChild(imgTel);
  if(i==0){
    if (location.hasContact && location.hasContact[0]["schema:telephone"]) {
      paragraphElement.innerHTML += " Téléphone : " + location.hasContact[0]["schema:telephone"][0] + "<br>" ; 
    } else {
      paragraphElement.innerHTML += "Téléphone non disponible <br>";
    }
  }
  else{
    if (location.tel && location.tel[0]["schema:telephone"]) {
      paragraphElement.innerHTML += " Téléphone : " + location.tel[0]["schema:telephone"][0] + "<br>" ; 
    } else {
      paragraphElement.innerHTML += "Téléphone non disponible <br>";
    }
  }

  const imgMail = document.createElement('img');
  imgMail.src = 'static/img/mail.svg'; 
  imgMail.alt = 'Icône Mail';
  imgMail.style.marginRight = '5px'; 
  imgMail.style.marginLeft = '5px';
  imgMail.style.width = '20px';
  imgMail.style.height = '20px';
  imgMail.style.verticalAlign = 'middle';
  paragraphElement.appendChild(imgMail);
  if(i==0){
    if(location.hasContact && location.hasContact[0]["schema:email"]){
    paragraphElement.innerHTML += "Adresse mail : <a href='mailto:" + location.hasContact[0]["schema:email"][0] + "'>" + location.hasContact[0]["schema:email"][0] + "</a><br>";
    }else {
      paragraphElement.innerHTML += "Adresse mail non disponible <br>";
    }
  }
  else{
    if(location.tel && location.tel[0]["schema:email"]){
    paragraphElement.innerHTML += "Adresse mail : <a href='mailto:" + location.tel[0]["schema:email"][0] + "'>" + location.tel[0]["schema:email"][0] + "</a><br>";
    }else {
      paragraphElement.innerHTML += "Adresse mail non disponible <br>";
    }
  }

  const imgWeb = document.createElement('img');
  imgWeb.src = 'static/img/globe.svg'; 
  imgWeb.alt = 'Icône Mail';
  imgWeb.style.marginRight = '5px'; 
  imgWeb.style.marginLeft = '5px';
  imgWeb.style.width = '20px';
  imgWeb.style.height = '20px';
  imgWeb.style.verticalAlign = 'middle';
  paragraphElement.appendChild(imgWeb);
  if(i==0){
    if(location.hasContact && location.hasContact[0]["foaf:homepage"]){
    paragraphElement.innerHTML += " <a href='" + location.hasContact[0]["foaf:homepage"] + "' target='_blank'>" + location.hasContact[0]["foaf:homepage"] + "</a><br>";
    }else {
      paragraphElement.innerHTML += "Lien du site non disponible <br>";
    }
  }
  else{
    if(location.tel && location.tel[0]["foaf:homepage"]){
    paragraphElement.innerHTML += " <a href='" + location.tel[0]["foaf:homepage"] + "' target='_blank'>" + location.tel[0]["foaf:homepage"] + "</a><br>";
    }else {
      paragraphElement.innerHTML += "Lien du site non disponible <br>";
    }
  }

  const imgPin = document.createElement('img');
  imgPin.src = 'static/img/map-pin.svg'; 
  imgPin.alt = 'Icône Mail';
  imgPin.style.marginRight = '5px';
  imgPin.style.marginLeft = '5px';
  imgPin.style.width = '20px';
  imgPin.style.height = '20px';
  imgPin.style.verticalAlign = 'middle';
  paragraphElement.appendChild(imgPin);
  if(i==0){
    if(location.isLocatedAt && location.isLocatedAt[0] && location.isLocatedAt[0]["schema:address"]) {
    paragraphElement.innerHTML += "Adresse : " + location.isLocatedAt[0]["schema:address"][0]["schema:streetAddress"] + ", " + location.isLocatedAt[0]["schema:address"][0]["schema:postalCode"]+ ", " + location.isLocatedAt[0]["schema:address"][0]["schema:addressLocality"] ;
    } else {
      paragraphElement.innerHTML += "Adresse non disponible<br>";
    }
  }
  else{
    if(location.located && location.located[0] && location.located[0]["schema:address"]) {
    paragraphElement.innerHTML += "Adresse : " + location.located[0]["schema:address"][0]["schema:streetAddress"] + ", " + location.located[0]["schema:address"][0]["schema:postalCode"]+ ", " + location.located[0]["schema:address"][0]["schema:addressLocality"] ;
    } else {
      paragraphElement.innerHTML += "Adresse non disponible<br>";
    }
  }
  
  const btnAddWaypoint= document.createElement('button');
  btnAddWaypoint.className = "ajouter-waypoint";
  btnAddWaypoint.dataset.lat = X;
  btnAddWaypoint.dataset.lng = Y;
  btnAddWaypoint.textContent = "Ajouter à l'itinéraire";

  infosDiv.appendChild(paragraphElement);
  if(i==1){
    infosDiv.appendChild(btnAddWaypoint);
  }
  
  divTheme.appendChild(infosDiv); 

  var Icon= L.icon
  ({
    iconUrl: 'static/img/Pin/'+theme+'.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });
  const marker = L.marker([X, Y], { icon: Icon });
  let popupC ="";

  if(i==0)
    popupC = "<b>" + location["rdfs:label"].fr + "</b> </br> " ;
  else 
    popupC = "<b>" + location.name + "</b> </br> " ; 
    
  marker.bindPopup(popupC);

  if(themesInsidePolygon.length > 500 || themesInsideCircle.length > 500)
    LayerCluster.addLayer(marker);
  else
    Layer.addLayer(marker);           

  // Gestion du survol du div
  infosDiv.addEventListener('mouseenter', function () {
    infosDiv.style.backgroundColor = 'lightblue';
    marker.setIcon(L.icon({
      iconUrl: 'static/img/Pin/' + theme +'.png', 
      iconSize: [50, 50],
      iconAnchor: [25, 50],
    }));
    var lat = parseFloat(infosDiv.getAttribute("data-lat"));
    var lng = parseFloat(infosDiv.getAttribute("data-lng"));
    map.panTo(new L.LatLng(lat, lng));
  });

  infosDiv.addEventListener('mouseleave', function () {
    infosDiv.style.backgroundColor = '';
    marker.setIcon(Icon);
  });

  marker.on('click', function () {
    const sideLocations = document.getElementById('sideLocations');
    const divTheme= document.getElementById("div_" + theme);
    if(!sideLocations.classList.contains('open'))
    {
      const openBtnLoc = document.getElementById('openBtn_sideLocations');
      const doc_map = document.getElementById('map');
      sideLocations.classList.add('open');
      openBtnLoc.style.display = 'block';
      doc_map.style.width = '77%';
    }
    const isVisible = window.getComputedStyle(divTheme).display !== 'none';
    if(!isVisible)
      divTheme.style.display = 'flex';
    
    infosDiv.scrollIntoView({ behavior: "smooth" });
    infosDiv.style.backgroundColor = 'lightblue';
    setTimeout(function () {
      infosDiv.style.backgroundColor = '';
    }, 2000);

  });
}

function createContainerInfos(checkboxes) {
  const divLoc = document.getElementById('mainDivLocations');
  if (divLoc) {
    divLoc.remove();
  } 

  const sideLocations = document.getElementById('sideLocations');
  const div = document.createElement('div');
  div.id = 'mainDivLocations';
  div.style.overflowY= 'auto';
  div.style.height ='700px';
  sideLocations.appendChild(div);

  for(let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].value != 'Tout cocher/décocher') {
      const button = document.createElement('button');
      button.textContent = checkboxes[i].value;
      button.id = checkboxes[i].value ;
      button.className = 'btnTitle';
      
      const image = document.createElement('img');
      image.src = '../static/img/chevron-down.svg';  
      image.id= checkboxes[i].value + '_image';
      image.alt= 'Dérouler';
      button.appendChild(image);
      div.appendChild(button);

      const divTheme = document.createElement('div');
      divTheme.id = 'div_' + checkboxes[i].value; 
      divTheme.className = 'divTheme';
      divTheme.style.display = 'none';
      div.appendChild(divTheme);
    }  
  }
};


function actionsBtnLocations() {
  const btnInfos = document.querySelectorAll('.btnTitle');

  btnInfos.forEach(function(btnInfo) {
    btnInfo.addEventListener('click', function() {
      const clickedButtonId = this.id;
      const targetDiv = document.getElementById('div_' + clickedButtonId);
      const image = document.getElementById(clickedButtonId + '_image');

      const isVisible = window.getComputedStyle(targetDiv).display !== 'none';

      targetDiv.style.display = isVisible ? 'none' : 'flex';

      if (isVisible) {
        image.src = '../static/img/chevron-down.svg';
        image.alt = 'Dérouler';
      } else {
        image.src = '../static/img/chevron-up.svg';
        image.alt = 'Replier';
      }

    })
  })
};

const checkboxe = document.querySelectorAll('input[type="checkbox"]');
const checkAll = document.getElementById('Tout cocher/décocher');
checkAll.addEventListener('change', function () {
  checkboxe.forEach(checkbox => {
    if (checkbox !== toggleSwitch) {
      checkbox.checked = checkAll.checked;
    }
})})

form.addEventListener("change", function() 
{ 
  document.getElementById('loading-container3').style.display = 'block';
  var checkboxes = form.querySelectorAll('input[type="checkbox"]:checked');
  Layer.clearLayers();
  LayerCluster.clearLayers();
  displaySideLocations(checkboxes);
 
  if(checkboxes.length>0) 
  {
    createContainerInfos(checkboxes);
    if(toggleState && themesInsidePolygon.length>0) {
      for(let i = 0; i<themesInsidePolygon.length; i++) 
      {
        for(let j=0; j<checkboxes.length; j++)
        {
          var element = checkboxes[j];
          var valeur = element.value;
          let theme = renommage(themesInsidePolygon[i]['@type']);
          if (theme==valeur)
          {         
            addInfosLocations(themesInsidePolygon[i], theme,0);
          }
        }  
      }  
    }
    if(toggleState && themesInsideCircle.length>0){
      for(let i = 0; i<themesInsideCircle.length; i++) 
      {
        for(let j=0; j<checkboxes.length; j++)
        {
          var element = checkboxes[j];
          var valeur = element.value;
          let theme = renommage(themesInsideCircle[i]['@type']);
          if (theme==valeur)
          {         
            addInfosLocations(themesInsideCircle[i], theme,0);
          }
        }  
      }  
    }
    if(!toggleState && routeLocations.length>0) 
      {
        for(let i = 0; i<routeLocations.length; i++) 
        {
          for(let j=0; j<checkboxes.length; j++) 
          {
            var element = checkboxes[j];
            var valeur = element.value;
            let theme = renommage(routeLocations[i].theme);
            if (theme==valeur)
            {
              addInfosLocations(routeLocations[i], theme,1);
            }
          }  
        }  
      }
      createLegend(checkboxes);
      Layer.addTo(map);
      LayerCluster.addTo(map);
    } else
      {
        createLegend([]);
      }
      actionsBtnLocations();
    document.getElementById('loading-container3').style.display = 'none';
})

document.addEventListener('DOMContentLoaded', function () {

  const sidePanel = document.getElementById('sidePanel');
  const leaflet_top = document.getElementById('leaflet-top');
  const openBtn = document.getElementById('openBtn_sidePanel');
  const closeBtn = document.getElementById('closeBtn_sidePanel');

  sidePanel.classList.add('open');
  leaflet_top.classList.add('open');

  openBtn.addEventListener('click', function () {
    sidePanel.classList.remove('close');
    sidePanel.classList.add('open');
    leaflet_top.classList.add('open');
  });

  closeBtn.addEventListener('click', function () {
    sidePanel.classList.remove('open');
    sidePanel.classList.add('close');
    leaflet_top.classList.remove('open');
  });
})

let lastClickTime = 0;

//Ajoute un lieu à l'itinéraire si on clique sur le bouton dans le pop-up du lieu
$("div").on("click", '.ajouter-waypoint', function() {

  const now = Date.now();
  if (now - lastClickTime < 500) {
      return;
  }

  lastClickTime = now;

  const lat = parseFloat($(this).data("lat"));
  const lng = parseFloat($(this).data("lng"));

  if (!isNaN(lat) && !isNaN(lng)) {
    let app = false;
    let waypoints = control.getWaypoints();
    let newWaypoint = L.Routing.waypoint(L.latLng(lat, lng));
    for(let i = 0; i<waypoints.length; i++) {
      if(waypoints[i].latLng.lat == newWaypoint.latLng.lat && waypoints[i].latLng.Lng == newWaypoint.latLng.Lng) {
        app = true;
      }
    }
    if(!app) {
      waypoints.splice(waypoints.length - 1, 0, newWaypoint);

      const btnSupprimer = document.createElement('button');
      btnSupprimer.type = "button";
      btnSupprimer.className = "supprimer-waypoint";
      btnSupprimer.dataset.lat = lat;
      btnSupprimer.dataset.lng = lng;
      btnSupprimer.textContent = "Supprimer de l'itinéraire";
      
      const parentDiv = $(this).closest('.infosLocDiv');
      const parentId = parentDiv.attr('id');
      parentDiv.append(btnSupprimer);
    
      let marker = L.marker(L.latLng(lat, lng), {icon: middleIcon, isRouteMarker: true});
      let popupC = "<b>" + parentId + "<b>" ;

      marker.bindPopup(popupC); 
      marker.addTo(map);  
      
      $(this).remove(); 
    }
    // Tri des points de la route dans l'ordre de la distance
    waypoints.sort(function(a, b) {
      const start = waypoints[0].latLng;
      return a.latLng.distanceTo(start) - b.latLng.distanceTo(start);
    });
      control.setWaypoints(waypoints);
  } 
});

$("div").on("click", '.supprimer-waypoint', function() {
  const now = Date.now();
  if (now - lastClickTime < 500) {
      return;
  }

  lastClickTime = now;

  const lat = parseFloat($(this).data("lat"));
  const lng = parseFloat($(this).data("lng"));
  if (!isNaN(lat) && !isNaN(lng)) {
      let waypoints = control.getWaypoints();
      waypointsBefore = waypoints.length;
      for (let i = 0; i < waypoints.length; i++) {
          if (waypoints[i].latLng.lat == lat && waypoints[i].latLng.lng == lng) {
              waypoints.splice(i, 1);
              break;
          }
      }
      control.setWaypoints(waypoints);

      map.eachLayer(function (layer) {
        if (layer instanceof L.Marker && layer.options.isRouteMarker && layer.getLatLng().lat === lat && layer.getLatLng().lng === lng) {
          map.removeLayer(layer);
        }
      });

      const btnAjouter = document.createElement('button');
      btnAjouter.type = "button";
      btnAjouter.className = "ajouter-waypoint";
      btnAjouter.dataset.lat = lat;
      btnAjouter.dataset.lng = lng;
      btnAjouter.textContent = "Ajouter à l'itinéraire";
    
      const parentDiv = $(this).closest('.infosLocDiv');
      parentDiv.append(btnAjouter);

      $(this).remove();
  }
});

document.getElementById("reloadButton").addEventListener('click', function(e){
  let waypoints = control.getWaypoints();

  let firstWaypoint = waypoints[0];
  let lastWaypoint = waypoints[waypoints.length - 1];
  let newWaypoints = [firstWaypoint, lastWaypoint];
  waypointsBefore = 2;

  control.setWaypoints(newWaypoints);

  control.route();
});

// Fonction pour convertir des degrés en radians
function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

// Fonction pour calculer la distance en kilomètres entre deux coordonnées GPS
function distanceCalculation(lat1, lon1, lat2, lon2) {
    const earthRadiusKm = 6371;

    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);

    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadiusKm * c;
}
  
let drawArray=[];
let drawControl = new L.Control.Draw();
map.addControl(drawControl);
themesInsidePolygon = [];
themesInsideCircle = [];

// Événement draw:created
//Événement check ---> dessin
map.on('draw:created', function (event) {
  const layer = event.layer;
  themesInsidePolygon = [];
  themesInsideCircle = [];
  Layer.clearLayers();
  LayerCluster.clearLayers();

  // Effacer toutes les couches existantes du calque de dessin
  map.eachLayer(function (existingLayer) {
      if (existingLayer instanceof L.Path) {
          map.removeLayer(existingLayer);
      }
  });

  var checkboxStates = [];
  var checkboxes = form.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(function(checkbox) {
    checkboxStates.push(checkbox.checked);
    checkbox.checked = false;
  });
  
  if (layer instanceof L.Polygon) {

      // Récupérer les coordonnées du polygone
      const polygonCoordinates = layer.getLatLngs()[0];
      // Convertir les coordonnées en un tableau de [lng, lat]
      polygonCoordinates.push(polygonCoordinates[0]);
      
      const coordinates = polygonCoordinates.map(coord => [coord.lng, coord.lat]);
       (coordinates);
      // Créer le polygone Turf.js
      const polyTurf = turf.polygon([coordinates]);
       (polyTurf);
      
      // Afficher les coordonnées dans la console
       ('Coordonnées du polygone:', polyTurf);
      if (toggleState) {
        for (let i = 0; i < uniqueLocations.length; i++) {
          let pointX = uniqueLocations[i].loc[0];
          let pointY = uniqueLocations[i].loc[1];

          // Vérifier si le point est à l'intérieur du polygone
          var pt = turf.point([pointX,pointY]);
          if (turf.booleanPointInPolygon(pt, polyTurf)) 
            themesInsidePolygon.push(uniqueLocations[i]); 
        }
      }

  } else if (layer instanceof L.Circle) {

    const circleCenter = layer.getLatLng();
    const circleRadius = layer.getRadius();
    let radiusInKm = circleRadius/1000;

    // Fonction pour vérifier si un point est à l'intérieur d'un cercle
    function isPointInCircle(X, Y, circleCenter) {
      const distance = distanceCalculation(Y, X, circleCenter.lat, circleCenter.lng);
      return distance < radiusInKm;
    } 
    if (toggleState) {
      for (let i = 0; i < uniqueLocations.length; i++) {
        let pointX = uniqueLocations[i].loc[0];
        let pointY = uniqueLocations[i].loc[1];

        if(isPointInCircle(pointX,pointY,circleCenter))
          themesInsideCircle.push(uniqueLocations[i]);
        
      }
    }
    document.getElementById('loading-container3').style.display = 'none';
  }

  checkboxes.forEach(function(checkbox, index) {
    checkbox.checked = checkboxStates[index];
  });
  form.dispatchEvent(new Event('change'));

  map.addLayer(layer);
});

