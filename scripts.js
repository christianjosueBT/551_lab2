let map = L.map('map').setView([51.055263, -114.070847], 13);
L.tileLayer(
  'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/navigation-night-v1',
    tileSize: 512,
    zoomOffset: -1,
    accessToken:
      'ACCESS_TOKEN_HERE',
  }
).addTo(map);

const btn = document.getElementById('date');

let baseUrl =
    'https://data.calgary.ca/resource/c2es-76ed.geojson?$$app_token=APP_TOKEN_HERE',
  markers = L.markerClusterGroup();

btn.addEventListener('click', function () {
  if (markers.getLayers().length > 0) {
    markers.clearLayers();
    markers = L.markerClusterGroup();
  }
  const start = document.getElementById('dateStart').value,
    end = document.getElementById('dateEnd').value;

  let url = `${baseUrl}&$where=issueddate%20%3E%20%27${start}%27%20and%20issueddate%20%3C%20%27${end}%27&$select=issueddate,workclassgroup,contractorname,communityname,originaladdress,locationsgeojson`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      for (const feature of data.features) {
        if (feature.properties.locationsgeojson === null) continue;
        else {
          let geojson = JSON.parse(feature.properties.locationsgeojson);

          if (geojson.type === 'Point') {
            let marker = L.marker([
              geojson.coordinates[1],
              geojson.coordinates[0],
            ]);
            marker.bindPopup(
              `<p>Date Issued: ${feature.properties.issueddate.substring(
                0,
                feature.properties.issueddate.indexOf('T')
              )}</p> 
                <p>Class Group: ${feature.properties.workclassgroup}</p>
                <p>Contractor: ${feature.properties.contractorname}</p>
                <p>Community: ${feature.properties.communityname}</p>
                <p>Address: ${feature.properties.originaladdress}</p>`
            );
            markers.addLayer(marker);
          } else if (geojson.type === 'MultiPoint') {
            for (const point of geojson.coordinates) {
              let marker = L.marker([point[1], point[0]]);

              marker.bindPopup(
                `<p>Date Issued: ${feature.properties.issueddate.substring(
                  0,
                  feature.properties.issueddate.indexOf('T')
                )}</p> 
                <p>Class Group: ${feature.properties.workclassgroup}</p>
                <p>Contractor: ${feature.properties.contractorname}</p>
                <p>Community: ${feature.properties.communityname}</p>
                <p>Address: ${feature.properties.originaladdress}</p>`
              );
              markers.addLayer(marker);
            }
          }
        }
      }
      map.addLayer(markers);
    });
});
