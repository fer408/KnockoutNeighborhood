'use strict';
//Create variables I will use.
var map;
var markers = [];
var largeInfowindow;
// Create a new blank array for all the listing markers.
//My locations.
var locations = [{
        title: "Lic. Gustavo Díaz Ordaz International Airport",
        location: {
            lat: 20.680518,
            lng: -105.252376
        },
        description: "The airport for Puerto Vallarta.",
        id: ""
    },
    {
        title: "Malecón, Puerto Vallarta",
        location: {
            lat: 20.608906,
            lng: -105.236223
        },
        description: "The Malecón is a 12-block, mile-long esplanade in Puerto Vallarta, Jalisco, Mexico.",
        id: ""
    },
    {
        title: "Church of Our Lady of Guadalupe (Puerto Vallarta)",
        location: {
            lat: 20.60987,
            lng: -105.233377
        },
        description: "Church of Our Lady of Guadalupe, known locally as La Iglesia de Nuestra Senora de Guadalupe, is a church building in Puerto Vallarta, Jalisco, Mexico." ,
        id: ""
    },
    {
        title: "Plaza de Armas (Puerto Vallarta)",
        location: {
            lat: 20.622677,
            lng: -105.229178
        },
        description: "Plaza de Armas (English: Main Square) is a plaza and local attraction in Puerto Vallarta, Jalisco, Mexico.",
        id: ""
    },
    {
        title: "Conchas Chinas",
        location: {
            lat: 20.590507,
            lng: -105.24448
        },
        description: "Conchas Chinas is an affluent colonia directly south of Puerto Vallarta in the state of Jalisco, on the Pacific coast of Mexico.",
        id: ""
    }
];

//Location objects
var Locations = function (data) {
    //All of the observables for my location objects.
    var self = this;
    this.title = ko.observable(data.title);
    this.location = ko.observable(data.location);
    this.description = ko.observable(data.description);
    this.visible = ko.observable(true);
    this.link = ko.observable("Wikipedia link:");
    this.id = ko.observable(data.id);
    //These observables will allow for the showing of hidden DOM elements to show
    //up once clicked.
    this.isVisible1 = ko.observable(false);
    this.isVisible2 = ko.observable(false);
    this.isVisible3 = ko.observable(false);
    this.isVisible4 = ko.observable(false);
    this.isVisible5 = ko.observable(false);   
}
//ViewModel
var AppViewModel = function () {
    var self = this;
    //Observables used in view.
    this.photo = ko.observable("https://image.ibb.co/kvC9QS/pv.jpg");
    this.locationList = ko.observableArray([]);
    this.search1 = ko.observable("");
    this.wikiList = ko.observableArray([]);
    //Function that populates the observableArray with data.
    locations.forEach(function (locationItem) {
        $.ajax({
            type: "POST",
            url: "https://en.wikipedia.org/w/api.php?action=opensearch&search="+ locationItem.title +"&format=json&callback=wikiCallback",
            dataType: 'jsonp',
            data: JSON.stringify(),
            success: function (response) {               
                locationItem.id += response[3].toString();
                self.locationList.push(new Locations(locationItem));
            }
        }).fail(function (response, status, error) { // Creates a function to handle errors,
            alert('Could not load API....');
        });
    });
    console.log(self.locationList());
    //Function responsible with setting markers up in map
    //at initialization of the web page.
    this.initMarkers = function(){
        var largeInfowindow = new google.maps.InfoWindow();
    // The following group uses the location array to create an array of markers on initialize.
        function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
            if (infowindow.marker != marker) {
                infowindow.marker = marker;
                infowindow.setContent("<div class='markerTitle'>" + marker.title + "</div>");
                infowindow.setContent("<div class='markerDescription'>" + marker.description + "</div>");
                infowindow.open(map, marker);
                // Make sure the marker property is cleared if the infowindow is closed.
                infowindow.addListener("closeclick", function() {
                infowindow.marker = null;
                });
            }
        }
        for (var i = 0; i < locations.length; i++) {
        // Get the position from the location array.
            var position = locations[i].location;
            var title = locations[i].title;
            var description = locations[i].description;
            // Create a marker per location, and put into markers array.
            var marker = new google.maps.Marker({
                position: position,
                title: title,
                description: description,
                animation: google.maps.Animation.DROP,
                id: i
            });
            // Push the marker to our array of markers.
            markers.push(marker);
            // Create an onclick event to open an infowindow at each marker.
            marker.addListener("click", function() {
                populateInfoWindow(this, largeInfowindow);
            });
        }
        //Populates Map in 
        markers[0].setMap(map);
        markers[1].setMap(map);
        markers[2].setMap(map);
        markers[3].setMap(map);
        markers[4].setMap(map);
    }
    this.initMarkers();    
    //function responsible for making marker show up on map as well as description show up  
    //description show up  on the DOM 
    this.masterListing = function(clickedListing){
        var bounds = new google.maps.LatLngBounds();
        if(clickedListing == self.locationList()[0]){
            markers[0].setMap(map);
            bounds.extend(markers[0].position);
            map.fitBounds(bounds);
            this.isVisible1(true);
        }
        if(clickedListing == self.locationList()[1]){
            markers[1].setMap(map);
            bounds.extend(markers[1].position);
            map.fitBounds(bounds);
            this.isVisible2(true);
        }
        if(clickedListing == self.locationList()[2]){
            markers[2].setMap(map);
            bounds.extend(markers[2].position);
            map.fitBounds(bounds);
            this.isVisible3(true);
        }
        if(clickedListing == self.locationList()[3]){
            markers[3].setMap(map);
            bounds.extend(markers[3].position);
            map.fitBounds(bounds);
            this.isVisible4(true);
        }
        if(clickedListing == self.locationList()[4]){
            markers[4].setMap(map);
            bounds.extend(markers[4].position);
            map.fitBounds(bounds);
            this.isVisible5(true);
        }
    }    
    //Function that filters the list when user searches the search input element.
    this.filtered = ko.computed(function () {
        var filter = self.search1().toLowerCase();
        
        if (!filter) {
            self.locationList().forEach(function (locationItem) {
                locationItem.visible(true);
            });
            return self.locationList();
        } else {
            return ko.utils.arrayFilter(self.locationList(), function (locationItem) {
                var string = locationItem.title().toLowerCase();
                var result = (string.search(filter) >= 0);
                locationItem.visible(result);
                return result;
            });
        }
    }, self);
}
function initMap() {
    var bounds = new google.maps.LatLngBounds();
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById("map"), {
    center: {
        lat: 20.622677,
        lng: -105.229178
    },
    zoom: 13,
    mapTypeControl: false
    });
    ko.applyBindings(new AppViewModel());
} 
//Function that handles Google error.
function errorMessage() {
    alert('Failed to get Google resources! Try again later..');
}