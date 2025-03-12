# **Models_GEEapp**

### **Linked Map GEE App for presenting the model raster (v4)**
🔗 [**Linked Map Chart Version**](https://bamp-nationalmodel.projects.earthengine.app/view/bamdensitymodelv5linkedmap)

#### **Drop-down menu options: 'Species_Year' raster**
---

### **Split-panelled GEE App for presenting the model raster (v3)**
🔗 [**Split-panelled Chart Version**](https://bamp-nationalmodel.projects.earthengine.app/view/bamdensitymodelv5splitpanel)

#### **Drop-down menu options: 'Species_Year' raster**
---
### **Visually-optimised GEE App for presenting the model raster (v2)**
🔗 [**View the Density Model v5**](https://bamp-nationalmodel.projects.earthengine.app/view/bamdensitymodelv5visual)

#### **Drop-down menu options: 1.Species, 2.Year, 3.Band (1-5)**
---

### **Obsolete GEE App for presenting the model raster (v1), with time-series function**
🔗 [**Pixel Time-Series Chart Version**](https://diegowuulaval.users.earthengine.app/view/bamnationalmodel)

#### **Drop-down menu options: 1.Species, 2.Click and show time serise plot**
---

## 📌 **Or, you can load the rasters at your choice in GEE Code editor**
📌 Code Snippet to load and visualize a model in **Google Earth Engine - Code Editor**:

```javascript
// Replace 'BAWW' and '2020' with your species and year of interest.
var demoImage = ee.Image('projects/bamp-nationalmodel/assets/BAWW/BAWW_mosaic_2020')
                  .select([0]); // Selects the first band (population prediction)

// Display the raster on the map
Map.addLayer(demoImage, {min: 0, max: 0.2, palette: ['blue', 'green', 'yellow', 'red']}, 'Demo Raster');

// Zoom the map to North America
Map.setCenter(-98.5, 55, 4);
