/*============================================================================================================================================================================*/
//                                                                      Global Variables
/*============================================================================================================================================================================*/
var sessionStatus = localStorage.getItem("mysessionStat");
var sessionName = localStorage.getItem("mysessionName");

var pgsh7=1;
var traceArray = []
var traceArrayInc = []
var listArray = []
var serialNumG
//=============================================================================================================================================
//                                                      Start System
//=============================================================================================================================================
function startSystem(){
    traceDictionary = [];
    incidentDictionary = [];
    document.getElementById("dataDetails").innerHTML = ""
  $("#ShellHistory").html("");
  $("<h3 class=tabContHead>Shell Traceability</h3>").appendTo("#ShellHistory");
  $("<p>Select <b>Date</b> and click <b>NEXT</b> to show report for one day </p><br>").appendTo("#ShellHistory");
  //-----------------------------------------------------------------------
  $("<div id=filterCon></div>").appendTo("#ShellHistory");

  $("<div id=filterSerialCon class=filterContainer></div>").appendTo("#filterCon");
      $("<label class=filter>Shell_Num : </label><input type=text class=filHolder id=filtershell ></input><br><br>").appendTo("#filterSerialCon")
      $("<label class=filter>Cast_Code : </label><input type=text class=filHolder id=filtercast ></input><br><br>").appendTo("#filterSerialCon")
      $("<label class=filter>Heat_Code : </label><input type=text class=filHolder id=filterheat ></input><br><br>").appendTo("#filterSerialCon")
      $("<button class=placeHbtn id=filterbtn onclick=filterdata()>Filter</button>").appendTo("#filterSerialCon");
  //----------------------------------------------------------------------- 
  if(listArray.length==0){
    console.log("search list = "+listArray.length)   
  }else{
    $("<br><br><div id=listCon></div>").appendTo("#ShellHistory");
    $("<h1>Search List</h1><div class=XptE><button class=XptEbut onclick=XporttoExcel2() >Xport_to_Excel</button></div>").appendTo("#listCon");
    var table = $("<table id=Prod_table ></table>").appendTo("#listCon");

    var row100 = $("<tr id=heading></tr>").appendTo(table);
        $("<th id=sero class=viewShell></th>").text("ID").appendTo(row100);
        $("<th id=sero class=viewShell></th>").text("Serial").appendTo(row100);
        $("<th id=sero class=viewShell></th>").text("Date").appendTo(row100);
        $("<th id=sero class=viewShell></th>").text("Operator").appendTo(row100);
        $("<th id=sero class=viewShell></th>").text("Shift").appendTo(row100);
        $("<th id=sero class=viewShell></th>").text("Product").appendTo(row100);
        $("<th id=sero class=viewShell></th>").text("Operation").appendTo(row100);
        $("<th id=sero class=viewShell></th>").text("Machine").appendTo(row100);
        $("<th id=sero class=viewShell></th>").text("Determination").appendTo(row100);
        $("<th id=sero class=viewShell></th>").text("Comments").appendTo(row100);

        for(var i=0; i<listArray.length;i++){

          var dataResult = listArray[i];
  /*-------------------------------------------------Table Data---------------------------------------------------------------------*/  
          var row1_1 = $("<tr class=dataP id="+i+"></tr>").appendTo(table);       
          $("<td style= font-weight:bold></td>").text(i).appendTo(row1_1);//count
          $("<td style= font-weight:bold></td>").text(dataResult.serialNumber).appendTo(row1_1);//Serial No

          if(dataResult.comments == "NO_DATA"){
            $("<td colspan=15 style= font-weight:bold></td>").text(dataResult.comments).appendTo(row1_1);//Comments
          }else{
            $("<td style= font-weight:bold></td>").text(dataResult.traceabilityDate.substring(0,10)).appendTo(row1_1);//Date .substring(0,10)
            $("<td style= font-weight:bold></td>").text(dataResult.operator).appendTo(row1_1);//Operator
            $("<td style= font-weight:bold></td>").text(dataResult.shift).appendTo(row1_1);//Shift
            $("<td style= font-weight:bold></td>").text(dataResult.product).appendTo(row1_1);//Product
            $("<td style= font-weight:bold></td>").text(dataResult.operationNo).appendTo(row1_1);//Operation
            $("<td style= font-weight:bold></td>").text(dataResult.machineNo).appendTo(row1_1);//Machine
            $("<td style= font-weight:bold></td>").text(dataResult.determination).appendTo(row1_1);//Machine
            $("<td style= font-weight:bold></td>").text(dataResult.comments).appendTo(row1_1);//Comments
          }

        }


  }
  
  $('#percentage').hide();
  $('#preloader').hide();
}
/*============================================================================================================================================================================*/
//                                                                    Clear Filter Form
/*============================================================================================================================================================================*/
function filterclear(){
    
  console.log("clear")
    document.getElementById("filtershell").value="";
    document.getElementById("filtercast").value="";
    document.getElementById("filterheat").value="";
}
/*============================================================================================================================================================================*/
//                                                                    Collect Filter Data
/*============================================================================================================================================================================*/
function filterdata(){

  var filterShell = document.getElementById("filtershell").value;
  var filtercCast = document.getElementById("filtercast").value.toUpperCase();
  var filterHeat = document.getElementById("filterheat").value.toUpperCase();

    console.log("filter by serial number");
    filterbySerial_Number(filterShell,filtercCast,filterHeat)
}
/*============================================================================================================================================================================*/
//                                                                    Filter By Serial Number
/*============================================================================================================================================================================*/
function filterbySerial_Number(filterShell,filtercCast,filterHeat){

  var serialNum = filterShell+"-"+filtercCast+"-"+filterHeat
      serialNumG = filterShell+"-"+filtercCast+"-"+filterHeat
  var filterDate7 = '';
  var filterShift7 = '';
  var filterMachine7 = '';
  console.log(serialNum);
  filterViuw(serialNum,filterDate7,filterShift7,filterMachine7)
}
/*==========================================================================================================================================================================*/
//                                                                    Filter View
/*============================================================================================================================================================================*/
async function filterViuw(serialNum,filterDate7,filterShift7,filterMachine7){
  $("#ShellHistory").html("");
  
  var resDataN, resDataINC;
  traceArray = []
  traceArrayInc = []

  
  await axios
  .get('http://192.168.2.223:9100/traceability/filterby?Tablename=trace_plant.shell_traceability&serialNumber='+serialNum+'&traceabilityDate='+filterDate7+'&shift='+filterShift7+'&machineNo='+filterMachine7+'')
    .then(res => {
        console.log(res);
        resDataN = res.data.length;
        console.log(resDataN);
          /*-------------------------------------------------Table Headings---------------------------------------------------------------------*/
          var production_table = $("<table id=Prod_table border=1></table>").appendTo("#ShellHistory");
          // if(pageN == ""){
            var row1 = $("<tr id=heading></tr>").appendTo(production_table);
            $("<th id=sero ></th>").text("Add_to_List").appendTo(row1);
            $("<th id=serEd ></th>").text("ShellNo").appendTo(row1);
            $("<th id=sero ></th>").text("Cast").appendTo(row1);
            $("<th id=sero ></th>").text("Heat").appendTo(row1);
            $("<th id=sero ></th>").text("Serial No").appendTo(row1);
            $("<th id=sero ></th>").text("Date").appendTo(row1);
            $("<th id=sero ></th>").text("Operator").appendTo(row1);
            $("<th id=sero ></th>").text("Supervisor").appendTo(row1);
            $("<th id=sero ></th>").text("Team-Leader").appendTo(row1);
            $("<th id=sero ></th>").text("Shift").appendTo(row1);
            $("<th id=sero ></th>").text("Product").appendTo(row1);
            $("<th id=sero ></th>").text("Operation").appendTo(row1);
            $("<th id=sero ></th>").text("Machine").appendTo(row1);
            $("<th id=sero ></th>").text("Determination").appendTo(row1);
            $("<th id=sero ></th>").text("Comments").appendTo(row1);
            $("<th id=seroInfo ></th>").text("Captured By").appendTo(row1);
          // }

          for(var i=0; i<res.data.length;i++){

            var dataResult = res.data[i];
            traceArray.push(res.data[i])
    /*-------------------------------------------------Table Data---------------------------------------------------------------------*/         
            var row1_1 = $("<tr class=dataP id="+dataResult.id+"></tr>").appendTo(production_table);
            $("<td><button class=editbut id="+dataResult.id+" onclick=addtolist(this)>Add_to_List</button></td>").appendTo(row1_1);
            $("<td style= font-weight:bold></td>").text(dataResult.shellNo).appendTo(row1_1);//ShellNo
            $("<td style= font-weight:bold></td>").text(dataResult.castCode).appendTo(row1_1);//Cast
            $("<td style= font-weight:bold></td>").text(dataResult.heatCode).appendTo(row1_1);//Heat
            $("<td style= font-weight:bold></td>").text(dataResult.serialNumber).appendTo(row1_1);//Serial No
            $("<td style= font-weight:bold></td>").text(dataResult.traceabilityDate.substring(0,10)).appendTo(row1_1);//Date .substring(0,10)
            $("<td style= font-weight:bold></td>").text(dataResult.operator).appendTo(row1_1);//Operator
            $("<td style= font-weight:bold></td>").text(dataResult.supervisor).appendTo(row1_1);//Supervisor
            $("<td style= font-weight:bold></td>").text(dataResult.teamleader).appendTo(row1_1);//Team-Leader
            $("<td style= font-weight:bold></td>").text(dataResult.shift).appendTo(row1_1);//Shift
            $("<td style= font-weight:bold></td>").text(dataResult.product).appendTo(row1_1);//Product
            $("<td style= font-weight:bold></td>").text(dataResult.operationNo).appendTo(row1_1);//Operation
            $("<td style= font-weight:bold></td>").text(dataResult.machineNo).appendTo(row1_1);//Machine
            $("<td style= font-weight:bold></td>").text(dataResult.determination).appendTo(row1_1);//Determination
            $("<td style= font-weight:bold></td>").text(dataResult.comments).appendTo(row1_1);//Comments
            $("<td style= font-weight:bold></td>").text(dataResult.userName).appendTo(row1_1);//Comments
          }

          var row2 = $("<tr id=heading></tr>").appendTo(production_table);
        $("<th id=seroHD class=inctable colspan=14 ></th>").text("On Incidents").appendTo(row2)
        $("<td colspan=2><button class=noDataBut id=noData onclick=addtolist(this)>Add As No_Data</button></td>").appendTo(row2);//ID;
       

          $('#preloader').hide();
        })
    .catch(err =>{ console.error(err)

          if(err == "Error: Request failed with status code 401"){
            
            swal.fire({
              title: "session expired!!!!!!!",
              text: "Please Sign-in",
              icon: "error",
              confirmButtonText: "Sign-in",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location="/pages/login/sign_in.html";
            }else{window.location="/pages/login/sign_in.html";}
            });
            
          }

          if(err == "Uncaught TypeError: Cannot read properties of null (reading 'split')"){
            swal.fire({
              title: "session expired!!!!!!!",
              text: "Please Sign-in",
              icon: "error",
              confirmButtonText: "Sign-in",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location="/pages/login/sign_in.html";
            }else{window.location="/pages/login/sign_in.html";}
            });
          }

          if(err == "Error: Network Error"){
            console.log("No Network")
            $("#ShellHistory").html("");
            $("<center><h1 id=errormsg>NO NETWORK</h1></center>").appendTo("#ShellHistory");
          }

        
    });
  /*============================================================================================================================*/
  //                                                      On Incidents View
  /*============================================================================================================================*/

  await axios
      .get('http://192.168.2.223:9100/traceability/filterby?Tablename=trace_plant.shell_traceability_incident&serialNumber='+serialNum+'&traceabilityDate='+filterDate7+'&shift='+filterShift7+'&machineNo='+filterMachine7+'', {
      
      })
  .then(res => {
        
          resDataINC = res.data.length;
          console.log(resDataINC);
          var production_table = $("<table class=inctable id=Prod_table border=1></table>").appendTo("#ShellHistory");

          var row1 = $("<tr id=heading></tr>").appendTo(production_table);
          $("<th id=sero ></th>").text("Add_to_List").appendTo(row1);
          $("<th id=sero ></th>").text("ShellNo").appendTo(row1);
          $("<th id=sero ></th>").text("Cast").appendTo(row1);
          $("<th id=sero ></th>").text("Heat").appendTo(row1);
          $("<th id=sero ></th>").text("Serial No").appendTo(row1);

          $("<th id=sero ></th>").text("Date").appendTo(row1);
          $("<th id=sero ></th>").text("Operator").appendTo(row1);
          $("<th id=sero ></th>").text("Supervisor").appendTo(row1);
          $("<th id=sero ></th>").text("Team-Leader").appendTo(row1);
          $("<th id=sero ></th>").text("Shift").appendTo(row1);
          $("<th id=sero ></th>").text("Product").appendTo(row1);
          $("<th id=sero ></th>").text("Operation").appendTo(row1);
          $("<th id=sero ></th>").text("Machine").appendTo(row1);
          $("<th id=sero ></th>").text("Determination").appendTo(row1);
          $("<th id=sero ></th>").text("Comments").appendTo(row1);
          $("<th id=sero ></th>").text("Captured By").appendTo(row1);

          for(i=0; i<res.data.length;i++){
          //console.log( res.res.datadata.results[i])
          
          var dictINC = res.data[i];
          traceArrayInc.push(res.data[i])
          var row1_1 = $("<tr class=dataP id="+dictINC.id+"></tr>").appendTo(production_table);
          $("<td><button class=editbut id="+dictINC.id+" onclick=addtolistinc(this)>Add_to_List</button></td>").appendTo(row1_1);//ID
          $("<td style= font-weight:bold></td>").text(dictINC.shellNo).appendTo(row1_1);//ShellNo
          $("<td style= font-weight:bold></td>").text(dictINC.castCode).appendTo(row1_1);//Cast
          $("<td style= font-weight:bold></td>").text(dictINC.heatCode).appendTo(row1_1);//Heat
          $("<td style= font-weight:bold></td>").text(dictINC.serialNumber).appendTo(row1_1);//Serial No
          $("<td style= font-weight:bold></td>").text(dictINC.traceabilityDate.substring(0,10)).appendTo(row1_1);//Date
          $("<td style= font-weight:bold></td>").text(dictINC.operator).appendTo(row1_1);//Operator
          $("<td style= font-weight:bold></td>").text(dictINC.supervisor).appendTo(row1_1);//Supervisor
          $("<td style= font-weight:bold></td>").text(dictINC.teamleader).appendTo(row1_1);//Team-Leader
          $("<td style= font-weight:bold></td>").text(dictINC.shift).appendTo(row1_1);//Shift
          $("<td style= font-weight:bold></td>").text(dictINC.product).appendTo(row1_1);//Product
          $("<td style= font-weight:bold></td>").text(dictINC.operationNo).appendTo(row1_1);//Operation
          $("<td style= font-weight:bold></td>").text(dictINC.machineNo).appendTo(row1_1);//Machine
          $("<td style= font-weight:bold></td>").text(dictINC.determination).appendTo(row1_1);//Determination
          $("<td style= font-weight:bold></td>").text(dictINC.comments).appendTo(row1_1);//Comments
          $("<td style= font-weight:bold></td>").text(dictINC.userName).appendTo(row1_1);//Comments
         
      }
          document.getElementById("dataDetails").innerHTML = "TraceData : "+resDataN+" || incidents : "+resDataINC +" || total : "+(resDataN+resDataINC)
          
      }) 
}
/*===============================================================================================================================================================*/
//                                            Add To list                        
/*===============================================================================================================================================================*/
function addtolist(shell_id){

  var shelID = shell_id.id
  console.log(shelID)
  
  for(var i=0; i<traceArray.length; i++){
    if(traceArray[i].id==shelID){
      console.log(traceArray[i])
      listArray.push(traceArray[i])
      document.getElementById("msgDetails").innerHTML =""
      document.getElementById("msgDetails").innerHTML =traceArray[i].serialNumber +"_"+traceArray[i].operationNo+ " - added to list"
      
    }
  }//end for loop
  if(shelID=="noData"){
    var nodataValues={
      serialNumber: serialNumG,
      comments: "NO_DATA"
    }
    listArray.push(nodataValues)
    document.getElementById("msgDetails").innerHTML =""
    document.getElementById("msgDetails").innerHTML = serialNumG + "_noData - added to list"
  }

}
//from incidents
function addtolistinc(shell_id){

  var shelID = shell_id.id
  console.log(shelID)
  
  for(var i=0; i<traceArrayInc.length; i++){
    if(traceArrayInc[i].id==shelID){
      console.log(traceArrayInc[i])
      listArray.push(traceArrayInc[i])
      document.getElementById("msgDetails").innerHTML =""
      document.getElementById("msgDetails").innerHTML =traceArrayInc[i].serialNumber +"_"+traceArrayInc[i].operationNo+  " - added to list"
    }
  }
}
/*==================================================================================================================================================================*/
//                                                      Export to Excel
/*==================================================================================================================================================================*/
function XporttoExcel2(){
  
  console.log("exporting to excel in a second");//daytable1

  if (confirm("export Search list, continue?")) {
    $("#listCon").table2excel({
        filename: "Search_list.xls"
      });
  }else {
    console.log("You pressed Cancel!") ;
  }
}
/*==================================================================================================================================================================*/