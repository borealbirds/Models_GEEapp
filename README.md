# **Models_GEEapp**

### **Visually-optimised GEE App for presenting the model raster (v2)**
🔗 [**View the Density Model v5**](https://bamdensitymap.projects.earthengine.app/view/densitymapv5visual)

#### **Drop-down menu options: 1.Species, 2.Year, 3.Band (1-5)**
---

### **Obsolete GEE App for presenting the model raster (v1), with time-series function**
🔗 [**Pixel Time-Series Chart Version**](https://diegowuulaval.users.earthengine.app/view/bamnationalmodel)

#### **Drop-down menu options: 1.Species, 2.Click and show time serise plot**
---

## 📌 **Or, you can load the rasters at your choice in GEE Code editor**
📌 Code Snippet to load and visualize a model in **Google Earth Engine - Code Editor**:

```javascript
// Replace 'TEWA' and '2010' with your species and year of interest.
var demoImage = ee.Image('projects/rnationalmodel/assets/TEWA_mosaic_2010')
                  .select([0]); // Selects the first band (population prediction)

// Display the raster on the map
Map.addLayer(demoImage, {min: 0, max: 1, palette: ['blue', 'green', 'red']}, 'Demo Raster');

// Zoom the map to North America
Map.setCenter(-98.5, 55, 4);
