let map;
let markers = {origin:null, destination:null};
let controversialMarkers = [];
let favoriteMarkers = [];
let infoWindow;
let geocoder;
const ConcepcionLatLng = {lat: -36.82699, lng: -73.04977};
var tourPlaces=[];
let p_start,p_end;
let directionsDisplay,directionsService;
let totalDistanceRoute;
let ConcepcionBounds;
let cityCircles=[];


// AIzaSyChbiyohYAY4lm-sC0us_k4RuzAo-yKTaQ localhost

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -36.82699, lng: -73.04977},
    zoom: 15,
    mapTypeControl: false,
    fullscreenControl: false
  });

  infoWindow = new google.maps.InfoWindow;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      let pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      infoWindow.setContent("Está aqui");
      infoWindow.setPosition(pos);
      infoWindow.open(map);
      map.setCenter(pos);
    });
  }

  let boundNE = {lat: -36.475659, lng: -72.469160};
  let boundSW = {lat: -37.266935, lng: -73.251065};
  ConcepcionBounds = new google.maps.LatLngBounds(boundSW,boundNE);

  const createHelpDiv = document.createElement('div'); // Filtro New Route
  CreateHelpControl(createHelpDiv);
  createHelpDiv.index = 1;
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(createHelpDiv);

  const createRouteFilterDiv = document.createElement('div'); // Filtro New Route
  CreateRouteFilterControl(createRouteFilterDiv);
  createRouteFilterDiv.index = 1;
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(createRouteFilterDiv);

  const createLegendsDiv = document.createElement('div'); // Filtro New Route
  CreateLegendsControl(createLegendsDiv);
  createLegendsDiv.index = 1;
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(createLegendsDiv);

  const favoritesAndReportDiv = document.createElement('div'); // Add Favoritos
  CreateFavoriteAndReportControl(favoritesAndReportDiv);

  // CreateMapClickMenu();
  map.addListener('click', function(event) {
    CreateMapClickMenu(event);
  });

}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

function CreateHelpControl(controlDiv){
  let helpControlUI = document.createElement('div');
  helpControlUI.classList.add('helpControlUI');
  helpControlUI.style.backgroundColor = '#fff';
  helpControlUI.style.border = '2px solid #fff';
  helpControlUI.style.borderRadius = '3px';
  // leftControlUI.style.borderBottomLeftRadius = '2px';
  // leftControlUI.style.borderTopLeftRadius = '2px';
  helpControlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  // helpControlUI.style.marginRight = '10px';
  helpControlUI.style.paddingTop = '10px';
  helpControlUI.style.paddingBottom = '10px';
  helpControlUI.style.paddingLeft = '10px';
  helpControlUI.style.paddingRight = '10px';
  helpControlUI.style.top = '5px';
  helpControlUI.style.right = '5px';
  helpControlUI.style.position = 'absolute';

  const helpButtonIMG = document.createElement('i'); //img siempre visible
  helpButtonIMG.classList.add('helpButtonIMG');
  helpButtonIMG.classList.add('fas');
  helpButtonIMG.classList.add('fa-question-circle');
  helpButtonIMG.style.fontSize = '40px';
  helpButtonIMG.style.color = '#23383f';
  helpButtonIMG.style.cursor = 'pointer';
  helpControlUI.appendChild(helpButtonIMG);

  controlDiv.appendChild(helpControlUI);

  $(helpButtonIMG).click(function(){
    mostrar("mAyudaMapa");
  });
}

function CreateFavoriteAndReportControl(controlDiv){

  let leftControlUI = document.createElement('div');
  leftControlUI.classList.add('FavoriteAndReportButtons');
  leftControlUI.style.backgroundColor = '#fff';
  leftControlUI.style.border = '2px solid #fff';
  leftControlUI.style.borderRadius = '3px';
  leftControlUI.style.borderBottomLeftRadius = '2px';
  leftControlUI.style.borderTopLeftRadius = '2px';
  leftControlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  leftControlUI.style.marginLeft = '10px';
  leftControlUI.style.paddingTop = '10px';
  leftControlUI.style.paddingBottom = '10px';
  leftControlUI.style.paddingLeft = '10px';
  leftControlUI.style.paddingRight = '10px';
  leftControlUI.style.position = 'absolute';

  const reportButtonUI = document.createElement('div'); //contenedor de categorias de reporte
  reportButtonUI.classList.add('reportButtonDiv');
  reportButtonUI.style.paddingBottom = '5px';
  reportButtonUI.title = 'Reportar un punto conflictivo';

  // Esto sobraba
  // const reportButtonDiv = document.createElement('div'); //reporte siempre visible
  // reportButtonDiv.classList.add('reportButtonUI');
  // reportButtonDiv.title = 'Reportar un punto conflictivo';

  const reportButtonIMG = document.createElement('i'); //img siempre visible
  reportButtonIMG.classList.add('reportButtonImg');
  reportButtonIMG.classList.add('fas');
  reportButtonIMG.classList.add('fa-flag');
  // reportButtonIMG.style.fontSize = '40px';
  reportButtonIMG.style.color = 'IndianRed';
  reportButtonIMG.style.cursor = 'pointer';

  // reportButtonDiv.appendChild(reportButtonIMG);
  reportButtonUI.appendChild(reportButtonIMG);

  const reportButtonCategories = document.createElement('div'); //categorias
  reportButtonCategories.classList.add('reportButtonCategories');
  reportButtonCategories.style.display = 'none';
  reportButtonCategories.title = 'Elija el tipo de conflicto';
  reportButtonCategories.style.backgroundColor = '#fff';
  reportButtonCategories.style.border = '2px solid #fff';
  reportButtonCategories.style.borderRadius = '3px';
  reportButtonCategories.style.borderBottomLeftRadius = '0px';
  reportButtonCategories.style.borderTopLeftRadius = '0px';
  reportButtonCategories.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  reportButtonCategories.style.marginTop = '10px';
  // reportButtonCategories.style.paddingTop = '12px';
  // reportButtonCategories.style.paddingBottom = '12px';
  reportButtonCategories.style.paddingLeft = '10px';
  reportButtonCategories.style.paddingRight = '10px';
  reportButtonCategories.style.position = 'relative';
  // reportButtonCategories.style.marginLeft = '74.22px';
  reportButtonCategories.style.alignItems = 'center';

  const reportButtonFirstCategory = document.createElement('div');
  reportButtonFirstCategory.style.paddingRight = '10px';
  reportButtonFirstCategory.title = 'Avanzar con cautela';

  const reportButtonFirstCategoryIMG = document.createElement('i');
  reportButtonFirstCategoryIMG.setAttribute("name", "cautela");
  reportButtonFirstCategoryIMG.classList.add('reportButtonImg');
  reportButtonFirstCategoryIMG.classList.add('fas');
  reportButtonFirstCategoryIMG.classList.add('fa-exclamation-triangle');
  // reportButtonFirstCategoryIMG.style.fontSize = '30px';
  reportButtonFirstCategoryIMG.style.color = 'Khaki';
  reportButtonFirstCategoryIMG.style.cursor = 'pointer';

  reportButtonFirstCategory.appendChild(reportButtonFirstCategoryIMG);
  reportButtonCategories.appendChild(reportButtonFirstCategory);

  const categoriesSpacerDiv = document.createElement('div');
  categoriesSpacerDiv.style.position = 'relative';
  categoriesSpacerDiv.style.backgroundColor = 'rgb(230, 230, 230)';
  categoriesSpacerDiv.style.marginRight = '10px';
  categoriesSpacerDiv.style.width = '1px';
  categoriesSpacerDiv.style.height = '30px';

  reportButtonCategories.appendChild(categoriesSpacerDiv);

  const reportButtonSecondCategory = document.createElement('div');
  // reportButtonSecondCategory.style.paddingRight = '10px';
  reportButtonSecondCategory.title = 'No pasar';

  const reportButtonSecondCategoryIMG = document.createElement('i');
  reportButtonSecondCategoryIMG.setAttribute("name", "no pasar");
  reportButtonSecondCategoryIMG.classList.add('reportButtonImg');
  reportButtonSecondCategoryIMG.classList.add('fas');
  reportButtonSecondCategoryIMG.classList.add('fa-ban');
  // reportButtonSecondCategoryIMG.style.fontSize = '30px';
  reportButtonSecondCategoryIMG.style.color = 'IndianRed';
  reportButtonSecondCategoryIMG.style.cursor = 'pointer';

  reportButtonSecondCategory.appendChild(reportButtonSecondCategoryIMG);
  reportButtonCategories.appendChild(reportButtonSecondCategory);

  leftControlUI.appendChild(reportButtonUI);

  reportButtonIMG.addEventListener('mouseover', function() {
    reportButtonCategories.style.display = 'flex';
    leftControlUI.style.borderTopRightRadius = '0px';
  });
  controlDiv.addEventListener('mouseleave', function() {
    reportButtonCategories.style.display = 'none';
    leftControlUI.style.borderTopRightRadius = '3px';
  });

  // Otra forma de hacer hover, con jquery
  // $(reportButtonFirstCategoryIMG).hover(
  //   function() {
  //     $(reportButtonFirstCategoryIMG).css("color","Yellow");
  //   }, function() {
  //     $(reportButtonFirstCategoryIMG).css("color","Khaki");
  //   }
  // );

  reportButtonFirstCategoryIMG.addEventListener('mouseover', function() {
    reportButtonFirstCategoryIMG.style.color = 'Yellow';
  });
  reportButtonFirstCategoryIMG.addEventListener('mouseleave', function() {
    reportButtonFirstCategoryIMG.style.color = 'Khaki';
  });

  reportButtonSecondCategoryIMG.addEventListener('mouseover', function() {
    reportButtonSecondCategoryIMG.style.color = 'Red';
  });
  reportButtonSecondCategoryIMG.addEventListener('mouseleave', function() {
    reportButtonSecondCategoryIMG.style.color = 'IndianRed';
  });

  reportButtonIMG.addEventListener('mouseover', function() {
    reportButtonIMG.style.color = 'Red';
  });
  controlDiv.addEventListener('mouseleave', function() {
    reportButtonIMG.style.color = 'IndianRed';
  });

  reportButtonFirstCategoryIMG.addEventListener('click', function() {
    AddControversialPoint(this, null);
  });
  reportButtonSecondCategoryIMG.addEventListener('click', function() {
    AddControversialPoint(this, null);
  });

  const buttonsSpacerDiv = document.createElement('div');
  buttonsSpacerDiv.style.position = 'relative';
  buttonsSpacerDiv.style.backgroundColor = 'rgb(230, 230, 230)';
  buttonsSpacerDiv.style.height = '1px';
  leftControlUI.appendChild(buttonsSpacerDiv);

  const favoritePlacesButtonUI = document.createElement('div');
  favoritePlacesButtonUI.classList.add('favoritePlacesButton');
  favoritePlacesButtonUI.style.paddingTop = '5px';
  favoritePlacesButtonUI.title = 'Agregar este lugar a favoritos';

  const favoritePlacesImg = document.createElement('i');
  favoritePlacesImg.classList.add('favoritePlacesImg');
  favoritePlacesImg.classList.add('fas');
  favoritePlacesImg.classList.add('fa-heart');
  // favoritePlacesImg.style.fontSize = '40px';
  favoritePlacesImg.style.color = 'pink';
  favoritePlacesImg.style.cursor = 'pointer';
  favoritePlacesButtonUI.appendChild(favoritePlacesImg);

  leftControlUI.appendChild(favoritePlacesButtonUI);

  favoritePlacesImg.addEventListener('mouseover', function() {
    favoritePlacesImg.style.color = 'HotPink';
  });
  favoritePlacesImg.addEventListener('mouseleave', function() {
    favoritePlacesImg.style.color = 'pink';
  });

  favoritePlacesImg.addEventListener('click', function() {
    AddFavoritePlace(null);
  });

  controlDiv.appendChild(leftControlUI);
  controlDiv.appendChild(reportButtonCategories);

  //JS media screen inicial
  if ($(window).width()<=768) {
    leftControlUI.style.marginTop = '0px';
    leftControlUI.style.bottom = '10px';
    reportButtonCategories.style.bottom = '57.15px';
    reportButtonCategories.style.marginLeft = '64.45px';
    controlDiv.index = 1;
    map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(controlDiv);
    $(leftControlUI).find("i").css("font-size","30px");
    $(reportButtonCategories).find("i").css("font-size","20px");
    $(reportButtonCategories).css("padding-top",'7px');
    $(reportButtonCategories).css("padding-bottom",'7px');
    $(".newRouteFilterButton").css("width","250px");
  }else if($(window).width()>768){
    leftControlUI.style.marginTop = '10px';
    leftControlUI.style.bottom = '';
    controlDiv.index = 1;
    reportButtonCategories.style.marginLeft = '74.22px';
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(controlDiv);
    $(leftControlUI).find("i").css("font-size","40px");
    $(reportButtonCategories).find("i").css("font-size","30px");
    $(reportButtonCategories).css("padding-top",'12px');
    $(reportButtonCategories).css("padding-bottom",'12px');
    $(".newRouteFilterButton").css("width","325px");
  }

// JS media query on resize
  // let resizeTimer;
  window.addEventListener('resize', function(event){
    // clearTimeout(resizeTimer);  //css tricks
    // resizeTimer = setTimeout(function() {
    if ($(window).width()<=768) {
      map.controls[google.maps.ControlPosition.TOP_LEFT].clear();
      leftControlUI.style.marginTop = '0px';
      leftControlUI.style.bottom = '10px';
      reportButtonCategories.style.bottom = '57.15px';
      reportButtonCategories.style.marginLeft = '64.45px';
      $(leftControlUI).find("i").css("font-size","30px");
      $(reportButtonCategories).find("i").css("font-size","20px");
      $(reportButtonCategories).css("padding-top",'7px');
      $(reportButtonCategories).css("padding-bottom",'7px');
      map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(controlDiv);
      $(".newRouteFilterButton").css("width","250px");
      $(".legendsControlDiv").css("top","0px");
      $(".legendsControlDiv").css("position","relative");

    }else if($(window).width()>768){
      map.controls[google.maps.ControlPosition.LEFT_BOTTOM].clear();
      leftControlUI.style.marginTop = '10px';
      leftControlUI.style.bottom = '';
      reportButtonCategories.style.bottom = '0px';
      reportButtonCategories.style.marginLeft = '74.22px';
      $(leftControlUI).find("i").css("font-size","40px");
      $(reportButtonCategories).find("i").css("font-size","30px");
      $(reportButtonCategories).css("padding-top",'12px');
      $(reportButtonCategories).css("padding-bottom",'12px');
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(controlDiv);
      $(".newRouteFilterButton").css("width","325px");
      $(".legendsControlDiv").css("top","125px");
      $(".legendsControlDiv").css("position","absolute");
    }

    // }, 250);
  });
}

function AddFavoritePlace(position){
  if(position){
    let opcion="ingresar_lugar_favorito";
    $.ajax({
      type:"POST",
      url:"./funcionesIndex.php",
      data:{
        "opcion":opcion,
        "lat":position.lat,
        "lng":position.lng
      },
      success:function(info){
        // console.log(info);
        countFavoritePlaces(position);
        infoWindow.setPosition(position);
        infoWindow.setContent('Se ha agregado este lugar a sus favoritos');
        infoWindow.open(map);
        map.setCenter(position);
      },error:function(info){
        console.log(info);
      }
    });
  }else{
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        let opcion="ingresar_lugar_favorito";
        $.ajax({
          type:"POST",
          url:"./funcionesIndex.php",
          data:{
            "opcion":opcion,
            "lat":pos.lat,
            "lng":pos.lng
          },
          success:function(info){
            // console.log(info);
            countFavoritePlaces(pos);
            infoWindow.setPosition(pos);
            infoWindow.setContent('Se ha agregado este lugar a sus favoritos');
            infoWindow.open(map);
            map.setCenter(pos);
          },error:function(info){
            console.log(info);
          }
        });

      }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
      handleLocationError(false, infoWindow, map.getCenter());
    }
  }
}

function AddControversialPoint(element, contPoint){
  let category = element.getAttribute("name");

  if(contPoint){
    let opcion="ingresar_punto_conflictivo";
    $.ajax({
      type:"POST",
      url:"./funcionesIndex.php",
      data:{
        "opcion":opcion,
        "lat":contPoint.lat,
        "lng":contPoint.lng,
        "cat":category
      },
      success:function(info){
        // console.log(info);
        infoWindow.setPosition(contPoint);
        infoWindow.setContent('Se ha reportado este punto. Gracias!');
        infoWindow.open(map);
        map.setCenter(contPoint);
      },error:function(info){
        // console.log(info);
      }
    });
  }else{
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        let pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        let opcion="ingresar_punto_conflictivo";
        $.ajax({
          type:"POST",
          url:"./funcionesIndex.php",
          data:{
            "opcion":opcion,
            "lat":pos.lat,
            "lng":pos.lng,
            "cat":category
          },
          success:function(info){
            // console.log(info);
            infoWindow.setPosition(pos);
            infoWindow.setContent('Se ha reportado este punto. Gracias!');
            infoWindow.open(map);
            map.setCenter(pos);
          },error:function(info){
            console.log(info);
          }
        });

      }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
      handleLocationError(false, infoWindow, map.getCenter());
    }
  }
}

function CreateRouteFilterControl(controlDiv) {

  const routeFilterControlUI = document.createElement('div');
  routeFilterControlUI.classList.add('newRouteFilterButton');
  routeFilterControlUI.style.backgroundColor = '#fff';
  routeFilterControlUI.style.border = '2px solid #fff';
  routeFilterControlUI.style.borderRadius = '3px';
  routeFilterControlUI.style.borderBottomRightRadius = '2px';
  routeFilterControlUI.style.borderTopRightRadius = '2px';
  routeFilterControlUI.style.paddingBottom = '3px';
  routeFilterControlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  routeFilterControlUI.style.textAlign = 'center';
  routeFilterControlUI.style.margin = '10px 0px 0px 0px';
  routeFilterControlUI.style.paddingLeft = '4%';
  routeFilterControlUI.style.paddingRight = '4%';
  routeFilterControlUI.style.paddingTop = '5px';
  routeFilterControlUI.style.width = '325px';
  routeFilterControlUI.style.height = 'auto';
  routeFilterControlUI.style.position = 'relative';
  routeFilterControlUI.title = '';
  controlDiv.appendChild(routeFilterControlUI);

  const routeFilterTitleDiv = document.createElement('div');
  routeFilterTitleDiv.style.width = '100%';
  routeFilterTitleDiv.style.display = 'flex';
  routeFilterTitleDiv.style.paddingBottom = '5px';
  routeFilterControlUI.appendChild(routeFilterTitleDiv);

  const routeFilterTitle = document.createElement('div');
  routeFilterTitle.style.width = '60%'; //cambiar a 60
  routeFilterTitle.style.color = 'rgb(25,25,25)';
  routeFilterTitle.style.fontFamily = 'Roboto,Arial,sans-serif';
  routeFilterTitle.style.fontSize = '16px';
  routeFilterTitle.style.lineHeight = '38px';
  routeFilterTitle.style.textAlign = 'right'; //cambiar a derecha
  routeFilterTitle.innerHTML = 'Nueva Ruta';
  routeFilterTitleDiv.appendChild(routeFilterTitle);

  const routeFilterToggle = document.createElement('div');
  routeFilterToggle.style.display = 'inline';
  routeFilterToggle.style.paddingTop = '9px';
  routeFilterToggle.style.paddingLeft = '5px';
  routeFilterTitleDiv.appendChild(routeFilterToggle);

  const routeFilterToggleIMG = document.createElement('i');
  routeFilterToggleIMG.setAttribute("id", "routeFilterToggle");
  routeFilterToggleIMG.classList.add('fas');
  routeFilterToggleIMG.classList.add('fa-angle-up');
  routeFilterToggleIMG.style.fontSize = '20px';
  routeFilterToggleIMG.style.cursor = 'pointer';
  routeFilterToggleIMG.title = 'Mostrar/Ocultar Filtro';
  routeFilterToggle.appendChild(routeFilterToggleIMG);

  $(routeFilterToggleIMG).click(function(){
    ToggleFilterOptions();
  });

  const splitLocationDiv = document.createElement('div');
  splitLocationDiv.style.width = '100%';
  splitLocationDiv.style.display = 'flex';
  splitLocationDiv.style.top = '25px';
  splitLocationDiv.style.paddingBottom = '5px';
  routeFilterControlUI.appendChild(splitLocationDiv);

  const routeLocationText = document.createElement('input');
  routeLocationText.setAttribute("id","routeLocationText");
  routeLocationText.setAttribute("type", "text");
  routeLocationText.setAttribute("placeholder", "¿De donde partimos?");
  routeLocationText.style.color = 'rgb(25,25,25)';
  routeLocationText.style.fontFamily = 'Roboto,Arial,sans-serif';
  routeLocationText.style.fontSize = '12px';
  routeLocationText.style.lineHeight = '38px';
  routeLocationText.style.paddingLeft = '5px';
  routeLocationText.style.paddingRight = '5px';
  routeLocationText.style.width = '85%';
  routeLocationText.style.height = '33px';
  routeLocationText.title = 'Escriba el inicio de su ruta';
  splitLocationDiv.appendChild(routeLocationText);

  // Coordenadas de la Provincia de Concepcion Approx
  // -36.475659, -72.469160 // NE
  // -37.266935, -73.251065 // SW
  // let boundNE = {lat: -36.475659, lng: -72.469160};
  // let boundSW = {lat: -37.266935, lng: -73.251065};
  // let autocompleteBounds = new google.maps.LatLngBounds(boundSW,boundNE);

  // autocompleteLocation.addListener('place_changed', function() {
  //   // let autocompletedPlace = autocompleteLocation.getPlace();
  //   console.log($("#routeLocationText").val());
  //   SetLocationText();
  // });
  // routeLocationText.addEventListener('change', SetLocationText);

  let autocompleteLocation = new google.maps.places.Autocomplete(routeLocationText, {
    componentRestrictions: {country: 'CL'},
    bounds: ConcepcionBounds,
    strictBounds: true
  });
  // let locationFlag;
  // routeLocationText.addEventListener('change', function(event){
  //   event.stopImmediatePropagation();
  //   locationFlag = null;
    // acLocEvent = autocompleteLocation.addListener('place_changed', function() {
    //   // let autocompletedPlace = autocompleteLocation.getPlace();
    //   // google.maps.event.removeListener(acLocEvent);
    //   console.log($(routeLocationText).val());
    //   SetLocationText();
    //   // locationFlag = 1;
    // });
    // if (locationFlag == null) {
      // console.log($(routeLocationText).val());
      // SetLocationText();
      // locationFlag = null;
    // }
  // });

  autocompleteLocation.addListener('place_changed', function() {
    // google.maps.event.removeListener(acLocEvent);
    // console.log($(routeLocationText).val());
    console.log("entramos");
    SetLocationText();
  });

  const routeLocationMarkerDiv = document.createElement('div');
  routeLocationMarkerDiv.style.width = '15%';
  routeLocationMarkerDiv.style.paddingTop = '5px';
  routeLocationMarkerDiv.style.paddingBottom = 'auto';
  splitLocationDiv.appendChild(routeLocationMarkerDiv);

  const routeLocationMarker = document.createElement('i');
  routeLocationMarker.setAttribute("id", "routeLocationMarkerImg");
  routeLocationMarker.classList.add('fas');
  routeLocationMarker.classList.add('fa-street-view');
  routeLocationMarker.style.fontSize = '27px';
  routeLocationMarker.style.color = 'GoldenRod';
  routeLocationMarker.style.alignContent = 'center';
  routeLocationMarker.style.cursor = 'pointer';
  routeLocationMarker.title = 'Usar geolocalización';
  routeLocationMarkerDiv.appendChild(routeLocationMarker);

  routeLocationMarker.addEventListener('click', function(){
    SetLocationMarker(null);
  });

  const splitDestinationDiv = document.createElement('div');
  splitDestinationDiv.style.width = '100%';
  splitDestinationDiv.style.display = 'flex';
  splitDestinationDiv.style.top = '25px';
  routeFilterControlUI.appendChild(splitDestinationDiv);

  const routeDestinationText = document.createElement('input');
  routeDestinationText.setAttribute("id","routeDestinationText");
  routeDestinationText.setAttribute("type", "text");
  routeDestinationText.setAttribute("placeholder", "¿A donde vamos?");
  routeDestinationText.style.color = 'rgb(25,25,25)';
  routeDestinationText.style.fontFamily = 'Roboto,Arial,sans-serif';
  routeDestinationText.style.fontSize = '12px';
  routeDestinationText.style.lineHeight = '38px';
  routeDestinationText.style.paddingLeft = '5px';
  routeDestinationText.style.paddingRight = '5px';
  routeDestinationText.style.width = '85%';
  routeDestinationText.style.height = '33px';
  routeDestinationText.title = 'Escriba su destino';
  splitDestinationDiv.appendChild(routeDestinationText);

  // routeDestinationText.addEventListener('change', SetDestinationText);

  let autocompleteDestination = new google.maps.places.Autocomplete(routeDestinationText, {
    componentRestrictions: {country: 'CL'},
    bounds: ConcepcionBounds,
    strictBounds: true
  });
  // let destinationFlag;
  // routeDestinationText.addEventListener('change', function(){
  //   destinationFlag = null;
  //   autocompleteDestination.addListener('place_changed', function() {
  //     // let autocompletedPlace = autocompleteLocation.getPlace();
  //     console.log($(routeDestinationText).val());
  //     SetDestinationText();
  //     destinationFlag = 1;
  //   });
  //   if (!destinationFlag) {
  //     console.log($(routeDestinationText).val());
  //     SetDestinationText();
  //     destinationFlag = null;
  //   }
  // });

  autocompleteDestination.addListener('place_changed', function() {
    // google.maps.event.removeListener(acLocEvent);
    // console.log($(routeLocationText).val());
    SetDestinationText();
  });

  const routeDestionationMarkerDiv = document.createElement('div');
  routeDestionationMarkerDiv.style.width = '15%';
  routeDestionationMarkerDiv.style.paddingTop = '5px';
  routeDestionationMarkerDiv.style.paddingBottom = 'auto';
  splitDestinationDiv.appendChild(routeDestionationMarkerDiv);

  const routeDestinationMarker = document.createElement('i');
  routeDestinationMarker.setAttribute("id", "routeDestinationMarkerImg");
  routeDestinationMarker.classList.add('fas');
  routeDestinationMarker.classList.add('fa-map-marker-alt');
  routeDestinationMarker.style.fontSize = '27px';
  routeDestinationMarker.style.color = 'red';
  routeDestinationMarker.style.alignContent = 'center';
  routeDestinationMarker.style.cursor = 'pointer';
  routeDestinationMarker.title = 'Marque en el mapa su destino';
  routeDestionationMarkerDiv.appendChild(routeDestinationMarker);

  routeDestinationMarker.addEventListener('click', SetDestinationMarker);

  const splitTextDiv = document.createElement('div');
  splitTextDiv.style.width = '100%';
  splitTextDiv.style.display = 'flex';
  routeFilterControlUI.appendChild(splitTextDiv);

  const rangeControlTextLeft = document.createElement('div');
  rangeControlTextLeft.style.width = '50%';
  rangeControlTextLeft.style.color = 'rgb(25,25,25)';
  rangeControlTextLeft.style.fontFamily = 'Roboto,Arial,sans-serif';
  rangeControlTextLeft.style.fontSize = '12px';
  rangeControlTextLeft.style.lineHeight = '38px';
  rangeControlTextLeft.style.textAlign = 'left';
  rangeControlTextLeft.innerHTML = 'Turismo';
  splitTextDiv.appendChild(rangeControlTextLeft);

  const rangeControlTextRight = document.createElement('div');
  rangeControlTextRight.style.width = '50%';
  rangeControlTextRight.style.color = 'rgb(25,25,25)';
  rangeControlTextRight.style.fontFamily = 'Roboto,Arial,sans-serif';
  rangeControlTextRight.style.fontSize = '12px';
  rangeControlTextRight.style.lineHeight = '38px';
  rangeControlTextRight.style.textAlign = 'right';
  rangeControlTextRight.innerHTML = 'Rápido';
  splitTextDiv.appendChild(rangeControlTextRight);

  const controlRange = document.createElement('input');
  controlRange.style.width = '100%';
  controlRange.setAttribute("id", "routeRangeInput");
  controlRange.setAttribute("type", "range");
  controlRange.setAttribute("step", "1");
  controlRange.setAttribute("list", "ticks");
  controlRange.setAttribute("min", "1");
  controlRange.setAttribute("max", "5");
  controlRange.setAttribute("value", "3");
  controlRange.style.cursor = 'pointer';
  controlRange.title = 'Escoja su preferencia para la ruta';
  let ticksList = document.createElement('datalist');
  ticksList.setAttribute("id", "ticks");
  let ticksOptions = ['1', '2', '3', '4', '5'];
  ticksOptions.forEach(item =>{
    let optionElement = document.createElement('option');
    optionElement.value = item;
    ticksList.appendChild(optionElement);
  });
  routeFilterControlUI.appendChild(controlRange);

  const generateRouteButton = document.createElement('button');
  generateRouteButton.setAttribute("id", "generateRouteButton");
  generateRouteButton.setAttribute("class", "botonDeSeleccion");
  generateRouteButton.setAttribute("type", "button");
  // generateRouteButton.style.color = 'rgb(25,25,25)';
  // generateRouteButton.style.backgroundColor = 'rgb(255, 255, 255';
  // generateRouteButton.style.fontFamily = 'Roboto,Arial,sans-serif';
  generateRouteButton.style.fontSize = '17.6px';
  // generateRouteButton.style.lineHeight = '38px';
  // generateRouteButton.style.paddingLeft = '7.5%';
  // generateRouteButton.style.paddingRight = '7.5%';
  // generateRouteButton.style.marginLeft = '30%';
  // generateRouteButton.style.marginRight = '30%';
  generateRouteButton.style.marginTop = '2%';
  generateRouteButton.style.padding = '2.5%';
  generateRouteButton.style.textAlign = 'center';
  generateRouteButton.style.cursor = 'pointer';
  generateRouteButton.innerHTML = 'Generar';
  routeFilterControlUI.appendChild(generateRouteButton);

  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  generateRouteButton.addEventListener('click', function(){
    // generateRouteButton.style.webkitTransform = 'translateY(4px)';
    // generateRouteButton.style.transform = 'translateY(4px)';
    // generateRouteButton.style.webkitTransform = 'translateY(-4px)';
    // generateRouteButton.style.transform = 'translateY(-4px)';

    GenerateRoute(directionsService, directionsDisplay, infoWindow);
  });
}

function ToggleFilterOptions(){
  const filterDiv = $(".newRouteFilterButton").children();
  if($("#routeFilterToggle").hasClass('fa-angle-down')){
    for (let i = 1; i < filterDiv.length; i++) {
      $(filterDiv[i]).slideToggle();
    }
    $("#routeFilterToggle").removeClass().attr("class","fas fa-angle-up");
  }else if($("#routeFilterToggle").hasClass('fa-angle-up')){
    for (let i = 1; i < filterDiv.length; i++) {
      $(filterDiv[i]).slideToggle();
    }
    $("#routeFilterToggle").removeClass().attr("class","fas fa-angle-down");
  }
  // filterDiv = $(".newRouteFilterButton").children().toggle();
  // const filterDiv = $(".newRouteFilterButton").children();
  // for (let i = 1; i < filterDiv.length; i++) {
  //   // $(filterDiv[i]).css("display","none");
  //   $(filterDiv[i]).toggle();
  // }
  // $("#routeFilterToggle").parent().css("display","inline");
  // $(filterDiv[0]).children().first().css("width", "60%");
  // $(filterDiv[0]).children().first().css("text-align","right");
  //
  // $("#routeFilterToggle").click(function(event){
  //   // $("#routeFilterToggle").off(event);
  //   // $(filterDiv[1]).css("display","flex");
  //   // $(filterDiv[2]).css("display","flex");
  //   // $(filterDiv[3]).css("display","flex");
  //   // $(filterDiv[4]).css("display","");
  //   $(filterDiv[1]).toggle();
  //   $(filterDiv[2]).toggle();
  //   $(filterDiv[3]).toggle();
  //   $(filterDiv[4]).toggle();
  //   // $("#routeFilterToggle").parent().css("display","none");
  //   // $(".newRouteFilterButton div div").first().css("width", "100%");
  //   // $(".newRouteFilterButton div div").first().css("text-align","center");
  //   $("#routeFilterToggle").removeClass().attr("class","fas fa-angle-up");
  // });
}

function CreateLegendsControl(controlDiv){
  const legendsControlDiv = document.createElement('div');
  legendsControlDiv.classList.add('legendsControlDiv');
  legendsControlDiv.style.backgroundColor = '#fff';
  legendsControlDiv.style.border = '2px solid #fff';
  legendsControlDiv.style.borderRadius = '3px';
  legendsControlDiv.style.borderBottomRightRadius = '2px';
  legendsControlDiv.style.borderTopRightRadius = '2px';
  legendsControlDiv.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  legendsControlDiv.style.textAlign = 'center';
  legendsControlDiv.style.margin = '10px 0px 0px 10px';
  legendsControlDiv.style.paddingLeft = '5px';
  legendsControlDiv.style.paddingRight = '5px';
  legendsControlDiv.style.width = '50px';
  legendsControlDiv.style.height = 'auto';
  legendsControlDiv.title = 'Click para ver/ocultar';
  controlDiv.appendChild(legendsControlDiv);

  const legendsTitle = document.createElement('div');
  legendsTitle.style.color = 'rgb(25,25,25)';
  legendsTitle.style.fontFamily = 'Roboto,Arial,sans-serif';
  legendsTitle.style.fontSize = '12px';
  legendsTitle.style.lineHeight = '38px';
  legendsTitle.style.textAlign = 'center';
  legendsTitle.innerHTML = 'Leyenda';
  legendsControlDiv.appendChild(legendsTitle);

  const titleSpacerDiv = document.createElement('div');
  titleSpacerDiv.style.position = 'relative';
  titleSpacerDiv.style.backgroundColor = 'rgb(230, 230, 230)';
  titleSpacerDiv.style.height = '1px';
  legendsControlDiv.appendChild(titleSpacerDiv);

  const legendToCopyDiv = document.createElement('div');
  legendToCopyDiv.setAttribute("class","legendToCopyDiv");
  legendToCopyDiv.setAttribute("name","puntos-conflictivos");
  legendToCopyDiv.style.width = '100%';
  legendToCopyDiv.style.display = 'flex';
  legendToCopyDiv.style.alignItems = 'center';
  legendToCopyDiv.style.paddingTop = '7.5px';
  legendToCopyDiv.style.paddingBottom = '7.5px';
  legendsControlDiv.appendChild(legendToCopyDiv);

  const legendIMGDiv = document.createElement('div');
  legendIMGDiv.style.width = '65%';
  legendToCopyDiv.appendChild(legendIMGDiv);

  const legendIMG = document.createElement('i');
  legendIMG.classList.add('fas');
  legendIMG.classList.add('fa-flag');
  legendIMG.style.fontSize = '25px';
  legendIMG.style.cursor = 'pointer';
  legendIMG.title = 'Puntos Conflictivos';
  legendIMG.style.color = 'red';
  legendIMGDiv.appendChild(legendIMG);

  const legendCheckboxDiv = document.createElement('div');
  legendCheckboxDiv.style.width = '35%';
  legendToCopyDiv.appendChild(legendCheckboxDiv);

  const legendCheckbox = document.createElement('input');
  legendCheckbox.setAttribute("type","checkbox");
  legendCheckboxDiv.appendChild(legendCheckbox);

  const legendsSpacerDiv = document.createElement('div');
  legendsSpacerDiv.style.position = 'relative';
  legendsSpacerDiv.style.backgroundColor = 'rgb(230, 230, 230)';
  legendsSpacerDiv.style.height = '1px';
  legendsControlDiv.appendChild(legendsSpacerDiv);

  $(legendToCopyDiv).clone(true, true).attr("name","lugares-favoritos").appendTo(legendsControlDiv).find("i").removeClass().attr("class","fas fa-thumbtack").attr("title","Lugares Favoritos").css("color","green");
  // $(legendsSpacerDiv).clone().appendTo(legendsControlDiv);
  // $(legendToCopyDiv).clone(true, true).attr("name","ciclovias").appendTo(legendsControlDiv).find("i").removeClass().attr("class","fas fa-bicycle").attr("title","Ciclovías").css("color","blue");

  if ($(window).width()<=768) {
    legendsControlDiv.style.top = '0px';
    legendsControlDiv.style.position = 'relative';
  }else if ($(window).width()>768) {
    legendsControlDiv.style.top = '125px';
    legendsControlDiv.style.position = 'absolute';
  }

  countFavoritePlaces(null); //cuenta los lugares favoritos que hay en la bd al momento de cargar la pagina

  $(legendsControlDiv).find(":checkbox").click(function(){
    let legendClicked = $(this).parent().parent().attr('name');
    let checkboxState = $(this).prop('checked');
    // console.log(legendClicked);
    // console.log(checkboxState);
    if(checkboxState){
      switch (legendClicked) {
        case "puntos-conflictivos":
          countControversialPoints();
          // console.log(controversialMarkers);
          break;
        case "lugares-favoritos":
          showFavoritePlaces();
          // console.log(favoriteMarkers);
          break;
        case "ciclovias":
          countBikeways();
          break;
        default:
          break;
      }
    }else{
      switch (legendClicked) {
        case "puntos-conflictivos":
          hideControversialPoints();
          break;
        case "lugares-favoritos":
          hideFavoritePlaces();
          break;
        case "ciclovias":
          hideBikeways();
          break;
        default:
          break;
      }
    }
  });
}

function countControversialPoints(){
  let opcion="recuperar_puntos_conflictivos";
  $.ajax({
    type:"POST",
    url:"./funcionesIndex.php",
    data:{
      "opcion":opcion
    },
    success:function(info){
      // console.log(info);
      let data=[];
      data=JSON.parse(info);
      if(data){
        // console.log(info);
        showControversialPoints(data);
      }else{
        console.log("no hay datos");
      }
    },error:function(info){
      console.log(info);
    }
  });
}

function countFavoritePlaces(coords){
  if(coords){  // Cuando se agrega un nuevo lugar favorito desde la pagina entra aqui
    let iconColor = "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
    geocoder = new google.maps.Geocoder;
    geocoder.geocode({'location': coords}, function(results, status) {
      if (status === 'OK') {
        if (results[0]) {
          let marker = new google.maps.Marker({
            position: coords,
            map: map,
            title: results[0].formatted_address,
            icon: iconColor,
            visible: false
          });
          favoriteMarkers.push(marker);
          $(document).ready(function(){
            if ($(".legendToCopyDiv[name='lugares-favoritos']").find(":checkbox").prop('checked')) {
              showFavoritePlaces();
            }
          });
        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
      }
    });
  }else{
    let opcion="recuperar_lugares_favoritos";
    $.ajax({
      type:"POST",
      url:"./funcionesIndex.php",
      data:{
        "opcion":opcion
      },
      success:function(info){
        // console.log(info);
        let data=[];
        data=JSON.parse(info);
        if(data){
          for(let i=0; i<data.length; i++){
            let favoriteCoords = {lat:Number(data[i].lat),lng:Number(data[i].lng)};
            let iconColor = "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
            geocoder = new google.maps.Geocoder;
            geocoder.geocode({'location': favoriteCoords}, function(results, status) {
              if (status === 'OK') {
                if (results[0]) {
                  let marker = new google.maps.Marker({
                    position: favoriteCoords,
                    map: map,
                    title: results[0].formatted_address,
                    icon: iconColor,
                    visible: false
                  });
                  favoriteMarkers.push(marker);
                } else {
                  alert('Geocode was not successful for the following reason: ' + status);
                }
              }
            });
          }
          // console.log(info);
        }else{
          console.log("no hay datos");
        }
      },error:function(info){
        console.log(info);
      }
    });
  }
}

function countBikeways(){

}

function showControversialPoints(puntos_conflictivos){
  for(let i=0; i<puntos_conflictivos.length; i++){
    let controversialCoords = {lat:Number(puntos_conflictivos[i].lat),lng:Number(puntos_conflictivos[i].lng)};
    // console.log(controversialCoords);
    let iconColor = "";
    if(puntos_conflictivos[i].tipo_punto_conflictivo=="cautela"){
      iconColor = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
    }else if(puntos_conflictivos[i].tipo_punto_conflictivo=="no pasar"){
      iconColor = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
    }
    let marker = new google.maps.Marker({
        map: map,
        position: controversialCoords,
        title: puntos_conflictivos[i].tipo_punto_conflictivo,
        icon: iconColor
    });
    controversialMarkers.push(marker);

    // marker.addListener('click', function(event) { PARA ANDRES
    //   CreateMapClickMenu(event);
    // });

  }
}

function showFavoritePlaces(){
  // console.log($(".legendToCopyDiv[name='lugares-favoritos']"));
  // if ($(".legendToCopyDiv[name='lugares-favoritos']").find(":checkbox").prop('checked')) {
  //   showFavoritePlaces();
  // }
  for(let i=0; i<favoriteMarkers.length; i++){
    $(document).ready(function(){
      if (favoriteMarkers[i]) {
        favoriteMarkers[i].setVisible(true);
      }
    });
  }
  SetFavoriteMarkersClickEvents(); //Aca se define que hacer al hacer click en un marker de Favoritos
}

function SetFavoriteMarkersClickEvents(){
  const deleteFavoriteButtonDiv = document.createElement('div');
  deleteFavoriteButtonDiv.style.width = "100%";
  const deleteFavoriteButton = document.createElement('button');
  deleteFavoriteButton.setAttribute("type","button");
  deleteFavoriteButton.setAttribute("class","deleteFavoritePlaceButton");
  deleteFavoriteButton.innerHTML = "Eliminar";
  deleteFavoriteButton.style.width = "auto";
  deleteFavoriteButton.style.backgroundColor = "#23383f";
  deleteFavoriteButton.style.color = "white";
  deleteFavoriteButton.style.borderRadius = "3px";
  deleteFavoriteButton.style.border = "none";
  deleteFavoriteButton.style.marginTop = "5%";
  deleteFavoriteButton.style.marginBottom = "2%";
  // deleteFavoriteButton.style.padding = "3%";
  deleteFavoriteButtonDiv.appendChild(deleteFavoriteButton);

  for(let i=0; i<favoriteMarkers.length; i++){
    // $(document).ready(function(){
    if (favoriteMarkers[i]) {
      // favoriteMarkers[i].setVisible(true);
      google.maps.event.addListener(favoriteMarkers[i], 'click', function(){
        infoWindow.setContent(deleteFavoriteButtonDiv);
        infoWindow.open(map, favoriteMarkers[i]);
      });
    }
    // });
  }
  $(document).ready(function(){
    $(deleteFavoriteButton).click(function(event){
      event.stopImmediatePropagation();
      deleteFavoritePlace(infoWindow.position.lat(),infoWindow.position.lng());
    });
  });
}

function deleteFavoritePlace(lat, lng){
  // console.log(lat+" "+lng);
  let opcion = "eliminar_lugar_favorito";
  let codigo;
  for (let i = 0; i < favoriteMarkers.length; i++) {
    // console.log(favoriteMarkers[i].position.lat()+" "+favoriteMarkers[i].position.lng());
    if(lat == favoriteMarkers[i].position.lat() && favoriteMarkers[i].position.lng() == lng){
      codigo = i;
    }
  }
  $.ajax({
    type:"POST",
    url:"./funcionesIndex.php",
    data:{
      "opcion":opcion,
      "lat":lat,
      "lng":lng,
      "cod":codigo
    },
    success:function(info){
      console.log(info);
      favoriteMarkers[codigo].setMap(null);
      favoriteMarkers.splice(codigo,1);
      // if ($(legendsControlDiv).find(":checkbox").prop('checked')) {
      //   countFavoritePlaces();
      // }
    },error:function(info){
      console.log(info);
    }
  });
}

function showBikeways(){
  console.log("showBikeways");
}

function hideControversialPoints(){
  if(controversialMarkers.length!=0){
    setMapOnAll(null, controversialMarkers);
    controversialMarkers.length = 0;
    controversialMarkers = [];
  }
}

function hideFavoritePlaces(){
  if(favoriteMarkers.length!=0){
    // setMapOnAll(null, favoriteMarkers);
    // favoriteMarkers.length = 0;
    // favoriteMarkers = [];
    for(let i=0;i<favoriteMarkers.length;i++){
      favoriteMarkers[i].setVisible(false);
    }
  }
}

function hideBikeways(){
  console.log("hideBikeways");
}

function CreateMapClickMenu(event){
  geocoder = new google.maps.Geocoder;
  let service = new google.maps.places.PlacesService(map);

  let pointPosition = {
    lat:event.latLng.lat(),
    lng:event.latLng.lng()
  };

  if ($("#routeFilterToggle").hasClass("fa-angle-up")) {
    ToggleFilterOptions();
  }

  const mapClickInfoDiv = document.createElement('div');
  mapClickInfoDiv.style.width = "100%";
  mapClickInfoDiv.style.display = "flex";
  mapClickInfoDiv.style.paddingTop = "5px";

  const leftMapClickInfoDiv = document.createElement('div');
  leftMapClickInfoDiv.style.width = "45%";
  mapClickInfoDiv.appendChild(leftMapClickInfoDiv);

  const imgMapClickInfoDiv = document.createElement('div');
  imgMapClickInfoDiv.style.width = "100%";
  imgMapClickInfoDiv.style.height = "auto";
  imgMapClickInfoDiv.style.margin = "auto";
  imgMapClickInfoDiv.style.display = "inline-block";
  imgMapClickInfoDiv.style.position = "relative";
  leftMapClickInfoDiv.appendChild(imgMapClickInfoDiv);

  const imgMapClickInfo = document.createElement('img');
  imgMapClickInfo.style.width = "100%";
  imgMapClickInfo.style.height = "auto";
  imgMapClickInfo.style.textAlign = "center";
  imgMapClickInfoDiv.appendChild(imgMapClickInfo);

  // const imgMapClickInfo = document.createElement('div');
  // imgMapClickInfo.style.width = "100%";
  // // imgMapClickInfo.style.height = "auto";
  // imgMapClickInfo.style.height = "100%";
  // // imgMapClickInfo.style.backgroundColor = "red";
  // // imgMapClickInfo.setAttribute("src","./fotossubidas/perfil_default.png");
  // imgMapClickInfoDiv.appendChild(imgMapClickInfo);

  const placeNameMapClickInfo = document.createElement('div');
  placeNameMapClickInfo.style.display = "none";
  placeNameMapClickInfo.style.paddingTop = "5px";
  placeNameMapClickInfo.style.textAlign = "center";
  leftMapClickInfoDiv.appendChild(placeNameMapClickInfo);

  const addressMapClickInfo = document.createElement('div');
  addressMapClickInfo.style.paddingTop = "5px";
  addressMapClickInfo.style.textAlign = "center";
  leftMapClickInfoDiv.appendChild(addressMapClickInfo);

  const mapClickSpacerDiv = document.createElement('div');
  mapClickSpacerDiv.style.position = 'relative';
  mapClickSpacerDiv.style.backgroundColor = 'rgb(230, 230, 230)';
  mapClickSpacerDiv.style.marginLeft = '10px';
  mapClickSpacerDiv.style.marginRight = '10px';
  mapClickSpacerDiv.style.width = '1px';

  $(mapClickSpacerDiv).clone().appendTo(mapClickInfoDiv);

  const rightSideMapClickInfoDiv = document.createElement('div');
  rightSideMapClickInfoDiv.style.width = "55%";
  rightSideMapClickInfoDiv.style.display = "flex";
  rightSideMapClickInfoDiv.style.paddingTop = "5px";
  rightSideMapClickInfoDiv.style.minHeight = "230px";
  mapClickInfoDiv.appendChild(rightSideMapClickInfoDiv);

  // Puntos Ruta Inicio
  const leftCenterMapClickInfoDiv = document.createElement('div');
  leftCenterMapClickInfoDiv.style.width = "32.5%";
  rightSideMapClickInfoDiv.appendChild(leftCenterMapClickInfoDiv);

  const mapClickInfoRouteTitle = document.createElement('div');
  mapClickInfoRouteTitle.style.height = "15%";
  mapClickInfoRouteTitle.innerHTML = "Ruta";
  mapClickInfoRouteTitle.style.textAlign = "center";
  leftCenterMapClickInfoDiv.appendChild(mapClickInfoRouteTitle);

  const mapClickInfoSpacer = document.createElement('div');
  mapClickInfoSpacer.style.position = 'relative';
  mapClickInfoSpacer.style.backgroundColor = 'rgb(230, 230, 230)';
  mapClickInfoSpacer.style.height = '1px';
  // leftCenterMapClickInfoDiv.appendChild(mapClickInfoSpacer);
  $(mapClickInfoSpacer).clone().appendTo(leftCenterMapClickInfoDiv);

  const routeOriginDiv = document.createElement('div');
  routeOriginDiv.style.height = "35%";
  routeOriginDiv.style.marginTop = '5%';
  routeOriginDiv.style.marginBottom = '5%';
  routeOriginDiv.style.paddingTop = '5%';
  leftCenterMapClickInfoDiv.appendChild(routeOriginDiv);

  const imgRouteOriginDiv = document.createElement('div');
  imgRouteOriginDiv.style.width = "100%";
  imgRouteOriginDiv.style.height = "auto";
  imgRouteOriginDiv.style.textAlign = "center";
  routeOriginDiv.appendChild(imgRouteOriginDiv);

  const imgRouteOrigin = document.createElement('i');
  // imgRouteOrigin.setAttribute("id", "routeDestinationMarkerImg");
  imgRouteOrigin.classList.add('fas');
  imgRouteOrigin.classList.add('fa-street-view');
  imgRouteOrigin.style.fontSize = '30px';
  imgRouteOrigin.style.color = 'Khaki';
  imgRouteOrigin.style.cursor = 'pointer';
  imgRouteOrigin.title = 'Fijar como punto de origen para la ruta';
  imgRouteOriginDiv.appendChild(imgRouteOrigin);

  const imgRouteOriginTitle = document.createElement('div');
  imgRouteOriginTitle.style.paddingTop = '5%';
  imgRouteOriginTitle.innerHTML = "Punto de Origen";
  imgRouteOriginTitle.style.textAlign = "center";
  routeOriginDiv.appendChild(imgRouteOriginTitle);

  $(mapClickInfoSpacer).clone().appendTo(leftCenterMapClickInfoDiv);

  const routeDestinationDiv = document.createElement('div');
  routeDestinationDiv.style.height = "35%";
  routeDestinationDiv.style.marginTop = '5%';
  routeDestinationDiv.style.marginBottom = '5%';
  routeDestinationDiv.style.paddingTop = '5%';
  leftCenterMapClickInfoDiv.appendChild(routeDestinationDiv);

  const imgRouteDestinationDiv = document.createElement('div');
  imgRouteDestinationDiv.style.width = "100%";
  imgRouteDestinationDiv.style.height = "auto";
  imgRouteDestinationDiv.style.textAlign = "center";
  routeDestinationDiv.appendChild(imgRouteDestinationDiv);

  const imgRouteDestination = document.createElement('i');
  // imgRouteOrigin.setAttribute("id", "routeDestinationMarkerImg");
  imgRouteDestination.classList.add('fas');
  imgRouteDestination.classList.add('fa-map-marker-alt');
  imgRouteDestination.style.fontSize = '30px';
  imgRouteDestination.style.color = 'IndianRed';
  imgRouteDestination.style.cursor = 'pointer';
  imgRouteDestination.title = 'Fijar como punto de destino para la ruta';
  imgRouteDestinationDiv.appendChild(imgRouteDestination);

  const imgRouteDestinationTitle = document.createElement('div');
  imgRouteDestinationTitle.style.paddingTop = '5%';
  imgRouteDestinationTitle.innerHTML = "Punto de Destino";
  imgRouteDestinationTitle.style.textAlign = "center";
  routeDestinationDiv.appendChild(imgRouteDestinationTitle);
  // Puntos de Ruta Fin

  $(mapClickSpacerDiv).clone().appendTo(rightSideMapClickInfoDiv);

  // Puntos Conflictivos Inicio
  const rightCenterMapClickInfoDiv = document.createElement('div');
  rightCenterMapClickInfoDiv.style.width = "32.5%";
  rightSideMapClickInfoDiv.appendChild(rightCenterMapClickInfoDiv);

  const mapClickInfoControversialPointTitle = document.createElement('div');
  mapClickInfoControversialPointTitle.style.height = "15%";
  mapClickInfoControversialPointTitle.innerHTML = "Puntos Conflictivos";
  mapClickInfoControversialPointTitle.style.textAlign = "center";
  rightCenterMapClickInfoDiv.appendChild(mapClickInfoControversialPointTitle);

  $(mapClickInfoSpacer).clone().appendTo(rightCenterMapClickInfoDiv);

  const cautionPointDiv = document.createElement('div');
  cautionPointDiv.style.height = "35%";
  cautionPointDiv.style.marginTop = '5%';
  cautionPointDiv.style.marginBottom = '5%';
  cautionPointDiv.style.paddingTop = '5%';
  rightCenterMapClickInfoDiv.appendChild(cautionPointDiv);

  const imgCautionPointDiv = document.createElement('div');
  imgCautionPointDiv.style.width = "100%";
  imgCautionPointDiv.style.height = "auto";
  imgCautionPointDiv.style.textAlign = "center";
  cautionPointDiv.appendChild(imgCautionPointDiv);

  const imgCautionPoint = document.createElement('i');
  // imgCautionPoint.setAttribute("id", "routeDestinationMarkerImg");
  imgCautionPoint.setAttribute("name", "cautela");
  imgCautionPoint.classList.add('fas');
  imgCautionPoint.classList.add('fa-exclamation-triangle');
  imgCautionPoint.style.fontSize = '30px';
  imgCautionPoint.style.color = 'Khaki';
  imgCautionPoint.style.cursor = 'pointer';
  imgCautionPoint.title = 'Reportar este punto para avanzar con cautela';
  imgCautionPointDiv.appendChild(imgCautionPoint);

  const imgCautionPointTitle = document.createElement('div');
  imgCautionPointTitle.style.paddingTop = '5%';
  imgCautionPointTitle.innerHTML = "Avanzar con cautela";
  imgCautionPointTitle.style.textAlign = "center";
  cautionPointDiv.appendChild(imgCautionPointTitle);

  $(mapClickInfoSpacer).clone().appendTo(rightCenterMapClickInfoDiv);

  const blockedPointDiv = document.createElement('div');
  blockedPointDiv.style.height = "35%";
  blockedPointDiv.style.marginTop = '5%';
  blockedPointDiv.style.marginBottom = '5%';
  blockedPointDiv.style.paddingTop = '5%';
  rightCenterMapClickInfoDiv.appendChild(blockedPointDiv);

  const imgBlockedPointDiv = document.createElement('div');
  imgBlockedPointDiv.style.width = "100%";
  imgBlockedPointDiv.style.height = "auto";
  imgBlockedPointDiv.style.textAlign = "center";
  blockedPointDiv.appendChild(imgBlockedPointDiv);

  const imgBlockedPoint = document.createElement('i');
  // imgBlockedPoint.setAttribute("id", "routeDestinationMarkerImg");
  imgBlockedPoint.setAttribute("name", "no pasar");
  imgBlockedPoint.classList.add('fas');
  imgBlockedPoint.classList.add('fa-ban');
  imgBlockedPoint.style.fontSize = '30px';
  imgBlockedPoint.style.color = 'IndianRed';
  imgBlockedPoint.style.cursor = 'pointer';
  imgBlockedPoint.title = 'Reportar este punto para no pasar';
  imgBlockedPointDiv.appendChild(imgBlockedPoint);

  const imgBlockedPointTitle = document.createElement('div');
  imgBlockedPointTitle.style.paddingTop = '5%';
  imgBlockedPointTitle.innerHTML = "No pasar";
  imgBlockedPointTitle.style.textAlign = "center";
  blockedPointDiv.appendChild(imgBlockedPointTitle);
  // Puntos Conflictivos Fin

  $(mapClickSpacerDiv).clone().appendTo(rightSideMapClickInfoDiv);

  // Lugares de Interes Inicio
  const rightMapClickInfoDiv = document.createElement('div');
  rightMapClickInfoDiv.style.width = "32.5%";
  rightSideMapClickInfoDiv.appendChild(rightMapClickInfoDiv);

  const mapClickPlacesTitle = document.createElement('div');
  mapClickPlacesTitle.style.height = "15%";
  mapClickPlacesTitle.innerHTML = "Lugares de Interés";
  mapClickPlacesTitle.style.textAlign = "center";
  rightMapClickInfoDiv.appendChild(mapClickPlacesTitle);

  $(mapClickInfoSpacer).clone().appendTo(rightMapClickInfoDiv);

  const favoritePlacesDiv = document.createElement('div');
  favoritePlacesDiv.style.height = "35%";
  favoritePlacesDiv.style.marginTop = '5%';
  favoritePlacesDiv.style.marginBottom = '5%';
  favoritePlacesDiv.style.paddingTop = '5%';
  rightMapClickInfoDiv.appendChild(favoritePlacesDiv);

  const imgFavoritePlacesDiv = document.createElement('div');
  imgFavoritePlacesDiv.style.width = "100%";
  imgFavoritePlacesDiv.style.height = "auto";
  imgFavoritePlacesDiv.style.textAlign = "center";
  favoritePlacesDiv.appendChild(imgFavoritePlacesDiv);

  const imgFavoritePlaces = document.createElement('i');
  // imgCautionPoint.setAttribute("id", "routeDestinationMarkerImg");
  imgFavoritePlaces.classList.add('fas');
  imgFavoritePlaces.classList.add('fa-heart');
  imgFavoritePlaces.style.fontSize = '30px';
  imgFavoritePlaces.style.color = 'pink';
  imgFavoritePlaces.style.cursor = 'pointer';
  imgFavoritePlaces.title = 'Agregar este lugar a favoritos';
  imgFavoritePlacesDiv.appendChild(imgFavoritePlaces);

  const imgFavoritePlacesTitle = document.createElement('div');
  imgFavoritePlacesTitle.style.paddingTop = '5%';
  imgFavoritePlacesTitle.innerHTML = "Agregar a Favoritos";
  imgFavoritePlacesTitle.style.textAlign = "center";
  favoritePlacesDiv.appendChild(imgFavoritePlacesTitle);

  $(mapClickInfoSpacer).appendTo(rightMapClickInfoDiv); //Meto el ultimo, no necesidad de clonar

  const moreInfoDiv = document.createElement('div');
  moreInfoDiv.style.height = "35%";
  moreInfoDiv.style.marginTop = '5%';
  moreInfoDiv.style.marginBottom = '5%';
  moreInfoDiv.style.paddingTop = '5%';
  rightMapClickInfoDiv.appendChild(moreInfoDiv);

  const imgMoreInfoDiv = document.createElement('div');
  imgMoreInfoDiv.style.width = "100%";
  imgMoreInfoDiv.style.height = "auto";
  imgMoreInfoDiv.style.textAlign = "center";
  moreInfoDiv.appendChild(imgMoreInfoDiv);

  const imgMoreInfo = document.createElement('i');
  // imgMoreInfo.setAttribute("id", "routeDestinationMarkerImg");
  imgMoreInfo.classList.add('fas');
  imgMoreInfo.classList.add('fa-info');
  imgMoreInfo.style.fontSize = '30px';
  imgMoreInfo.style.color = 'grey';
  imgMoreInfo.style.cursor = 'pointer';
  imgMoreInfo.title = 'Obtener mas información sobre este lugar(solo lugares designados en el mapa)';
  imgMoreInfoDiv.appendChild(imgMoreInfo);

  const imgMoreInfoTitle = document.createElement('div');
  imgMoreInfoTitle.style.paddingTop = '5%';
  imgMoreInfoTitle.innerHTML = "Más Información";
  imgMoreInfoTitle.style.textAlign = "center";
  moreInfoDiv.appendChild(imgMoreInfoTitle);
  // Lugares de Interes Fin

  imgRouteOrigin.addEventListener('mouseover', function() {
    imgRouteOrigin.style.color = 'GoldenRod';
  });
  imgRouteOrigin.addEventListener('mouseleave', function() {
    imgRouteOrigin.style.color = 'Khaki';
  });
  imgRouteOrigin.addEventListener('click', function() {
    if ($("#routeFilterToggle").hasClass("fa-angle-down")) {
      ToggleFilterOptions();
    }
    SetLocationMarker(pointPosition);
  });

  imgRouteDestination.addEventListener('mouseover', function() {
    imgRouteDestination.style.color = 'red';
  });
  imgRouteDestination.addEventListener('mouseleave', function() {
    imgRouteDestination.style.color = 'IndianRed';
  });
  imgRouteDestination.addEventListener('click', function() {
    if ($("#routeFilterToggle").hasClass("fa-angle-down")) {
      ToggleFilterOptions();
    }
    SetDestinationMarker(pointPosition);
  });

  imgCautionPoint.addEventListener('mouseover', function() {
    imgCautionPoint.style.color = 'GoldenRod';
  });
  imgCautionPoint.addEventListener('mouseleave', function() {
    imgCautionPoint.style.color = 'Khaki';
  });
  imgCautionPoint.addEventListener('click', function() {
    AddControversialPoint(this,pointPosition);
  });

  imgBlockedPoint.addEventListener('mouseover', function() {
    imgBlockedPoint.style.color = 'red';
  });
  imgBlockedPoint.addEventListener('mouseleave', function() {
    imgBlockedPoint.style.color = 'IndianRed';
  });
  imgBlockedPoint.addEventListener('click', function() {
    AddControversialPoint(this,pointPosition);
  });

  imgFavoritePlaces.addEventListener('mouseover', function() {
    imgFavoritePlaces.style.color = 'HotPink';
  });
  imgFavoritePlaces.addEventListener('mouseleave', function() {
    imgFavoritePlaces.style.color = 'pink';
  });
  imgFavoritePlaces.addEventListener('click', function() {
    AddFavoritePlace(pointPosition);
  });

  imgMoreInfo.addEventListener('mouseover', function() {
    imgMoreInfo.style.color = 'black';
  });
  imgMoreInfo.addEventListener('mouseleave', function() {
    imgMoreInfo.style.color = 'grey';
  });
  imgMoreInfo.addEventListener('click', function() {
    // console.log("click imgMoreInfo");
    getPlaceInfo(event);
  });

  if(event.placeId){
    event.stop(); // Y esto que hace aqui?
    // console.log(event.placeId);
    // console.log(event);
    let placeRequest = {
      placeId: event.placeId,
      fields: ['photos', 'name', 'rating', 'formatted_address']
    };
    service.getDetails(placeRequest, callback);

    function callback(place, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        if (place.photos) {
          if (place.photos.length>1) {
            let placePhoto = new Array();
            for (var i = 0; i < place.photos.length; i++) {
              placePhoto[i] = new Image();
              placePhoto[i].src = place.photos[i].getUrl();
              // console.log(placePhoto[i]);
              // placePhoto.push(place.photos[i].getUrl());

            }
            // $(imgMapClickInfo).attr("src", placePhoto[0]);
            $(imgMapClickInfo).attr("src", placePhoto[0].src);
            // imgMapClickInfoDiv
            imgLeftArrowDiv = document.createElement('div');
            imgLeftArrowDiv.style.position = "absolute";
            imgLeftArrowDiv.style.top = "40%";
            imgLeftArrowDiv.style.left = "0";

            imgLeftArrow = document.createElement('i');
            imgLeftArrow.classList.add('fas');
            imgLeftArrow.classList.add('fa-chevron-circle-left');
            imgLeftArrow.style.fontSize = '35px';
            imgLeftArrow.style.color = 'black';
            imgLeftArrow.style.cursor = 'pointer';
            imgLeftArrowDiv.appendChild(imgLeftArrow);
            imgMapClickInfoDiv.appendChild(imgLeftArrowDiv);

            imgRightArrowDiv = document.createElement('div');
            imgRightArrowDiv.style.position = "absolute";
            imgRightArrowDiv.style.top = "40%";
            imgRightArrowDiv.style.right = "0px";
            imgRightArrowDiv.style.textAlign = "right";

            imgRightArrow = document.createElement('i');
            imgRightArrow.classList.add('fas');
            imgRightArrow.classList.add('fa-chevron-circle-right');
            imgRightArrow.style.fontSize = '35px';
            imgRightArrow.style.color = 'black';
            imgRightArrow.style.cursor = 'pointer';
            imgRightArrowDiv.appendChild(imgRightArrow);
            imgMapClickInfoDiv.appendChild(imgRightArrowDiv);

            let cont = 0;
            $(imgLeftArrow).click(function(){
              if (cont==0) {
                cont = placePhoto.length-1;
              }else{
                cont--;
              }
              $(imgMapClickInfo).attr("src", placePhoto[cont].src);
            });

            $(imgRightArrow).click(function(){
              if (cont==(placePhoto.length-1)) {
                cont = 0;
              }else{
                cont++;
              }
              $(imgMapClickInfo).attr("src", placePhoto[cont].src);
            });
          }else{
            $(imgMapClickInfo).attr("src", place.photos[0].getUrl());
          }

        }

        $(placeNameMapClickInfo).css("display", "block");
        $(placeNameMapClickInfo).html(place.name);
        $(addressMapClickInfo).html(place.formatted_address);

        infoWindow.setPosition(pointPosition);
        infoWindow.setContent(mapClickInfoDiv);
        infoWindow.open(map);

        if ($(window).width()<=768) {
          map.panTo(pointPosition);
          map.panBy(0,-275);
        }else if($(window).width()>768){
          map.panTo(pointPosition);
          map.panBy(0,-150);
        }
      }
    }
  }else{
    geocoder.geocode({'location': pointPosition}, function(results, status) {
      if (status === 'OK') {
        if (results[0]) {
          $(addressMapClickInfo).html(results[0].formatted_address);
          infoWindow.setPosition(pointPosition);
          infoWindow.setContent(mapClickInfoDiv);
          infoWindow.open(map);
          // map.setCenter(pointPosition);

          if ($(window).width()<=768) {
            map.panTo(pointPosition);
            map.panBy(0,-275);
            imgMapClickInfo.style.display = "none";
            imgMapClickInfoDiv.style.height = "150px";
            imgMapClickInfoDiv.style.width = "200px";
          }else if($(window).width()>768){
            map.panTo(pointPosition);
            map.panBy(0,-150);
            imgMapClickInfo.style.display = "none";
            imgMapClickInfoDiv.style.height = "200px";
            imgMapClickInfoDiv.style.width = "250px";
          }

        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });

    // Inicio StreetView
    let sv = new google.maps.StreetViewService();

    sv.getPanorama({
      location: pointPosition,
      radius: 100
    }, function (data, status) {
      if (status === google.maps.StreetViewStatus.OK) {
        // OK
        // console.log(data);
        let streetViewPanoramaImg = new google.maps.StreetViewPanorama(imgMapClickInfoDiv,{
          position: pointPosition,
          // pov: {heading: 165, pitch: 0},
          streetViewControl: false,
          panControl: false,
          zoomControl: false,
          addressControl:false,
          fullscreenControl:false,
          linksControl:false,
          motionTracking: false,
          motionTrackingControl: false
        });
      } else {
        $(imgMapClickInfoDiv).css("text-align","center").html("En este punto no hay imagen disponible de Street View. Intenta mas cerca de una calle");
        errorImg = document.createElement('i');
        errorImg.classList.add('fas');
        errorImg.classList.add('fa-image');
        errorImg.style.fontSize = '150px';
        errorImg.style.color = 'black';
        imgMapClickInfoDiv.appendChild(errorImg);
        // window.alert("En este punto no se encontró un StreetView disponible");
        // console.log("no hay"); Si funciona
          // error or no results
      }
    });
  } //Fin StreetView

  // JS MediaScreen
  if ($(window).width()<=768) {
    mapClickInfoDiv.style.display = 'inline';
    leftMapClickInfoDiv.style.width = '100%';
    rightSideMapClickInfoDiv.style.width = '100%';
    rightSideMapClickInfoDiv.style.height = '250px';
  }else if($(window).width()>768){
    // rightSideMapClickInfoDiv.style.width = '100%';
    // rightSideMapClickInfoDiv.style.height = '250px';
  }
}

function SetLocationText(){
  let routeLocationInput = $("#routeLocationText").val();
  geocoder = new google.maps.Geocoder;
  // let postalCodes = ['4030000', '4100000', '4190000', '4170000'];
  // Con Postal Code Solo Conce pq las demas ciudades tienen otro codigo(talcahuano coronel etc etc)
  // componentRestrictions: {country: 'CL', postalCode: '4030000'}
  geocoder.geocode( { 'address': routeLocationInput, 'bounds': ConcepcionBounds, componentRestrictions: {country: 'CL'}}, function(results, status) {
    if (status == 'OK') {
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location,
          title: 'Origen',
          label: 'O'
      });
      // deleteMarkers();
      if(markers.origin){
        // console.log(markers.origin);
        markers.origin.setMap(null);
        markers.origin = null;
      }
      markers.origin = marker;
      // markers.push(marker);
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function getPlaceInfo(event){
  let service = new google.maps.places.PlacesService(map);
  if(event.placeId){
    // event.stop(); // Y esto que hace aqui?
    // console.log(event.placeId);
    // console.log(event);
    let placeRequest = {
      placeId: event.placeId,
      fields: ['name', 'rating', 'formatted_address', 'formatted_phone_number', 'opening_hours', 'website', 'url']
    };
    service.getDetails(placeRequest, callback);

    function callback(place, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        // console.log(place);
        $("#placeInfoText").html("");
        if (place.name) {
          $("<p></p>").text("Nombre: "+place.name).appendTo($("#placeInfoText"));
        }
        if (place.formatted_address) {
          $("<p></p>").text("Dirección: "+place.formatted_address).appendTo($("#placeInfoText"));
        }
        if (place.rating) {
          $("<p></p>").text("Rating/Valuación(1 - 5): "+place.rating).css("font-weight","bold").appendTo($("#placeInfoText"));
        }
        if (place.formatted_phone_number) {
          $("<p></p>").text("Número Telefónico: "+place.formatted_phone_number).appendTo($("#placeInfoText"));
        }
        if (place.website) {
          let websiteAppenddivTag = $("<div></div>").css("text-align","center").text("Website: ");
          let websiteAppendaTag = $("<a></a>").attr("href",place.website).text(place.website);
          websiteAppendaTag.appendTo(websiteAppenddivTag);
          websiteAppenddivTag.appendTo($("#placeInfoText"));
        }
        if (place.opening_hours) {
          $("<p></p>").text("Horario:").appendTo($("#placeInfoText"));
          for (let i = 0; i < place.opening_hours.weekday_text.length; i++) {
            $("<p></p>").text(place.opening_hours.weekday_text[i]).appendTo($("#placeInfoText"));
          }
        }
        if (place.url) {
          let urlAppenddivTag = $("<div></div>").css("text-align","center").text("Referencia: ");
          let urlAppendaTag = $("<a></a>").attr("href",place.url).text(place.url);
          urlAppendaTag.appendTo(urlAppenddivTag);
          urlAppenddivTag.appendTo($("#placeInfoText"));
        }

        mostrar('placeInfoDiv');
      }
    }
  }else {
    $("<p></p>").text("Esta función solo esta disponible para los lugares designados en el mapa con un simbolo").appendTo($("#placeInfoText"));
    mostrar('placeInfoDiv');
    // console.log("not found");
  }
}

function SetLocationMarker(pos){
  if (pos) {
    geocoder = new google.maps.Geocoder;
    geocoder.geocode({'location': pos}, function(results, status) {
      if (status === 'OK') {
        if (results[0]) {
          let marker = new google.maps.Marker({
            position: pos,
            map: map,
            title: 'Origen',
            label: 'O'
          });
          let locationAddress = results[0].formatted_address;
          $("#routeLocationText").val(locationAddress);
          if(markers.origin){
            // console.log(markers.origin);
            markers.origin.setMap(null);
            markers.origin = null;
          }
          markers.origin = marker;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }else{
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        let geoPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        geocoder = new google.maps.Geocoder;
        geocoder.geocode({'location': geoPos}, function(results, status) {
          if (status === 'OK') {
            if (results[0]) {
              let marker = new google.maps.Marker({
                position: geoPos,
                map: map,
                title: 'Origen',
                label: 'O'
              });
              let locationAddress = results[0].formatted_address;
              $("#routeLocationText").val(locationAddress);
              if(markers.origin){
                // console.log(markers.origin);
                markers.origin.setMap(null);
                markers.origin = null;
              }
              markers.origin = marker;
            } else {
              window.alert('No results found');
            }
          } else {
            window.alert('Geocoder failed due to: ' + status);
          }
        });
      });
    }
  }
}

function SetDestinationText(){
  let routeDestinationInput = $("#routeDestinationText").val();
  geocoder = new google.maps.Geocoder;
  // Con Postal Code Solo Conce pq las demas ciudades tienen otro codigo(talcahuano coronel etc etc)
  // componentRestrictions: {country: 'CL', postalCode: '4030000'}
  geocoder.geocode( { 'address': routeDestinationInput, 'bounds': ConcepcionBounds, componentRestrictions: {country: 'CL'}}, function(results, status) {
    if (status == 'OK') {
      map.setCenter(results[0].geometry.location);
      let marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location,
          title: 'Destino',
          label: 'D'
      });
      // deleteMarkers();
      if(markers.destination){
        // console.log(markers.destination);
        markers.destination.setMap(null);
        markers.destination = null;
      }
      markers.destination = marker;
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function SetDestinationMarker(pos){
  geocoder = new google.maps.Geocoder;
  geocoder.geocode({'location': pos}, function(results, status) {
    if (status === 'OK') {
      if (results[0]) {
        let marker = new google.maps.Marker({
          position: pos,
          map: map,
          title: 'Destino',
          label: 'D'
        });
        let destinationAddress = results[0].formatted_address;
        $("#routeDestinationText").val(destinationAddress);
        if(markers.destination){
          // console.log(markers.destination);
          markers.destination.setMap(null);
          markers.destination = null;
        }
        markers.destination = marker;
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });
}


// Esta funcion ya no sirve, recibia el click para poner un destino en el menu de ruta/filtro
// function SetDestinationMarker() {
//   // map.setOptions({draggableCursor: 'url(map-marker-alt-solid.png.cur) 16 16, default;' });
//   // map.setOptions({ draggableCursor: 'url(map-marker-alt-solid.svg) 16 16, default' });
//   // map.setOptions({ draggableCursor: 'url(http://78.media.tumblr.com/avatar_91989eab746d_96.png) 16 16, default' });
//   let rightClickListener = map.addListener('rightclick', function(){
//     google.maps.event.removeListener(listener);
//     map.setOptions({draggableCursor:'auto'});
//     // google.maps.event.stopImmediatePropagation(listener);
//     google.maps.event.removeListener(rightClickListener);
//   });
//
//   let listener = map.addListener('click', function(event) {
//     let pointPosition = {
//       lat:event.latLng.lat(),
//       lng:event.latLng.lng()
//     };
//
//     geocoder = new google.maps.Geocoder;
//     geocoder.geocode({'location': pointPosition}, function(results, status) {
//       if (status === 'OK') {
//         if (results[0]) {
//           var marker = new google.maps.Marker({
//             position: pointPosition,
//             map: map,
//             title: 'Destino',
//             label: 'D'
//           });
//           let destinationAddress = results[0].formatted_address;
//           $("#routeDestinationText").val(destinationAddress);
//           deleteMarkers();
//           markers.push(marker);
//           infoWindow.setContent(destinationAddress);
//           infoWindow.open(map, marker);
//         } else {
//           window.alert('No results found');
//         }
//       } else {
//         window.alert('Geocoder failed due to: ' + status);
//       }
//     });
//
//     google.maps.event.removeListener(listener);
//     map.setOptions({draggableCursor:'auto'});
//   });
// }

function GenerateRoute(directionsService, directionsDisplay, infoWindow){

  // if(!$("#routeLocationText").val()){
  //   infoWindow.setPosition(map.getCenter());
  //   infoWindow.setContent('Debe ingresar un inicio');
  //   infoWindow.open(map);
  // }else if(!$("#routeDestinationText").val()){
  //   infoWindow.setPosition(map.getCenter());
  //   infoWindow.setContent('Debe ingresar un destino');
  //   infoWindow.open(map);
  // }else{
  //   console.log("si le damos !");
  // }

  if(!(markers.origin)){
    infoWindow.setPosition(map.getCenter());
    infoWindow.setContent('Debe ingresar un inicio válido');
    infoWindow.open(map);
  }else if(!markers.destination){
    infoWindow.setPosition(map.getCenter());
    infoWindow.setContent('Debe ingresar un destino válido');
    infoWindow.open(map);
  }else{
    let rangeInputOption = $("#routeRangeInput").val();
    // if(markers.length>1){markers.pop()}  // para evitar que se marque un pin de Origen encima del pin A de la ruta
    switch (rangeInputOption) {
      case "1":
      console.log("1");
      GenerateTouristicRoute(directionsService, directionsDisplay);
      break;

      case "2":
      console.log("2");
      GenerateSemiTouristicRoute(directionsService, directionsDisplay);
      break;

      case "3":
      console.log("3");
      GenerateDefaultRoute(directionsService, directionsDisplay);
      break;

      case "4":
      console.log("4");
      GenerateSemiFastRoute(directionsService, directionsDisplay);
      break;

      case "5":
      GenerateFastRoute(directionsService, directionsDisplay);
      break;

      default:
      break;
    }
  }
}

/*Desde aqui empiezan las funciones para la ruta Turistica*/
function GenerateTouristicRoute(directionsService, directionsDisplay){
   if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
     let pos = {
        lat: markers.origin.position.lat(),
        lng: markers.origin.position.lng()
      };
      let ptomedio = {
        lat: ((pos.lat+markers.destination.position.lat())/2),
        lng: ((pos.lng+markers.destination.position.lng())/2)
      };
      p_start=pos;
      p_end=markers.destination.position;
      let distance = Math.sqrt(Math.pow((pos.lat-ptomedio.lat),2)+Math.pow((pos.lng-ptomedio.lng),2));
      searchPlacesTour(ptomedio,(distance)*100/0.0013507214378515806);//100 metros equivalen a esa distancia en coordenadas

    });
  }


}
function searchPlacesTour(ptomedio, distance){
      var service = new google.maps.places.PlacesService(map);
      service.nearbySearch({
        location: ptomedio,
        radius: distance,
        //radius: google.maps.geometry.spherical.computeDistanceBetween(pos, markers[0].position),
        type: ['museum','amusement_park','zoo','stadium','mosque','park']
      },callbackTour);
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        GenerateFastRoute(directionsService,directionsDisplay);

      }

}
function callbackTour(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        var auxplace = {lat: results[i].geometry.location.lat(), lng: results[i].geometry.location.lng()};
        var obj = {
        location: auxplace,
        stopover: true
      };
      tourPlaces.push(obj);


    }
    if(results.length==0){//console.log("aqui llamo a la rapida");
    }else{
      SortByDist(20);
      GeneraRutaTour();
    }
  }
}

/*Aqui termina las funciones de la ruta turistica*/

/*Aqui empieza las funciones SemiTouristic*/
function GenerateSemiTouristicRoute(directionsService, directionsDisplay){
   if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      let pos = {
        lat: markers.origin.position.lat(),
        lng: markers.origin.position.lng()
      };
      let ptomedio = {
        lat: ((pos.lat+markers.destination.position.lat())/2),
        lng: ((pos.lng+markers.destination.position.lng())/2)
      };
      p_start=pos;
      p_end=markers.destination.position;
      let distance = Math.sqrt(Math.pow((pos.lat-ptomedio.lat),2)+Math.pow((pos.lng-ptomedio.lng),2));
      searchPlacesSemiTour(ptomedio,(distance)*100/0.0013507214378515806);//100 metros equivalen a esa distancia en coordenadas
    });
  }
}
function searchPlacesSemiTour(ptomedio, distance){
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location: ptomedio,
    radius: distance,
    type: ['museum','amusement_park','zoo','stadium','mosque','park']
  },callbackSemiTour);
  if (status !== google.maps.places.PlacesServiceStatus.OK) {
    GenerateFastRoute(directionsService,directionsDisplay);
  }
}
function callbackSemiTour(results, status) {
  tourPlaces=[];
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var auxplace = {lat: results[i].geometry.location.lat(), lng: results[i].geometry.location.lng()};
      var obj = {
        location: auxplace,
        stopover: true
      };
      tourPlaces.push(obj);
    }
    if(results.length==0){console.log("aqui llamo a la rapida");
    }else{
    SortByDist(15);
    GeneraRutaTour();
    }
  }
}

function GenerateDefaultRoute(directionsService, directionsDisplay){

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      let pos = {
        lat: markers.origin.position.lat(),
        lng: markers.origin.position.lng()
      };
      let ptomedio = {
        lat: ((pos.lat+markers.destination.position.lat())/2),
        lng: ((pos.lng+markers.destination.position.lng())/2)
      };
      p_start=pos;
      p_end=markers.destination.position;
      let distance = Math.sqrt(Math.pow((pos.lat-ptomedio.lat),2)+Math.pow((pos.lng-ptomedio.lng),2));
      searchPlacesDefault(ptomedio,(distance)*100/0.0013507214378515806);//100 metros equivalen a esa distancia en coordenadas
    });
  }
}

function searchPlacesDefault(ptomedio, distance){
  console.log("Entre a la default");
  var service = new google.maps.places.PlacesService(map);
  console.log(ptomedio);
  console.log(distance);
  service.nearbySearch({
    location: ptomedio,
    radius: distance,
    type: ['museum','amusement_park','zoo','stadium','mosque','park']
  },callbackDefault);

  if (status !== google.maps.places.PlacesServiceStatus.OK) {
    GenerateFastRoute(directionsService,directionsDisplay);
  }
}

function callbackDefault(results, status) {
  tourPlaces=[];
  console.log(results.length);
  console.log("Llegue al callback");
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var auxplace = {lat: results[i].geometry.location.lat(), lng: results[i].geometry.location.lng()};
      var obj = {
        location: auxplace,
        stopover: true
      };
      tourPlaces.push(obj);
    }
    console.log(tourPlaces.length);
    if(results.length==0){console.log("aqui llamo a la rapida");
    }else{
    SortByDist(10);
    GeneraRutaTour();
    }
  }
}

function GenerateSemiFastRoute(directionsService, directionsDisplay){
    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      let pos = {
        lat: markers.origin.position.lat(),
        lng: markers.origin.position.lng()
      };
      let ptomedio = {
        lat: ((pos.lat+markers.destination.position.lat())/2),
        lng: ((pos.lng+markers.destination.position.lng())/2)
      };
      p_start=pos;
      p_end=markers.destination.position;
      let distance = Math.sqrt(Math.pow((pos.lat-ptomedio.lat),2)+Math.pow((pos.lng-ptomedio.lng),2));
      searchPlacesSemiFast(ptomedio,(distance)*100/0.0013507214378515806);//100 metros equivalen a esa distancia en coordenadas
    });
  }
}

function searchPlacesSemiFast(ptomedio, distance){
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location: ptomedio,
    radius: distance,
    type: ['museum','amusement_park','zoo','stadium','mosque','park']
  },callbackSemiFast);
  if (status !== google.maps.places.PlacesServiceStatus.OK) {
    GenerateFastRoute(directionsService,directionsDisplay);
  }
}

function callbackSemiFast(results, status) {
  tourPlaces=[];
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var auxplace = {lat: results[i].geometry.location.lat(), lng: results[i].geometry.location.lng()};
      var obj = {
        location: auxplace,
        stopover: true
      };
      tourPlaces.push(obj);
    }
    if(results.length==0){console.log("aqui llamo a la rapida");
    }else{
    SortByDist(5);
    GeneraRutaTour();
    }
  }
}

function GenerateFastRoute(directionsService, directionsDisplay){
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      let pos = {
        lat: markers.origin.position.lat(),
        lng: markers.origin.position.lat()
      };
      directionsDisplay.setMap(map);
      directionsService.route({
        origin: markers.origin.position,
        destination: markers.destination.position,
        travelMode: 'WALKING',
      }, function(response, status) {
        if (status === 'OK') {
          clearMarkers();
          let marker = new google.maps.Marker({
            position: pos,
            map: map,
            title: 'Origen',
            label: 'O'
          });
          if(marker&&markers.length<2){
            markers.push(marker);
          }
          clearMarkers();
          ToggleFilterOptions();
          directionsDisplay.setDirections(response);
          let distanceRoute=0;
          for (var i = 0; i < response.routes[0].legs.length; i++) {
            distanceRoute+=response.routes[0].legs[i].distance.value;
          }
          totalDistanceRoute=distanceRoute/1000;
          controversialInRoute(response);
          console.log("Fast: "+ totalDistanceRoute);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
    });
  }
}

function SortByDist(n){
  //n es la cantidad de lugares que deseo visitar
  n = parseInt(n);
  console.log("debo usar : "+n+ "llegaron: "+tourPlaces.length);
  console.log(tourPlaces.length.valueOf()-n.valueOf());
  var next=p_start;
  var minimo;
  while(tourPlaces.length>n){
    tourPlaces.pop();
    console.log("saque");
  }
  console.log("Quedaron: "+tourPlaces.length);
  
}

function GeneraRutaTour(){

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      let pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      directionsDisplay.setMap(map);
      directionsService.route({
        origin: markers.origin.position,
        destination: markers.destination.position,
        waypoints: tourPlaces,
        optimizeWaypoints: true,
        travelMode: 'WALKING',
      }, function(response, status) {
        if (status === 'OK') {
          clearMarkers();
          deleteMarkers();
          ToggleFilterOptions();
          directionsDisplay.setDirections(response);
          let distanceRoute=0;
          for (var i = 0; i < response.routes[0].legs.length; i++) {
            distanceRoute+=response.routes[0].legs[i].distance.value;
          }
          totalDistanceRoute=distanceRoute/1000;
          console.log("tour: "+totalDistanceRoute);
          controversialInRoute(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
    });
  }
}

function controversialInRoute(response){
  for (var i = 0; i < cityCircles.length; i++) {
    cityCircles[i].setMap(null);
  }
  cityCircles=[];
  let opcion="recuperar_puntos_conflictivos";
  $.ajax({
    type:"POST",
    url:"./funcionesIndex.php",
    data:{
      "opcion":opcion
    },
    success:function(info){
      // console.log(info);
      let data=[];
      data=JSON.parse(info);
      if(data){
         //console.log(info);
        for (var i = 0; i < data.length; i++) {
          console.log(data);
          let pto_conflictivo = {
            lat: Number(data[i].lat),
            lng: Number(data[i].lng)
          };
          for (var j = 0; j < response.routes[0].legs.length; j++) {
            a = response.routes[0].legs[j].start_location;
            let distance = Math.sqrt(Math.pow((a.lat()-pto_conflictivo.lat),2)+Math.pow((a.lng()-pto_conflictivo.lng),2));
            
            if(distance<0.0013507214378515806){
              if(data[i].tipo_punto_conflictivo=="no pasar"){
                  var cityCircle = new google.maps.Circle({
                  strokeColor: '#FF0000',
                  strokeOpacity: 0.8,
                  strokeWeight: 1,
                  fillColor: '#FF0000',
                  fillOpacity: 0.35,
                  map: map,
                  center: pto_conflictivo,
                  radius: 50
                });
              }else{
                  var cityCircle = new google.maps.Circle({
                  strokeColor: 'yellow',
                  strokeOpacity: 0.8,
                  strokeWeight: 1,
                  fillColor: 'yellow',
                  fillOpacity: 0.35,
                  map: map,
                  center: pto_conflictivo,
                  radius: 50
                });
              }
              cityCircles.push(cityCircle);
            }
          }
          
        }
      }else{
        console.log("no hay datos");
      }
    },error:function(info){
      console.log(info);
    }
  });
}

function setMapOnAll(map, markers) {
  if(markers){
    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }
}

function clearMarkers() {
  setMapOnAll(null, markers);
}

function showMarkers() {
  setMapOnAll(map, markers);
}

function deleteMarkers() {
  if(markers.length!=0){
    clearMarkers();
    markers.length = 0;
    markers = [];
  }
}


//-------------------------Funciones exclusivas de Estilo-------------------------------

// Muestra la ventana modal con el ID especificado
function mostrar(id) {
    console.log("debería mostrar");
    document.getElementById(id).style.visibility = 'visible';
}

// Oculta la ventana modal con el ID especificado
function ocultar(id) {
    console.log("debería ocultar");
    document.getElementById(id).style.visibility = 'hidden';
}

// Cierre de sesión
function salida(id) {
    document.location.href = 'logout.php';
}

//Al presionar el icono de las 3 barras se despliega y/o al presionar el body oculta el menu
$('#iBarra').click(function(event) {
    if($(this).data('clicked') == 'no') {
        $("#lista").show();
        $(this).data('clicked', 'yes');
    } else {
        $("#lista").hide();
        $(this).data('clicked', 'no');
    }
    event.stopPropagation();
});

$('body').click(function() {
    if($('#lista').is(":visible") && $("#iBarra").data('clicked') == 'yes') {
        $('#lista').hide();
        $("#iBarra").data('clicked', 'no');
    }
});


//Muestra datos o los oculta
function mostrarClick(id1, id2, id3, id4) {
  console.log(id2);
  console.log($(document.getElementById(id1)).data('clicked'));
  if($(document.getElementById(id1)).data('clicked') == 'no') {
    console.log("Entra al no");
      document.getElementById(id2).style.display = 'block';
      document.getElementById(id4).style.display = 'block';
      document.getElementById(id3).style.display = 'none';
      //$(document.getElementById(id2)).show();
      $(document.getElementById(id1)).data('clicked', 'yes');
  } else {
    console.log("Entra al no");
      document.getElementById(id2).style.display = 'none';
      document.getElementById(id4).style.display = 'none';
      document.getElementById(id3).style.display = 'block';
      //$(document.getElementById(id2)).hide();
      $(document.getElementById(id1)).data('clicked', 'no');
  }
}


// comprueba que el usuario ingreso los datos bien en sugerencia
function alertaSugerencia() {
    if(document.getElementById("descripcion").value == '' || document.getElementById("tipodeServicio").value == ''){

        mostrar("mCampos");
        return false;
    }
    return true;
}
// Al enviar una sugerencia de recomendacion se invoca esta funcion
// tiene como proposito mostrar una ventana que indique que fue enviada con exito la recomendacion
function avisoSugEnviada() {
    if(alertaSugerencia()) {
      var opcion = "sugRec";
      var descripcion = document.getElementById("descripcion").value;
      var tipodeServicio = document.getElementById("tipodeServicio").value;
      var datos = "&opcion=" + "sugRec" + "&descripcion=" + descripcion + "&tipodeServicio=" + tipodeServicio;
        $.ajax({
            type:"POST",
            url:"hermes.php",
            data: datos,
            success:function(info){
                console.log("se envio\n");
                ocultar("mSugerirRecomendacion");
                mostrar("mSugerenciaEnviada");
            },
            error:function(info){
                console.log("no se envio\n");
                console.log(tipodeServicio);
                console.log(opcion);
                console.log(descripcion);

            }
        });
    }
}

var nota = 0;
// Al hacer click en algun elemento que tenga como clase "iStars"
$('.iStars').click(function() {
    // Obtiene el valor de la estrella seleccionada y la guarda
    nota = $(this).attr('value');
    pintaEstrellas(nota);

});


function pintaEstrellas(nota) {
  // Toma todos los elementos que tengan clase ".iStars" y los guarda
    var matches = document.querySelectorAll(".iStars");
    // Pinta solo de amarillo las estrellas cuyos valores sean menores o igual a la estrella seleccionada
    for (var i = 0, l = matches.length; i < l; i++) {
        if(matches[i].getAttribute("value") <= nota) {
            $(matches[i]).css('color', '#f1c40f');
        }
        if(matches[i].getAttribute("value") > nota) {
            $(matches[i]).css('color', '#2c3e50');
        }
    }
}


// Comprueba que el usuario ingreso bien los datos en califica
function alertaCalifica() {
    if(document.getElementById("tipoServicio").value == '' || nota == 0){
        mostrar("mCampos");
        return false;
    }
    return true;
}

// Al enviar una calificacion se invoca esta funcion
// tiene como proposito mostrar una ventana que indique que fue enviada con exito una calificacion
function avisoCalifEnviada() {
    if(alertaCalifica()) {
        $.ajax({
            type:"POST",
            url:"hermes.php",
            data:{
                "opcion": "califica",
                "tipoServicio": document.getElementById("tipoServicio").value,
                "nota": nota,
            },
            success:function(){
                console.log("se envio la calificacion\n");
                mostrar("mCalifEnviada");
                ocultar("mCalificar");
                limpiaCalifica();
            },
            error:function(){
                console.log("no se envio\n");
            }
        });
    }
}

function limpiaCalifica() {
  document.getElementById("tipoServicio").selectedIndex = 0;
  pintaEstrellas(-1);
  var matches = document.querySelectorAll(".starActual");
    for (var i = 0, l = matches.length; i < l; i++) {
      $(matches[i]).css('color', '#23383f');
    }
}


//valida contraseña
function validaPass(pass) {
    if(pass.length < 8 || pass.length > 20) return false;
    return true;
}


//valida nombre y apellido
function validaCadena(cadena) {
    if(cadena.length > 0 && cadena.length < 21) {
        var regex = /[A-Za-zÑñáéíóúÁÉÍÓÚ]/;
        return regex.test(cadena);
    }
    return false;

}


//Funcion que gestiona la modificacion de datos
$(document).ready(function(){
    $("#boton_modifica").on('click',function(){
        var datos = "";
        var error = false;
        var nomb = document.getElementById("nombre_modifica").value;
        var ap = document.getElementById("apellido_modifica").value;
        var genero = $("input[name=genero]:checked").val();
        var peso = document.getElementById("peso").value;

        var pesoBien = peso > 0 && peso < 1000 ? true : false;

        var categoria = document.getElementById("categoria").value;

        var c1 = document.getElementById("c1").value;

        if(nomb !== "") {
            if(validaCadena(nomb)) datos += "&nombre=" + nomb;
            else error = true;
        }

        if(ap !== "") {
            if(validaCadena(ap)) datos += "&apellido=" + ap;
            else error = true;
        }

        if(typeof genero !== 'undefined') datos += "&genero=" + genero;

        //probar
        if(peso !== "") {
            if(pesoBien) datos += "&peso=" + peso;
            else error = true;
        }

        if(categoria !== "") datos += "&categoria=" + categoria;

        if(c1 !== "") {
            if(validaPass(c1)) datos += "&contrasenia=" + c1;
            else error = true;
        }

        console.log(nomb + " " + ap + " " + genero + " " + peso + " " + categoria + " " + " " + c1);
        console.log("\n" + datos);

        if(!error) { // Si no hay errores de ingreso
            if(datos !== "") {
                datos += "&opcion=" + "modifica";
                $.ajax({
                    type: "POST",
                    url: "hermes.php",
                    data: datos,
                    success:function() {
                      mostrar("mModificarExitoso");
                      $( "#cambiaDatos" ).click(function() {
                        location.reload();
                      });
                    }, error:function() {
                        mostrar("mErrorServ");
                    }
                });

            }
        } else {
            mostrar("mCamposMalos");
        }
      });
});

$('#tipoServicio').change(function() {
  console.log("change");
  var valor = document.getElementById('tipoServicio').value;
  var datos = "&opcion=" + "calificacionActual" + "&valor=" + valor;
  $.ajax({
    type: "POST",
    url: "hermes.php",
    data: datos,
    dataType: "html",
    success:function(dato) {
      $("#estrellasNotaActual").html(dato);
    }, error: function() {
      console.log("error");
    }
  });
});


// Gestiona la subida de imagen de perfil del usuario
$(document).ready(function (e) {
  $("#ff").on('submit',(function(e) {
    e.preventDefault();
    var fd = new FormData(this);
    fd.append("opcion", "subefoto");
    $.ajax({
      url: "hermes.php",
      type: "POST",
      data: fd, // Data enviada al servidor
      contentType: false,       // El tipo de contenido usado cuando se envia datos al servidor
      cache: false,             // To unable request pages to be cached
      processData:false,        // To send DOMDocument or non processed data file it is set to false
      success: function(data) {
        switch(data) {
          case "1":
            //La imagen es mayor a 500KB
            console.log("entra 1");
            mostrar("mErrorImgSize");
            break;
          case "2":
            //No es una imagen
            mostrar("mErrorImgFormat");
            console.log("entra 2");
            break;
          case "3":
            //Exito
            console.log("entra 3");
            location.reload();
            break;
          case "4":
            console.log("entra 4");
            mostrar("mErrorServ");
        }
      }
    });
  }));
});
