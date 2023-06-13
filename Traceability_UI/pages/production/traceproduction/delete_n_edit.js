/*============================================================================================================================================================================*/
//                                                                      Global Variables
/*============================================================================================================================================================================*/
var sessionStatus = localStorage.getItem("mysessionStat");
var sessionName = localStorage.getItem("mysessionName");
/*============================================================================================================================================================================*/
//                                                                      Delete Data
/*============================================================================================================================================================================*/
function deletedata(element){

    var traceid = element.id;
    console.log(traceid)
  
    axios    
    .get("http://192.168.2.223:9100/serialbyid?Tablename=trace_plant.shell_traceability&id="+traceid+"") 
    .then(res => {
        console.log(res.data[0].userName)

            if(res.data[0].userName == sessionName){

              swal.fire({
                title: res.data[0].serialOP,
                text: "are you sure you want to delete?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "yes",
            }).then((result) => {
                if (result.isConfirmed) {
                  
                  axios
                  .delete("http://192.168.2.223:9100/traceability/deleteshell?Tablename=trace_plant.shell_traceability&id="+traceid+"")
                  .then(res => $(element).parent().parent().remove())
                  .catch(err => console.error(err));
                }
              });

          }else{
                        swal.fire({
                          title: "Not Authorized!!!!!!!",
                          text: "You can only delete your own work",
                          icon: "warning",
                          confirmButtonText: "Cancel",
                      })
                }


    })
  .catch(err => console.error(err));

  }
         
  /************************************************************************delete on incidents*******************************************************************************/
  function deleteINCdata(delt){

    var deltId = delt.id;
    console.log(deltId)
  
    axios    
    .get("http://192.168.2.223:9100/serialbyid?Tablename=trace_plant.shell_traceability_incident&id="+deltId+"")
      .then(res => {
          if(res.data[0].userName == sessionName){

            swal.fire({
              title: res.data[0].serialOP,
              text: "are you sure you want to delete?",
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "yes",
            }).then((result) => {
              if (result.isConfirmed) {
                
                axios
                .delete("http://192.168.2.223:9100/traceability/deleteshell?Tablename=trace_plant.shell_traceability_incident&id="+deltId+"")
                .then(res => $(delt).parent().parent().remove())
                .catch(err => console.error(err));
              }
            });

          }else{
                      swal.fire({
                        title: "Not Authorized!!!!!!!",
                        text: "You can only delete your own work",
                        icon: "warning",
                        confirmButtonText: "Cancel",
                    })
              }
  
      })//end request 
      .catch(err => console.error(err));

  }
/*============================================================================================================================================================================*/
//                                                                      edit shell form
/*============================================================================================================================================================================*/
  var highlightRow;//global variable

  async function editdata(elem){
    
    var trcid = elem.id;
    console.log(trcid);
  
  
    await axios    
    .get("http://192.168.2.223:9100/serialbyid?Tablename=trace_plant.shell_traceability&id="+trcid+"") 
    .then(res => {
        console.log(res.data[0].serialOP)

        if(res.data[0].userName == sessionName){
  
            highlightRow = $(elem).parent().parent();
            highlightRow.css("background-color","orange");
            
    
            var formlayout = $("<div class=formlayout></div>").appendTo("#serEd");
            var edform = $("<form id=edform></form>").appendTo(formlayout);
            $("#edform").html("");
            $("<label class=labool>Shell: </label>").appendTo(edform);
            $("<input type=text class=serial placeholder="+res.data[0].shellNo+" value="+res.data[0].shellNo+" id=shellno_edit  onchange=updateValue(this)></input>").appendTo(edform);
        
            $("<br><br><label class=labool>Cast: </label>").appendTo(edform);
            $("<input type=text class=serial placeholder="+res.data[0].castCode+" value="+res.data[0].castCode+" id=castCode_edit onchange=updateValue(this)></input>").appendTo(edform);
        
            $("<br><br><label class=labool>Heat: </label>").appendTo(edform);
            $("<input type=text class=serial placeholder="+res.data[0].heatCode+" value="+res.data[0].heatCode+" id=heatCode_edit onchange=updateValue(this)></input>").appendTo(edform);
        
            $("<br><br><label class=labool>Date: </label>").appendTo(edform);
            $("<input type=text class=serial placeholder="+res.data[0].traceabilityDate+" value="+res.data[0].traceabilityDate+" id=traceabilityDate_edit onchange=updateValue(this)></input>").appendTo(edform);
        
            $("<br><br><label class=labool>operator: </label>").appendTo(edform);
            $("<input type=text class=serial placeholder="+res.data[0].operator+" value="+res.data[0].operator.replace(/\s+/g, '_')+" id=operator_edit onchange=updateValue(this)></input>").appendTo(edform);
        
            $("<br><br><label class=labool>supervisor: </label>").appendTo(edform);
            $("<input type=text class=serial placeholder="+res.data[0].supervisor+" value="+res.data[0].supervisor.replace(/\s+/g, '_')+" id=supervisor_edit onchange=updateValue(this)></input>").appendTo(edform);
        
            $("<br><br><label class=labool>teamleader: </label>").appendTo(edform);
            $("<input type=text class=serial placeholder="+res.data[0].teamleader+" value="+res.data[0].teamleader.replace(/\s+/g, '_')+" id=teamleader_edit onchange=updateValue(this)></input>").appendTo(edform);
        
            $("<br><br><label class=labool>shift: </label>").appendTo(edform);
            var select2 = $("<select class=serial value="+res.data[0].shift+" id=shift_edit onchange=updateValue(this)></select>").appendTo(edform);
            $("<option>"+res.data[0].shift+"</option>").appendTo(select2);
            $("<option value=Morning>Morning</option>").appendTo(select2);
            $("<option value=Afternoon>Afternoon</option>").appendTo(select2);
            $("<option value=Night>Night</option>").appendTo(select2);
        
            $("<br><br><label class=labool>product: </label>").appendTo(edform);
            $("<input type=text class=serial placeholder="+res.data[0].product+" value="+res.data[0].product.replace(/\s+/g, '_')+" id=product_edit onchange=updateValue(this)></input>").appendTo(edform);
        
            $("<br><br><label class=labool>operationNo: </label>").appendTo(edform);
            $("<input type=text class=serial placeholder="+res.data[0].operationNo+" value="+res.data[0].operationNo.replace(/\s+/g, '_')+" id=operationNo_edit onchange=updateValue(this)></input>").appendTo(edform);
        
            $("<br><br><label class=labool>machineNo: </label>").appendTo(edform);
            $("<input type=text class=serial placeholder="+res.data[0].machineNo+" value="+res.data[0].machineNo+" id=machineNo_edit onchange=updateValue(this)></input>").appendTo(edform);
        
            $("<br><br><label class=labool>determination: </label>").appendTo(edform);
            var select3 = $("<select class=serial id=determination_edit onchange=updateValue(this)></select>").appendTo(edform);
            $("<option>"+res.data[0].determination+"</option>").appendTo(select3);
            $("<option value=Pass>Pass</option>").appendTo(select3);
            $("<option value=Rework>Rework</option>").appendTo(select3);
            $("<option value=Scrap>Scrap</option>").appendTo(select3);
        
            $("<br><br><label class=labool>Comments: </label>").appendTo(edform);
            $("<input type=text class=serial placeholder="+res.data[0].comments+" value="+res.data[0].comments+" id=comments_edit onchange=updateValue(this)></input>").appendTo(edform);
        
        
            var buttonbox = $("<br><div class=buttonbox></div>").appendTo(edform);
            $("<br><input type=button20 id="+res.data[0].id+" onclick=save_edit(this) value=save></input>").appendTo(buttonbox);
            $("<input type=button id=cancelinfo onclick=cancel_edit(this) value=cancel></input>").appendTo(buttonbox);
  
        }else{
            swal.fire({
            title: "Not Authorized!!!!!!!",
            text: "You can only edit your own work",
            icon: "warning",
            confirmButtonText: "Cancel",
        })
        }
  
    });//end request  
  
  }
  function updateValue(valueId)
  {
     var valID = valueId.id
     var valValue = valueId.value
    document.getElementById(valID).value = valValue;
  }
/*============================================================================================================================================================================*/
//                                                                      cancel edit
/*============================================================================================================================================================================*/
  function cancel_edit(){
    $('.formlayout').hide();
  }
  
/*============================================================================================================================================================================*/
//                                                                      re-arrange edited shell data
/*============================================================================================================================================================================*/
   function save_edit(lemento){
    var res_idIn = lemento.id
    console.log("shell updated : "+res_idIn)
  
    // $("<center><div class=loader></div></center>").appendTo("#tableView");
    //----------------------------------------------------------------------------------

    var shell_number = document.getElementById("shellno_edit").value;
    var cast_code = document.getElementById("castCode_edit").value.toUpperCase();
    var heat_code = document.getElementById("heatCode_edit").value.toUpperCase();
    var date_trae = document.getElementById("traceabilityDate_edit").value;
    var operatorname = document.getElementById("operator_edit").value.toUpperCase();
    var supervisorname = document.getElementById("supervisor_edit").value.toUpperCase();
    var teamleadername = document.getElementById("teamleader_edit").value.toUpperCase();
    var shiftname = document.getElementById("shift_edit").value;
    var productname = document.getElementById("product_edit").value;
    var operationname = document.getElementById("operationNo_edit").value;
    var machine_name = document.getElementById("machineNo_edit").value;
    var determinationname = document.getElementById("determination_edit").value;
    var commentname = document.getElementById("comments_edit").value.toUpperCase();
    //rejectname = document.getElementById("reject").value;
  
    shell_serial_no = shell_number+"-"+cast_code+"-"+heat_code
    serialNumber = shell_number+cast_code+heat_code
    serialOP = serialNumber+operationname
  
    date1 = date_trae+" 00:00:00";
     
    year = new Date(date_trae).getFullYear()
    mon = (new Date(date_trae).getMonth() + 1).toString().padStart(2, "0");
    recmonth = year +"-"+ mon +"-01 00:00:00"
    
    console.log("shellno:", shell_number);
    console.log("cast:", cast_code);
    console.log("heat:", heat_code);
    console.log("date:",date1);
    console.log("operator:",operatorname);
    console.log("supervisor:",supervisorname);
    console.log("determination:",determinationname);
    console.log("month:", recmonth );

    url_search =
            axios
                .get( "http://192.168.2.223:9100/hardnessReport?Tablename=trace_plant.traceabilityhardness&castCode="+cast_code+"&heatCode="+heat_code+"")
                // timeout: 5000
                .then(res => {
                   
                    productname = res.data[0].product_name;
                    console.log("product name: "+productname)
          
                })

                .catch(err =>{ 
                    console.error(err)
                  })

  
    url_search = "http://192.168.2.223:9100/hardnessReport?Tablename=trace_plant.traceabilityhardness&castCode="+cast_code+"&heatCode="+heat_code+""
    axios
        .get(url_search, {
        // timeout: 5000
        })
        .then(res => {
          console.log(res.data.length);
          
          if(res.data.length==0){

            swal.fire({
              title: "NO HARDNESS FOUND",
              text: "Please Delete "+serialNumber+"  and Re-add as New Shell",
              icon: "error",
              showCancelButton: true,
              confirmButtonText: "Delete",
          }).then((result) => {
              if (result.isConfirmed) {

                axios
                .delete("http://192.168.2.223:9100/traceability/deleteshell?Tablename=trace_plant.shell_traceability&id="+res_idIn+"")
                .then(res =>{ 
                  highlightRow.remove();
                  $('.formlayout').hide();
                  document.getElementById("dataDetails").innerHTML = ""
                  document.getElementById("dataDetails").style.color = "yellowgreen";
                  document.getElementById("dataDetails").innerHTML = serialNumber+" Deleted, Please Re-Add as New Shell";
                  setTimeout(function() {
                    document.getElementById("dataDetails").innerHTML = ""}
                  , 7000)//clear label after 5seconds
                })
                .catch(err => {
                  document.getElementById("dataDetails").innerHTML = ""  
                  document.getElementById("dataDetails").style.color = "red";
                    document.getElementById("dataDetails").innerHTML = "NO Changes Made to Record. Please Retry";
                    setTimeout(function() {
                      document.getElementById("dataDetails").innerHTML = ""}
                    , 5000)//clear label after 5seconds
                });
                  
                

                  }
                });
  
          }else{

            var url_search = "http://192.168.2.223:9100/serialnumber?Tablename=trace_plant.shell_traceability&shellNumber="+shell_number+"&castCode="+cast_code+"&heatCode="+heat_code+"&traceabilityDate="+date1+"&operator="+operatorname+"&teamleader="+teamleadername+"&supervisor="+supervisorname+"&shift="+shiftname+"&operationNo="+operationname+"&machineNo="+machine_name+"&product="+productname+"&determination="+determinationname+""
              //check if shell already has data inside the database
              axios
                .get(url_search)
                .then(res => {
                    if(res.data.length >= 1){
                        // alert(serialNumber+" ||Shell already exist")
                        
                        swal.fire({
                          title: "Record already exist in database",
                          text: "Do you want to Continue with the Change?",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "yes",
                              }).then((result) => {
                                  if (result.isConfirmed) 
                                  {
                                    axios
                                    .delete("http://192.168.2.223:9100/traceability/deleteshell?Tablename=trace_plant.shell_traceability&id="+res_idIn+"")
                                    .then(res => highlightRow.remove())
                                    .catch(err => console.error(err));
            
                                    axios
                                      .post('http://192.168.2.223:9100/traceability/addshell?Tablename=trace_plant.shell_traceability_incident', {
                                        userName: sessionName,
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
                                        $('.formlayout').hide();
                                        highlightRow.css("background-color","");

                                        document.getElementById("dataDetails").innerHTML = ""
                                        document.getElementById("dataDetails").style.color = "orange";
                                        document.getElementById("dataDetails").innerHTML = "Record Moved to incidents";
                                        setTimeout(function() {
                                          document.getElementById("dataDetails").innerHTML = ""}
                                        , 5000)//clear label after 5seconds
                                      })
                                      .catch(err => {
                                        document.getElementById("dataDetails").innerHTML = ""  
                                        document.getElementById("dataDetails").style.color = "red";
                                          document.getElementById("dataDetails").innerHTML = "NO Changes Made to Record. Please Retry";
                                          setTimeout(function() {
                                            document.getElementById("dataDetails").innerHTML = ""}
                                          , 5000)//clear label after 5seconds
                                      });
                                  }//end if
                        });//end swal
            
                    }else{
                      $('.editFormContainer').hide();
                      editupdate(lemento,res_idIn,shell_number,cast_code,heat_code,date1,
                        operatorname,supervisorname,teamleadername,shiftname,productname,operationname,
                        machine_name,determinationname,commentname,shell_serial_no,serialOP,recmonth);
                    }
                     
      
                });//End query
          } 
          
        })
        .catch(err => console.error(err));
  }
/*============================================================================================================================================================================*/
//                                                                      Post edited shell
/*============================================================================================================================================================================*/
function editupdate(lemento,res_idIn,shell_number,cast_code,heat_code,date1,
  operatorname,supervisorname,teamleadername,shiftname,productname,operationname,
  machine_name,determinationname,commentname,shell_serial_no,serialOP,recmonth)
{

  console.log("edit update activated")

   console.log(res_idIn)
  
  
  axios
    .put("http://192.168.2.223:9100/traceability/editshell?Tablename=trace_plant.shell_traceability", {
      Shell_id: res_idIn,
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
      
        //document.getElementById("fltDC").classList.toggle("show1");
        //filterdata();
        // console.log(res)
        console.log(res.status)
       if (res.status == 201){
  
            
            ///--------------------------------------------------------

          axios
          .get("http://192.168.2.223:9100/serialbyid?Tablename=trace_plant.shell_traceability&id="+res_idIn+"")
          .then(res => {
                  highlightRow.css("background-color","");
                  highlightRow.remove();
                  $(lemento).parent().parent().remove()
                  console.log(res)
                var row1_1 = $("<tr class=dataP id="+res.data[0].id+"></tr>").insertAfter($( "#heading" ));
                  $("<td><button class=delete id="+res.data[0].id+" onclick=deletedata(this)>Delete</button></td>").appendTo(row1_1);//ID
                  $("<td id=serEd><button class=editbut id="+res.data[0].id+" onclick=editdata(this)>edit</button></td>").appendTo(row1_1);//ID
                  $("<td class= edited1 style= font-weight:bold></td>").text(res.data[0].shellNo).appendTo(row1_1);//ShellNo
                  $("<td class= edited1 style= font-weight:bold></td>").text(res.data[0].castCode).appendTo(row1_1);//Cast
                  $("<td class= edited1 style= font-weight:bold></td>").text(res.data[0].heatCode).appendTo(row1_1);//Heat
                  $("<td class= edited1 style= font-weight:bold></td>").text(res.data[0].serialNumber).appendTo(row1_1);//Serial No
                  $("<td class= edited1 style= font-weight:bold></td>").text(res.data[0].serialOP).appendTo(row1_1);//Serial OP
                  $("<td class= edited1 style= font-weight:bold></td>").text(res.data[0].traceabilityDate.substring(0,10)).appendTo(row1_1);//Date
                  $("<td class= edited1 style= font-weight:bold></td>").text(res.data[0].operator).appendTo(row1_1);//Operator
                  $("<td class= edited1 style= font-weight:bold></td>").text(res.data[0].supervisor).appendTo(row1_1);//Supervisor
                  $("<td class= edited1 style= font-weight:bold></td>").text(res.data[0].teamleader).appendTo(row1_1);//Team-Leader
                  $("<td class= edited1 style= font-weight:bold></td>").text(res.data[0].shift).appendTo(row1_1);//Shift
                  $("<td class= edited1 style= font-weight:bold></td>").text(res.data[0].product).appendTo(row1_1);//Product
                  $("<td class= edited1 style= font-weight:bold></td>").text(res.data[0].operationNo).appendTo(row1_1);//Operation
                  $("<td class= edited1 style= font-weight:bold></td>").text(res.data[0].machineNo).appendTo(row1_1);//Machine
                  $("<td class= edited1 style= font-weight:bold></td>").text(res.data[0].determination).appendTo(row1_1);//Determination
                  $("<td class= edited1 style= font-weight:bold></td>").text(res.data[0].comments).appendTo(row1_1);//Comments
                  $("<td class= edited1 style= font-weight:bold></td>").text(res.data[0].userName).appendTo(row1_1);//Comments
                  $('.formlayout').hide();
                  
                
             })
          .catch(err => {
          console.log(err)
              if(err == "Error: Network Error"){
                console.log("No Network")
                $("#tableView").html("");
                $("<center><h1 id=errormsg>NO NETWORK</h1></center>").appendTo("#tableView");

              }
  
            if  (Response.statusCode !== 200 || Response.statusCode !== 201 || err == "Error: Request failed with status code 403"){//IF SHELL DOESNT GO THROUGH
            
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
                        .delete("http://192.168.2.223:9100/traceability/deleteshell?Tablename=trace_plant.shell_traceability&id="+res_idIn+"")
                        .then(res => highlightRow.remove())
                        .catch(err => console.error(err));

                        axios
                        .post('http://192.168.2.223:9100/traceability/addshell?Tablename=trace_plant.shell_traceability_incident', {
                          userName: sessionName,
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
                            $('.formlayout').hide();
                            highlightRow.css("background-color","");

                            document.getElementById("dataDetails").innerHTML = ""
                            document.getElementById("dataDetails").style.color = "orange";
                            document.getElementById("dataDetails").innerHTML = "Record Moved to incidents";
                            setTimeout(function() {
                              document.getElementById("dataDetails").innerHTML = ""}
                            , 5000)//clear label after 5seconds
                          })
                          .catch(err => {
                            document.getElementById("dataDetails").innerHTML = ""  
                            document.getElementById("dataDetails").style.color = "red";
                              document.getElementById("dataDetails").innerHTML = "NO Changes Made to Record. please retry";
                              setTimeout(function() {
                                document.getElementById("dataDetails").innerHTML = ""}
                              , 5000)//clear label after 5seconds
                          });

                      }//end if
              });//end swal
            } //end if for response     
          })//end catch
        }// end if
  
    })//end then
}//end function
