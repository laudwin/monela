/*============================================================================================================================================================================*/
//                                                                      Global Variables
/*============================================================================================================================================================================*/
var sessionStatus = localStorage.getItem("mysessionStat");
var sessionName = localStorage.getItem("mysessionName");
/*============================================================================================================================================================================*/
//                                                                      keyboard keys
/*============================================================================================================================================================================*/
function ASreroute(e){
    if (e.keyCode == 13){//enter key
      document.getElementById('addshell').click()
    }
  
    // if(e.keyCode == 40){//arrow down key
    //     document.getElementsByTagName('input').focus();
    // }
  }
/*============================================================================================================================================================================*/
//                                                                      Validate Placeholders
/*============================================================================================================================================================================*/
function validate(){

    var utc = new Date().toJSON().slice(0,10);

    var shell_number = document.getElementById("shell").value;
    var cast_code = document.getElementById("cast").value.toUpperCase();
    var heat_code = document.getElementById("heat").value.toUpperCase();
    var date_trae = document.getElementById("Sdate").value;
    var operatorname = document.getElementById("operator").value.toUpperCase();
    operatorname = operatorname.replace(/\s+/g, '_');
    var supervisorname = document.getElementById("supervisor").value.toUpperCase();
    var teamleadername = document.getElementById("teamleader").value.toUpperCase();
    var shiftname = document.getElementById("shift").value;
    // var productname = document.getElementById("product").value.toUpperCase();
    var operationname = document.getElementById("operation").value;
    var machine_name = document.getElementById("machine_no").value;
    var determinationname = document.getElementById("determination").value;
    var commentname = document.getElementById("comment").value.toUpperCase();

    
    
    if ( shell_number == "") {
        alert("Enter shell number");
    } else if (cast_code == "") {
        alert("Enter cast code");
    }else if (heat_code == "") {
      alert("Enter heat code");
    }else if (date_trae == ""||date_trae == "yyyy/mm/dd" || date_trae > utc) {
      alert("Enter a valid date");
    }else if (operatorname == "") {
      alert("Enter operator name");
    }else if (supervisorname == "") {
      alert("Enter supervisor name");
    }else if (teamleadername == "") {
      alert("Enter teamleader name ");
    }else if (shiftname == "" || shiftname == "Select shift" ) {
      alert("Enter shift");
    // }else if (productname == "") {
    //   alert("Enter product name");
    }else if (operationname == "") {
        alert("operation product number");
    }else if (machine_name == "") {
      alert("Enter machine number");
    }else if (determinationname == "" || determinationname == "Select determination") {
      alert("Enter determination");
    }else if (commentname == "") {
      alert("Enter comment");
    }else{reArrangePostData(shell_number,cast_code,heat_code,date_trae,operatorname,supervisorname,teamleadername,shiftname,operationname,
        machine_name,determinationname,commentname)}
  } 
/*============================================================================================================================================================================*/
//                                                                      Re-arrange Data
/*============================================================================================================================================================================*/
function reArrangePostData(shell_number,cast_code,heat_code,date_trae,operatorname,supervisorname,teamleadername,shiftname,operationname,
    machine_name,determinationname,commentname)
    {
        document.getElementById("addshell").disabled = true;
        
        useridDC = sessionName;
        shell_serial_no = shell_number+"-"+cast_code+"-"+heat_code;
        serialNumber = shell_number+cast_code+heat_code;
        serialOP = serialNumber+operationname;

        date1 = new Date(date_trae).toISOString().substring(0,19).replace('T',' ');//load date value
        year = new Date(date_trae).getFullYear()
        mon = (new Date(date_trae).getMonth() + 1).toString().padStart(2, "0");
        recmonth = year +"-"+ mon +"-01 00:00:00"

        console.log("serial number: ", shell_serial_no);
        console.log("date: ",date1);
        console.log("month: ", recmonth );

        //get shell information from database
            url_search = "http://192.168.2.223:9100/hardnessReport?Tablename=trace_plant.traceabilityhardness&castCode="+cast_code+"&heatCode="+heat_code+""
            axios
                .get(url_search, {
                // timeout: 5000
                })
                .then(res => {
                   
                    productname = res.data[0].product_name;
                    console.log("product name: "+productname)

                    shellAE(shell_number,cast_code,heat_code,date1,operatorname,supervisorname,teamleadername,shiftname,operationname,
                      machine_name,determinationname,commentname,productname,recmonth,serialOP)
                    
                })

                .catch(err =>{ 
                    console.error(err)
                    // alert(err)
            
                    if(err == "Error: Network Error"){
                      console.log("No Network")
                      $("#tableView").html("");
                      $("<center><h1 id=errormsg>NO NETWORK</h1></center>").appendTo("#tableView");    
                    }else{
                      
                        swal.fire({
                            title: "Batch not found",
                            text: "Are you sure you entered the correct Serial Number : "+serialNumber+"?",
                            icon: "warning",
                            input: "select",
                            inputOptions: {
                              
                              "155mmM9HE":"155mmM9HE",
                              "155mmM9CAR":"155mmM9CAR",
                              "SBT":"SBT",
                              "M2003PA":"M2003PA",
                              "155mmM2000Slug":"155mmM2000Slug",
                              "LazyBoySlugs":"LazyBoySlugs",
                              "155mmM0121Body":"155mmM0121Body",
                              "M2005BodyAssembly":"M2005BodyAssembly",
                              "M2005Ogive":"M2005Ogive",
                              "M0603-PFF-PA":"M0603-PFF-PA",
                              "AlBaseBleed":"AlBaseBleed",
                              "155mmM0121PA":"155mmM0121PA",
                              "155mmM0603Assembly":"155mmM0603Assembly",
                              "M2003Body":"M2003Body",
                              "155mmM2000":"155mmM2000",
                              "Canister-LV":"Canister-LV",
                              "M2003Ogive":"M2003Ogive",
                              "M2005Body":"M2005Body",
                              "M0603-PFF-Sleeve":"M0603-PFF-Sleeve",
                              "155mmV31":"155mmV31",
                              "M0425A1-LVBB-Slugs":"M0425A1-LVBB-Slugs",
                              "76mm-Body":"76mm-Body",
                              "M0603-PFF-Body":"M0603-PFF-Body",
                              "M2003-SLEEVE":"M2003-SLEEVE",
                              "M0256-PFF-Body":"M0256-PFF-Body",
                              "M0256-PFF-Sleeve":"M0256-PFF-Sleeve"
                            },
                            inputPlaceholder: 'Select Product for this Batch',
                            showCancelButton: true,
                              inputValidator: function (value) {
                                return new Promise(function (resolve, reject) {
                                  if (value !== '') {
                                    resolve();
                                  } else {
                                    resolve('No product Selected');
                                  }
                                });
                              },
                            confirmButtonText: "yes",
                        }).then((result) => {
                            if (result.isConfirmed) {
                                productname = result.value

                                shellAE(shell_number,cast_code,heat_code,date1,operatorname,supervisorname,teamleadername,shiftname,operationname,
                                  machine_name,determinationname,commentname,productname,recmonth,serialOP)
                                    
                             }else{ 
                                document.getElementById("shell").value="";
                                document.getElementById("shellStatus").style.color = "red";
                                document.getElementById("shellStatus").innerHTML = "shell cancelled. please retry";
                                document.getElementById("addshell").disabled = false;                              
                            }
                            });
                    }//end else
                });//end catch
    }
/*============================================================================================================================================================================*/
//                                                                      Add Shell To Traceability DB
/*============================================================================================================================================================================*/
function shellAE(shell_number,cast_code,heat_code,date1,operatorname,supervisorname,teamleadername,shiftname,operationname,
  machine_name,determinationname,commentname,productname,recmonth,serialOP)
{
    useridDC = sessionName;

    var url_search = "http://192.168.2.223:9100/serialnumber?Tablename=trace_plant.shell_traceability&shellNumber="+shell_number+"&castCode="+cast_code+"&heatCode="+heat_code+"&traceabilityDate="+date1+"&operator="+operatorname+"&teamleader="+teamleadername+"&supervisor="+supervisorname+"&shift="+shiftname+"&operationNo="+operationname+"&machineNo="+machine_name+"&product="+productname+"&determination="+determinationname+""
    //check if shell already has data inside the database
    axios
      .get(url_search)
      .then(res => {

          if(res.data.length >= 1){
            swal.fire({
              title: "Shell already exist in database",
              text: "Are you sure you entered the correct Serial Number : "+serialNumber+"?",
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "yes",
                  }).then((result) => {
                      if (result.isConfirmed) 
                      {
                          axios
                              .post('http://192.168.2.223:9100/traceability/addshell?Tablename=trace_plant.shell_traceability_incident', {
                              userName: useridDC,
                              shellNo: shell_number,
                              castCode: cast_code,
                              heatCode: heat_code,
                              serialNumber: shell_serial_no,
                              serialOP: serialOP,
                              traceabilityDate: date1,
                              operator: operatorname,
                              supervisor: supervisorname,
                              teamleader: teamleadername,
                              shift: shiftname,
                              product: productname,
                              operationNo: operationname,
                              machineNo: machine_name,
                              determination: determinationname,
                              month: recmonth,
                              comments: commentname
                          })
                          .then(res => {
                                  document.getElementById("shell").value="";
                                  document.getElementById("shell").focus();
                                  document.getElementById("shellStatus").style.color = "orange";
                                  document.getElementById("shellStatus").innerHTML = "shell_____ "+serialNumber+" _____added on incidents";
                                  document.getElementById("addshell").disabled = false;
                          })
                          .catch(err => {
                                  document.getElementById("shellStatus").style.color = "red";
                                  document.getElementById("shellStatus").innerHTML = "shell NOT added. please retry";
                                  document.getElementById("addshell").disabled = false;
                          });
                      }else{ 
                          document.getElementById("shell").value="";
                          document.getElementById("shellStatus").style.color = "red";
                          document.getElementById("shellStatus").innerHTML = "shell cancelled. please retry";
                          document.getElementById("addshell").disabled = false;                              
                      }
                  })
          }else{
            addToTraceabilityDB(shell_number,cast_code,heat_code,date1,operatorname,supervisorname,teamleadername,shiftname,operationname,
              machine_name,determinationname,commentname,productname,recmonth,serialOP)
          }
      })
      .catch(err =>{ console.error(err)})

}
/*============================================================================================================================================================================*/
//                                                                      Add Shell To Traceability DB
/*============================================================================================================================================================================*/
function addToTraceabilityDB(shell_number,cast_code,heat_code,date1,operatorname,supervisorname,teamleadername,shiftname,operationname,
        machine_name,determinationname,commentname,productname,recmonth,serialOP)
{

    if(sessionStatus != false){
        useridDC = sessionName;
        axios
            .post('http://192.168.2.223:9100/traceability/addshell?Tablename=trace_plant.shell_traceability', {
                userName: useridDC,
                shellNo: shell_number,
                castCode: cast_code,
                heatCode: heat_code,
                serialNumber: shell_serial_no,
                serialOP: serialOP,
                traceabilityDate: date1,
                operator: operatorname,
                supervisor: supervisorname,
                teamleader: teamleadername,
                shift: shiftname,
                product: productname,
                operationNo: operationname,
                machineNo: machine_name,
                determination: determinationname,
                month: recmonth,
                comments: commentname

        })
            .then(res =>{ 
                console.log(res)
                console.log(res.status)
                if (res.status == 201){

                   axios
                        .get("http://192.168.2.223:9100/traceability/username?Tablename=trace_plant.shell_traceability&DataLimit=1&userName="+useridDC+"")
                        .then(res => {
                        
                            var usernameDC = sessionName;
                
                            var row1_1 = $("<tr class=dataP id="+res.data[0].id+"></tr>").insertAfter($( "#heading" ));
                                $("<td><button class=delete id="+res.data[0].id+" onclick=deletedata(this)>Delete</button></td>").appendTo(row1_1);//ID
                                $("<td><button class=editbut id="+res.data[0].id+" onclick=editdata(this)>edit</button></td>").appendTo(row1_1);//ID
                               
                                $("<td style= font-weight:bold></td>").text(res.data[0].shellNo).appendTo(row1_1);//ShellNo
                                $("<td style= font-weight:bold></td>").text(res.data[0].castCode).appendTo(row1_1);//Cast
                                $("<td style= font-weight:bold></td>").text(res.data[0].heatCode).appendTo(row1_1);//Heat
                                $("<td style= font-weight:bold></td>").text(res.data[0].serialNumber).appendTo(row1_1);//Serial No
                                $("<td style= font-weight:bold></td>").text(res.data[0].serialOP).appendTo(row1_1);//Serial OP
                                $("<td style= font-weight:bold></td>").text(res.data[0].traceabilityDate.substring(0,10)).appendTo(row1_1);//Date
                                $("<td style= font-weight:bold></td>").text(res.data[0].operator).appendTo(row1_1);//Operator
                                $("<td style= font-weight:bold></td>").text(res.data[0].supervisor).appendTo(row1_1);//Supervisor
                                $("<td style= font-weight:bold></td>").text(res.data[0].teamleader).appendTo(row1_1);//Team-Leader
                                $("<td style= font-weight:bold></td>").text(res.data[0].shift).appendTo(row1_1);//Shift
                                $("<td style= font-weight:bold></td>").text(res.data[0].product).appendTo(row1_1);//Product
                                $("<td style= font-weight:bold></td>").text(res.data[0].operationNo).appendTo(row1_1);//Operation
                                $("<td style= font-weight:bold></td>").text(res.data[0].machineNo).appendTo(row1_1);//Machine
                                $("<td style= font-weight:bold></td>").text(res.data[0].determination).appendTo(row1_1);//Determination
                                $("<td style= font-weight:bold></td>").text(res.data[0].comments).appendTo(row1_1);//Comments
                                $("<td style= font-weight:bold></td>").text(usernameDC).appendTo(row1_1);//Comments

                                document.getElementById("shell").value=""; 
                                document.getElementById("shell").focus();
                                document.getElementById("shellStatus").style.color = "yellowgreen";
                                document.getElementById("shellStatus").innerHTML = "Shell_____ "+serialNumber+" _____added ";
                                document.getElementById("addshell").disabled = false;
                            
                          })
                          .catch(err =>{ console.error(err)})

              
                }  
            })
            .catch(err =>{ 
                if(err == "Error: Network Error"){
                  console.log("No Network")
                  $("#tableView").html("");
                  $("<center><h1 id=errormsg>NO NETWORK</h1></center>").appendTo("#tableView");
                }
        
                if  (Response.statusCode !== 200 || Response.statusCode !== 201 ){//IF SHELL DOESNT GO THROUGH
                  //console.log("shell error")

                  swal.fire({
                    title: "Shell already exist in database",
                    text: "Are you sure you entered the correct Serial Number : "+serialNumber+"?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "yes",
                        }).then((result) => {
                            if (result.isConfirmed) 
                            {
                                axios
                                    .post('http://192.168.2.223:9100/traceability/addshell?Tablename=trace_plant.shell_traceability_incident', {
                                    userName: useridDC,
                                    shellNo: shell_number,
                                    castCode: cast_code,
                                    heatCode: heat_code,
                                    serialNumber: shell_serial_no,
                                    serialOP: serialOP,
                                    traceabilityDate: date1,
                                    operator: operatorname,
                                    supervisor: supervisorname,
                                    teamleader: teamleadername,
                                    shift: shiftname,
                                    product: productname,
                                    operationNo: operationname,
                                    machineNo: machine_name,
                                    determination: determinationname,
                                    month: recmonth,
                                    comments: commentname
                                })
                                .then(res => {
                                        document.getElementById("shell").value="";
                                        document.getElementById("shell").focus();
                                        document.getElementById("shellStatus").style.color = "orange";
                                        document.getElementById("shellStatus").innerHTML = "shell_____ "+serialNumber+" _____added on incidents";
                                        document.getElementById("addshell").disabled = false;
                                })
                                .catch(err => {
                                        document.getElementById("shellStatus").style.color = "red";
                                        document.getElementById("shellStatus").innerHTML = "shell NOT added. please retry";
                                        document.getElementById("addshell").disabled = false;
                                });
                            }else{ 
                                document.getElementById("shell").value="";
                                document.getElementById("shellStatus").style.color = "red";
                                document.getElementById("shellStatus").innerHTML = "shell cancelled. please retry";
                                document.getElementById("addshell").disabled = false;                              
                            }
                        })
                }//end if
            });
    }else{
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
        
}
