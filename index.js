// The main script for the extension
// The following are examples of some basic extension functionality

//You'll likely need to import extension_settings, getContext, and loadExtensionSettings from extensions.js
//import { extension_settings, getContext, loadExtensionSettings } from "../../../extensions.js";

//You'll likely need to import some other functions from the main script
//import { saveSettingsDebounced } from "../../../../script.js";
import { loadMovingUIState } from '../../../power-user.js';
import { dragElement } from '../../../RossAscends-mods.js';
import { registerSlashCommand, executeSlashCommands } from "../../../slash-commands.js";

// Keep track of where your extension is located, name should match repo name
const extensionName = "SillyTavern-Map";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;
const currentLoadedMap= 'Japan.json'

function showMap() {
   	
	makeMovable();
		
    var MapPath = `${extensionFolderPath}/${currentLoadedMap}`;
	
	// Fetch the SVG data from a JSON file
    $.getJSON(MapPath, function(svgData) {
        initMap(svgData);
		toastr.info("Map loaded");
    }).fail(function() {
		toastr.info("Error loading Map data");
        console.error("Error loading Map data");
    });
}

/**
* Initial map setup
* - Creates background image
* - Creates interaction zones
**/
function initMap(svgData) {
    // Set the background image of the SVG container
    var svgElement = document.getElementById('svg-container');
    var imageElement = document.createElementNS("http://www.w3.org/2000/svg", "image");
    imageElement.setAttributeNS("http://www.w3.org/1999/xlink", 'xlink:href', svgData.backgroundImage.file);
    imageElement.setAttribute('x', '0');
    imageElement.setAttribute('y', '0');
    imageElement.setAttribute('width', svgData.backgroundImage.width);
    imageElement.setAttribute('height', svgData.backgroundImage.height);
    imageElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svgElement.appendChild(imageElement); 	
	
	// Update the viewBox attribute of the SVG
    $('#svg-container').attr('viewBox', '0 0 ' + svgData.backgroundImage.width + ' ' + svgData.backgroundImage.height);
	
	// Create and append each path to the SVG container
    svgData.shapes.forEach(function(shape) {
        var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", shape.path);
        path.setAttribute("id", shape.id);
        path.setAttribute("fill", "transparent"); // Set initial fill to transparent
        path.setAttribute("class", "svg-path");
        path.dataset.script = shape.script; // Store the shape script in a data attribute
		path.dataset.originalColor = shape.color; // Store the original color
        path.addEventListener('click', handleClick);
		
		// Add hover effects
        path.addEventListener('mouseover', function() {
            this.style.fill = addTransparency(this.dataset.originalColor, 0.3); // 30% opacity
        });
        path.addEventListener('mouseout', function() {
            this.style.fill = "transparent";
        });
				
        svgElement.appendChild(path);
    });
}


/**
 * Creates a new draggable container based on a template.
 * This function takes a template with the ID 'generic_draggable_template' and clones it.
 * The cloned element has its attributes set, a new child div appended, and is made visible on the body.
 * Additionally, it sets up the element to prevent dragging on its images.
 */
function makeMovable(id = "map") {

    console.debug('making new container from template')
    const template = $('#generic_draggable_template').html();
    const newElement = $(template);
    newElement.css('background-color', 'var(--SmartThemeBlurTintColor)');
    newElement.attr('forChar', id);
    newElement.attr('id', `${id}`);
    newElement.find('.drag-grabber').attr('id', `${id}header`);
    newElement.find('.dragTitle').text('Map')
    //add a div for the map
    newElement.append(`<div id="dragMap" class="container"><svg id="svg-container" viewBox="0 0 1000 1000"></svg></div>`);
    // add no-scrollbar class to this element
    newElement.addClass('no-scrollbar');	
	

    // get the close button and set its id and data-related-id
    const closeButton = newElement.find('.dragClose');
    closeButton.attr('id', `${id}close`);
    closeButton.attr('data-related-id', `${id}`);

    $(`#dragMap`).css('display', 'block');

    $('body').append(newElement);

    loadMovingUIState();
    $(`.draggable[forChar="${id}"]`).css('display', 'block');
    dragElement(newElement);

    $(`.draggable[forChar="${id}"] img`).on('dragstart', (e) => {
        console.log('saw drag on avatar!');
        e.preventDefault();
        return false;
    });

    $('body').on('click', '.dragClose', function () {
        const relatedId = $(this).data('related-id');  // Get the ID of the related draggable
        $(`#${relatedId}`).remove();  // Remove the associated draggable
    });
}

 // Function to handle click event
 function handleClick(event) {
     console.log(event.target.dataset.script); //debug information
	 executeSlashCommands(event.target.dataset.script);
 }

/**
 * Function to add transparent color
 * Used to demonstrate onHover events
 */
function addTransparency(color, opacity) {
    var R = parseInt(color.substring(1,3), 16);
    var G = parseInt(color.substring(3,5), 16);
    var B = parseInt(color.substring(5,7), 16);
    return "rgba(" + R + ", " + G + ", " + B + ", " + opacity + ")";
}

// This function is called when the extension is loaded
jQuery(async () => {
	const button = $(`
    <div id="map_start" class="list-group-item flex-container flexGap5">
        <div class="fa-solid fa-map" title="Load a new map"/></div>
        Open Map
    </div>`);

    $('#extensionsMenu').append(button);
	
	const settings = `
    <div class="map_settings">
        <div class="inline-drawer">
            <div class="inline-drawer-toggle inline-drawer-header">
                <b>Map Extension</b>
                <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
            </div>
            <div class="inline-drawer-content">
				<label for="mapSelectionPresets">Map Selection:</label>
                <div class="flex-container flexnowrap wide100p">
                    <select id="mapSelections" name="map-selection" class="flex1 text_pole">
                    </select>
                    <div id="map_load" class="menu_button menu_button_icon">
                        <div class="fa-solid fa-save"></div>
                        <span>Load Map</span>
                    </div>              
                </div>		
            </div>
        </div>
    </div>`;
		
  // Append settingsHtml to extensions_settings
  // extension_settings and extensions_settings2 are the left and right columns of the settings menu
  // Left should be extensions that deal with system functions and right should be visual/UI related 
  $("#extensions_settings2").append(settings);

  $("#map_load").on("click", showMap);  
});

// Registers a simple command for opening the map.
registerSlashCommand("show-map", showMapCommand, ["mp"], "– shows the map", true, true);  //todo: amend to support named map

function showMapCommand(args) {
    showMap();
}