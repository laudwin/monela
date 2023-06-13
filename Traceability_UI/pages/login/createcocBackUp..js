/*************************************************************************Global Variables*********************************************************************************/
var passedProduct = "";
var dictionary = [];//initialize array
var dictionaryPallet = [];//initialize array
var sessionName = localStorage.getItem("mysessionName");
var sessionStatus = localStorage.getItem("mysessionStat");
var pallet_number;
var view = "fromScratch";//initial view(display)
var viewCnt= 0;
var product;
/***********************************************************************************************************************************************************************/
/*************************************************************************Change Views**********************************************************************************/
/***********************************************************************************************************************************************************************/
function openPage(pageName,elmnt,color) {

    if(sessionStatus == "true"){
    
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tablink");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].style.backgroundColor = "";
        }
        document.getElementById(pageName).style.display = "block";
        elmnt.style.backgroundColor = color;
        elmnt.style.fontWeight = "bold";
            if(pageName == "createCoc"){
                if(view == "fromScratch"){
                    create_new_coc_View()
                }else{createPalletView()}
            }
            if(pageName == "InCompleted_CofC"){
                showIncompletePallet()
            }
            if(pageName == "Completed_CofC"){
                showcompletePallet()
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
    }
}

    
/****************************************************************************************************************************************************************************/
/****************************************************************************************************************************************************************************/
//--------------------------------------------------------------------Create New CofC----------------------------------------------------------------------------------------/
/****************************************************************************************************************************************************************************/
/****************************************************************************************************************************************************************************/
function create_new_coc_View()
{
    
    $("#createCoc").html("");
    if(viewCnt==1){
        viewCnt = 0;//set viewcount to 0 reset reload
        location.reload()
    }
    view = "fromScratch";
    $("<h3 class=tabContHead>Create New CofC</h3><hr class=L_hr>").appendTo("#createCoc");
    $("<p>Select a product and click next to continue</p><br>").appendTo("#createCoc");
    var layout = $("<center><label for=Utype><b>Select Product</b><br></label><br></center>").appendTo("#createCoc");
    var select = $("<select name=product class=cascade-dropdown id=selProduct></select><br><br><br><br>").appendTo(layout);
        $("<option value=155MM_M0121_shell selected=selected>155MM_M0121_shell</option>").appendTo(select);
        $("<option value=155MM_M2000_shell >155MM_M2000_shell</option>").appendTo(select);
        $("<option value=155MM_M2003_body >155MM_M2003_body</option>").appendTo(select);
        $("<option value=155MM_M0121_pa >155MM_M0121_pa</option>").appendTo(select);
        $("<option value=Steel_Boat_Tail >Steel_Boat_Tail</option>").appendTo(select);
        $("<option value=M2003_pa >M2003_pa</option>").appendTo(select);
        $("<option value=CANISTER_LV >CANISTER_LV</option>").appendTo(select);
    $("<button class=submitbut type=submit name=nextCOC onclick=createPalletView()>Next</button>").appendTo(layout);                   
}

/*************************************************************************pallet list view*********************************************************************************/
function createPalletView()
{
    if(view == "fromScratch"){
        dictionary = [];//initialize array
        dictionaryPallet = [];//initialize array
        product = document.getElementById("selProduct").value
        passedProduct = product;
        $("#IncompTab").removeAttr('disabled');

        url_search = "http://server_main.products:9071/dipnpack"
    axios
        .get(url_search, {
        // timeout: 5000
        })
        .then(res => {
            var k = res.data.length;
            pallet_number = (res.data[k-1].pallet_id)+1;
            console.log("pallet no: "+ pallet_number)
        }).catch(err =>{ 
            console.log(err)
        })
        
        
        
    }else{
        console.log("from Edit")
        product = dictionaryPallet[0].product_name;
        passedProduct = product;
        pallet_number = dictionaryPallet[0].pallet_id;
        $("#IncompTab").prop("disabled", true);
        
    }
    $("#createCoc").html("");
    $("<center><div id=preloader><div id=loader></div></div></center>").appendTo("#createCoc");
    
    url_search = "http://server_main.products:9071/API?Product="+product+"&SERIAL=&DataLimit=1000"
    axios
        .get(url_search, {
        // timeout: 5000
        })
        .then(res => {
            
           for(var p = 0; p< res.data.length; p++){
   
                if(res.data[p].Status == "PASS"){
                    dictionary.push(res.data[p]);//push values into array only if the status is pass
                }
             }
           
             
             $("<h3 class=tabContHead>create pallet list : "+product+"</h3><hr class=L_hr>").appendTo("#createCoc");
             if(view != "fromScratch"){
                $("<p>Search and Add shell to pallet no: "+pallet_number+" or <button id=newPallet onclick=location.reload()>Create new Pallet</button> </p><br>").appendTo("#createCoc");
             }else{
                $("<p>Search and Add shell to pallet no: "+pallet_number+" </p><br>").appendTo("#createCoc");
             }
             
         
             //--------------------------search view---------------------------------------------------------------------------------------------------------------------------
             var table_view = $("<div id=TableView></div>").appendTo("#createCoc"); 
             var search_table_view = $("<div id=searchTableView></div>").appendTo(table_view);
             $("<input type=text id=schShell onkeyup=searchShell() placeholder= e.g.__100ZZZHHH__(search_serial) autocomplete=off><button id=searchbtn onclick=searchOneShell()>Search</button></input><br>").appendTo(search_table_view);
             var table_view_S = $("<div id=TableViewS></div>").appendTo(search_table_view);
             var search_table = $("<table id=search_table ></table>").appendTo(table_view_S);
             var row1 = $("<tr id=heading></tr>").appendTo(search_table);
             $("<th id=headtab ></th>").text("Add to pallet").appendTo(row1);
             $("<th id=headtab ></th>").text("Serial no").appendTo(row1);
             $("<th id=headtab ></th>").text("FI-Status").appendTo(row1);
             console.log(dictionary)
             for (i = 0; i < dictionary.length; i++) {
                 var row1_1 = $("<tr id="+dictionary[i].id+" class=tableRow></tr>").appendTo("#TableViewS");
                 $("<td id=datatab><button class=AddtoPallet id="+dictionary[i].SERIAL+" onclick=AddToPallet(this)>Add to Pallet</button></td>").appendTo(row1_1);
                 $("<td id=datatab style= font-weight:bold></td>").text(dictionary[i].SERIAL).appendTo(row1_1);
                 $("<td id=datatab style= font-weight:bold></td>").text(dictionary[i].Status).appendTo(row1_1);
             }
             
            //----------------------------pallet view--------------------------------------------------------------------------------------------------------------------------
             var pallet_table_view = $("<div id=palletTableView></div>").appendTo(table_view);
            //  $("<div class=pallist>Pallet List  <button class=generate>Generate CofC</button> </div>").appendTo(pallet_table_view);
            $("<div class=pallist>Pallet List  <button class=generate onclick=GenerateCofC("+pallet_number+")>Generate CofC</button> </div>").appendTo(pallet_table_view);
             $("<div id=messagebar>no shell added [ "+dictionaryPallet.length+" ]</div>").appendTo(pallet_table_view);

             var table_view_S1 = $("<div id=TableViewS1></div>").appendTo(pallet_table_view);

                if(view != "fromScratch"){displaypallet(dictionaryPallet)} 

                view = "fromScratch"// set view to "fromScratch"
                viewCnt = 1;//set viewcount to 0 set reload


              $('#preloader').hide();
        })
        .catch(err =>{ 
            console.log(err)
        })
 
    
}


/*********************************************************************search shell******************************************************************************************/
function searchShell() {
console.log("inside search")
    var input, filter, table, td, i, txtValue;
    input = document.getElementById("schShell");
    filter = input.value.toUpperCase();
    table = document.getElementsByClassName("tableRow");
    // tr = table.getElementsByTagName("tr");
    
        for (i = 0; i < table.length; i++) {
            // console.log(table[i].cells[1])
        td = table[i].cells[1];
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    table[i].style.display = "";
                } else {
                    table[i].style.display = "none";
                }
            }       
        }
      

    }

function searchOneShell(){
    
}
/*********************************************************************add shell to pallet***********************************************************/
var palShellCount = 0;
function AddToPallet(serialV){

    var serialNumber = serialV.id;
    console.log(serialNumber);

    axios
            .post('http://server_main.products:9071/pallet_list', {
                method: "Get_Serial",
                SERIAL: serialNumber
            }).then(res => {
                // console.log(res.data)
                if (res.data.length > 0){
                  
                    swal.fire({
                        title: "Shell Packed",
                        text: "On pallet: "+res.data[0].pallet_id+" | status: "+res.data[0].OVERALL_STATUS+"",
                        icon: "error",
                        confirmButtonText: "Abort",
                    });
                }else{

                    for(var pl = 0; pl< dictionary.length; pl++){
   
                        if(dictionary[pl].SERIAL == serialNumber){
                    
                            var shellid = dictionary[pl].id;

                                dictionaryPallet.push(dictionary[pl]);//push values into array only if the status is pass  
                                // console.log(dictionaryPallet);

                            axios
                                .post('http://server_main.products:9071/pallet_list', {
                                    method: "Post",
                                    pallet_id: pallet_number,
                                    product_name: passedProduct,
                                    serial_id: shellid,
                                    SERIAL: serialNumber,
                                    user_name: sessionName,
                                    material_status: "false",
                                    tensile_status: "false",
                                    mpi_status: "false",
                                    ut_status: "false",                     
                                    balancing_status: "false",
                                    OVERALL_STATUS: "Incomplete"
                                })
                                .then(res => {
                                    $("#messagebar").html("");
                                    palShellCount = dictionaryPallet.length;
                                    document.getElementById("messagebar").innerHTML = "___"+serialNumber+"___added_to_pallet ["+palShellCount+"]";
                                    document.getElementById("messagebar").style.color = "yellowgreen"
                                    displaypallet(dictionaryPallet);
                                }).catch(err => {
                                if (err == "Error: Network Error") {

                                    dictionaryPallet.splice((palShellCount-1),1);//remove current added elements on array
                                    console.log("no network",dictionaryPallet)
                                    swal.fire({
                                        title: "NO NETWORK",
                                        text: "server is down",
                                        icon: "error",
                                        confirmButtonText: "Retry",
                                    });

                                } else {

                                    dictionaryPallet.splice((palShellCount-1),1);//remove current added elements on array
                                    console.log("bad request",dictionaryPallet)

                                    swal.fire({
                                        title: "Bad Request",
                                        text: "try to enter shell again",
                                        icon: "warning",
                                        confirmButtonText: "Retry",
                                    });
                            
                                }
                            });        
                        
                        }//end if
                    }//end for

                }//end else                        
            })

    
}
/*********************************************************************display added shells**********************************************************/
function displaypallet(dictionaryPallet){
    console.log("display pallet info");
    $("#TableViewS1").html("");
    document.getElementById("schShell").focus();
    
    for(var l = 0; l< dictionaryPallet.length; l++){
        var serialcode= ""+dictionaryPallet[l].SERIAL+""
        var row1_1 = $("<tr id="+dictionaryPallet[l].id+" class=tableRow1></tr>").appendTo("#TableViewS1");
         $("<td id=datatab><button class=removeFPallet id="+dictionaryPallet[l].id+" value="+serialcode+" name="+l+" onclick=removeFPallet(this)>Remove From Pallet</button></td>").appendTo(row1_1);
         $("<td id=datatab style= font-weight:bold></td>").text([l+1]+ "   :   " +dictionaryPallet[l].SERIAL).appendTo(row1_1);
      
    }
} 
/***************************************************************************remove from pallet*****************************************************/
function removeFPallet(Shellid){
    var removeShellId = Shellid.id;
    var serialcode = Shellid.value;
    var removenum = Shellid.name

    console.log(removenum)

    swal.fire({
        title: "Remove Shell",
        text: "are you sure you want to remove "+serialcode+"  ",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "YES",
    }).then((result) => {
        if (result.isConfirmed) {
            axios
                .post('http://server_main.products:9071/pallet_list', {
                    method: "Delete",
                    pallet_id: removeShellId,
                })
                .then(res => {
                    
                    dictionaryPallet.splice(removenum,1)
                    // console.log(dictionaryPallet)
                    palShellCount = dictionaryPallet.length;
                    document.getElementById("messagebar").innerHTML = "___"+serialcode+"___Removed_From_Pallet ["+palShellCount+"]";
                    document.getElementById("messagebar").style.color = "orange"
                    displaypallet(dictionaryPallet);
                })
        }
        });
    
}
/****************************************************************************************************************************************************************************/
/****************************************************************************************************************************************************************************/
//--------------------------------------------------------------------display incomplete pallet list-------------------------------------------------------------------------/
/****************************************************************************************************************************************************************************/
/****************************************************************************************************************************************************************************/
function showIncompletePallet(){
    console.log("inside incomplete")

    $("#InCompleted_CofC").html("");

    $("<h3 class=tabContHead>InCompleted CofC</h3><hr class=L_hr>").appendTo("#InCompleted_CofC");
    $("<p>Select incomplete record you want to complete </p><br>").appendTo("#InCompleted_CofC");
    $("<div id=incompleteRec></div><br>").appendTo("#InCompleted_CofC");
    $("<table id=incompleteRectable></table><br>").appendTo("#incompleteRec");



    var url_search = "http://server_main.products:9071/dipnpack"
    axios
        .get(url_search, {
        // timeout: 5000
        })
        .then(res => {
            // console.log(res.data)

            $("#incompleteRectable").html("");
            var row1 = $("<tr id=heading></tr>").appendTo("#incompleteRectable");
            $("<th id=headtab ></th>").text("no").appendTo(row1);
            $("<th id=headtab ></th>").text("Pallet no").appendTo(row1);
            $("<th id=headtab ></th>").text("Product").appendTo(row1);
            $("<th id=headtab ></th>").text("Shells Count").appendTo(row1);
            $("<th id=headtab ></th>").text("Created").appendTo(row1);
            $("<th id=headtab ></th>").text("Edit").appendTo(row1);
            $("<th id=headtab ></th>").text("delete").appendTo(row1);

            
            for(var l = 0; l< res.data.length; l++){

                if(res.data[l].OVERALL_STATUS == "Incomplete"){
            
                    var row1_1 = $("<tr id="+res.data[l].pallet_id+" class=tableRow1></tr>").appendTo("#incompleteRectable");
                    $("<td id=datatab style= font-weight:bold></td>").text(l+1).appendTo(row1_1);
                    $("<td id=datatab style= font-weight:bold></td>").text(res.data[l].pallet_id).appendTo(row1_1);
                    $("<td id=datatab style= font-weight:bold></td>").text(res.data[l].product_name).appendTo(row1_1);
                    $("<td id=datatab style= font-weight:bold></td>").text(res.data[l].COUNT).appendTo(row1_1);
                    $("<td id=datatab style= font-weight:bold></td>").text(res.data[l].created_at.substring(0,10)).appendTo(row1_1);
                    $("<td id=datatab><button class=Edit id="+res.data[l].pallet_id+" onclick=EditPallet(this)>Edit Pallet</button></td>").appendTo(row1_1);
                    $("<td id=datatab><button class=delete id="+res.data[l].pallet_id+" onclick=deletePallet(this)>delete Pallet</button></td>").appendTo(row1_1);
                }//end if

             }//end for
            
        }).catch(err => {
            if (err == "Error: Network Error") {

                swal.fire({
                    title: "NO NETWORK",
                    text: "server is down",
                    icon: "error",
                    confirmButtonText: "Retry",
                });

            } else {

                swal.fire({
                    title: "Bad Request",
                    text: "try to enter shell again",
                    icon: "warning",
                    confirmButtonText: "Retry",
                });
        
            }//end else
            
        }) //end catch   
}//end function
/******************************************************************edit pallet********************************************************************/
function EditPallet(palletNum){

    var pallet_number = palletNum.id;

    axios
            .post('http://server_main.products:9071/pallet_list', {
                method: "Get",
                pallet_id: pallet_number,
            })
            .then(res => {
                
                dictionaryPallet = [];//initialize array
                view = "fromEdit";
                
                for(var pl = 0; pl< res.data.length; pl++){
                   
                    dictionaryPallet.push(res.data[pl]);//push values into array 
                }
                // console.log(dictionaryPallet);
                palShellCount = dictionaryPallet.length
                // createPalletView();
                document.getElementById("defaultOpen").click();

            }).catch(err => {
                if (err == "Error: Network Error") {

                    swal.fire({
                        title: "NO NETWORK",
                        text: "server is down",
                        icon: "error",
                        confirmButtonText: "Retry",
                    });
                } else {
                        console.log(err)
                swal.fire({
                    title: "Bad Request",
                    text: "try to enter shell again",
                    icon: "warning",
                    confirmButtonText: "Retry",
                });
        
            }//end else
            })
}
/******************************************************************delete pallet********************************************************************/
function deletePallet(palletNum){

    var pallet_number = palletNum.id;

    swal.fire({
        title: "Delete Pallet",
        text: "are you sure you want to delete Pallet no: "+pallet_number+"  ",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "YES",
    }).then((result) => {
        if (result.isConfirmed) {
            axios
            .post('http://server_main.products:9071/pallet_list', {
                method: "Delete_Pallet",
                pallet_id: pallet_number,
            })
            .then(res => {showIncompletePallet()})
            .catch(err =>{console.log(err)})
        }})

    
}
/****************************************************************************************************************************************************************************/
/****************************************************************************************************************************************************************************/
//--------------------------------------------------------------------display complete pallet list-------------------------------------------------------------------------/
/****************************************************************************************************************************************************************************/
/****************************************************************************************************************************************************************************/
function showcompletePallet(){
    console.log("inside incomplete")

    $("#Completed_CofC").html("");

    $("<h3 class=tabContHead>Completed CofC</h3><hr class=L_hr>").appendTo("#Completed_CofC");
    $("<p>List of completed CofCs </p><br>").appendTo("#Completed_CofC");
    $("<div id=completeRec></div><br>").appendTo("#Completed_CofC");
    $("<table id=completeRectable></table><br>").appendTo("#completeRec");

    // $("<div>nothing to show here</div><br>").appendTo("#incompleteRectable");

    var url_search = "http://server_main.products:9071/dipnpack"
    axios
        .get(url_search, {
        // timeout: 5000
        })
        .then(res => {
            // console.log(res.data)

            $("#completeRectable").html("");
            var row1 = $("<tr id=heading></tr>").appendTo("#completeRectable");
            $("<th id=headtab ></th>").text("no").appendTo(row1);
            $("<th id=headtab ></th>").text("Pallet no").appendTo(row1);
            $("<th id=headtab ></th>").text("Product").appendTo(row1);
            $("<th id=headtab ></th>").text("Shells Count").appendTo(row1);
            $("<th id=headtab ></th>").text("Completed").appendTo(row1);
         

            
            for(var l = 0; l< res.data.length; l++){

                if(res.data[l].OVERALL_STATUS == "Complete"){
            
                    var row1_1 = $("<tr id="+res.data[l].pallet_id+" class=tableRow1></tr>").appendTo("#completeRectable");
                    $("<td id=datatab style= font-weight:bold></td>").text(l+1).appendTo(row1_1);
                    $("<td id=datatab style= font-weight:bold></td>").text(res.data[l].pallet_id).appendTo(row1_1);
                    $("<td id=datatab style= font-weight:bold></td>").text(res.data[l].product_name).appendTo(row1_1);
                    $("<td id=datatab style= font-weight:bold></td>").text(res.data[l].COUNT).appendTo(row1_1);
                    $("<td id=datatab style= font-weight:bold></td>").text(res.data[l].created_at.substring(0,10)).appendTo(row1_1);
                   
                }//end if

             }//end for
            
        }).catch(err => {
            if (err == "Error: Network Error") {

                swal.fire({
                    title: "NO NETWORK",
                    text: "server is down",
                    icon: "error",
                    confirmButtonText: "Retry",
                });

            } else {

                swal.fire({
                    title: "Bad Request",
                    text: "try to enter shell again",
                    icon: "warning",
                    confirmButtonText: "Retry",
                });
        
            }//end else
            
        }) //end catch   
}//end function
//=================================================================================================================================================================
//                                                              Generate CofC
//=================================================================================================================================================================
async function GenerateCofC(pallet_number)
{
    
    await axios
    .get("http://192.168.2.223:9075/Generate_CofC?pallet_number="+pallet_number+"")
    .then(res => {
        console.log(res)
        console.log("checking data........")
        loadCOCResults()

    }).catch(err =>{console.log(err)});  
    
}
//=================================================================================================================================================================
function loadCOCResults(){
     
    axios
    .post('http://server_main.products:9071/pallet_list', {
        method: "Get",
        pallet_id: pallet_number,
    })
    .then(res => {
        console.log(res)
        generatorView()
    }).catch(err =>{console.log(err)}); 
}
//=================================================================================================================================================================
function generatorView(){
    console.log("generate coc for : "+pallet_number)
    $("#mainItems").html("");
    $("#item2").html("");
}

