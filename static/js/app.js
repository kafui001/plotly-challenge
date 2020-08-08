//Create a function to build the bar chart & bubble plot
//The function will create plots based on id selected from dropdown menu
function buildCharts(id) {

    //Use D3 to retrieve data from json file
    d3.json("samples.json").then(function(data) {
        //set a samples variable filtering the data by id within the samples dataset
        //id is a string in the samples dataset, push the input in names id to a string
        var samples = data.samples.filter(d => d.id.toString() === id)[0];
        console.log(samples);

        //set a wash frequency variable filtering the data by id within the metadata dataset
        var wFreq = data.metadata.filter(d => d.id.toString() === id).map(d => d.wfreq);
        console.log(wFreq);

        //set the sampleValues variable, slice the top 10 responses and reverse the data for the plot
        var sampleValues = samples.sample_values.slice(0,10).reverse();
        console.log(sampleValues);

        //set the OTU_ID variable, slice the top 10 responses and reverse the data for the plot
        //use map to add "OTU" to the newly created OTU_ID array
        var OTU_ID = samples.otu_ids.slice(0,10).reverse().map(d => "OTU " + d);
        console.log(OTU_ID);

        //set the OTU_Type variable, slice the top 10 response and reverse the data for the plot
        var OTU_Type = samples.otu_labels.slice(0,10).reverse();
        console.log(OTU_Type);

        //Create the trace for the bar chart
        trace1 = {
          x: sampleValues,
          y: OTU_ID,
          text: OTU_Type,
          type: "bar",
          orientation: "h"
        };

        var data = [trace1];

        var layout = {
          title: "Top 10 OTUs by Patient ID",
          //title: `Top 10 OTU for Patient ${samples.id}`
          margin: {
            l: 100,
            r: 100,
            t: 100,
            b: 20
          }
        };

        //Create bar plot in the id="bar" div
        Plotly.newPlot("bar", data, layout);

        //Create the trace for the bubble chart
        var trace2 = {
          x: samples.otu_ids,
          y: samples.sample_values,
          mode: "markers",
          marker: {
            size: samples.sample_values,
            color: samples.otu_ids,
            colorscale: "Jet"
          },
          text: samples.otu_labels
        };

        var data2 = [trace2];

        var layout2 = {
          xaxis:{title: "OTU ID"},
          height: 600,
          width: 1000
        };

        Plotly.newPlot("bubble", data2, layout2);

        //Create the data set for the gauge chart using wfreq (wash frequency)
        var data3 = [
          {
          domain: { x: [0, 1], y: [0, 1] },
          value: parseFloat(wFreq),
          title: { text: `Weekly Washing Frequency ` },
          type: "indicator",
          mode: "gauge+number",
          gauge: { axis: { range: [null, 9] },
                  bar: {color: "rgb(230,100,0)"},
                   steps: [
                    { range: [0, 2], color: "rgb(240,230,215)" },
                    { range: [2, 4], color: "rgb(210,206,145)" },
                    { range: [4, 6], color: "rgb(170,202,42)" },
                    { range: [6, 8], color: "rgb(14,150,13)" },
                    { range: [8, 9], color: "rgb(0,105,11)" },
                  ]}
              
          }
        ];
        
        //create the gauge chart
        var layout3 = { 
            width: 700, 
            height: 600, 
            margin: { t: 20, b: 40, l:100, r:100 } 
          };
      
        Plotly.newPlot("gauge", data3, layout3);

    });
};

// Create a function to update the demographics with metadata from the samples.json data
function updateDemographics(id) {
  //d3 pull data
  d3.json("samples.json").then(function(data) {
    var metaData = data.metadata.filter(d => d.id.toString() === id)[0];
  
    //d3 select Demographics table box
    var sampleDemo = d3.select("#sample-metadata");

    sampleDemo.html("");

    Object.entries(metaData).forEach((key) => {
      sampleDemo.append("h5").text(`${key[0]}: ${key[1]}`);
    });
  });
}

//Create a function to update the plots once a new id is selected from the dropdown
function optionChanged(id) {
  buildCharts(id);
  updateDemographics(id);
}

// create the function for the initial data rendering on the page
function init() {
  // select dropdown menu 
  var dropdown = d3.select("#selDataset");

  // read the data 
  d3.json("samples.json").then((data)=> {
      console.log(data)

      // get the id data to the dropdwown menu
      data.names.forEach(function(name) {
          dropdown.append("option").text(name).property("value");
      });

      // call the functions to display the data and the plots to the page
      buildCharts(data.names[0]);
      updateDemographics(data.names[0]);
  });
}

//call the init function to initialize the page
init();
