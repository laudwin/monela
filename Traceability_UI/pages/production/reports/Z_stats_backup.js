/*==============================================================================================================================================*/
//                                                          Global Variable
/*==============================================================================================================================================*/
var incDictionary = [];
var cycleTimeDictionary = [];
var DataDictionary = [];
var machineDataDictionary = [];
var overallDictionary = [];
var machineArray =["4.4","69","70","5.1","5.2","5.3","5.4","6.1","6.2","82","93","94","95","96","97",
"100","101","102","103","104","105","107","108","109","130","131","132",
"157","159","163","165","166","168","169","170","171","74","75"]

// machineArray =["4.4","69","70","5.1","5.2","5.3","5.4","6.1","6.2","82","92","93","94","95","96","97",
//     "100","101","102","103","104","105","107","108","109","130","131","132","Welding","BR1","BR2","assembly",
//     "157","159","163","165","166","168","169","170","171","74","75"]
/*==============================================================================================================================================*/
//                                                              Start system
/*==============================================================================================================================================*/
 async function startSystem(){
    console.log("Production Stats")
    incDictionary = [];
    cycleTimeDictionary = [];
    DataDictionary = [];
    machineDataDictionary = [];
    overallDictionary = [];

    machineArray =["4.4","69","70","5.1","5.2","5.3","5.4","6.1","6.2","82","93","94","95","96","97",
    "100","101","102","103","104","105","107","108","109","130","131","132",
    "157","159","163","165","166","168","169","170","171","74","75"]

  $("#stats").html("");
  $("<center><div id=preloader><div id=loader></div></div><div</div></center>").appendTo("#stats"); 

  // $("<button id=Slidebtn class=SSlide onclick=clearInterval(myDelay)>stop Slide</button>").appendTo("#userInfo");
  // $('#Slidebtn').hide();

  $("<h3 class=tabContHead>Production Stats</h3>").appendTo("#stats");

    var todaysDate= new Date().toJSON().substring(0,10);
    var dateOffset = (24*60*60*1000) * 1; //1 days
    var myDate = new Date(todaysDate);
    myDate.setTime(myDate.getTime() - dateOffset);
    var yesterdate =myDate.toJSON().substring(0,10);
    // console.log(todaysDate)
    // console.log(yesterdate)

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
     get("http://192.168.2.223:9101?Tablename=trace_plant.incidentview&ColumnD=dateinc&StartDate="+yesterdate+"&EndDate="+todaysDate+"&Product=")
     .then(res => {
         for(var y=0;y<res.data.length;y++){
             incDictionary.push(res.data[y]);
         }
        
         
     })
     .catch(err =>{console.log(err)});
    //-------------------------------------------------------------------------------------------------------------------------
      await axios.
      get("http://192.168.2.223:9101?Tablename=trace_plant.traceabiltyview1&ColumnD=date&StartDate="+yesterdate+"&EndDate="+todaysDate+"&Product=")
      .then(res => {
              //sort shift data per date and machine
              // for(var zh=0; zh<dateDictionary.length; zh++){
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

                
                    
                    for(var z=0; z<res.data.length; z++){
                        if(yesterdate==res.data[z].date.substring(0,10)){
                            if(machineArray[zx]==res.data[z].machine_no){

                                //get count for incidents
                                for(var y=0;y<incDictionary.length;y++){
                                    if(yesterdate==incDictionary[y].dateinc.substring(0,10) && machineArray[zx]==incDictionary[y].machine_no_inc){
                                        if(incDictionary[y].shift_inc=="Morning"){
                                            morningCntInc=incDictionary[y].COUNT;
                                        }
                                        if(incDictionary[y].shift_inc=="Afternoon"){
                                            afternoonCntInc = incDictionary[y].COUNT;
                                        }
                                        if(incDictionary[y].shift_inc=="Night"){
                                            nightCntInc =  incDictionary[y].COUNT;
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
                            //create a list
                            let shellData=
                            {
                                mc: machineArray[zx],
                                date: yesterdate,
                                shft:[
                                    {shift:"Morning", count: morningCnt, product: morningPro, operation: morningOp,target_shift:target1},
                                    {shift:"Afternoon", count: afternoonCnt, product: afternoonPro, operation: afternoonOp,target_shift:target2},
                                    {shift:"Night", count: nightCnt, product: nightPro, operation: nightOp,target_shift:target3}]

                            };
                            
                                DataDictionary.push(shellData);
                    
                // }//end for
            }//end for
            //-------------------------------------------------------------------------------------------------------------------------
            // console.log(DataDictionary)
            //sort data by machines
            for(var ax=0; ax<machineArray.length; ax++){
                machineDataDictionary = [];
                for(var a=0; a<DataDictionary.length; a++){
                    if(machineArray[ax]==DataDictionary[a].mc){
                        machineDataDictionary.push(DataDictionary[a]);
                    }//end if
                }//end for

                let mcData=
                            {
                                mc: machineArray[ax],
                                data: machineDataDictionary
                            };
                            overallDictionary.push(mcData);
            }//end for

            // console.log(overallDictionary)
          
      })
      .catch(err =>{console.log(err)});
    //-------------------------------------------------------------------------------------------------------------------------


  
  
  $('#percentage').hide();
  $('#preloader').hide();

  weekdata()
}
/*==============================================================================================================================================*/
//                                                  Generate Weekly data
/*==============================================================================================================================================*/
var dayStr = [];
var weeklyDates = [];
function weekdata(){
  var todaysDate= new Date().toJSON().substring(0,10);
  var dateOffset = (24*60*60*1000) * 7; //1 days
  var myDate2 = new Date(todaysDate);
  var dL 
  


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

      if(dayofW =='Sat' || dayofW =='Sun' ){
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
/*=============================================================================================================================================================*/
var overallDictionaryweek = []//global variable
async function DateRangeCollection(startDay,endDay,weeklyDates){
  var incDictionaryWeek = []
  var DataDictionaryWeek = []
  

  console.log("-------------------------------------------------------------------------------");
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
                                  //create a list
                                  let shellData=
                                  {
                                      mc: machineArray[zx],
                                      date: weeklyDates[zh],
                                      shft:[
                                          {shift:"Morning", count: morningCnt, product: morningPro, operation: morningOp,target_shift:target1},
                                          {shift:"Afternoon", count: afternoonCnt, product: afternoonPro, operation: afternoonOp,target_shift:target2},
                                          {shift:"Night", count: nightCnt, product: nightPro, operation: nightOp,target_shift:target3}]

                                  };
                                  
                                      DataDictionaryWeek.push(shellData);
                          
                      }//end for
                  }//end for
                  //-------------------------------------------------------------------------------------------------------------------------
                  console.log(DataDictionaryWeek)
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

          displayinfo()
}
          
/*==============================================================================================================================================*/
//                                                  display data on table
/*==============================================================================================================================================*/
var mcCount = 0;//global variable for switching machine numbers
function displayinfo(){


  if(mcCount<0){mcCount=37}
  if(mcCount>37){mcCount=0}

  console.log(overallDictionary)
  $("<div id=slideCont></div>").appendTo("#stats");
  $("<div id=tableBox></div>").appendTo("#slideCont");
  $("<button id=prevBtn onclick=prevPage()> < </button>").appendTo("#slideCont");
  $("<button id=nextBtn onclick=nextPage()> > </button>").appendTo("#slideCont");

  var daytable1 = $("<br><table id=daytable1 border=0></table>").appendTo("#tableBox");// create table
    var row0 = $("<tr id=heading></tr>").appendTo(daytable1);
      $("<th id=serotop colspan=1 ></th>").text("Machine  : "+overallDictionary[mcCount].mc).appendTo(row0);
      $("<th id=serotop colspan=5 ></th>").text(overallDictionary[mcCount].data[0].date).appendTo(row0);
    var row1 = $("<tr id=heading></tr>").appendTo(daytable1);
      $("<th id=sero colspan=1 ></th>").text("").appendTo(row1);
      $("<th id=sero colspan=1 ></th>").text("Product").appendTo(row1);
      $("<th id=sero colspan=1 ></th>").text("Operation").appendTo(row1);
      $("<th id=sero colspan=1 ></th>").text("Description").appendTo(row1);
      $("<th id=sero colspan=1 ></th>").text("Target").appendTo(row1);
      $("<th id=sero colspan=1 ></th>").text("Actual").appendTo(row1);
    var row2 = $("<tr id=heading></tr>").appendTo(daytable1);
      $("<th id=sero colspan=1 ></th>").text("Morning").appendTo(row2);
      $("<td style= font-weight:bold></td>").text(overallDictionary[mcCount].data[0].shft[0].product).appendTo(row2);//Product
      $("<td style= font-weight:bold></td>").text(overallDictionary[mcCount].data[0].shft[0].operation).appendTo(row2);//operation
      $("<td style= font-weight:bold></td>").text("").appendTo(row2);//description
      $("<td style= font-weight:bold></td>").text(overallDictionary[mcCount].data[0].shft[0].target_shift).appendTo(row2);//target
      $("<td style= font-weight:bold></td>").text(overallDictionary[mcCount].data[0].shft[0].count).appendTo(row2);//actual
    var row3 = $("<tr id=heading></tr>").appendTo(daytable1);
      $("<th id=sero colspan=1 ></th>").text("Afternoon").appendTo(row3);
      $("<td style= font-weight:bold></td>").text(overallDictionary[mcCount].data[0].shft[1].product).appendTo(row3);//Product
      $("<td style= font-weight:bold></td>").text(overallDictionary[mcCount].data[0].shft[1].operation).appendTo(row3);//operation
      $("<td style= font-weight:bold></td>").text("").appendTo(row3);//description
      $("<td style= font-weight:bold></td>").text(overallDictionary[mcCount].data[0].shft[1].target_shift).appendTo(row3);//target
      $("<td style= font-weight:bold></td>").text(overallDictionary[mcCount].data[0].shft[1].count).appendTo(row3);//actual
    var row4 = $("<tr id=heading></tr>").appendTo(daytable1);
      $("<th id=sero colspan=1 ></th>").text("Night").appendTo(row4);
      $("<td style= font-weight:bold></td>").text(overallDictionary[mcCount].data[0].shft[2].product).appendTo(row4);//Product
      $("<td style= font-weight:bold></td>").text(overallDictionary[mcCount].data[0].shft[2].operation).appendTo(row4);//operation
      $("<td style= font-weight:bold></td>").text("").appendTo(row4);//description
      $("<td style= font-weight:bold></td>").text(overallDictionary[mcCount].data[0].shft[2].target_shift).appendTo(row4);//target
      $("<td style= font-weight:bold></td>").text(overallDictionary[mcCount].data[0].shft[2].count).appendTo(row4);//actual

      var targA,targB,targC,targTOT;
      var actA,actB,actC,actTOT;
      var Star=0
      var machine = overallDictionary[mcCount].mc
     

      if(overallDictionary[mcCount].data[0].shft[0].target_shift == "-"){targA=0}else{targA = overallDictionary[mcCount].data[0].shft[0].target_shift}
      if(overallDictionary[mcCount].data[0].shft[1].target_shift == "-"){targB=0}else{targB = overallDictionary[mcCount].data[0].shft[1].target_shift}
      if(overallDictionary[mcCount].data[0].shft[2].target_shift == "-"){targC=0}else{targC = overallDictionary[mcCount].data[0].shft[2].target_shift}

      if(overallDictionary[mcCount].data[0].shft[0].count == "-"){actA=0}else{actA = overallDictionary[mcCount].data[0].shft[0].count}
      if(overallDictionary[mcCount].data[0].shft[1].count == "-"){actB=0}else{actB = overallDictionary[mcCount].data[0].shft[1].count}
      if(overallDictionary[mcCount].data[0].shft[2].count == "-"){actC=0}else{actC = overallDictionary[mcCount].data[0].shft[2].count}
      
      targTOT = targA+targB+targC
      actTOT = actA+actB+actC

      if(targA>0){Star=targA}
      else if(targB>0){Star=targB}
      else if(targC>0){Star=targC}

      console.log("machine : "+overallDictionary[mcCount].mc)
      console.log("target : "+Star)

    var row5 = $("<tr id=heading></tr>").appendTo(daytable1);
      $("<th id=sero colspan=1 ></th>").text("Total Target").appendTo(row5);
      $("<td colspan=5 style= font-weight:bold></td>").text(targTOT).appendTo(row5);//actual
    var row6 = $("<tr id=heading></tr>").appendTo(daytable1);
      $("<th id=sero colspan=1 ></th>").text("Total Actual").appendTo(row6);
      $("<td colspan=5 style= font-weight:bold></td>").text(actTOT).appendTo(row6);//actual

      if(targTOT==0){
        nextPage()
      }else{graphicalView(actA,actB,actC,machine,Star,mcCount)}

      

}
/*==============================================================================================================================================*/
//                                                  graphical data view
/*==============================================================================================================================================*/
function graphicalView(actA,actB,actC,machine,Star,mcCount){

  console.log(actA,actB,actC)
  $("<div id=graphCon></div>").appendTo("#slideCont");
  $("<div class=graphtitle>Machine "+machine+"</div>").appendTo("#graphCon");

  $("<div id=graphCon1></div>").appendTo("#slideCont");
  $("<div class=graphtitle>Week Productivity For Machine  "+machine+"</div>").appendTo("#graphCon1");
  $("<canvas id=chartBox style=width:800px;height=800px></canvas>").appendTo("#graphCon");

    var xValues = ["Morning", "Afternoon", "Night"];
    var yValues = [actA,actB,actC];
    var barColors = ["blue","brown","orange"];

    new Chart("chartBox", {
      type: "bar",
      data: {
        labels: xValues,
        datasets: [
          {
            label: "Target",
            fill: false,
            lineTension: 0,
            backgroundColor: "red",
            borderColor: "red",
            data: [Star,Star,Star],
            type: 'line',
            order: 0
          },
          {
            label: "Morning",
            backgroundColor: barColors,
            borderColor: 'black',
            borderWidth: 1,
            data: yValues
        },
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
        }//end scale
      }
    });

    /************************************************************************************************************** */
    //weekly gragh
    console.log(overallDictionaryweek)

      var morningdata = [];
      var afternoondata = [];
      var nightdata = [];
      var cntAS;
      var cntBS;
      var cntCS;

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
    var yValues = [5,8,10,9,15,2,10];

    new Chart("chartBox1", {
      type: "line",
      data: {
        labels: xValues,
        datasets: [
          {
            label:"Target",
            fill: false,
            lineTension: 0,
            backgroundColor: "red",
            borderColor: "red",
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
  displayinfo(overallDictionary)
}
function nextPage(){
  $("#slideCont").html("");
  mcCount++
  displayinfo(overallDictionary)
}
/*==============================================================================================================================================*/
//                                                   Start Show Slide
/*==============================================================================================================================================*/
let myDelay = setInterval(StartSlide, 10000);


function StartSlide(){
  nextPage()
}