let map;
let markers = [];
let controversialMarkers = [];
let favoriteMarkers = [];
let infoWindow;
let geocoder;
const ConcepcionLatLng = {lat: -36.82699, lng: -73.04977};
var tourPlaces=[];
let p_start,p_end;
let directionsDisplay,directionsService;
let totalDistanceRoute;

// AIzaSyChbiyohYAY4lm-sC0us_k4RuzAo-yKTaQ localhost

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -36.82699, lng: -73.04977},
    zoom: 15,
    mapTypeControl: false,
    fullscreenControl: false
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      let pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      map.setCenter(pos);
    });
  }

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

}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

function CreateFavoriteAndReportControl(controlDiv){

  infoWindow = new google.maps.InfoWindow;

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

  const reportButtonDiv = document.createElement('div'); //reporte siempre visible
  reportButtonDiv.classList.add('reportButtonUI');
  reportButtonDiv.title = 'Reportar un punto conflictivo';

  const reportButtonIMG = document.createElement('i'); //img siempre visible
  reportButtonIMG.classList.add('reportButtonImg');
  reportButtonIMG.classList.add('fas');
  reportButtonIMG.classList.add('fa-flag');
  // reportButtonIMG.style.fontSize = '40px';
  reportButtonIMG.style.color = 'IndianRed';
  reportButtonIMG.style.cursor = 'pointer';

  reportButtonDiv.appendChild(reportButtonIMG);
  reportButtonUI.appendChild(reportButtonDiv);

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
    AddControversialPoint(infoWindow, this);
  });
  reportButtonSecondCategoryIMG.addEventListener('click', function() {
    AddControversialPoint(infoWindow, this);
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
    AddFavoritePlace(infoWindow);
  });

  controlDiv.appendChild(leftControlUI);
  controlDiv.appendChild(reportButtonCategories);

  //JS media query inicial
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
      $(reportButtonCategories).css("padding-top",'10px');
      $(reportButtonCategories).css("padding-bottom",'10px');
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

function AddFavoritePlace(infoWindow){
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
          console.log(info);
          infoWindow.setPosition(pos);
          infoWindow.setContent('Se ha agregado este lugar a sus favoritos');
          infoWindow.open(map);
          map.setCenter(pos);
          // let data=[];
          // data=JSON.parse(info);
          // if(data){
          //   console.log(info);
          // }else{
          //   console.log("error .....");
          // }
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

function AddControversialPoint(infoWindow, element){
  let category = element.getAttribute("name");
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
          console.log(info);
          infoWindow.setPosition(pos);
          infoWindow.setContent('Se ha reportado este punto. Gracias!');
          infoWindow.open(map);
          map.setCenter(pos);
          // let data=[];
          // data=JSON.parse(info);
          // if(data){
          //   console.log(info);
          // }else{
          //   console.log("error .....");
          // }
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

  routeDestinationText.addEventListener('change', SetDestinationText);

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
  // generateRouteButton.style.marginTop = '10px';
  // generateRouteButton.style.marginBottom = '5px';
  // generateRouteButton.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  // generateRouteButton.style.border = '2px solid';
  // generateRouteButton.style.borderRadius = '3px';
  generateRouteButton.style.textAlign = 'center';
  generateRouteButton.style.cursor = 'pointer';
  generateRouteButton.innerHTML = 'Generar';
  routeFilterControlUI.appendChild(generateRouteButton);

  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  infoWindow = new google.maps.InfoWindow;
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
          countFavoritePlaces();
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

function countFavoritePlaces(){
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
        // console.log(info);
        showFavoritePlaces(data);
      }else{
        console.log("no hay datos");
      }
    },error:function(info){
      console.log(info);
    }
  });
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
  }
}

function showFavoritePlaces(lugares_favoritos){
  let deleteButtonHtml = '<div class="deleteFavoritePlaceButtonDiv"><button class="deleteFavoritePlaceButton">Eliminar</button></div>';
  let deleteInfoWindow = new google.maps.InfoWindow();
  deleteInfoWindow.setContent(deleteButtonHtml);
  for(let i=0; i<lugares_favoritos.length; i++){
    let favoriteCoords = {lat:Number(lugares_favoritos[i].lat),lng:Number(lugares_favoritos[i].lng)};
    // console.log(favoriteCoords);
    let iconColor = "http://maps.google.com/mapfiles/ms/icons/green-dot.png";

    geocoder = new google.maps.Geocoder;
    geocoder.geocode({'location': favoriteCoords}, function(results, status) {
      if (status === 'OK') {
        if (results[0]) {
          var marker = new google.maps.Marker({
            position: favoriteCoords,
            map: map,
            title: results[0].formatted_address,
            icon: iconColor
          });
          favoriteMarkers.push(marker);

          google.maps.event.addListener(favoriteMarkers[i], 'click', function(){
            deleteInfoWindow.open(map, favoriteMarkers[i]);
            deleteFavoritePlace();
          });

        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
      }
    });
  }
}

function deleteFavoritePlace(){
  $(".deleteFavoritePlaceButton").click(function(event){
    // $(".deleteFavoritePlaceButton").off(event);
    console.log("test");
    // console.log(favoriteMarkers);
    event.stopImmediatePropagation();
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
    setMapOnAll(null, favoriteMarkers);
    favoriteMarkers.length = 0;
    favoriteMarkers = [];
  }
}

function hideBikeways(){
  console.log("hideBikeways");
}

function SetDestinationText() {
  // console.log($("#routeDestinationText").val());
  let routeDestinationInput = $("#routeDestinationText").val();
  geocoder = new google.maps.Geocoder;
  geocoder.geocode( { 'address': routeDestinationInput}, function(results, status) {
    if (status == 'OK') {
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location,
          title: 'Destino',
          label: 'D'
      });
      deleteMarkers();
      markers.push(marker);
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function SetDestinationMarker() {
  // map.setOptions({draggableCursor: 'url(map-marker-alt-solid.png.cur) 16 16, default;' });
  // map.setOptions({ draggableCursor: 'url(map-marker-alt-solid.svg) 16 16, default' });
  // map.setOptions({ draggableCursor: 'url(http://78.media.tumblr.com/avatar_91989eab746d_96.png) 16 16, default' });
  let rightClickListener = map.addListener('rightclick', function(){
    google.maps.event.removeListener(listener);
    map.setOptions({draggableCursor:'auto'});
    // google.maps.event.stopImmediatePropagation(listener);
    google.maps.event.removeListener(rightClickListener);
  });

  let listener = map.addListener('click', function(mapLocation) {
    let pointPosition = {
      lat:mapLocation.latLng.lat(),
      lng:mapLocation.latLng.lng()
    };

    geocoder = new google.maps.Geocoder;
    infoWindow = new google.maps.InfoWindow;
    geocoder.geocode({'location': pointPosition}, function(results, status) {
      if (status === 'OK') {
        if (results[0]) {
          var marker = new google.maps.Marker({
            position: pointPosition,
            map: map,
            title: 'Destino',
            label: 'D'
          });
          let destinationAddress = results[0].formatted_address;
          $("#routeDestinationText").val(destinationAddress);
          deleteMarkers();
          markers.push(marker);
          infoWindow.setContent(destinationAddress);
          infoWindow.open(map, marker);
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });

    google.maps.event.removeListener(listener);
    map.setOptions({draggableCursor:'auto'});
  });
}

function GenerateRoute(directionsService, directionsDisplay, infoWindow){

  if(!$("#routeDestinationText").val()){
    infoWindow.setPosition(map.getCenter());
    infoWindow.setContent('Debe ingresar un destino');
    infoWindow.open(map);
  }

  let rangeInputOption = $("#routeRangeInput").val();
  if(markers.length>1){markers.pop()}  // para evitar que se marque un pin de Origen encima del pin A de la ruta
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

/*Desde aqui empiezan las funciones para la ruta Turistica*/
function GenerateTouristicRoute(directionsService, directionsDisplay){
   if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      let pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      let ptomedio = {
        lat: ((pos.lat+markers[0].position.lat())/2),
        lng: ((pos.lng+markers[0].position.lng())/2)
      }
      p_start=pos;
      p_end=markers[0].position;
      let distance = Math.sqrt(Math.pow((pos.lat-ptomedio.lat),2)+Math.pow((pos.lng-ptomedio.lng),2));
      // console.log("new distance" + distance);
      // console.log("distancia: " +(distance)*125/0.0013507214378515806);
      // console.log(pos.lat + " <> " + pos.lng);
      // console.log(p_end.lat() + " = " + p_end.lng());
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
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      let ptomedio = {
        lat: ((pos.lat+markers[0].position.lat())/2),
        lng: ((pos.lng+markers[0].position.lng())/2)
      }
      p_start=pos;
      p_end=markers[0].position;
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
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      let ptomedio = {
        lat: ((pos.lat+markers[0].position.lat())/2),
        lng: ((pos.lng+markers[0].position.lng())/2)
      }
      p_start=pos;
      p_end=markers[0].position;
      let distance = Math.sqrt(Math.pow((pos.lat-ptomedio.lat),2)+Math.pow((pos.lng-ptomedio.lng),2));
      searchPlacesDefault(ptomedio,(distance)*100/0.0013507214378515806);//100 metros equivalen a esa distancia en coordenadas
    });
  }
}

function searchPlacesDefault(ptomedio, distance){
  var service = new google.maps.places.PlacesService(map);
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
    SortByDist(10);
    GeneraRutaTour();
    }
  }
}

function GenerateSemiFastRoute(directionsService, directionsDisplay){
    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      let pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      let ptomedio = {
        lat: ((pos.lat+markers[0].position.lat())/2),
        lng: ((pos.lng+markers[0].position.lng())/2)
      }
      p_start=pos;
      p_end=markers[0].position;
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
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      directionsDisplay.setMap(map);
      directionsService.route({
        origin: pos,
        destination: markers[0].position,
        travelMode: 'WALKING',
      }, function(response, status) {
        if (status === 'OK') {
          // clearMarkers();
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
          HideFilterOptions();
          directionsDisplay.setDirections(response);
          let distanceRoute=0;
          for (var i = 0; i < response.routes[0].legs.length; i++) {
            distanceRoute+=response.routes[0].legs[i].distance.value;
          }
          totalDistanceRoute=distanceRoute/1000;
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
  for (var i = 0; i < tourPlaces.length; i++) {
    var dmin=9999999999;
    for (var j = i; j < tourPlaces.length-1; j++) {
      let distancei = Math.sqrt(Math.pow((next.lat-tourPlaces[i].location.lat),2)+Math.pow((next.lng-tourPlaces[i].location.lng),2));
      let distancej = Math.sqrt(Math.pow((next.lat-tourPlaces[j].location.lat),2)+Math.pow((next.lng-tourPlaces[j].location.lng),2));
      if(distancej<dmin){
        minimo=j;
        dmin=distancej;
      }
    }
    var aux=tourPlaces[i];
    tourPlaces[i]=tourPlaces[minimo];
    tourPlaces[minimo]=aux;
    next={
      lat: tourPlaces[i].location.lat,
      lng: tourPlaces[i].location.lng
    };
  }
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
        origin: pos,
        destination: markers[0].position,
        waypoints: tourPlaces,
        optimizeWaypoints: true,
        travelMode: 'WALKING',
      }, function(response, status) {
        if (status === 'OK') {
          clearMarkers();
          deleteMarkers();
          HideFilterOptions();
          directionsDisplay.setDirections(response);
          let distanceRoute=0;
          for (var i = 0; i < response.routes[0].legs.length; i++) {
            distanceRoute+=response.routes[0].legs[i].distance.value;
          }
          totalDistanceRoute=distanceRoute/1000;
          console.log("tour: "+totalDistanceRoute);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
    });
  }
}

function HideFilterOptions(){
  const filterDiv = $(".newRouteFilterButton").children();
  for (let i = 1; i < filterDiv.length; i++) {
    $(filterDiv[i]).css("display","none");
  }
  $("#routeFilterToggle").parent().css("display","inline");
  $(filterDiv[0]).children().first().css("width", "60%");
  $(filterDiv[0]).children().first().css("text-align","right");

  $("#routeFilterToggle").click(function(event){
    $("#routeFilterToggle").off(event);
    $(filterDiv[1]).css("display","flex");
    $(filterDiv[2]).css("display","flex");
    $(filterDiv[3]).css("display","flex");
    $(filterDiv[4]).css("display","");
    $("#routeFilterToggle").parent().css("display","none");
    $(".newRouteFilterButton div div").first().css("width", "100%");
    $(".newRouteFilterButton div div").first().css("text-align","center");
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


// Al hacer click en algun elemento que tenga como clase "iStars"
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


// Elimina una fila de una tabla
$('body').on('click', '.trash', function () {
  mostrar('mEliminar');
  var $boton = $(this);
  console.log("hola" + $boton);
  $( "#eliminaRow" ).click(function() {

    var $row = $boton.closest("tr");   
    var $tds = $row.find("td");
    var elementos_fila = [];
    $.each($tds, function() {          
      elementos_fila.push($(this).text());
      console.log($(this));        
    });
    var datos = "&cod=" + elementos_fila[0] + "&opcion=" + "eliminaF";
    
    $.ajax({
      type: "POST",
      url: "hermes-admin.php",
      data: datos,
      success:function() {
        $row.fadeOut('slow');
       
      }, error:function() {
          mostrar("mErrorServ");
      }
    });
  
  });
});


// Marca como importante una sugerencia, moviendola de su tabla corresponidiente a la tabla de destacados
$('body').on('click', '.bkSugerencia', function () {
  var $row = $(this).closest("tr");   // Encuentra la <tr> mas cercana
  var $tds = $row.find("td");             // Encuentra todos los elementos <td>

  var elementos_fila = [];
  $.each($tds, function() {               // Visita cada elemento <td> 
    elementos_fila.push($(this).text());
    console.log($(this));        // Imprime el texto dentro de <td>
  });
  elementos_fila.pop();
  console.log(elementos_fila);

  var text = "<tr>";
  for(var i = 0; i < elementos_fila.length; i++) {
    text += "<td>" + elementos_fila[i] + "</td>";
  }
  var datos = "&cod=" + elementos_fila[0] + "&opcion=" + "bookmark";

  $.ajax({
    type: "POST",
    url: "hermes-admin.php",
    data: datos,
    dataType: "JSON",
    success:function(campos) {
      //Campos corresponde a un array PHP, por lo que es necesario retornar un json
      mostrar('mExitoGuardar');
      for(var i = 0; i < campos.length; i++) {
        text += "<td>" + campos[i] + "</td>";
      }
      text += "<td style='text-align: center;'><i class='fas fa-times desmarca' style='color:red;'></i></td><tr>";
      console.log(text);  
      $("#tablaDestacados tbody").append(text);
      $row.fadeOut('slow');
    }, error:function() {
      mostrar("mErrorServ");
    }
  });
});


// Desmarca una sugerencia, sacandola de la tabla destacados y mostrandola en su tabla correspondiente
$('body').on('click', '.desmarca', function () {
  var boton = $(this); 
  var $row = boton.closest("tr");   // encuentra el <tr> mas cercano a row
  var $tds = $row.find("td");             // encuentra todos los elementos <td> hijos

  var elementos_fila = [];
  $.each($tds, function() {               // Recorre cada elemento <td>
    elementos_fila.push($(this).text());  // Imprime el texto dentro del td
    console.log($(this));        
  });

  //Elimina accion, fecha_marca, correo y servicio
  var j = 0;
  while(j <= 3) {
    elementos_fila.pop();
    j++;
  }
  console.log(elementos_fila);

  var text = "<tr>";
  for(var i = 0; i < elementos_fila.length; i++) {
    text += "<td>" + elementos_fila[i] + "</td>";
  }
  text += "<td style='text-align: center;'><i class='far fa-bookmark bkSugerencia'>"
  + "</i><i class='fas fa-trash trash'></i></td>";
  var datos = "&cod=" + elementos_fila[0] + "&opcion=" + "deleteBookmark";

  $.ajax({
    type: "POST",
    url: "hermes-admin.php",
    data: datos,

    success:function(numTabla) {
      console.log(text);  
      console.log(numTabla);
      //Dependiendo del numTabla se designa a cual tabla se agregará la nueva fila  
      switch(numTabla) {
        case "2":
          $("#tablaSG tbody").append(text);   
          break;
        case "3":
          $("#tablaRutas tbody").append(text);   
          break;
        case "5":
          $("#tablaRec tbody").append(text);   
          break;
        case "6":
          $("#tablaIC tbody").append(text);   
          break;
        case "7":
          $("#tablaAy tbody").append(text);   

      }
      $row.fadeOut('slow');
      mostrar("mDesmarcada");
    }, error:function() {
      mostrar("mErrorServ");
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
      url: "hermes-admin.php", 
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