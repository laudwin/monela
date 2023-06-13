/*============================================================================================================================================================================*/
//                                                                      Global Variables
/*============================================================================================================================================================================*/
var sessionStatus = localStorage.getItem("mysessionStat");
var sessionName = localStorage.getItem("mysessionName");
/*********************************************************hide/show new shell************************************************************/
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
    document.getElementById("shell").focus();
    $(".add_shell").show(); 
  $(".close").show();
  $(".dropbtn").hide();
  document.getElementById("batchEdit").innerHTML = "" 
  }
  
  function close_new_shell(){
    document.getElementById("myDropdown").classList.toggle("show");
    document.getElementById("batchEdit").innerHTML = "" 
    $(".add_shell").hide(); 
    $(".close").hide();
    $(".dropbtn").show();
  }
/*----------------------------------------------------------------------------------------------------------------------------------------------------*/
/********************************************************************view selection********************************************************************/
/*----------------------------------------------------------------------------------------------------------------------------------------------------*/
function mainsheetview()
{
    document.getElementById("batchEdit").innerHTML = "" 
    $("#tableView").html("");
    $("#loggedas").html("");
    $('.dropbtn').show();

    mode_selector = "mainsheet";
    pageN = "";//initialise page
    loadURL = "http://192.168.2.223:9100/traceability/username?Tablename=trace_plant.shell_traceability&DataLimit=10&userName="+sessionName+""
    oldTableViewD = 0;

    showOutput(loadURL,mode_selector);

    Mainbut.style.backgroundColor='orange';
    INCbut.style.backgroundColor=null;
    fltbut.style.backgroundColor=null;
    Reportid.style.backgroundColor=null;

}
/*----------------------------------------------------------------------------------------------------------------------------------------------------*/
function IncidentSheetView()
{
    document.getElementById("batchEdit").innerHTML = ""   
    $("#tableView").html("");
    $("#loggedas").html("");
    $('.dropbtn').hide();

    mode_selector = "incshell";
    loadURL = "http://192.168.2.223:9100/traceability/username?Tablename=trace_plant.shell_traceability_incident&DataLimit=30&userName="+sessionName+""
    oldTableViewD = 0;

   showOutput(loadURL,mode_selector);

    Mainbut.style.backgroundColor=null;
    INCbut.style.backgroundColor='orange';
    fltbut.style.backgroundColor=null;
    Reportid.style.backgroundColor=null;
}
/*----------------------------------------------------------------------------------------------------------------------------------------------------*/
/**********************************************************************table view**********************************************************************/
/*----------------------------------------------------------------------------------------------------------------------------------------------------*/
function showOutput(loadURL,mode_selector) {

    var extload; 
    var dataResult;
  
    //  if(pageN==""){;}
  
    document.getElementById("dataDetails").innerHTML = "";
    $("<center><div id=preloader><div id=loader></div></div></center>").appendTo("#tableView");
  
      if(sessionStatus != "true"){
        swal.fire({
          title: "session expired!!!!!!!",
          text: "Please Sign-in",
          icon: "error",
          confirmButtonText: "Sign-in",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location="/pages/login/signIn_ui.html";
        }else{window.location="/pages/login/signIn_ui.html";}
        });
      }
  
      var url_search = loadURL;
      axios
          .get(url_search, {
          
          })
      .then(res => {
       
            /*-------------------------------------------------Table Headings---------------------------------------------------------------------*/
            var production_table = $("<table id=Prod_table ></table>").appendTo("#tableView");
            // if(pageN == ""){
              var row1 = $("<tr id=heading></tr>").appendTo(production_table);
              $("<th id=sero ></th>").text("Delete").appendTo(row1);
              $("<th id=sero ></th>").text("edit").appendTo(row1);
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
  
              if(mode_selector =="mainsheet"){
                extload = res.data[i].UserInProcessTraecibilty_id;
                dataResult = res.data[i]
                console.log(dataResult)
                
                // document.getElementById("productlabel").innerHTML = "Production Sheet";
                document.getElementById("heading").style.color = "white";
              }//display inprocess shells
  
  
              if(mode_selector =="incshell"){
                extload = res.data[i].UserInProcessTraecibiltyIncident_id;
                dataResult = res.data[i]
                // document.getElementById("productlabel").innerHTML = "Incident Shells";
                document.getElementById("heading").style.color = "orange";
              }//display incident shells
                       
    /*-------------------------------------------------Table Data---------------------------------------------------------------------*/         
              var row1_1 = $("<tr class=dataP id="+dataResult.id+"></tr>").appendTo(production_table);
              if(mode_selector !="incshell"){$("<td><button class=delete id="+dataResult.id+" onclick=deletedata(this)>Delete</button></td>").appendTo(row1_1);}//ID
              else{$("<td><button class=delete id="+dataResult.id+" onclick=deleteINCdata(this)>Delete</button></td>").appendTo(row1_1);}//delete botton
  
              if(mode_selector !="incshell"){$("<td id=serEd><button class=editbut id="+dataResult.id+" onclick=editdata(this)>edit</button></td>").appendTo(row1_1);}//ID
              else{$("<td style= font-weight:bold></td>").text("").appendTo(row1_1);}//edit button
  
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
                window.location="/pages/login/signIn_ui.html";
              }else{window.location="/pages/login/signIn_ui.html";}
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
                window.location="/pages/login/signIn_ui.html";
              }else{window.location="/pages/login/signIn_ui.html";}
              });
            }
  
            if(err == "Error: Network Error"){
              console.log("No Network")
              $("#tableView").html("");
              $("<center><h1 id=errormsg>NO NETWORK</h1></center>").appendTo("#tableView");
            }
  
          
      });
      // setTimeout(function(){ $('#preloader').hide();$('#loader').hide();}, 5000);   
  }
  /******************************************************************************************************************************************************/
 
