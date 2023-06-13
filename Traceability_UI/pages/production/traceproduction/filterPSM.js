/*============================================================================================================================================================================*/
//                                                                      Global Variables
/*============================================================================================================================================================================*/
var sessionStatus = localStorage.getItem("mysessionStat");
var sessionName = localStorage.getItem("mysessionName");

var pgsh7=1;
var traceArray = []
var traceArrayInc = []

/*============================================================================================================================================================================*/
//                                                                     Filter Data Form
/*============================================================================================================================================================================*/
function filterform(){
    document.getElementById("fltDC").classList.toggle("show1");
    fltbut.style.backgroundColor='orange';
  }
  //-------------------------------------------------------------------
  function closefilterform(){
    document.getElementById("fltDC").classList.toggle("show1");
    fltbut.style.backgroundColor = null;
  }
/*============================================================================================================================================================================*/
//                                                                    Clear Filter Form
/*============================================================================================================================================================================*/
function filterclear(){
    
    console.log("clear")
      document.getElementById("filtershell").value="";
      document.getElementById("filtercast").value="";
      document.getElementById("filterheat").value="";
  
      document.getElementById("filterdate7").value="";
      document.getElementById("filterShift7").value="";
      document.getElementById("filterMachine7").value="";
  }
/*============================================================================================================================================================================*/
//                                                                    Collect Filter Data
/*============================================================================================================================================================================*/
function filterdata(){

    var filterShell = document.getElementById("filtershell").value;
    var filtercCast = document.getElementById("filtercast").value;
    var filterHeat = document.getElementById("filterheat").value;

    var filterDate7 = document.getElementById("filterdate7").value;
    var filterShift7 = document.getElementById("filterShift7").value;
    var filterMachine7 = document.getElementById("filterMachine7").value;

    if(filterShell!="" && filtercCast!="" && filterHeat!=""){
        console.log("filter by serial number");
        filterbySerial_Number(filterShell,filtercCast,filterHeat)

    }else if(filterDate7!=""){
        console.log("filter by date")
        filterbyDate(filterDate7,filterShift7,filterMachine7)
    }else{
        alert("invalid entry!!!!!")
    }
}
/*============================================================================================================================================================================*/
//                                                                    Filter By Serial Number
/*============================================================================================================================================================================*/
function filterbySerial_Number(filterShell,filtercCast,filterHeat){

    var serialNum = filterShell+"-"+filtercCast+"-"+filterHeat
    var filterDate7 = '';
    var filterShift7 = '';
    var filterMachine7 = '';
    console.log(serialNum);
    filterViuw(serialNum,filterDate7,filterShift7,filterMachine7)
}
/*============================================================================================================================================================================*/
//                                                                    Hide & Show Incident Button
/*============================================================================================================================================================================*/
function hideBt(){
    $('.inctable').hide(); 
    $('.hideBB').hide();
    $('.inctable').hide();
    $('.showBB').show();  
  }
  function showBt(){
    $('.inctable').show(); 
    $('.hideBB').show();
    $('.inctable').show();
    $('.showBB').hide();  
  }
  
/*============================================================================================================================================================================*/
//                                                                    Filter By Date
/*============================================================================================================================================================================*/
function filterbyDate(filterDate7,filterShift7,filterMachine7){
    console.log(filterDate7+filterShift7+filterMachine7);
    var serialNum = '';
    filterViuw(serialNum,filterDate7,filterShift7,filterMachine7)
}
/*============================================================================================================================================================================*/
//                                                                    Filter View
/*============================================================================================================================================================================*/
async function filterViuw(serialNum,filterDate7,filterShift7,filterMachine7){
    $("#tableView").html("");
    $("#loggedas").html("");
    $('.dropbtn').hide();

    document.getElementById("fltDC").classList.toggle("show1");
    Mainbut.style.backgroundColor=null;
    INCbut.style.backgroundColor=null;
    fltbut.style.backgroundColor=null;
    Reportid.style.backgroundColor=null;
    fltbut.style.backgroundColor='orange';
    
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
            var production_table = $("<table id=Prod_table border=1></table>").appendTo("#tableView");
            // if(pageN == ""){
              var row1 = $("<tr id=heading></tr>").appendTo(production_table);
              $("<th id=sero ></th>").text("Delete").appendTo(row1);
              $("<th id=sero ></th>").text("Edit").appendTo(row1);
              $("<th id=serEd ></th>").text("ShellNo").appendTo(row1);
              $("<th id=sero ></th>").text("Cast").appendTo(row1);
              $("<th id=sero ></th>").text("Heat").appendTo(row1);
              $("<th id=sero ></th>").text("Serial No").appendTo(row1);
              $("<th id=sero ></th>").text("Serial OP").appendTo(row1);
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
              $("<td><button class=delete id="+dataResult.id+" onclick=deletedata(this)>Delete</button></td>").appendTo(row1_1);
              $("<td id=serEd><button class=editbut id="+dataResult.id+" onclick=editdata(this)>edit</button></td>").appendTo(row1_1);
              $("<td style= font-weight:bold></td>").text(dataResult.shellNo).appendTo(row1_1);//ShellNo
              $("<td style= font-weight:bold></td>").text(dataResult.castCode).appendTo(row1_1);//Cast
              $("<td style= font-weight:bold></td>").text(dataResult.heatCode).appendTo(row1_1);//Heat
              $("<td style= font-weight:bold></td>").text(dataResult.serialNumber).appendTo(row1_1);//Serial No
              $("<td style= font-weight:bold></td>").text(dataResult.serialOP).appendTo(row1_1);//Serial OP
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
          $("<th id=seroHD class=inctable colspan=16 ></th>").text("On Incidents").appendTo(row2);
          $("<td><button class=hideBB id=hideB onclick=hideBt()>hide Incidents</button></td>").appendTo(row2);//ID
          $("<td><button class=showBB id=hideB onclick=showBt()>show Incidents</button></td>").appendTo(row2);//ID
          $('.showBB').hide(); 

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
              $("#tableView").html("");
              $("<center><h1 id=errormsg>NO NETWORK</h1></center>").appendTo("#tableView");
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
            var production_table = $("<table class=inctable id=Prod_table border=1></table>").appendTo("#tableView");

            var row1 = $("<tr id=heading></tr>").appendTo(production_table);
            $("<th id=sero ></th>").text("Delete").appendTo(row1);
            $("<th id=sero ></th>").text("Edit").appendTo(row1);
            $("<th id=sero ></th>").text("ShellNo").appendTo(row1);
            $("<th id=sero ></th>").text("Cast").appendTo(row1);
            $("<th id=sero ></th>").text("Heat").appendTo(row1);
            $("<th id=sero ></th>").text("Serial No").appendTo(row1);
            $("<th id=sero ></th>").text("Serial OP").appendTo(row1);
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
            $("<td><button class=delete id="+dictINC.id+" onclick=deleteINCdata(this)>Delete</button></td>").appendTo(row1_1);//ID
            $("<td id=serEd></td>").appendTo(row1_1);//ID
            $("<td style= font-weight:bold></td>").text(dictINC.shellNo).appendTo(row1_1);//ShellNo
            $("<td style= font-weight:bold></td>").text(dictINC.castCode).appendTo(row1_1);//Cast
            $("<td style= font-weight:bold></td>").text(dictINC.heatCode).appendTo(row1_1);//Heat
            $("<td style= font-weight:bold></td>").text(dictINC.serialNumber).appendTo(row1_1);//Serial No
            $("<td style= font-weight:bold></td>").text(dictINC.serialOP).appendTo(row1_1);//Serial OP
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
            document.getElementById("batchEdit").innerHTML = "" 
            if(filterDate7!='' && filterShift7!='' && filterMachine7!=''){
              document.getElementById("batchEdit").innerHTML = "<button id=BEButton onclick=batch_editing()>Batch Edit</button>" //show batch edit button     
            }
            
        })
        
    
}
//======================================================================================================================================
//                                                           Batch Edit
//======================================================================================================================================
function batch_editing(){
  employeesList1()

  var formlayout = $("<div class=batchElayout></div>").appendTo("#batchEdit");
  var edform = $("<form id=edform></form>").appendTo(formlayout);
  $("#edform").html("");
  $("<p><b>Select Column(s) you wish to edit</b></p><hr>").appendTo(edform);

  $("<br><input type=checkbox id=Date onclick=displayHolder()><label>Date</label>").appendTo(edform);
  $("<input type=date class=beph id=DateChange style=display:none; ><br>").appendTo(edform);

  $("<input type=checkbox id=Supervisor onclick=displayHolder()><label>Supervisor</label>").appendTo(edform);
  $("<input type=text class=beph id=SupervisorChange autocomplete=off onkeyup=searchSupervisor1() list=SupervisorDropdown placeholder=Supervisor style=display:none; ><br>").appendTo(edform);

  $("<input type=checkbox id=Operator onclick=displayHolder()><label>Operator</label>").appendTo(edform);
  $("<input type=text class=beph id=OperatorChange autocomplete=off onkeyup=searchOperator1() list=OperatorDropdown placeholder=Operator style=display:none; ><br>").appendTo(edform);

  $("<input type=checkbox id=Teamleader onclick=displayHolder()><label>Teamleader</label>").appendTo(edform);
  $("<input type=text class=beph id=TeamleaderChange autocomplete=off onkeyup=searchTeamLeader1() list=TeamleaderDropdown placeholder=TeamLeader style=display:none; ><br>").appendTo(edform);

  $("<input type=checkbox id=Shift onclick=displayHolder()><label>Shift</label>").appendTo(edform);
  $("<select type=text class=beph id=ShiftChange autocomplete=off style=display:none; ><br>").appendTo(edform);
    $("<option></option>").appendTo("#ShiftChange")
    $("<option>Morning</option>").appendTo("#ShiftChange")
    $("<option>Afternoon</option>").appendTo("#ShiftChange")
    $("<option>Night</option>").appendTo("#ShiftChange")

  $("<br><input type=checkbox id=OperationNo onclick=displayHolder()><label>OperationNo</label>").appendTo(edform);
  $("<input type=text class=beph id=OperationNoChange placeholder=Operation_Number style=display:none; ><br>").appendTo(edform);

  $("<input type=checkbox id=MachineNo onclick=displayHolder()><label>MachineNo</label>").appendTo(edform);
  $("<input type=text class=beph id=MachineNoChange placeholder=Machine_Number style=display:none; ><br>").appendTo(edform);

  $("<input type=checkbox id=Determination onclick=displayHolder()><label>Determination</label>").appendTo(edform);
  $("<select type=text class=beph id=DeterminationChange autocomplete=off style=display:none; ><br>").appendTo(edform);
    $("<option></option>").appendTo("#DeterminationChange")
    $("<option>Pass</option>").appendTo("#DeterminationChange")
    $("<option>Rework</option>").appendTo("#DeterminationChange")
    $("<option>Scrap</option>").appendTo("#DeterminationChange")


  $("<br><input type=checkbox id=Comments onclick=displayHolder()><label>Comments</label>").appendTo(edform);
  $("<input type=text class=beph id=CommentsChange placeholder=Comment style=display:none; ><hr>").appendTo(edform);

  var buttonbox = $("<br><center><div class=buttonbox></div></center>").appendTo(edform);
      $("<input type=button20  onclick=save_editBE() value=save></input>").appendTo(buttonbox);
      $("<input type=button id=cancelinfo onclick=cancel_editBE() value=cancel></input>").appendTo(buttonbox);
      
}
//================================================================================================================================================
//                                                    Cancel/Close Edit Batch
//================================================================================================================================================
function cancel_editBE(){
  console.log("close Form")
  $('.batchElayout').hide();
}
//================================================================================================================================================
//                                           Display placeHolder on Batch Edit
//================================================================================================================================================
function displayHolder() {

  var dateCheck = document.getElementById("Date");
  var DateChange = document.getElementById("DateChange");
  /********************************************************************/
  var OperatorCheck = document.getElementById("Operator");
  var OperatorChange = document.getElementById("OperatorChange");
  /********************************************************************/
  var SupervisorCheck = document.getElementById("Supervisor");
  var SupervisorChange = document.getElementById("SupervisorChange");
  /********************************************************************/
  var TeamleaderCheck = document.getElementById("Teamleader");
  var TeamleaderChange = document.getElementById("TeamleaderChange");
  /********************************************************************/
  var ShiftCheck = document.getElementById("Shift");
  var ShiftChange = document.getElementById("ShiftChange");
  /********************************************************************/
  var OperationNoCheck = document.getElementById("OperationNo");
  var OperationNoChange = document.getElementById("OperationNoChange");
  /********************************************************************/
  var MachineNoCheck = document.getElementById("MachineNo");
  var MachineNoChange = document.getElementById("MachineNoChange");
  /********************************************************************/
  var DeterminationCheck = document.getElementById("Determination");
  var DeterminationChange = document.getElementById("DeterminationChange");
  /********************************************************************/
  var CommentsCheck = document.getElementById("Comments");
  var CommentsChange = document.getElementById("CommentsChange");
  /********************************************************************/


  console.log("date clicked")
  //-----------------------------------------------------------------
  if (dateCheck.checked == true){
    DateChange.style.display = "block";
  } else {
    DateChange.style.display = "none";
    DateChange = document.getElementById("DateChange").value = "";  
  }
  //------------------------------------------------------------------
  if (OperatorCheck.checked == true){
    OperatorChange.style.display = "block";
  } else {
    OperatorChange.style.display = "none";
    OperatorChange = document.getElementById("OperatorChange").value = ""; 
  }
  //------------------------------------------------------------------
  if (SupervisorCheck.checked == true){
    SupervisorChange.style.display = "block";
  } else {
    SupervisorChange.style.display = "none";
    SupervisorChange = document.getElementById("SupervisorChange").value = "";  
  }
  //------------------------------------------------------------------
  if (TeamleaderCheck.checked == true){
    TeamleaderChange.style.display = "block";
  } else {
    TeamleaderChange.style.display = "none";
    TeamleaderChange = document.getElementById("TeamleaderChange").value = "";
  }
  //------------------------------------------------------------------
  if (ShiftCheck.checked == true){
    ShiftChange.style.display = "block";
  } else {
    ShiftChange.style.display = "none";
    ShiftChange = document.getElementById("ShiftChange").value = "";
  }
  //------------------------------------------------------------------
  if (OperationNoCheck.checked == true){
    OperationNoChange.style.display = "block";
  } else {
    OperationNoChange.style.display = "none";
    OperationNoChange = document.getElementById("OperationNoChange").value = "";
  }
  //------------------------------------------------------------------
  if (MachineNoCheck.checked == true){
    MachineNoChange.style.display = "block";
  } else {
    MachineNoChange.style.display = "none";
    MachineNoChange = document.getElementById("MachineNoChange").value = ""; 
  }
  //------------------------------------------------------------------
  if (DeterminationCheck.checked == true){
    DeterminationChange.style.display = "block";
  } else {
    DeterminationChange.style.display = "none";
    DeterminationChange = document.getElementById("DeterminationChange").value = "";
  }
  //------------------------------------------------------------------
  if (CommentsCheck.checked == true){
    CommentsChange.style.display = "block";
  } else {
    CommentsChange.style.display = "none";
    CommentsChange = document.getElementById("CommentsChange").value = "";
  }
  //------------------------------------------------------------------
}

//================================================================================================================================================
//                                           Employees list
//================================================================================================================================================
var employees = [];
var operatorList = [];
var teamleaderList = [];
var supervisorList = [];
//===================================================================================
async function employeesList1(){
  employees = [];
  operatorList = [];
  teamleaderList = [];
  supervisorList = [];
  await $.get("http://192.168.2.223:9101/employeeslist", function (data) { 
      for(var i=0; i<data.length; i++){
        employees.push(data[i])
      }
    //____________________________________________________________________
    for(var k=0; k<employees.length; k++){
      if(employees[k].position == "Operator"){
        operatorList.push(employees[k].fullnameID.toUpperCase())
      }else if(employees[k].position == "Team Leader"){
        teamleaderList.push(employees[k].fullnameID.toUpperCase())
      }else if(employees[k].position == "Supervisor"){
        supervisorList.push(employees[k].fullnameID.toUpperCase())
      }
    }
    //  console.log(operatorList)
  })
}
//---------------------------------------------------------------------------------------------
function searchOperator1() {
  console.log("search operator")
  $("<datalist id=OperatorDropdown></datalist>").appendTo("#OperatorChange")
  $("#OperatorDropdown").html("")
  opValue = document.getElementById("OperatorChange").value.toUpperCase()
  for(var y=0;y<operatorList.length; y++){
    var result = operatorList[y].match(opValue);
    if (result!=null){
      // console.log(operatorList[y])
      $("<option>"+operatorList[y]+"</option>").appendTo("#OperatorDropdown")
    }
  }
}
//---------------------------------------------------------------------------------------------
function searchTeamLeader1() {
  console.log("search Teamleader")
  $("<datalist id=TeamleaderDropdown></datalist>").appendTo("#TeamleaderChange")
  $("#TeamleaderDropdown").html("")
  opValue = document.getElementById("TeamleaderChange").value.toUpperCase()
  for(var y=0;y<teamleaderList.length; y++){
    var result = teamleaderList[y].match(opValue);
    if (result!=null){
      // console.log(teamleaderList[y])
      $("<option>"+teamleaderList[y]+"</option>").appendTo("#TeamleaderDropdown")
    }
  }
}
//---------------------------------------------------------------------------------------------
function searchSupervisor1() {
  console.log("search Supervisor")
  $("<datalist id=SupervisorDropdown></datalist>").appendTo("#SupervisorChange")
  $("#SupervisorDropdown").html("")
  opValue = document.getElementById("SupervisorChange").value.toUpperCase()
  for(var y=0;y<supervisorList.length; y++){
    var result = supervisorList[y].match(opValue);
    if (result!=null){
      // console.log(supervisorList[y])
      $("<option>"+supervisorList[y]+"</option>").appendTo("#SupervisorDropdown")
    }
  }
}
//================================================================================================================================================
//                                           Save Edit Of Batch
//================================================================================================================================================
async function save_editBE(){
  
  var utc = new Date().toJSON().slice(0,10);
  var DateChange = document.getElementById("DateChange").value;  
  var OperatorChange = document.getElementById("OperatorChange").value; 
  var SupervisorChange = document.getElementById("SupervisorChange").value;  
  var TeamleaderChange = document.getElementById("TeamleaderChange").value;
  var ShiftChange = document.getElementById("ShiftChange").value;
  var OperationNoChange = document.getElementById("OperationNoChange").value;
  var MachineNoChange = document.getElementById("MachineNoChange").value; 
  var DeterminationChange = document.getElementById("DeterminationChange").value;
  var CommentsChange = document.getElementById("CommentsChange").value;
  var changedRecCount = 0;
  var changedRecCountinc = 0;

  if(DateChange != ""&&DateChange != "yyyy/mm/dd"){
    if (DateChange <= utc){
      var DateChangeWR= "`traceabilityDate` = '"+DateChange+" 00:00:00',"
    
    }
  }else{
    var DateChangeWR= ""
  }//------------------------------------------------------------------------
  if(OperatorChange != ""){
    var OperatorChangeWR= "`operator` = '"+OperatorChange+"',"
  }else{
    var OperatorChangeWR= ""
  }//------------------------------------------------------------------------
  if(SupervisorChange != ""){
    var SupervisorChangeWR= "`supervisor` = '"+SupervisorChange+"',"
  }else{
    var SupervisorChangeWR= ""
  }//------------------------------------------------------------------------
  if(TeamleaderChange != ""){
    var TeamleaderChangeWR= "`teamleader` = '"+TeamleaderChange+"',"
  }else{
    var TeamleaderChangeWR= ""
  }//------------------------------------------------------------------------
  if(ShiftChange != ""){
    var ShiftChangeWR= "`shift` = '"+ShiftChange+"',"
  }else{
    var ShiftChangeWR= ""
  }//------------------------------------------------------------------------
  if(OperationNoChange != ""){
    var OperationNoChangeWR= "`operationNo` = '"+OperationNoChange
  }else{
    var OperationNoChangeWR= ""
  }//------------------------------------------------------------------------
  if(MachineNoChange != ""){
    var MachineNoChangeWR= "`machineNo` = '"+MachineNoChange+"',"
  }else{
    var MachineNoChangeWR= ""
  }//------------------------------------------------------------------------
  if(DeterminationChange != ""){
    var DeterminationChangeWR= "`determination` = '"+DeterminationChange+"',"
  }else{
    var DeterminationChangeWR= ""
  }//------------------------------------------------------------------------
  if(CommentsChange != ""){
    var CommentsChangeWR= "`comments` = '"+CommentsChange+"',"
  }else{
    var CommentsChangeWR= ""
  }//------------------------------------------------------------------------

  //check if there is a selected checkbox in order to run an SQL line. if not, Abort edit 
  if (DateChange <= utc){
    if(DateChangeWR != ""||OperatorChangeWR != ""||SupervisorChangeWR != ""||TeamleaderChangeWR != ""||ShiftChangeWR != ""||OperationNoChangeWR != ""||MachineNoChangeWR != ""||DeterminationChangeWR != ""||CommentsChangeWR != ""){
      for(var r=0; r<traceArray.length; r++){
        var updated_at
        var myDate = new Date();
            myDate.setHours(myDate.getHours() + 2);
            updated_at =(myDate.toJSON()).substring(0,19).replace('T',' ')

            if(OperationNoChange != ""){
              var serialnum = (traceArray[r].serialNumber).replace("-","")
              var OperationNoChangeWR= "`operationNo` = '"+OperationNoChange+"',`serialOP` = '"+serialnum+OperationNoChange+"',"
                console.log(OperationNoChangeWR)
            }

            //=============================================================================================================================================
            //                                                  Check whether shell already exist
            //=============================================================================================================================================

                if(DateChange != ""&&DateChange != "yyyy/mm/dd"){
                    var DateOr= DateChange+" 00:00:00"
                }else{
                  var DateOr= traceArray[r].traceabilityDate
                }//------------------------------------------------------------------------
                if(OperatorChange != ""){
                  var OperatorOr= OperatorChange
                }else{
                  var OperatorOr= traceArray[r].operator
                }//------------------------------------------------------------------------
                if(SupervisorChange != ""){
                  var SupervisorOr= SupervisorChange
                }else{
                  var SupervisorOr= traceArray[r].supervisor
                }//------------------------------------------------------------------------
                if(TeamleaderChange != ""){
                  var TeamleaderOr= TeamleaderChange
                }else{
                  var TeamleaderOr= traceArray[r].teamleader
                }//------------------------------------------------------------------------
                if(ShiftChange != ""){
                  var ShiftOr= ShiftChange
                }else{
                  var ShiftOr= traceArray[r].shift
                }//------------------------------------------------------------------------
                if(OperationNoChange != ""){
                  var OperationNoOr= OperationNoChange
                }else{
                  var OperationNoOr= traceArray[r].operationNo
                }//------------------------------------------------------------------------
                if(MachineNoChange != ""){
                  var MachineNoOr= MachineNoChange
                }else{
                  var MachineNoOr= traceArray[r].machineNo
                }//------------------------------------------------------------------------
                if(DeterminationChange != ""){
                  var DeterminationOr= DeterminationChange
                }else{
                  var DeterminationOr= traceArray[r].determination
                }//------------------------------------------------------------------------
                if(CommentsChange != ""){
                  var commentsOr= CommentsChange
                }else{
                  var commentsOr= traceArray[r].comments
                }//------------------------------------------------------------------------
        
          
                  var shellnoOr = traceArray[r].shellNo
                  var castCodeOr = traceArray[r].castCode
                  var heatCodeOr = traceArray[r].heatCode
                  var productnameOr = traceArray[r].product
                  var res_idIn = traceArray[r].id

                  var fullData = shellnoOr+castCodeOr+heatCodeOr+DateOr+OperatorOr+SupervisorOr+TeamleaderOr+ShiftOr+OperationNoOr+MachineNoOr+productnameOr+DeterminationOr
                  console.log(fullData)
            //=============================================================================================================================================
            if(traceArray[r].userName==sessionName){//user only allowed to change their own work
              await axios
              .get("http://192.168.2.223:9100/traceability/fullrowdata?rowData="+fullData+"")
            
              .then(async res => { 
    
                  console.log(res)
                  if(res.data.length==0){// if record is not a duplicate, edit data
                      var SQLine =  DateChangeWR+OperatorChangeWR+SupervisorChangeWR+TeamleaderChangeWR+ShiftChangeWR+OperationNoChangeWR+DeterminationChangeWR+CommentsChangeWR+"`updated_at`= '"+updated_at+"' WHERE (`id` = '"+traceArray[r].id+"')";
                      console.log(SQLine)
                      
                      await axios
                        .put("http://192.168.2.223:9100/traceability/editshellBE?Tablename=trace_plant.shell_traceability", {
                          SQLStatement: SQLine
                      })
                      
                        .then(res => { 

                            console.log(res.status)
                            changedRecCount++;
                            
                        }).catch(err => console.error(err));

                  }else{//if record is a duplicate remove and add it on incidents
                    
                        axios
                          .delete("http://192.168.2.223:9100/traceability/deleteshell?Tablename=trace_plant.shell_traceability&id="+res_idIn+"")
                          .then(res =>{})
                          .catch(err => console.error(err));

                          var shell_serial_no = shellnoOr+"-"+castCodeOr+"-"+heatCodeOr
                          var serialNumber = shellnoOr+castCodeOr+heatCodeOr
                          var serialOP = serialNumber+OperationNoOr

                          var year = new Date(DateOr).getFullYear()
                          var mon = (new Date(DateOr).getMonth() + 1).toString().padStart(2, "0");
                          var recmonth = year +"-"+ mon +"-01 00:00:00"

                          axios
                          .post('http://192.168.2.223:9100/traceability/addshell?Tablename=trace_plant.shell_traceability_incident', {
                            userName: sessionName,
                            shellNo: shellnoOr,
                            castCode: castCodeOr,
                            heatCode: heatCodeOr,
                            serialNumber: shell_serial_no,
                            serialOP: serialOP,
                            traceabilityDate: DateOr,
                            operator: OperatorOr,
                            supervisor: SupervisorOr,
                            teamleader: TeamleaderOr,
                            shift: ShiftOr,
                            product: productnameOr,
                            operationNo: OperationNoOr,
                            machineNo: MachineNoOr,
                            determination: DeterminationOr,
                            month: recmonth,
                            comments: commentsOr
                          })
                            .then(res => { 

                              console.log(res.status)
                              changedRecCount++;
                              
                          }).catch(err => console.error(err));
                  } 
              }).catch(err => console.error(err));
            
            }else{
              console.log("not allowed to change")
              changedRecCountinc++;
            }

        
          
      }//end for loop
      for(var r=0; r<traceArrayInc.length; r++){
        var updated_at
        var myDate = new Date();
            myDate.setHours(myDate.getHours() + 2);
            updated_at =(myDate.toJSON()).substring(0,19).replace('T',' ')
        var SQLine =  DateChangeWR+OperatorChangeWR+SupervisorChangeWR+TeamleaderChangeWR+ShiftChangeWR+OperationNoChangeWR+DeterminationChangeWR+CommentsChangeWR+"`updated_at`= '"+updated_at+"' WHERE (`id` = '"+traceArrayInc[r].id+"')";
        console.log(SQLine)
        if(traceArrayInc[r].userName==sessionName){//user only allowed to change their own work
          await axios
            .put("http://192.168.2.223:9100/traceability/editshellBE?Tablename=trace_plant.shell_traceability_incident", {
              SQLStatement: SQLine
          })
          
            .then(res => { 

                console.log(res.status)
                changedRecCount++;
                
            }).catch(err => console.error(err));
        }else{
          console.log("not allowed to change")
          changedRecCountinc++;
        }
      }
      filterdata()
      cancel_editBE()

      swal.fire({
        title: "Batch Edit Complete!!!!!!!",
        text: "Total Edited : "+changedRecCount+" || Not Edited : "+changedRecCountinc,
        icon: "success",
        confirmButtonText: "Ok",
      })
      // console.log(traceArray)
      // console.log(traceArrayInc)
    }else{
      swal.fire({
        title: "No Changes Detected!!!!!!!",
        text: "select a column you wish to edit",
        icon: "warning",
        confirmButtonText: "Ok",
      })
    }
  }else{
    DateChangeWR= ""
    swal.fire({
      title: "Date Invalid!!!!!!!",
      text: "future date detected",
      icon: "warning",
      confirmButtonText: "Ok",
    })
  }
}
