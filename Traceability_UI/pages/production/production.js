/*************************************************************************Global Variables*********************************************************************************/
sessionStatus = localStorage.getItem("mysessionStat");
var sessionValue = localStorage.getItem("mysessionData");
sessionValue=JSON.parse(sessionValue)
// console.log(sessionValue.privilege_data[i].privilege);
/***********************************************************************************************************************************************************************/
function Data_Capture_view()
{
    
    $("#Data_Capture").html("");
    
    $("<h3 class=tabContHead>Data Capture Files</h3><hr class=L_hr>").appendTo("#Data_Capture");
    $("<p>Only users with access are allowed</p><br><br>").appendTo("#Data_Capture");
    var layout = $("<center><label><b>Select Product</b><br></label><br></center>").appendTo("#Data_Capture");
  
    $("<button class=item4button onclick=openDBtable(this) id=Production_Sheet_Master>Production Sheet Master</button>").appendTo(layout);      
    
}
function Shell_history_view(){
    $("#Shell_history").html("");
    
    // $("<h3 class=tabContHead>Data Capture Files</h3><hr class=L_hr>").appendTo("#Shell_history");
    $("<p>select shell history to see traceability of a shell</p><br><br>").appendTo("#Shell_history");
    var layout = $("<center><label><b>Selections</b><br></label><br></center>").appendTo("#Shell_history");
  
    $("<button class=item4button onclick=openDBtable(this) id=shellTraceability>Shell Traceability</button>").appendTo(layout);    
    // $("<button class=item4button onclick=openDBtable(this) id=plantProductivity</button>Plant Productivity</button>").appendTo(layout);    
}
function Reports_view()
{
    
    $("#Reports").html("");
    
    $("<h3 class=tabContHead>Data Capture Files</h3><hr class=L_hr>").appendTo("#Reports");
    $("<p>Only users with access are allowed</p><br><br>").appendTo("#Reports");
    var layout = $("<center><label><b>Select Product</b><br></label><br></center>").appendTo("#Reports");
  
    $("<button class=item4button onclick=openDBtable(this) id=dailyReport> Daily Report</button>").appendTo(layout);    
    $("<button class=item4button onclick=openDBtable(this) id=plantProductivity> Plant Productivity</button>").appendTo(layout);        
    $("<button class=item4button onclick=openDBtable(this) id=stats> Production Stats</button>").appendTo(layout);        
    
}

function openDBtable(proDs)
{
    var proID = proDs.id
    console.log(proID)
   
        if (sessionStatus == "true"){

            if(proID=='Production_Sheet_Master'){

                if(sessionValue.privilege_data[0].privilege==null || sessionValue.privilege_data[0].privilege=="null"){//check whether user has privileges to open tab
                    swal.fire({
                        title: "NOT AUTHORIZED!!!!!!!",
                        text: "you are not allowed to use this tab",
                        icon: "error",
                        confirmButtonText: "Ok",
                      })
                }else{
                    window.location="./traceproduction/productionSM.html";
                }//end authorization if
            }else if(proID=='dailyReport'){
                window.location="./reports/dailyReport.html";
            }else if(proID=='plantProductivity'){
                window.location="./reports/plantProductivity.html";
            }else if(proID=='shellTraceability'){
                window.location="./shell_history/history.html";    
            }else if(proID=='stats'){
                window.location="./reports/stats.html";    
            }

            
            
        }else{
            swal.fire({
                title: "SESSION EXPIRED!!!!",
                text: "please Sign-in",
                icon: "error",
                confirmButtonText: "sign_in",
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location="../login/signIn_ui.html";
                    return 0;
                }
                });
            // window.location="./pages/login/signIn_ui.html";
        }
    
}

function closeTable()
{
    if (sessionStatus == "true"){
        window.location="../production_ui.html";
    }else{
        swal.fire({
            title: "SESSION EXPIRED!!!!",
            text: "please Sign-in",
            icon: "error",
            confirmButtonText: "sign_in",
        }).then((result) => {
            if (result.isConfirmed) {
                window.location="../login/signIn_ui.html";
                return 0;
            }
            });
    }
}