//Steps - bar chart
//1)populate the Subject ID with the list of IDs from the Name field in the samples.json.
//2)create an event handler to grab the subject id from the subject box.
//3)create a function that will take the subject ID and use it to return the top ten values from that subjects sample_values,
//  and the corresponding oti_ids and oti_labels.
//4) use the values to create a horizontal bar chart showing the top 10 w/ name and id

//This makes the bar graph using the selected sample ID
//Steps - bubble chart
//1) using the subject ID, create a bubble chart of all of microbes - size of bubbles represents sample_value, 
//   the y axis is also the sample_value, and the oti_id is the x axis as well as the color of the bubble
//2) using the subject ID, find the rest of the data in the samples.json

//Steps - demographics
//1) display specific demo data about the subject id in the demo box - Ethnicity, gender, age, location, bbtype, wfreq

//This makes the bar chart
function MakeBar(sampleID)
{
  console.log ("Bar Graph: sample = ", sampleID);
  
d3.json("samples.json").then((data) =>
  {  
  var samples = data.samples;
  var resultArray = samples.filter(sampleObj => sampleObj.id == sampleID);
  var result = resultArray[0];
  var otu_ids = result.otu_ids;
  var otu_labels = result.otu_labels;
  var sample_values = result.sample_values;

  var yticks = otu_ids.slice(0,10).map(otuID => 'OTU ${otuID}').reverse;

  var bardata = [
    {
      x:sample_values.slice(0,10).reverse(),
      y:yticks,
      type:"bar",
      text:otu_labels.slice(0,10).reverse,
      orientation: "h"
    }
  ];
  var barLayout =
  {
    title: "Top 10 Bacteria Cultures",
    margin: {t:30,l:150},
    xaxis: otu_labels,
    yaxis: otu_ids
  };

  
  Plotly.newPlot("bar", bardata, barLayout);
});
 
}

//This makes the bubble chart using the selected ID
function MakeBubble(sampleID)
{
  console.log("Bubble Chart", sampleID);
 
  d3.json("samples.json").then((data) =>
  {
    var section = data.samples;
    var resultArray = section.filter(sampleObj => sampleObj.id == sampleID);
    var result = resultArray[0];
    
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;
     
    var bubbledata = [
    {
      x: otu_ids,
      y: sample_values,
      mode:"markers", 
      marker:
      {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth",
        labels: otu_labels
      }
    }];

    var layout = {
        title: 'OTU',
        xaxis: { title: 'OTU ID' },
        showlegend: true
      };
      
    Plotly.newPlot("bubble", bubbledata, layout);
  })
}

//This fills in the demo data box using the selected ID
function MakeDemo(sampleID)
 {
  console.log("Demo Table", sampleID);
  d3.json("samples.json").then((data) => 
    {
      var metadata = data.metadata;

      var resultArray = metadata.filter(sampleObj => sampleObj.id == sampleID);
      var result = resultArray [0];
      
      console.log("result", result);
      
      var panel = d3.select("#sample-metadata");
      panel.html("");

      Object.entries(result).forEach(([key, value]) => 
      {
        var texttoShow =`${key.toUpperCase()}: ${value}`;
        panel.append("h6").text(texttoShow);
      });
    })
  }
  
//This clears the screen, loads all the sample IDs, and calls the chart functions
function Init()
{
  console.log("Init Screen");
  //load the sample names
  var selection = d3.select("#selDataset");

  d3.json("samples.json").then((data) => 
  {
    var sampleNames = data.names;
    sampleNames.forEach((sample)=> 
    {
      selection
        .append("option")
        .text(sample)
        .property("value",sample);
    });
    var sampleID = sampleNames[0];

    MakeBar(sampleID);
    MakeBubble(sampleID);
    MakeDemo(sampleID);

  })
}

//This changes the sample ID to the one chosen
function optionChanged(newsampleID)
{
  console.log("new sample # is:" , newsampleID)
  MakeBar(newsampleID);
  MakeBubble(newsampleID);
  MakeDemo(newsampleID);
}

Init();
