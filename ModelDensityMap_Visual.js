////////////////////////////////////////////////////////////////////////////////////////////
// Define a dictionary of layers with asset paths, and
// Map visualization parameters
////////////////////////////////////////////////////////////////////////////////////////////
var layers = {
  //'OVEN': [
    //{ year: 1985, asset: 'projects/rnationalmodel/assets/OVEN_mosaic_1985' },
    //{ year: 1990, asset: 'projects/rnationalmodel/assets/OVEN_mosaic_1990' },
    //{ year: 1995, asset: 'projects/rnationalmodel/assets/OVEN_mosaic_1995' },
    //{ year: 2000, asset: 'projects/rnationalmodel/assets/OVEN_mosaic_2000' },
    //{ year: 2005, asset: 'projects/rnationalmodel/assets/OVEN_mosaic_2005' },
    //{ year: 2010, asset: 'projects/rnationalmodel/assets/OVEN_mosaic_2010' },
    //{ year: 2015, asset: 'projects/rnationalmodel/assets/OVEN_mosaic_2015' },
    //{ year: 2020, asset: 'projects/rnationalmodel/assets/OVEN_mosaic_2020' }
  //],
  'TEWA': [
    { year: 2010, asset: 'projects/rnationalmodel/assets/TEWA_mosaic_2010' },
    { year: 2015, asset: 'projects/rnationalmodel/assets/TEWA_mosaic_2015' }
  ],
  'VESP': [
    { year: 1985, asset: 'projects/rnationalmodel/assets/VESP_mosaic_1985' },
    { year: 2020, asset: 'projects/rnationalmodel/assets/VESP_mosaic_2020' }
  ],
  'YBFL': [
    { year: 1990, asset: 'projects/rnationalmodel/assets/YBFL_mosaic_1990' }
  ]
};
////////////////////////////////////////////////////////////////////////////////////////////
// Define best visualization ranges for different bands
////////////////////////////////////////////////////////////////////////////////////////////
var bandRanges = {
  '1': { min: 0.0, max: 0.2 },     // Best range for band 1, max 1.0 can show more depth
  '2': { min: 0.0, max: 5.0 },     // Best range for band 2
  '3': { min: 0.0, max: 1.0 },   // Best range for band 3
  '4': { min: 0, max: 10000000 }, // Best range for band 4
  '5': { min: 0, max: 5 },         // Best range for band 5
};
////////////////////////////////////////////////////////////////////////////////////////////
// Map center point and zoom level
Map.setCenter(-100, 58, 3.5); 

// Change the projection to Albers Equal Area for North America (EPSG:5070)
var projection = ee.Projection('EPSG:5070');

////////////////////////////////////////////////////////////////////////////////////////////
// Panel organisation
////////////////////////////////////////////////////////////////////////////////////////////
var panel = ui.Panel({
  style: { width: '400px' }
});
ui.root.add(panel);

panel.add(ui.Label({
  value: 'BAM bird density model v.5 Viewer',
  style: {
    fontSize: '18px', color: 'blue', fontWeight: 'bold' 
  }
}));

// Variables to track active species and images globally
var activeSpecies = null;
var activeYear = null;
var activeBand = null;

////////////////////////////////////////////////////////////////////////////////////////////
// Section 1 - Choose a species
// Create a list of items for the dropdown menu, displaying species codes
////////////////////////////////////////////////////////////////////////////////////////////
var title1 = ui.Label('Step 1: Select a species');
panel.add(title1);

// Dropdown menu for selecting layers
var speciesSelector = ui.Select({
  items: Object.keys(layers),
  placeholder: 'Select a species',
  onChange: function (species) {
    activeSpecies = species;
    activeYear = null;
    activeBand = null;

    // Reset UI
    yearSelector.items().reset([]);
    bandSelector.items().reset([]);
    Map.layers().reset();
    selectedAssetLabel.setValue('Asset name: Not selected');
    
    // Populate year dropdown
    var yearOptions = layers[species].map(function (layer) {
      return layer.year.toString();
    });

    yearSelector.items().reset(yearOptions);
  }
});
panel.add(speciesSelector);

////////////////////////////////////////////////////////////////////////////////////////////
// Step 2: Select a Year
////////////////////////////////////////////////////////////////////////////////////////////
panel.add(ui.Label('Step 2: Select a year'));

var yearSelector = ui.Select({
  placeholder: 'Select a year',
  onChange: function (year) {
    activeYear = parseInt(year);
    activeBand = null;

    // Reset band selector
    bandSelector.items().reset([]);
    selectedAssetLabel.setValue('Asset name: Not selected');

    // Populate band options (1-5)
    var bandOptions = ['1', '2', '3', '4', '5'];
    bandSelector.items().reset(bandOptions);
  }
});
panel.add(yearSelector);

////////////////////////////////////////////////////////////////////////////////////////////
// Step 3: Select a Band
////////////////////////////////////////////////////////////////////////////////////////////
panel.add(ui.Label('Step 3: Select a band (1-5)'));

var bandSelector = ui.Select({
  placeholder: 'Select a band',
  onChange: function (band) {
    activeBand = band;

    // Clear previous layers
    Map.layers().reset();

    // Find the selected layer
    var selectedLayer = layers[activeSpecies].filter(function (layer) {
      return layer.year === activeYear;
    })[0];  // Get the first matching item (since filter returns an array)

    if (selectedLayer) {
      var image = ee.Image(selectedLayer.asset).select(['b' + activeBand]);

      // Get appropriate min/max values for the selected band
      var range = bandRanges[activeBand];

      Map.addLayer(image, 
        { min: range.min, max: range.max, palette: ['#FFFF99', '#C2E699', '#78C679', '#31A354', '#006837'] },
        activeSpecies + ' - ' + activeYear + ' (Band ' + activeBand + ')'
      );
      // i try a more visible color palette: ['blue', 'green', 'yellow', 'red']
      selectedAssetLabel.setValue('Asset name: ' + selectedLayer.asset);
    }
  }
});
panel.add(bandSelector);

//////////////////////////////////////////////////////////////
panel.add(ui.Label(''));
var title4 = ui.Label('*Hint: type the location name above and fly there');
panel.add(title4);
var title5 = ui.Label('');
panel.add(title5);
////////////////////////////////////////////////////////////////////////////////////////////
// Section 3 - 
// Download link 1,2,3
////////////////////////////////////////////////////////////////////////////////////////////
var title6 = ui.Label('Last step: Download options');
panel.add(title6);

// Download link 1
var imageUrl1 = 'https://drive.google.com/drive/u/1/folders/1aJUZr4fACdD02H8AYejR2XG6zuA6E492';

var imageLink1 = ui.Label({
  value: '- through Google Drive:',
  style: {
    fontSize: '14px', color: 'blue',textAlign: 'center', textDecoration: 'underline'
  }
});

imageLink1.setUrl(imageUrl1); // Direct the label to the external image URL
panel.add(imageLink1);

// Download link 2
var imageUrl2 = 'https://github.com/borealbirds/BAMexploreR';

var imageLink2 = ui.Label({
  value: '- through R package (BAMexploreR):',
  style: {
    fontSize: '14px', color: 'blue', textAlign: 'center', textDecoration: 'underline'
  }
});

imageLink2.setUrl(imageUrl2); // Direct the label to the external image URL
panel.add(imageLink2);

// Download link 3 
var selectedAssetLabel = ui.Label('Asset name: Not selected');
panel.add(selectedAssetLabel);

var spacing = ui.Label('');
panel.add(spacing);

// Add a copyright label at the bottom of the panel
var copyrightLabel = ui.Label({
  value: 'Copyright by Boreal Avian Modelling Project (BAM)',
  style: {
    fontSize: '12px',
    textAlign: 'right',
    color: 'gray',
    margin: '10px auto'
  }
});
panel.add(copyrightLabel);

////////////////////////////////////////////////////////////////////////////////////////////
// Map manupulation:
// Optionally add the first layer by default (if needed)
////////////////////////////////////////////////////////////////////////////////////////////
var defaultSpeciesKey = Object.keys(layers)[0]; // Get the first species key (e.g., 'OVEN')
var defaultLayer = layers[defaultSpeciesKey][0]; // Get the first layer for the default species (1985 layer in this case)

// Add the default layer to the map
var defaultImage = ee.Image(defaultLayer.asset).select([0]); // Load the default raster layer
Map.addLayer(
  defaultImage,
  {
    //min: 0.0, 
    //max: 0.2, 
    palette: ['#FFFF99', '#C2E699', '#78C679', '#31A354', '#006837'] ,
    crs: projection.crs(), 
    crsTransform: projection.transform() 
  },
  defaultSpeciesKey + ' - ' + defaultLayer.year 
);
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
// Add a legend to explain the color ramp
////////////////////////////////////////////////////////////////////////////////////////////

// Create a panel for the legend
var legend = ui.Panel({
  style: {
    position: 'bottom-right',
    padding: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.7)'
  }
});

// Title of the legend
var legendTitle = ui.Label({
  value: 'Legend',
  style: {
    fontSize: '14px',
    fontWeight: 'bold',
    margin: '0px 0px 4px 0px'
  }
});
legend.add(legendTitle);

// Define color scale and labels
var colorPalette = ['#FFFF99', '#C2E699', '#78C679', '#31A354', '#006837'];
var labels = ['Low', '', '', '', 'High'];  // Adjust labels for clarity

// Create a row for each color
for (var i = 0; i < colorPalette.length; i++) {
  var colorBox = ui.Label({
    style: {
      backgroundColor: colorPalette[i],
      padding: '8px',
      margin: '2px',
      width: '20px',
      height: '20px'
    }
  });

  var textLabel = ui.Label({
    value: labels[i],
    style: {
      margin: '2px 8px',
      fontSize: '12px'
    }
  });

  // Add color and label as a row
  var legendRow = ui.Panel({
    widgets: [colorBox, textLabel],
    layout: ui.Panel.Layout.Flow('horizontal')
  });

  legend.add(legendRow);
}

// Add the legend to the map
Map.add(legend);
