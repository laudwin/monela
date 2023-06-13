 /********************************************export to excel*********************************************************************** */
 function XporttoExcel2(){
  
    console.log("exporting to excel in a second");//daytable1
  
    if (confirm("are you sure you want to export data to excel?")) {
      $("#Productivity").table2excel({
          filename: "DailyReport.xls"
        });
    }else {
      console.log("You pressed Cancel!") ;
    }
  }
  /******************************************print data************************************************************* */
  function printtable2(){
    var divContents = document.getElementById("Productivity").innerHTML;
    var a = window.open('', '', 'height=700, width=1000');
    a.document.write('<html>');
    //a.document.write('<body > <h1>Daily Report for 2022-02-18<br>');
    a.document.write(divContents);
    a.document.write('</body></html>');
    a.document.close();
    a.print();
  }
/***********************************************export RAW data***************************************************************************************************************/
var selected_product;
async function ExportRawData()
    {
        var traceDBDictionary =[];
        var traceDBDictionaryIncidents = []
        selected_product=""
        
       await axios.
        get("http://192.168.2.223:9101/traceability/daterange?Tablename=trace_plant.shell_traceability&StartDate="+start_date+"&EndDate="+date_end+"")
        .then(res => {
            for (var k=0; k< res.data.length ; k++ ){
                traceDBDictionary.push(res.data[k]);
            }
        }).catch(err =>{console.log(err)});
    
        await axios.
        get("http://192.168.2.223:9101/traceability/daterange?Tablename=trace_plant.shell_traceability_incident&StartDate="+start_date+"&EndDate="+date_end+"")
        .then(res => {
            for (var p=0; p< res.data.length ; p++ ){
                traceDBDictionaryIncidents.push(res.data[p]);
            }
        }).catch(err =>{console.log(err)});

        console.log(traceDBDictionary);
        console.log(traceDBDictionaryIncidents);

        swal.fire({
            title: "Export Raw_data to Excel",
            text: "click YES to download or cancel to abort ",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "YES",
        }).then((result) => {
            if (result.isConfirmed) {
                filename='Raw_data_reports.xlsx';
    
                    var ws = XLSX.utils.json_to_sheet(traceDBDictionary);
                    var ws1 = XLSX.utils.json_to_sheet(traceDBDictionaryIncidents);
                    var wb = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(wb, ws,"traceability");
                    XLSX.utils.book_append_sheet(wb, ws1,"incident");
                    XLSX.writeFile(wb,filename);
            }
            });

            
     }
/*******************************************************************************************************************************************************************************/
//--------------------------------------------------------------------Productivity VIEW----------------------------------------------------------------------------------------/
/*****************************************************************************************************************************************************************************/
/*****************************************************************************************************************************************************************************/
function show_filterBy(){
    $('.filterNav').show();
    $('.filterNav').hide();
}

function hide_filterBy(){
    $('.filterNav').hide();
}
/*****************************************************************************************************************************************************************************/
//GLOBAL VARIABLES
var dateDictionary = [];
var machineArray =["4.4","69","70","5.1","5.2","5.3","5.4","6.1","6.2","82","92","93","94","95","96","97",
                    "100","101","102","103","104","105","107","108","109","130","131","132","Welding","BR1","BR2","assembly",
                    "157","159","163","165","166","168","169","170","171","74","75"
                ]
var cycleTimeDictionary = [];
var TraceDictionary = [];
var incDictionary = [];
var DataDictionary = [];
var DataDictionaryONE = [];
var incDictionaryONE = [];
var machineDataDictionary = [];
var overallDictionary = [];
var zoomClicked ="off";
var productlist=["NO_PRODUCT_SELECTED","155mmM0121Body","155mmV31","155mmM0121PA","SBT","155mmM9HE","M2003PA","M2005BodyAssembly",
        "M2005Ogive","M0603-PFF-PA","155mmM0603Assembly","M2003Body","155mmM2000","M2003Ogive","M2005Body","M0603-PFF-Sleeve"];
/*=======================================================================================================================================================*/ 
//                                                                 Start System
/*=======================================================================================================================================================*/
function startSystem(){
    dateDictionary = [];
    machineArray =["4.4","69","70","5.1","5.2","5.3","5.4","6.1","6.2","82","92","93","94","95","96","97",
                    "100","101","102","103","104","105","107","108","109","130","131","132","Welding","BR1","BR2","assembly",
                    "157","159","163","165","166","168","169","170","171","74","75"
                ]
    cycleTimeDictionary = [];
    TraceDictionary = [];
    incDictionary = [];
    DataDictionary = [];
    DataDictionaryONE = [];
    incDictionaryONE = [];
    machineDataDictionary = [];
    overallDictionary = [];
    zoomClicked ="off";
    productlist=["NO_PRODUCT_SELECTED","155mmM0121Body","155mmV31","155mmM0121PA","SBT","155mmM9HE","M2003PA","M2005BodyAssembly",
            "M2005Ogive","M0603-PFF-PA","155mmM0603Assembly","M2003Body","155mmM2000","M2003Ogive","M2005Body","M0603-PFF-Sleeve"];

    normal_zoom()
    window.location="./plantProductivity.html";
}
/*=======================================================================================================================================================*/ 
//                                                             Productivity Report
/*=======================================================================================================================================================*/
function  productivityReport()
{
    // if(zoomClicked =="off"){
        
        $("#Productivity").html("");

        $("<h3 class=tabContHead>Plant Productivity</h3><hr class=L_hr>").appendTo("#Productivity");
        $("<p>Select <b>start_date</b> and <b>End_date</b> for a range of days and click <b>Filter</b> </p>").appendTo("#Productivity");
        $("<label class=filter>Start_Date : </label><input type=date class=DateF id=startDat> ").appendTo("#Productivity");
        $("<label class=filter>End_Date : </label><input type=date class=DateF id=endDat><br><br>").appendTo("#Productivity");

        $("<p>Select <b>product</b> to filter by product</p>").appendTo("#Productivity");
        $("<label class=filter>product : </label><select class=DateF id=productS><select/> ").appendTo("#Productivity");

        $("<br><br><button class=filterBut id=filterbtn onclick=datestructure()>filter</button><br><br>").appendTo("#Productivity");
        $("<div id=tablesView></div>").appendTo("#Productivity");       
        zoomClicked ="off"   

        for(var q=0; q<productlist.length; q++){
            $("<option value="+productlist[q]+">"+productlist[q]+"</option>").appendTo("#productS");        
        }
    // }else{
    //     swal.fire({
    //         title: "Switch not Possible!!!!",
    //         text: "please click zoom_in ",
    //         icon: "warning",
    //         confirmButtonText: "Ok",
    //     }); 
    // }
}
/*********************************************************************************************************************************************************************/
var start_date;
var end_date;
var date_end;
var selected_product;
function datestructure(){
    
        start_date = document.getElementById("startDat").value;
        end_date = document.getElementById("endDat").value;
        selected_product = document.getElementById("productS").value;
        todaysDate= new Date().toJSON().substring(0,10);

        console.log(start_date)
        console.log(end_date)
        console.log(todaysDate)
        console.log(selected_product)
    
        if(start_date!= "" && end_date!="" && end_date<=todaysDate){
            if(selected_product=="NO_PRODUCT_SELECTED"){
                $("#Productivity").html("");
                filterbyDateRange()
            }else{
                $("#Productivity").html("");
                filterbyproduct()
            }
            
        }else{
            swal.fire({
                title: "Missing Date or future date!!!!",
                text: "please select date for Start_Date and End_Date",
                icon: "error",
                confirmButtonText: "Ok",
            });
        }
    
}

async function  filterbyDateRange(){
    console.log("-------------------------------------------------------------------------------");
    $("<center><div id=preloader><div id=loader></div></div><div</div></center>").appendTo("#Productivity"); 

    // start_date = document.getElementById("startDat").value;
    // end_date = document.getElementById("endDat").value;
    if(zoomClicked =="on"){
        zoom_in();
    }

    var dateOffset = (24*60*60*1000) * 1; //1 days
    var myDate = new Date(end_date);
    myDate.setTime(myDate.getTime() + dateOffset);
    date_end =myDate.toJSON().substring(0,10);

        dateDictionary = [];
        DataDictionary = [];
        cycleTimeDictionary = [];
        machineDataDictionary = [];
        overallDictionary = [];
        incDictionary = [];
        let startD = new Date(start_date)
        let endD = new Date(end_date)
        let diffTime = Math.abs(endD - startD);
        let dateDifference = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 

        console.log(dateDifference)

        for(var i=0; i<=dateDifference;i++){
            var dateSub = new Date(end_date);
            dateSub.setDate(dateSub.getDate() - (dateDifference-[i]));
            dateDictionary.push(dateSub.toJSON().substring(0,10));
        }
        console.log(dateDictionary)
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
        get("http://192.168.2.223:9101?Tablename=trace_plant.incidentview&ColumnD=dateinc&StartDate="+start_date+"&EndDate="+date_end+"&Product=")
        .then(res => {
            for(var y=0;y<res.data.length;y++){
                incDictionary.push(res.data[y]);
            }
            // console.log(incDictionary);
            
        })
        .catch(err =>{console.log(err)});
        //-------------------------------------------------------------------------------------------------------------------------
        await axios.
            get("http://192.168.2.223:9101?Tablename=trace_plant.traceabiltyview1&ColumnD=date&StartDate="+start_date+"&EndDate="+date_end+"&Product=")
            .then(res => {
                    //sort shift data per date and machine
                    for(var zh=0; zh<dateDictionary.length; zh++){
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
                                if(dateDictionary[zh]==res.data[z].date.substring(0,10)){
                                    if(machineArray[zx]==res.data[z].machine_no){

                                        //get count for incidents
                                        for(var y=0;y<incDictionary.length;y++){
                                            if(dateDictionary[zh]==incDictionary[y].dateinc.substring(0,10) && machineArray[zx]==incDictionary[y].machine_no_inc){
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
                                        date: dateDictionary[zh],
                                        shft:[
                                            {shift:"Morning", count: morningCnt, product: morningPro, operation: morningOp,target_shift:target1},
                                            {shift:"Afternoon", count: afternoonCnt, product: afternoonPro, operation: afternoonOp,target_shift:target2},
                                            {shift:"Night", count: nightCnt, product: nightPro, operation: nightOp,target_shift:target3}]

                                    };
                                    
                                        DataDictionary.push(shellData);
                            
                        }//end for
                    }//end for
                    //-------------------------------------------------------------------------------------------------------------------------
                    console.log(DataDictionary)
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

                    console.log(overallDictionary)
                    //-------------------------------------------HTML graphics-----------------------------------------------------------------------------------
                    $("#Productivity").html("");
                    
                    $("<h3 class=tabContHead><div id=RadminArea></div>Data from : "+start_date+" to "+end_date+"<div id=adminArea></div></h3><hr class=L_hr>").appendTo("#Productivity");
                    $("<button class=export2E onclick=view_by_operator() >view by operator</button>").appendTo("#RadminArea");
                    
                    // $("<button class=export2E onclick=visualizeData() >Visualize</button>").appendTo("#RadminArea");
                    $("<button class=export2E id=inZ onclick=zoom_in() >zoom-in</button>").appendTo("#RadminArea");
                    $("<button class=export2E id=outZ onclick=zoom_out() >zoom-out</button>").appendTo("#RadminArea");
                    $("<button class=export2E onclick=ExportRawData() >| Raw_data to excel</button>").appendTo("#adminArea");
                    $("<button class=export2E onclick=XporttoExcel2() >| Export to excel</button>").appendTo("#adminArea");
                    $("<button class= printhtml onclick=printtable2() >Print</button>").appendTo("#adminArea");
                    //-------------------------------------------------------------------------------------------------------------------------------------------
                    $("<div id=tablesView></div>").appendTo("#Productivity");
                    $("<div id=VisualView></div>").appendTo("#Productivity");
                    $("#VisualView").hide();
                    $("#inZ").hide();
            
                    for(var h =0; h<machineArray.length; h++){
                        var box1 = $("<div id=box1 style=border: 2px;></div>").appendTo("#tablesView");
                        var daytable1 = $("<br><table id=daytable1 border=0></table>").appendTo(box1);
                        var row0 = $("<tr id=heading></tr>").appendTo(daytable1);
                        $("<th id=sero colspan=1 ></th>").text("Machine  : "+machineArray[h]).appendTo(row0);
                        $("<th id=sero colspan=31 ></th>").text("Output").appendTo(row0);
                        //---------------------------------------Date---------------------------------------------------------------------------------------------
                        var row1 = $("<tr id=heading></tr>").appendTo(daytable1);
                        $("<th id=sero colspan=1 ></th>").text("Date").appendTo(row1);
                        for(var j=0; j<dateDictionary.length; j++){
                            $("<td style= font-weight:bold></td>").text(dateDictionary[j]).appendTo(row1);//machine number
                        }
                        // var row1_1 = $("<tr id=heading></tr>").appendTo(daytable1);
                        // $("<th id=sero colspan=1 ></th>").text("Product").appendTo(row1_1);
            
                        // var row1_2 = $("<tr id=heading></tr>").appendTo(daytable1);
                        // $("<th id=sero colspan=1 ></th>").text("Operation no.").appendTo(row1_2);

                        //----------------------------------------Morning Shift------------------------------------------------------------------------------------
                        var row2 = $("<tr id=heading></tr>").appendTo(daytable1);
                        $("<th id=sero colspan=1 ></th>").text("Morning").appendTo(row2);
                            for(var ri1=0; ri1<overallDictionary[h].data.length;ri1++){
                                var countP1 = overallDictionary[h].data[ri1].shft[0].count
                                var targetP1 = overallDictionary[h].data[ri1].shft[0].target_shift
                                var productivityP1 = Math.round((countP1/targetP1)*100)
                                var productP1 = overallDictionary[h].data[ri1].shft[0].product
                                var operationP1 = overallDictionary[h].data[ri1].shft[0].operation
                                if(countP1=="-"){
                                    productivityP1="-"
                                    $("<td id=dataT style= font-weight:bold;background-color:powderblue;color:black></td>").text(productivityP1).appendTo(row2);//productivity
                                }else if(countP1!="-" && targetP1=="-"){
                                    productivityP1=countP1
                                    $("<td id=dataT style= font-weight:bold;background-color:purple;color:white></td>").text(productivityP1+" | "+productP1+" | "+operationP1).appendTo(row2);//productivity
                                }else{
                                    if(productivityP1<=40){
                                        $("<td id=dataT style= font-weight:bold;background-color:red;color:white></td>").text(productivityP1+"% | "+countP1+" | "+productP1+" | "+operationP1).appendTo(row2);//productivity
                                    }else if(productivityP1>=41 && productivityP1<=70){
                                        $("<td id=dataT style= font-weight:bold;background-color:orange;color:white></td>").text(productivityP1+"% | "+countP1+" | "+productP1+" | "+operationP1).appendTo(row2);//productivity
                                    }else if(productivityP1>=71){
                                        $("<td id=dataT style= font-weight:bold;background-color:green;color:white></td>").text(productivityP1+"% | "+countP1+" | "+productP1+" | "+operationP1).appendTo(row2);//productivity
                                    }   
                                }//end else
                            
                            }//end for
                        //----------------------------------------Afternoon Shift---------------------------------------------------------------------------
                        var row3 = $("<tr id=heading></tr>").appendTo(daytable1);
                        $("<th id=sero colspan=1 ></th>").text("Afternoon").appendTo(row3);
                            for(var ri2=0; ri2<overallDictionary[h].data.length;ri2++){
                                var countP2 =overallDictionary[h].data[ri2].shft[1].count
                                var targetP2 = overallDictionary[h].data[ri2].shft[1].target_shift
                                var productivityP2 = Math.round((countP2/targetP2)*100)
                                var productP2 = overallDictionary[h].data[ri2].shft[1].product
                                var operationP2 = overallDictionary[h].data[ri2].shft[1].operation
                                if(countP2=="-"){
                                    productivityP2="-"
                                    $("<td id=dataT style= font-weight:bold;background-color:powderblue;color:black></td>").text(productivityP2).appendTo(row3);//productivity
                                }else if(countP2!="-" && targetP2=="-"){
                                    productivityP2=countP2
                                    $("<td id=dataT style= font-weight:bold;background-color:purple;color:white></td>").text(productivityP2+" | "+productP2+" | "+operationP2).appendTo(row3);//productivity
                                }else{
                                    if(productivityP2<=40){
                                        $("<td id=dataT style= font-weight:bold;background-color:red;color:white></td>").text(productivityP2+"% | "+countP2+" | "+productP2+" | "+operationP2).appendTo(row3);//productivity
                                    }else if(productivityP2>=41 && productivityP2<=70){
                                        $("<td id=dataT style= font-weight:bold;background-color:orange;color:white></td>").text(productivityP2+"% | "+countP2+" | "+productP2+" | "+operationP2).appendTo(row3);//productivity
                                    }else if(productivityP2>=71){
                                        $("<td id=dataT style= font-weight:bold;background-color:green;color:white></td>").text(productivityP2+"% | "+countP2+" | "+productP2+" | "+operationP2).appendTo(row3);//productivity
                                    }   
                                }//end else
                            
                            }//end for
                        //-----------------------------------------Nigth Shift------------------------------------------------------------------------------
                        var row4 = $("<tr id=heading></tr>").appendTo(daytable1);
                        $("<th id=sero colspan=1 ></th>").text("Night").appendTo(row4);
                            for(var ri3=0; ri3<overallDictionary[h].data.length;ri3++){
                                var countP3 = overallDictionary[h].data[ri3].shft[2].count
                                var targetP3 = overallDictionary[h].data[ri3].shft[2].target_shift
                                var productivityP3 = Math.round((countP3/targetP3)*100)
                                var productP3 = overallDictionary[h].data[ri3].shft[2].product
                                var operationP3 = overallDictionary[h].data[ri3].shft[2].operation
                                if(countP3=="-"){
                                    productivityP3="-"
                                    $("<td id=dataT style= font-weight:bold;background-color:powderblue;color:black></td>").text(productivityP3).appendTo(row4);//productivity
                                }else if(countP3!="-" && targetP3=="-"){
                                    productivityP3=countP3
                                    $("<td id=dataT style= font-weight:bold;background-color:purple;color:white></td>").text(productivityP3+" | "+productP3+" | "+operationP3).appendTo(row4);//productivity
                                }else{
                                    if(productivityP3<=40){
                                        $("<td id=dataT style= font-weight:bold;background-color:red;color:white></td>").text(productivityP3+"% | "+countP3+" | "+productP3+" | "+operationP3).appendTo(row4);//productivity
                                    }else if(productivityP3>=41 && productivityP3<=70){
                                        $("<td id=dataT style= font-weight:bold;background-color:orange;color:white></td>").text(productivityP3+"% | "+countP3+" | "+productP3+" | "+operationP3).appendTo(row4);//productivity
                                    }else if(productivityP3>=71){
                                        $("<td id=dataT style= font-weight:bold;background-color:green;color:white></td>").text(productivityP3+"% | "+countP3+" | "+productP3+" | "+operationP3).appendTo(row4);//productivity
                                    }   
                                }//end else
                            
                            }//end for
                        //---------------------------------------------------------------------------------------------------------------------------------
                        $('.loader').hide();   
                    }

            }).catch(err =>{console.log(err)});
        //-------------------------------------------------------------------------------------------------------------------------

        
    
}
/*****************************************************************************************************************************************************************************/
/*****************************************************************************************************************************************************************************/
/************************************************************Productivity View By operator****************************************************/
/*****************************************************************************************************************************************************************************/
/*****************************************************************************************************************************************************************************/

async function view_by_operator(){//show data by operator

    console.log("-------------------------------------------------------------------------------");
    $("<center><div id=preloader><div id=loader></div></div><div</div></center>").appendTo("#Productivity"); 
    TraceDictionary = [];
    var operatorArr = [];
    var operatorArr_new = [];
    var operatorDictionary = [];
    var operatorDataDictionary=[];
    var overallOperatorDictionary=[];
    //get traceability data-----------------------------------------------------------------------
    await axios.
        get("http://192.168.2.223:9101?Tablename=trace_plant.traceabiltyview1&ColumnD=date&StartDate="+start_date+"&EndDate="+date_end+"&Product=")
            .then(res => {
                for(var y=0;y<res.data.length;y++){
                    TraceDictionary.push(res.data[y]);
                } 
            })
            .catch(err =>{console.log(err)});
    //-----------------------------------------------------------------------------------------------------------------------
        // console.log(TraceDictionary);    
        // console.log(incDictionary);
        // console.log(cycleTimeDictionary[0]);

        //extract operator names from database
        for(var yi=0; yi<TraceDictionary.length; yi++){
            operatorArr.push(TraceDictionary[yi].operator)
        }
        operatorArr_new = Array.from(new Set(operatorArr));
        // console.log(operatorArr_new)
        //------------------------------------------------------------------------------------------

        for(var yj=0; yj<operatorArr_new.length;yj++){
            for(var yk=0; yk<dateDictionary.length;yk++){
                var morningCnt ="-";
                var afternoonCnt ="-";
                var nightCnt ="-";

                var morningCntInc = 0;
                var afternoonCntInc = 0;
                var nightCntInc = 0;

                var morningPro ="-";
                var afternoonPro ="-";
                var nightPro ="-";

                var morningMc ="-";//machine:morningMc
                var afternoonMc ="-";//machine:afternoonMc
                var nightMc ="-";//machine:nightMc

                var morningOp ="-";
                var afternoonOp ="-";
                var nightOp ="-";

                var target1="-";
                var target2="-";
                var target3="-";
                for(var i=0; i<TraceDictionary.length;i++){
                  
                    if(operatorArr_new[yj]==TraceDictionary[i].operator && dateDictionary[yk]==TraceDictionary[i].date.substring(0,10) ){

                        for(var y=0;y<incDictionary.length;y++){
                            if(dateDictionary[yk]==incDictionary[y].dateinc.substring(0,10) && operatorArr_new[yj]==incDictionary[y].operator_inc){
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
                        //-----------------------------------------------------------------------------------------------------------------------------
                        //----------------get count,product & operation number from the normal traceability database------------------------------------
                        if(TraceDictionary[i].shift=="Morning"){
                            morningCnt = TraceDictionary[i].COUNT + morningCntInc;
                            morningPro = TraceDictionary[i].product;
                            morningOp = TraceDictionary[i].operation.replace(/\D/g,'');
                            morningMc = TraceDictionary[i].machine_no;
                        }//end if
    
                        if(TraceDictionary[i].shift=="Afternoon"){
                            afternoonCnt =  TraceDictionary[i].COUNT +afternoonCntInc;
                            afternoonPro = TraceDictionary[i].product;
                            afternoonOp = (TraceDictionary[i].operation).replace(/\D/g,'');
                            afternoonMc = TraceDictionary[i].machine_no;
                        }//end if
                        if(TraceDictionary[i].shift=="Night"){
                            nightCnt =  TraceDictionary[i].COUNT + nightCntInc;
                            nightPro = TraceDictionary[i].product;
                            nightOp = (TraceDictionary[i].operation).replace(/\D/g,'');
                            nightMc = TraceDictionary[i].machine_no;
                        }//end if
                        //---------------------------------------------------------------------------------------------------------------------------------------------
                for(var sr=0; sr<cycleTimeDictionary[0].length; sr++){
                    if(TraceDictionary[i].machine_no==cycleTimeDictionary[0][sr].machine){
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
                    }
                }//end for tracedictionary
                
                let opData={

                    operator: operatorArr_new[yj],
                    date: dateDictionary[yk],
                    shft:[
                        {shift:"Morning", count: morningCnt, product: morningPro,machine:morningMc, operation: morningOp,target_shift:target1},
                        {shift:"Afternoon", count: afternoonCnt, product: afternoonPro,machine:afternoonMc, operation: afternoonOp,target_shift:target2},
                        {shift:"Night", count: nightCnt, product: nightPro,machine:nightMc, operation: nightOp,target_shift:target3}]

                };
            
                operatorDictionary.push(opData);  
            }//end for date
              
        }//end for operator
        console.log(operatorDictionary)
        //---------------------------------------------------------------------------------------
        //sort data by operator
        for(var ax=0; ax<operatorArr_new.length; ax++){
            operatorDataDictionary = [];
            for(var a=0; a<operatorDictionary.length; a++){
                if(operatorArr_new[ax]==operatorDictionary[a].operator){
                    operatorDataDictionary.push(operatorDictionary[a]);
                }//end if
            }//end for

            let operatorData=
                        {
                            operator: operatorArr_new[ax],
                            data: operatorDataDictionary
                        };
                        overallOperatorDictionary.push(operatorData);
        }//end for
        console.log(overallOperatorDictionary)
        $('#preloader').hide();
    //-------------------------------------------HTML graphics-----------------------------------------------------------------------------------
    $("#RadminArea").html("");
    $("<button class=export2E onclick=filterbyDateRange() >view by machine</button>").appendTo("#RadminArea");
    $("<button class=export2E id=inZ onclick=zoom_in() >zoom-in</button>").appendTo("#RadminArea");
    $("<button class=export2E id=outZ onclick=zoom_out() >zoom-out</button>").appendTo("#RadminArea");
    $("#adminArea").html("");
    $("#tablesView").html("");

    if(zoomClicked =="on"){
        $("#outZ").hide();
        $("#inZ").show();   
    }else{
        $("#outZ").show();
        $("#inZ").hide(); 
    }
    
    for(var h =0; h<operatorArr_new.length; h++){
        var box1 = $("<div id=box1 style=border: 2px;></div>").appendTo("#tablesView");
        var daytable1 = $("<br><table id=daytable1 border=0></table>").appendTo(box1);
        var row0 = $("<tr id=heading></tr>").appendTo(daytable1);
        $("<th id=sero colspan=1 ></th>").text(operatorArr_new[h]).appendTo(row0);
        $("<th id=sero colspan=31 ></th>").text("Output").appendTo(row0);
        //---------------------------------------Date---------------------------------------------------------------------------------------------
        var row1 = $("<tr id=heading></tr>").appendTo(daytable1);
        $("<th id=sero colspan=1 ></th>").text("Date").appendTo(row1);
        for(var j=0; j<dateDictionary.length; j++){
            $("<td style= font-weight:bold></td>").text(dateDictionary[j]).appendTo(row1);//machine number
        }
       
        //----------------------------------------Morning Shift------------------------------------------------------------------------------------
        var row2 = $("<tr id=heading></tr>").appendTo(daytable1);
        $("<th id=sero colspan=1 ></th>").text("Morning").appendTo(row2);
            for(var ri1=0; ri1<overallOperatorDictionary[h].data.length;ri1++){
                var countP1 = overallOperatorDictionary[h].data[ri1].shft[0].count
                var targetP1 = overallOperatorDictionary[h].data[ri1].shft[0].target_shift
                var productivityP1 = Math.round((countP1/targetP1)*100)
                var productP1 = overallOperatorDictionary[h].data[ri1].shft[0].product
                var operationP1 = overallOperatorDictionary[h].data[ri1].shft[0].operation
                var machineP1 = overallOperatorDictionary[h].data[ri1].shft[0].machine
                if(countP1=="-"){
                    productivityP1="-"
                    $("<td id=dataT style= font-weight:bold;background-color:powderblue;color:black></td>").text(productivityP1).appendTo(row2);//productivity
                }else if(countP1!="-" && targetP1=="-"){
                    productivityP1=countP1
                    $("<td id=dataT style= font-weight:bold;background-color:purple;color:white></td>").text(productivityP1+" | "+productP1+" | Mc"+machineP1+ " | OP"+operationP1).appendTo(row2);//productivity
                }else{
                    if(productivityP1<=40){
                        $("<td id=dataT style= font-weight:bold;background-color:red;color:white></td>").text(productivityP1+"% | "+countP1+" | "+productP1+" | Mc"+machineP1+" | OP"+operationP1).appendTo(row2);//productivity
                    }else if(productivityP1>=41 && productivityP1<=70){
                        $("<td id=dataT style= font-weight:bold;background-color:orange;color:white></td>").text(productivityP1+"% | "+countP1+" | "+productP1+" | Mc"+machineP1+" | OP"+operationP1).appendTo(row2);//productivity
                    }else if(productivityP1>=71){
                        $("<td id=dataT style= font-weight:bold;background-color:green;color:white></td>").text(productivityP1+"% | "+countP1+" | "+productP1+" | Mc"+machineP1+" | OP"+operationP1).appendTo(row2);//productivity
                    }   
                }//end else
            
            }//end for
        //----------------------------------------Afternoon Shift---------------------------------------------------------------------------
        var row3 = $("<tr id=heading></tr>").appendTo(daytable1);
        $("<th id=sero colspan=1 ></th>").text("Afternoon").appendTo(row3);
            for(var ri2=0; ri2<overallOperatorDictionary[h].data.length;ri2++){
                var countP2 =overallOperatorDictionary[h].data[ri2].shft[1].count
                var targetP2 = overallOperatorDictionary[h].data[ri2].shft[1].target_shift
                var productivityP2 = Math.round((countP2/targetP2)*100)
                var productP2 = overallOperatorDictionary[h].data[ri2].shft[1].product
                var operationP2 = overallOperatorDictionary[h].data[ri2].shft[1].operation
                var machineP2 = overallOperatorDictionary[h].data[ri2].shft[1].machine
                if(countP2=="-"){
                    productivityP2="-"
                    $("<td id=dataT style= font-weight:bold;background-color:powderblue;color:black></td>").text(productivityP2).appendTo(row3);//productivity
                }else if(countP2!="-" && targetP2=="-"){
                    productivityP2=countP2
                    $("<td id=dataT style= font-weight:bold;background-color:purple;color:white></td>").text(productivityP2+" | "+productP2+" | Mc"+machineP2+ " | OP"+operationP2).appendTo(row3);//productivity
                }else{
                    if(productivityP2<=40){
                        $("<td id=dataT style= font-weight:bold;background-color:red;color:white></td>").text(productivityP2+"% | "+countP2+" | "+productP2+" | Mc"+machineP2+ " | OP"+operationP2).appendTo(row3);//productivity
                    }else if(productivityP2>=41 && productivityP2<=70){
                        $("<td id=dataT style= font-weight:bold;background-color:orange;color:white></td>").text(productivityP2+"% | "+countP2+" | "+productP2+" | Mc"+machineP2+ " | OP"+operationP2).appendTo(row3);//productivity
                    }else if(productivityP2>=71){
                        $("<td id=dataT style= font-weight:bold;background-color:green;color:white></td>").text(productivityP2+"% | "+countP2+" | "+productP2+" | Mc"+machineP2+ " | OP"+operationP2).appendTo(row3);//productivity
                    }   
                }//end else
            
            }//end for
        //-----------------------------------------Nigth Shift------------------------------------------------------------------------------
        var row4 = $("<tr id=heading></tr>").appendTo(daytable1);
        $("<th id=sero colspan=1 ></th>").text("Night").appendTo(row4);
            for(var ri3=0; ri3<overallOperatorDictionary[h].data.length;ri3++){
                var countP3 = overallOperatorDictionary[h].data[ri3].shft[2].count
                var targetP3 = overallOperatorDictionary[h].data[ri3].shft[2].target_shift
                var productivityP3 = Math.round((countP3/targetP3)*100)
                var productP3 = overallOperatorDictionary[h].data[ri3].shft[2].product
                var operationP3 = overallOperatorDictionary[h].data[ri3].shft[2].operation
                var machineP3 = overallOperatorDictionary[h].data[ri3].shft[2].machine
                if(countP3=="-"){
                    productivityP3="-"
                    $("<td id=dataT style= font-weight:bold;background-color:powderblue;color:black></td>").text(productivityP3).appendTo(row4);//productivity
                }else if(countP3!="-" && targetP3=="-"){
                    productivityP3=countP3
                    $("<td id=dataT style= font-weight:bold;background-color:purple;color:white></td>").text(productivityP3+" | "+productP3+" | Mc"+machineP3+ " | OP"+operationP3).appendTo(row4);//productivity
                }else{
                    if(productivityP3<=40){
                        $("<td id=dataT style= font-weight:bold;background-color:red;color:white></td>").text(productivityP3+"% | "+countP3+" | "+productP3+" | Mc"+machineP3+ " | OP"+operationP3).appendTo(row4);//productivity
                    }else if(productivityP3>=41 && productivityP3<=70){
                        $("<td id=dataT style= font-weight:bold;background-color:orange;color:white></td>").text(productivityP3+"% | "+countP3+" | "+productP3+" | Mc"+machineP3+ " | OP"+operationP3).appendTo(row4);//productivity
                    }else if(productivityP3>=71){
                        $("<td id=dataT style= font-weight:bold;background-color:green;color:white></td>").text(productivityP3+"% | "+countP3+" | "+productP3+" | Mc"+machineP3+ " | OP"+operationP3).appendTo(row4);//productivity
                    }   
                }//end else
               
            }//end for
           
        //---------------------------------------------------------------------------------------------------------------------------------
    }
   
}

/*****************************************************************************************************************************************************************************/
/*****************************************************************************************************************************************************************************/
function zoom_out()
{
        console.log("zoomed out")
        zoomClicked ="on"
        var Page = document.getElementById('body');
        var tablezoom = document.getElementById("tablesView");
        var height= tablezoom.clientHeight;
        var zoom = parseInt(Page.style.zoom) - 50 +'%'
        tablezoom.style.height = height + 900 + "px";
        Page.style.zoom = zoom;
        $("#outZ").hide();
        $("#inZ").show();   
}
function zoom_in(){
    console.log("zoomed in")
    zoomClicked ="off"
    var Page = document.getElementById('body');
    var tablezoom = document.getElementById("tablesView");
    var height= tablezoom.clientHeight;
    var zoom = parseInt(Page.style.zoom) + 50 +'%'
    tablezoom.style.height = "720px";
    Page.style.zoom = zoom;
    $("#outZ").show();
    $("#inZ").hide();  
}
function normal_zoom(){
    console.log("Normal zoom")
    zoomClicked ="off"
    var Page = document.getElementById('body');
    var tablezoom = document.getElementById("tablesView");
    var height= tablezoom.clientHeight;
    var zoom = parseInt(Page.style.zoom) +'100%'
    tablezoom.style.height = "720px";
    Page.style.zoom = zoom;
    $("#outZ").show();
    $("#inZ").hide();    
}            
/*****************************************************************************************************************************************************************************/
/*****************************************************************Filter by Product*******************************************************************************************/
/*****************************************************************************************************************************************************************************/
function filterChangebyproduct(){
    selected_product = document.getElementById("productS").value;
    filterbyproduct()
}
async function filterbyproduct(){
    console.log("filter by product")
    // selected_product = document.getElementById("productS").value;
    
    console.log(selected_product)

    var dateOffset = (24*60*60*1000) * 1; //1 days
    var myDate = new Date(end_date);
    myDate.setTime(myDate.getTime() + dateOffset);
    date_end =myDate.toJSON().substring(0,10);

        dateDictionary = [];
        DataDictionary = [];
        DataDictionaryONE = [];
        incDictionaryONE = [];
        overallDictionary = [];
        incDictionary = [];
        let startD = new Date(start_date)
        let endD = new Date(end_date)
        let diffTime = Math.abs(endD - startD);
        let dateDifference = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 

        for(var i=0; i<=dateDifference;i++){
            var dateSub = new Date(end_date);
     
            dateSub.setDate(dateSub.getDate() - (dateDifference-[i]));
            var dayofweek = dateSub.toDateString().substring(0,3);
            

            if(dayofweek =='Sat' || dayofweek =='Sun' ){
                //do nothing
            }else{
                dateDictionary.push(dateSub.toJSON().substring(0,10));
            }
        }
        console.log(dateDictionary)
        
        //-------------------------------------------------------------------------------------------------------------------------
        await axios.
        get("http://192.168.2.223:9101?Tablename=trace_plant.traceabiltyview1&ColumnD=date&StartDate="+start_date+"&EndDate="+date_end+"&Product="+selected_product+"")
        .then(res => {
            for(var y=0;y<res.data.length;y++){
                DataDictionary.push(res.data[y]);
            }//including weekends

            for(var x=0; x<dateDictionary.length; x++){
                for(var y=0;y<DataDictionary.length;y++){
                    if(dateDictionary[x]==(DataDictionary[y].date).substring(0,10)){
                        DataDictionaryONE.push(DataDictionary[y]);
                    } 
                }
            }//exclude weekends
            
            
        })
        .catch(err =>{console.log(err)});
        //-------------------------------------------------------------------------------------------------------------------------
        await axios.
        get("http://192.168.2.223:9101?Tablename=trace_plant.incidentview&ColumnD=dateinc&StartDate="+start_date+"&EndDate="+date_end+"&Product="+selected_product+"")
        .then(res => {
            for(var z=0;z<res.data.length;z++){
                incDictionary.push(res.data[z]);
            }//including weekends
            for(var x=0; x<dateDictionary.length; x++){
                for(var y=0;y<incDictionary.length;y++){
                    if(dateDictionary[x]==(incDictionary[y].dateinc).substring(0,10)){
                        incDictionaryONE.push(incDictionary[y]);
                    } 
                }
            }//exclude weekends
            
        })
        .catch(err =>{console.log(err)});
        //-------------------------------------------------------------------------------------------------------------------------
        filterbyproductVIEW(selected_product)
        
}
//===================================================================================================================================================================
//                                                              Filter By Product view
//===================================================================================================================================================================
function filterbyproductVIEW(selected_product){
    console.log(DataDictionary);
    console.log(incDictionary);
    console.log("===========================================");
    console.log(DataDictionaryONE);
    console.log(incDictionaryONE);


    var operationArr=[];
    var operationArrHead;

    var grCount;
    var grONECount;
    var graph_Y_Values=[];
    var graph_Y_ValuesONE=[];
    var startop
    var removeop


    if(selected_product== "155mmM2000"){
        startop = 270;
        removeop =320

    }else{
        startop = 0;
    }


    for(var r=0; r<DataDictionary.length;r++){
        // .replace(/\D/g,'')
        if(DataDictionary[r].operation!=undefined &&  (DataDictionary[r].operation.replace(/\D/g,'')).substring(0,3) >= startop){
            operationArr.push((DataDictionary[r].operation) .replace(/\D/g,''))
        }

    }
    for(var r=0; r<incDictionary.length;r++){
        if(incDictionary[r].operation_inc!=undefined && (incDictionary[r].operation_inc.replace(/\D/g,'')).substring(0,3) >= startop)
        operationArr.push((incDictionary[r].operation_inc) .replace(/\D/g,''))
    }
    //----------------------------------------------------------------------------------------------------
    operationArrHead = Array.from(new Set(operationArr.sort()));
    console.log(operationArr)
    console.log(operationArrHead)
    //----------------------------------------------------------------------------------------------------
        
         
    //----------------------------------------------------------------------------------------------------
    for(var ri=0; ri<operationArrHead.length;ri++){
        grCount=0;
        grONECount=0;
        for(var rj=0; rj<DataDictionary.length;rj++){
            if(operationArrHead[ri]==(DataDictionary[rj].operation).replace(/\D/g,'')){
                grCount+=DataDictionary[rj].COUNT;
            }//end if
        }//end for datadictionary
        //-------------------------------------------------------------------------------------
        for(var rj=0; rj<DataDictionaryONE.length;rj++){
            if(operationArrHead[ri]==(DataDictionaryONE[rj].operation).replace(/\D/g,'')){
                grONECount+=DataDictionaryONE[rj].COUNT;
            }//end if
        }//end for datadictionaryONE
        //-------------------------------------------------------------------------------------
        for(var rk=0; rk<incDictionary.length;rk++){
            if(operationArrHead[ri]==(incDictionary[rk].operation_inc).replace(/\D/g,'')){
                grCount+=incDictionary[rk].COUNT;
            }//end if
        }//end for incdictionary
        //--------------------------------------------------------------------------------------
        for(var rk=0; rk<incDictionaryONE.length;rk++){
            if(operationArrHead[ri]==(incDictionaryONE[rk].operation_inc).replace(/\D/g,'')){
                grONECount+=incDictionaryONE[rk].COUNT;
            }//end if
        }//end for incdictionaryONE
        //---------------------------------------------------------------------------------------
        graph_Y_Values.push(grCount)
        graph_Y_ValuesONE.push(grONECount)
    }//end for operationHead
    console.log(graph_Y_Values)
    //----------------------------------------------------------------------------------------------------
    var dateVary= dateDictionary.length;
    console.log("dateDifference : "+dateVary)

    var daytarget=dateVary*300;
    var midtarget=dateVary*150;
    console.log(daytarget)
    console.log(midtarget)

    var barColors = [];

    for(var rs=0; rs<graph_Y_Values.length;rs++){
        if(graph_Y_Values[rs] <= midtarget){
            barColors.push("red")  
        }
        if(graph_Y_Values[rs] > midtarget && graph_Y_Values[rs] < daytarget){
            barColors.push("orange")  
        }
        if(graph_Y_Values[rs] >= daytarget){
            barColors.push("green")  
        }
    }

    console.log(barColors)
    //---------------------------------------------------------------------------------------------------------------------------------------------------------------------
    $("#Productivity").html("");
    $("<h3 class=tabContHead><div id=RadminArea></div>Data from : "+start_date+" to "+end_date+"<div id=adminArea></div></h3><hr class=L_hr>").appendTo("#Productivity");

    //-------------------------------------------------------------------------------------------------------------------------------------------
    $("<div id=tablesView></div>").appendTo("#Productivity");
    $("<div id=VisualView></div>").appendTo("#Productivity");
    $("#VisualView").hide();
    $("#inZ").hide();

    var container = $("<div id=boxed style=border: 2px;></div>").appendTo("#tablesView");
        var box1 = $("<div id=box1Graph style=border: 2px;></div>").appendTo(container);
        $("<div id=headGraph></div>").text("Product  : "+selected_product).appendTo(box1);
        $("<div id=headGraph2></div><br><br><hr>").appendTo(box1);
        $("<label class=filter>product : </label><select class=DateF id=productS><select/><button class=changebut onclick=filterChangebyproduct()>Change</botton> ").appendTo("#headGraph2");
        $("<canvas id=graphDisplay></canvas>").appendTo(box1);
        $("<div id=headtitle></div>").text("Operation").appendTo(box1);
       


        var box2 = $("<div id=box2Graph style=border: 2px;></div>").appendTo(container);
        $("<div id=headGraph></div>").text("Operation Description").appendTo(box2);

        axios
            .get("http://192.168.2.223:9101/traceability/opdescription?product="+selected_product+"")
            .then(res => {
                console.log(res.data)
                for(i=0; i<res.data.length; i++){
                    $("<div id=opdes></div><br>").text("OP"+res.data[i].opNo+"___"+res.data[i].op_description).appendTo(box2);
                }
            })
            .catch(err =>{ console.error(err)})


        for(var q=0; q<productlist.length; q++){
            $("<option value="+productlist[q]+">"+productlist[q]+"</option>").appendTo("#productS");        
        }
        
        new Chart("graphDisplay", {
          type: "bar",
          data: {
            labels: operationArrHead,
            datasets: [{
              label:'With weekend',
              backgroundColor: "royalblue",
              borderColor: 'black',
              borderWidth: 1,
              data: graph_Y_Values
            },{
                label:'Without weekend',
                backgroundColor:"orange",
                borderColor: 'black',
                borderWidth: 1,
                data: graph_Y_ValuesONE
            }]
          },
          options: {
            animation: {
                //duration: 1,
                onComplete: function () {
                    var chartInstance = this.chart,
                        ctx = chartInstance.ctx;
                    ctx.textAlign = 'center';
                    ctx.fillStyle = "rgba(0, 0, 0, 1)";
                    ctx.textBaseline = 'bottom';

                    this.data.datasets.forEach(function (dataset, i) {
                        var meta = chartInstance.controller.getDatasetMeta(i);
                        meta.data.forEach(function (bar, index) {
                            var data = dataset.data[index];
                            ctx.fillText(data, bar._model.x, bar._model.y - 5);

                        });
                    });
                }
            },
            scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Operation number'
                  },
                },
                y: {
                    title: {
                      display: true,
                      text: 'Quantity'
                    },
                  }
              },
            plugins: {
                datalabels: {
                    display: true,
                    color: 'black',
                    rotation: 80,
                  },
                autocolors: false,
                annotation: {
                  annotations: {
                    line1: {
                      type: 'line',
                      mode: 'horizontal',
                      yMin: daytarget,
                      yMax: daytarget,
                      borderColor: 'green',
                      borderWidth: 2,
                    },
                    line2: {
                        type: 'line',
                        mode: 'horizontal',
                        yMin: midtarget,
                        yMax: midtarget,
                        borderColor: 'purple',
                        borderWidth: 1,
                      }
                      
                  }
                }
              }
          }
        });

    
}