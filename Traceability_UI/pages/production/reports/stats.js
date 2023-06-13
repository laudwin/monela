/*==============================================================================================================================================*/
//                                                          Global Variable
/*==============================================================================================================================================*/
var cycleTimeDictionary = [];
var descriptionDictionary = []
var machineDataDictionary = [];
var overallDictionaryweek = []//global variable
var incDictionaryWeek = []
var DataDictionaryWeek = []
var machineArray =["4.4","69","70","5.1","5.2","5.3","5.4","6.1","6.2","82","93","94","95","96","97",
"100","101","102","103","104","105","107","108","109","130","131","132",
"157","159","163","165","166","168","169","170","171","74","75"]

var mcCount = 0;// for switching machine numbers
var morningdata = [];
var afternoondata = [];
var nightdata = [];

//normal machines to run
// machineArray =["4.4","69","70","5.1","5.2","5.3","5.4","6.1","6.2","82","93","94","95","96","97",
// "100","101","102","103","104","105","107","108","109","130","131","132",
// "157","159","163","165","166","168","169","170","171","74","75"]

//all machines
// machineArray =["4.4","69","70","5.1","5.2","5.3","5.4","6.1","6.2","82","92","93","94","95","96","97",
//     "100","101","102","103","104","105","107","108","109","130","131","132","Welding","BR1","BR2","assembly",
//     "157","159","163","165","166","168","169","170","171","74","75"]

//only machines that ran
// machineArray =["4.4","69","70","5.2","5.3","5.4","6.2","82","93","94","95","96",
// "100","101","102","103","104","105","108","131","132",
// "163","166","168","74"]
/*==============================================================================================================================================*/
//                                                              Start system
/*==============================================================================================================================================*/

/******************************************************************************************************************************/
var dayStr = [];
var weeklyDates = [];


function startSystem(){
  // var todaysDate= new Date("2023-03-18").toJSON().substring(0,10);//for static data


  var todaysDate= new Date().toJSON().substring(0,10);
  var dateOffset = (24*60*60*1000) * 7; //1 days
  var myDate2 = new Date(todaysDate);
  var dL 

  dayStr = [];
  weeklyDates = [];

  myDate2.setTime(myDate2.getTime() - dateOffset);
  var nextLdate =myDate2.toJSON().substring(0,10);
  var dayofW = new Date(todaysDate).toDateString().substring(0,3)
  console.log(nextLdate)

    var startD = new Date(nextLdate)
    var endD = new Date(todaysDate)
    var diffTime = Math.abs(startD - endD);
    var dateDifference = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    console.log(dateDifference)


    for(var i=0; i<=[dateDifference-1];i++){
      var dateSub = new Date(endD);
      dateSub.setDate(dateSub.getDate() - (dateDifference-[i]));
      var dayofW = dateSub.toDateString().substring(0,3);

      if(dayofW =='Sat' || dayofW =='Sun'){
        //do nothing
      }else{
      
          weeklyDates.push(dateSub.toJSON().substring(0,10));
          dayStr.push(dayofW);
      }

      
  }

  console.log(dayofW)
  console.log(dayStr)

    dL = weeklyDates.length//date array length

    console.log("the day is Wednesday")
    console.log(weeklyDates)
    console.log("start date :"+weeklyDates[0])
    console.log("end date :"+weeklyDates[dL-1])

    var startDay = weeklyDates[0]
    var endDay = todaysDate

    DateRangeCollection(startDay,endDay,weeklyDates)
}
/*****************************************************************************************************************************/
    
async function DateRangeCollection(startDay,endDay,weeklyDates){

  
  console.log("Production Stats")

  cycleTimeDictionary = [];
  descriptionDictionary = []
  machineDataDictionary = [];
  incDictionaryWeek = []
  DataDictionaryWeek = []
  overallDictionaryweek = [];
  mcCount = 0;
  morningdata = [];
  afternoondata = [];
  nightdata = [];

  machineArray =["4.4","69","70","5.1","5.2","5.3","5.4","6.1","6.2","82","93","94","95","96","97",
"100","101","102","103","104","105","107","108","109","130","131","132",
"157","159","163","165","166","168","169","170","171","74","75"]

$("#stats").html("");
$("<center><div id=preloader><div id=loader></div></div><div</div></center>").appendTo("#stats"); 

// $("<button id=Slidebtn class=SSlide onclick=clearInterval(myDelay)>stop Slide</button>").appendTo("#userInfo");
// $('#Slidebtn').hide();

console.log(machineArray)

$("<h3 class=tabContHead>Production Stats</h3>").appendTo("#stats");

  var todaysDate= new Date().toJSON().substring(0,10);
  var dateOffset = (24*60*60*1000) * 1; //1 days
  var myDate = new Date(todaysDate);
  myDate.setTime(myDate.getTime() - dateOffset);
  var yesterdate =myDate.toJSON().substring(0,10);

  console.log("-------------------------------------------------------------------------------");
        //-------------------------------------------------------------------------------------------------------------------------
        await axios.
        get("http://192.168.2.223:9101/cycle_time")
        .then(res => {
            cycleTimeDictionary.push(res.data);
            // console.log(cycleTimeDictionary[0]);
        })
        .catch(err =>{console.log(err)});
        //-------------------------------------------------------------------------------------------------------------------------
        await axios.
        get("http://192.168.2.223:9101/traceability/descriptions")
        .then(res => {
            descriptionDictionary.push(res.data);
            console.log(descriptionDictionary[0]);
        })
        .catch(err =>{console.log(err)});
        //-------------------------------------------------------------------------------------------------------------------------
        
      await axios.
      get("http://192.168.2.223:9101?Tablename=trace_plant.incidentview&ColumnD=dateinc&StartDate="+startDay+"&EndDate="+endDay+"&Product=")
      .then(res => {
          for(var y=0;y<res.data.length;y++){
              incDictionaryWeek.push(res.data[y]);
          }
          // console.log(incDictionaryWeek);
          
      })
      .catch(err =>{console.log(err)});
      //-------------------------------------------------------------------------------------------------------------------------
      await axios.
          get("http://192.168.2.223:9101?Tablename=trace_plant.traceabiltyview1&ColumnD=date&StartDate="+startDay+"&EndDate="+endDay+"&Product=")
          .then(res => {
            //console.log(res)
                  //sort shift data per date and machine
                  for(var zh=0; zh<weeklyDates.length; zh++){
                      for(var zx=0; zx<machineArray.length; zx++){
                          var morningCnt ="-";
                          var afternoonCnt ="-";
                          var nightCnt ="-";

                          var morningCntInc = 0;
                          var afternoonCntInc = 0;
                          var nightCntInc = 0;

                          var morningPro ="-";
                          var afternoonPro ="-";
                          var nightPro ="-";

                          var morningOp ="-";
                          var afternoonOp ="-";
                          var nightOp ="-";

                          var target1="-";
                          var target2="-";
                          var target3="-";

                          var descript1="-";
                          var descript2="-";
                          var descript3="-";
                      
                           
                          for(var z=0; z<res.data.length; z++){
                              if(weeklyDates[zh]==res.data[z].date.substring(0,10)){
                                  if(machineArray[zx]==res.data[z].machine_no){

                                      //get count for incidents
                                      for(var y=0;y<incDictionaryWeek.length;y++){
                                          if(weeklyDates[zh]==incDictionaryWeek[y].dateinc.substring(0,10) && machineArray[zx]==incDictionaryWeek[y].machine_no_inc){
                                              if(incDictionaryWeek[y].shift_inc=="Morning"){
                                                  morningCntInc=incDictionaryWeek[y].COUNT;
                                              }
                                              if(incDictionaryWeek[y].shift_inc=="Afternoon"){
                                                  afternoonCntInc = incDictionaryWeek[y].COUNT;
                                              }
                                              if(incDictionaryWeek[y].shift_inc=="Night"){
                                                  nightCntInc =  incDictionaryWeek[y].COUNT;
                                              }
                                          }//end if
                                      }//end for
                                      //------------------------------------------------------------------------------------------------------------------------------
                                      //----------------get count,product & operation number from the normal traceability database------------------------------------
                                      if(res.data[z].shift=="Morning"){
                                          morningCnt = res.data[z].COUNT + morningCntInc;
                                          morningPro = res.data[z].product;
                                          morningOp = res.data[z].operation.replace(/\D/g,'');
                                      }//end if
                                      if(res.data[z].shift=="Afternoon"){
                                          afternoonCnt =  res.data[z].COUNT +afternoonCntInc;
                                          afternoonPro = res.data[z].product;
                                          afternoonOp = (res.data[z].operation).replace(/\D/g,'');
                                      }//end if
                                      if(res.data[z].shift=="Night"){
                                          nightCnt =  res.data[z].COUNT + nightCntInc;
                                          nightPro = res.data[z].product;
                                          nightOp = (res.data[z].operation).replace(/\D/g,'');
                                      }//end if
                                  }//end if
                              }//end if
                          }//end for
                      //---------------------------------------------------------------------------------------------------------------------------------------------
                          //cycle time
                              for(var sr=0; sr<cycleTimeDictionary[0].length; sr++){
                                  if(machineArray[zx]==cycleTimeDictionary[0][sr].machine){
                                      if(morningPro==cycleTimeDictionary[0][sr].product && morningOp== cycleTimeDictionary[0][sr].operation){
                                          target1 = cycleTimeDictionary[0][sr].target_shift;
                                      }
                                      if(afternoonPro==cycleTimeDictionary[0][sr].product && afternoonOp== cycleTimeDictionary[0][sr].operation){
                                          target2 = cycleTimeDictionary[0][sr].target_shift;
                                      }
                                      if(nightPro==cycleTimeDictionary[0][sr].product && nightOp== cycleTimeDictionary[0][sr].operation){
                                          target3 = cycleTimeDictionary[0][sr].target_shift;
                                      }

                                  }
                              }
                          //------------------------------------------------------------------------------------------------------------------------------
                          //description
                          for(var sr=0; sr<descriptionDictionary[0].length; sr++){
                            
                                if(morningPro==descriptionDictionary[0][sr].product && morningOp== descriptionDictionary[0][sr].opNo){
                                    descript1 = descriptionDictionary[0][sr].op_description;
                                }
                                if(afternoonPro==descriptionDictionary[0][sr].product && afternoonOp== descriptionDictionary[0][sr].opNo){
                                  descript2 = descriptionDictionary[0][sr].op_description;
                                }
                                if(nightPro==descriptionDictionary[0][sr].product && nightOp== descriptionDictionary[0][sr].opNo){
                                  descript3 = descriptionDictionary[0][sr].op_description;
                                }

                            
                        }
                    //------------------------------------------------------------------------------------------------------------------------------
                                  //create a list
                                  let shellData=
                                  {
                                      mc: machineArray[zx],
                                      date: weeklyDates[zh],
                                      shft:[
                                          {shift:"Morning", count: morningCnt, product: morningPro, operation: morningOp,target_shift:target1,description:descript1},
                                          {shift:"Afternoon", count: afternoonCnt, product: afternoonPro, operation: afternoonOp,target_shift:target2,description:descript2},
                                          {shift:"Night", count: nightCnt, product: nightPro, operation: nightOp,target_shift:target3,description:descript3}]

                                  };
                                  
                                      DataDictionaryWeek.push(shellData);
                          
                      }//end for
                  }//end for
                  //-------------------------------------------------------------------------------------------------------------------------
                      //console.log(DataDictionaryWeek)
                  //sort data by machines
                  for(var ax=0; ax<machineArray.length; ax++){
                      machineDataDictionary = [];
                      for(var a=0; a<DataDictionaryWeek.length; a++){
                          if(machineArray[ax]==DataDictionaryWeek[a].mc){
                              machineDataDictionary.push(DataDictionaryWeek[a]);
                          }//end if
                      }//end for

                      let mcData=
                                  {
                                      mc: machineArray[ax],
                                      data: machineDataDictionary
                                  };
                                  overallDictionaryweek.push(mcData);
                  }//end for

                  
          })
          $('#percentage').hide();
          $('#preloader').hide();
          displayinfo()
}
          
/*==============================================================================================================================================*/
//                                                  display data on table
/*==============================================================================================================================================*/

function displayinfo(){


  if(mcCount<0){mcCount=38}
  if(mcCount>38){mcCount=0}

  if(mcCount!=38){
    //console.log(overallDictionaryweek)
    $("<div id=slideCont></div>").appendTo("#stats");
    $("<div id=tableBox></div>").appendTo("#slideCont");
    $("<button id=prevBtn onclick=prevPage()> < </button>").appendTo("#slideCont");
    $("<button id=nextBtn onclick=nextPage()> > </button>").appendTo("#slideCont");

    var daytable1 = $("<br><table id=daytable1 border=0></table>").appendTo("#tableBox");// create table
      var row0 = $("<tr id=heading></tr>").appendTo(daytable1);
        $("<th id=serotop colspan=1 ></th>").text("Machine  : "+overallDictionaryweek[mcCount].mc).appendTo(row0);
        $("<th id=serotop colspan=5 ></th>").text(overallDictionaryweek[mcCount].data[4].date).appendTo(row0);
      var row1 = $("<tr id=heading></tr>").appendTo(daytable1);
        $("<th id=sero colspan=1 ></th>").text("").appendTo(row1);
        $("<th id=sero colspan=1 ></th>").text("Product").appendTo(row1);
        $("<th id=sero colspan=1 ></th>").text("Operation").appendTo(row1);
        $("<th id=sero colspan=1 ></th>").text("Description").appendTo(row1);
        $("<th id=sero colspan=1 ></th>").text("Target").appendTo(row1);
        $("<th id=sero colspan=1 ></th>").text("Actual").appendTo(row1);
      var row2 = $("<tr id=heading></tr>").appendTo(daytable1);
        $("<th id=sero colspan=1 ></th>").text("Morning").appendTo(row2);
        $("<td style= font-weight:bold></td>").text(overallDictionaryweek[mcCount].data[4].shft[0].product).appendTo(row2);//Product
        $("<td style= font-weight:bold></td>").text(overallDictionaryweek[mcCount].data[4].shft[0].operation).appendTo(row2);//operation
        $("<td style= font-weight:bold></td>").text(overallDictionaryweek[mcCount].data[4].shft[0].description).appendTo(row2);//description
        $("<td style= font-weight:bold></td>").text(overallDictionaryweek[mcCount].data[4].shft[0].target_shift).appendTo(row2);//target
        $("<td style= font-weight:bold></td>").text(overallDictionaryweek[mcCount].data[4].shft[0].count).appendTo(row2);//actual
      var row3 = $("<tr id=heading></tr>").appendTo(daytable1);
        $("<th id=sero colspan=1 ></th>").text("Afternoon").appendTo(row3);
        $("<td style= font-weight:bold></td>").text(overallDictionaryweek[mcCount].data[4].shft[1].product).appendTo(row3);//Product
        $("<td style= font-weight:bold></td>").text(overallDictionaryweek[mcCount].data[4].shft[1].operation).appendTo(row3);//operation
        $("<td style= font-weight:bold></td>").text(overallDictionaryweek[mcCount].data[4].shft[1].description).appendTo(row3);//description
        $("<td style= font-weight:bold></td>").text(overallDictionaryweek[mcCount].data[4].shft[1].target_shift).appendTo(row3);//target
        $("<td style= font-weight:bold></td>").text(overallDictionaryweek[mcCount].data[4].shft[1].count).appendTo(row3);//actual
      var row4 = $("<tr id=heading></tr>").appendTo(daytable1);
        $("<th id=sero colspan=1 ></th>").text("Night").appendTo(row4);
        $("<td style= font-weight:bold></td>").text(overallDictionaryweek[mcCount].data[4].shft[2].product).appendTo(row4);//Product
        $("<td style= font-weight:bold></td>").text(overallDictionaryweek[mcCount].data[4].shft[2].operation).appendTo(row4);//operation
        $("<td style= font-weight:bold></td>").text(overallDictionaryweek[mcCount].data[4].shft[2].description).appendTo(row4);//description
        $("<td style= font-weight:bold></td>").text(overallDictionaryweek[mcCount].data[4].shft[2].target_shift).appendTo(row4);//target
        $("<td style= font-weight:bold></td>").text(overallDictionaryweek[mcCount].data[4].shft[2].count).appendTo(row4);//actual

        var targA,targB,targC,targTOT;
        var actA,actB,actC,actTOT;
        var Star=0
        var machine = overallDictionaryweek[mcCount].mc
      

        if(overallDictionaryweek[mcCount].data[4].shft[0].target_shift == "-"){targA=0}else{targA = overallDictionaryweek[mcCount].data[4].shft[0].target_shift}
        if(overallDictionaryweek[mcCount].data[4].shft[1].target_shift == "-"){targB=0}else{targB = overallDictionaryweek[mcCount].data[4].shft[1].target_shift}
        if(overallDictionaryweek[mcCount].data[4].shft[2].target_shift == "-"){targC=0}else{targC = overallDictionaryweek[mcCount].data[4].shft[2].target_shift}

        if(overallDictionaryweek[mcCount].data[4].shft[0].count == "-"){actA=0}else{actA = overallDictionaryweek[mcCount].data[4].shft[0].count}
        if(overallDictionaryweek[mcCount].data[4].shft[1].count == "-"){actB=0}else{actB = overallDictionaryweek[mcCount].data[4].shft[1].count}
        if(overallDictionaryweek[mcCount].data[4].shft[2].count == "-"){actC=0}else{actC = overallDictionaryweek[mcCount].data[4].shft[2].count}
        
        targTOT = targA+targB+targC
        actTOT = actA+actB+actC

        if(targA>0){Star=targA}
        else if(targB>0){Star=targB}
        else if(targC>0){Star=targC}

        console.log("machine : "+overallDictionaryweek[mcCount].mc)
        console.log("target : "+Star)

      var row5 = $("<tr id=heading></tr>").appendTo(daytable1);
        $("<th id=sero colspan=1 ></th>").text("Total Target").appendTo(row5);
        $("<td colspan=5 style= font-weight:bold></td>").text(targTOT).appendTo(row5);//actual
      var row6 = $("<tr id=heading></tr>").appendTo(daytable1);
        $("<th id=sero colspan=1 ></th>").text("Total Actual").appendTo(row6);
        $("<td colspan=5 style= font-weight:bold></td>").text(actTOT).appendTo(row6);//actual

        // if(targTOT==0){
        //   nextPage()
        // }else{graphicalView(actA,actB,actC,machine,Star,mcCount)}

        graphicalView(actA,actB,actC,machine,Star,mcCount)
    }else{
      $("<div id=slideCont></div>").appendTo("#stats");
      $("<img src=/links/icons/pictures/image001.png class=rdmnews />").appendTo("#slideCont");
    }   
    
        

}
/*==============================================================================================================================================*/
//                                                  graphical data view
/*==============================================================================================================================================*/
function graphicalView(actA,actB,actC,machine,Star,mcCount){

  //console.log(actA,actB,actC)
  $("<div id=graphCon></div>").appendTo("#slideCont");
  $("<div class=graphtitle>Machine "+machine+"</div>").appendTo("#graphCon");

  $("<div id=graphCon1></div>").appendTo("#slideCont");
  $("<div class=graphtitle>Week Productivity For Machine  "+machine+"</div>").appendTo("#graphCon1");
  $("<canvas id=chartBox style=width:800px;height=800px></canvas>").appendTo("#graphCon");

    // var xValues = ["Morning", "Afternoon", "Night"];
    var xValues = ["Shifts"]
    var yValues = [actA,actB,actC];
    var barColors = ["blue","brown","orange"];


    Chart.defaults.font.weight = '600';
    Chart.defaults.font.size = '18'; 
    Chart.defaults.color = 'black';      

    new Chart("chartBox", {
      
      type: "bar",
      data: {
        labels: xValues,
        datasets: [
          // {
          //   label: "Target",
          //   fill: true,
          //   lineTension: 0,
          //   backgroundColor: "red",
          //   borderColor: "red",
          //   data: [Star],
          //   type: 'bar',
          //   order: 0
          // },
          {
            label: "Morning",
            backgroundColor: 'blue',
            borderColor: 'black',
            borderWidth: 1,
            data: [actA]
        },
        {
          label: "Afternoon",
          backgroundColor: 'brown',
          borderColor: 'black',
          borderWidth: 1,
          data: [actB]
      },
      {
        label: "Night",
        backgroundColor: 'orange',
        borderColor: 'black',
        borderWidth: 1,
        data: [actC]
    },
        ]
      },
      options: {
        legend: {display: false},
       
        scales: {
          
          y:{min: 0,
            
            title: {
              display: true,
              text: 'Quantity',
            },
            ticks:{
              font:{
                weight:'bold',
              }
            }
          }//end y
        },//end scale
        plugins:{
          
          annotation: {
            annotations: {
              line1: {
                type: 'line',
                mode: 'horizontal',
                yMin: Star,
                yMax: Star,
                borderColor: 'green',
                borderWidth: 5,
              }

            }
          }
        }
      }
});

    /************************************************************************************************************** */
    //weekly gragh
    //console.log(overallDictionaryweek)

      var cntAS;
      var cntBS;
      var cntCS;

          morningdata = [];
          afternoondata = [];
          nightdata = [];

      console.log()
      for(var i=0; i<overallDictionaryweek[mcCount].data.length; i++){
        /*******************************Morning tartget********************************/
        if(overallDictionaryweek[mcCount].data[i].shft[0].count == "-")
          { cntAS=0;
            morningdata.push(cntAS)
          }else{
            cntAS = overallDictionaryweek[mcCount].data[i].shft[0].count;
            morningdata.push(cntAS)
          } 
        /*******************************Afternoon tartget********************************/
        if(overallDictionaryweek[mcCount].data[i].shft[1].count == "-")
          { cntBS=0;
            afternoondata.push(cntBS)
          }else{
            cntBS = overallDictionaryweek[mcCount].data[i].shft[1].count;
            afternoondata.push(cntBS)
          } 
        /*********************************Night tartget**********************************/
        if(overallDictionaryweek[mcCount].data[i].shft[2].count == "-")
          { cntCS=0;
            nightdata.push(cntCS)
          }else{
            cntCS = overallDictionaryweek[mcCount].data[i].shft[2].count;
            nightdata.push(cntCS)
          } 
        /********************************************************************************/
      }//end for loop

      console.log(morningdata)
      console.log(afternoondata)
      console.log(nightdata)
      

    $("<canvas id=chartBox1 style=width:800px;height=800px></canvas>").appendTo("#graphCon1");
    var xValues = dayStr;

    new Chart("chartBox1", {
      type: "line",
      data: {
        labels: xValues,
        datasets: [
          {
            label:"Target",
            fill: false,
            lineTension: 0,
            backgroundColor: "green",
            borderColor: "green",
            data: [Star,Star,Star,Star,Star,Star,Star],
            type: 'line',
            order: 0
          },
          {
            label:'Morning',
            fill: false,
            lineTension: 0,
            backgroundColor: "blue",
            borderColor: "blue",
            data: morningdata
          },
          {
            label:'Afternoon',
            fill: false,
            lineTension: 0,
            backgroundColor: "brown",
            borderColor: "brown",
            data: afternoondata
          },
          {
            label:'Night',
            fill: false,
            lineTension: 0,
            backgroundColor: "orange",
            borderColor: "orange",
            data: nightdata
          }
        ]
      },
      options: {
        legend: {display: false},
   
        scales: {
          y:{min: 0,
            title: {
              display: true,
              text: 'Quantity'
            },
          }//end y
        }//end scales
      }
    });

}
/*==============================================================================================================================================*/
//                                                  change machine
/*==============================================================================================================================================*/
function prevPage(){
  $("#slideCont").html("");
  mcCount--
  displayinfo()
}
function nextPage(){
  $("#slideCont").html("");
  mcCount++
  displayinfo()
}
/*==============================================================================================================================================*/
//                                                   Start Show Slide
/*==============================================================================================================================================*/
let myDelay = setInterval(StartSlide, 10000);
let resetData = setInterval(resetDataSet, 60000);//10 minutes = 1000 x 60 x 10 = 600000


function StartSlide(){
  nextPage()
}
//----------------------------------------------------------------------------------
var reDate = (new Date().toLocaleString("sv").substring(0,10))+" 06:00"
var countReset=0
//----------------------------------------------------------------------------------
function resetDataSet(){
  const d = new Date().toLocaleString("sv").substring(0,16);
  // console.log(d)
  // console.log(reDate)
  if(countReset==0){
    if (d >= reDate){
      reDate = (new Date().toLocaleString("sv").substring(0,10))+" 14:00"
      console.log("date reset : "+reDate)
      countReset++
      startSystem()
    }
  }
  if(countReset==1){
    if (d >= reDate){
      reDate = (new Date().toLocaleString("sv").substring(0,10))+" 22:00"
      console.log("date reset : "+reDate)
      countReset++
      startSystem()
    }
  }
  if(countReset==2){
    if (d >= reDate){
      var dateOffset = (24*60*60*1000) * 1; //1 days
      var myDate = new Date(); 
  
      myDate.setTime(myDate.getTime() + dateOffset);
      reDate = (myDate.toLocaleString("sv").substring(0,10))+" 06:00"
      countReset=0
      console.log("date reset : "+reDate)
      console.log("count reset : "+countReset)
      startSystem()
    }
  }
  
  
}