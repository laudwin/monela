function startup(){
    $("#messagebox").hide()
    sessionData = JSON.parse(localStorage.getItem("mysessionData"));
    sessionStatus = sessionData.loggedin
    sessionName = sessionData.username
    sessionUserType = sessionData.userType
    
        $("<div class=userName>"+sessionName+" As Admin</div>").appendTo("#userInfo");// display username on html
        $("<button class=bbt onclick=logout()> SignOut</button></div>").addClass("fas fa-sign-out-alt").appendTo("#userInfo");// display logout button on html
        
}
/****************************************************************************************************************************************************************************/
function homePage(){ 
    window.location="/index.html";
}//redirect to another page
/****************************************************************************************************************************************************************************/
function registerPage(){
    window.location="../login/register_ui.html";
}//redirect to another page
/****************************************************************************************************************************************************************************/
function adminView(){
    window.location="/pages/Admin/admin.html";
}//redirect to another page
/****************************************************************************************************************************************************************************/
function Users(){
    window.location="/pages/Admin/users/users_ui.html";
}//redirect to another page
/****************************************************************************************************************************************************************************/
function logout() {

    swal.fire({
        title: "Sign-out ?",
        text: "Are you sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem("mysessionStat");
            localStorage.removeItem("mysessionName");
            localStorage.removeItem("mysessionData");
            homePage();
        }
        });
  }
/****************************************************************************************************************************************************************************/
var sessionName = localStorage.getItem("mysessionName");
var privilegeList=[];
/*==========================================================================================================================================================================*/
/****************************************register password check*************************************************************************************************************/
var check = function() { //check if passwords entered match
    if (document.getElementById('createpassword').value == document.getElementById('confirmpassword').value && document.getElementById('createpassword').value !="") {
      document.getElementById('message').style.color = 'green';
      document.getElementById('message').innerHTML = 'matching';
  
      
    }else if(document.getElementById('createpassword').value =="" && document.getElementById('confirmpassword').value==""){
        document.getElementById('message').style.color = 'orange';
        document.getElementById('message').innerHTML = 'field cannot be blank';
    } else {
      document.getElementById('message').style.color = 'red';
      document.getElementById('message').innerHTML = 'not matching';
    }
  }
/********************************************************************************************************************************************************************************/
 async function register(){



    console.log(privilegeList)
    
    var usertype = (document.getElementById('usertypeDropdown').value);
    var createfirstname = (document.getElementById('createfirstname').value).toLowerCase();
    var createlastname = (document.getElementById('createlastname').value).toLowerCase();
    var createclocknumber = (document.getElementById('createclocknumber').value);
    var createpassword = (document.getElementById('createpassword').value).toLowerCase();
    var confirmpassword = (document.getElementById('confirmpassword').value).toLowerCase();

    var Data_Capturecheck = null
    var Productioncheck = null
    var Operatorcheck = null
    var Quality_Inspectorcheck = null 
    var COC_Qualitycheck = null
    var Managementcheck = null
    var Admincheck = null

    if(privilegeList[0]=="Data_Capture"){
        Data_Capturecheck = document.getElementById("Data_Capture");
        if(Data_Capturecheck.checked == true){Data_Capturecheck = document.getElementById("Data_Capture").value}else{ Data_Capturecheck = null}
    }
    if(privilegeList[1]=="Production"){
        Productioncheck = document.getElementById("Production");
        if(Productioncheck.checked == true){Productioncheck = document.getElementById("Production").value}else{ Productioncheck = null}
    }
    if(privilegeList[2]=="Operator"){
        Operatorcheck = document.getElementById("Operator");
        if(Operatorcheck.checked == true){Operatorcheck = document.getElementById("Operator").value}else{ Operatorcheck = null}
    }
    if(privilegeList[3]=="Quality_Inspector"){
        Quality_Inspectorcheck = document.getElementById("Quality_Inspector");
        if(Quality_Inspectorcheck.checked == true){Quality_Inspectorcheck = document.getElementById("Quality_Inspector").value}else{ Quality_Inspectorcheck = null}
    }
    if(privilegeList[4]=="COC_Quality"){
        COC_Qualitycheck = document.getElementById("COC_Quality");
        if(COC_Qualitycheck.checked == true){COC_Qualitycheck = document.getElementById("COC_Quality").value}else{ COC_Qualitycheck = null}
    }
    if(privilegeList[5]=="Management"){
        Managementcheck = document.getElementById("Management");
        if(Managementcheck.checked == true){Managementcheck = document.getElementById("Management").value}else{ Managementcheck = null}
    }
    if(privilegeList[6]=="Admin"){
        Admincheck = document.getElementById("Admin");
        if(Admincheck.checked == true){Admincheck = document.getElementById("Admin").value}else{ Admincheck = null}
    }


    $("#messageboxArea").html("");

    if(usertype==""){
        $("<div id=messagebox </div>").text("x -- User_Type cannot be left blank").appendTo("#messageboxArea");// display error messagel
    }else if(createfirstname==""){
        $("<div id=messagebox </div>").text("x -- First Name field cannot be left blank").appendTo("#messageboxArea");// display error message
    }else if(createlastname==""){
        $("<div id=messagebox </div>").text("x -- Last Name field cannot be left blank").appendTo("#messageboxArea");// display error message
    }else if(createclocknumber==""){
        $("<div id=messagebox </div>").text("x -- Clock Number field cannot be left blank").appendTo("#messageboxArea");// display error message
    }else if(createpassword==""){
        $("<div id=messagebox </div>").text("x -- Password field cannot be left blank").appendTo("#messageboxArea");// display error message
    }else if(confirmpassword==""){
        $("<div id=messagebox </div>").text("x -- Confirm Password field cannot be left blank").appendTo("#messageboxArea");// display error message
    }else{
        console.log(usertype)
        console.log(createfirstname)
        console.log(createlastname)
        console.log(createclocknumber)
        console.log(createpassword)
        // console.log(confirmpassword)
        console.log(Data_Capturecheck)
        console.log(Productioncheck)
        console.log(Operatorcheck)
        console.log(Quality_Inspectorcheck)
        console.log(COC_Qualitycheck)
        console.log(Managementcheck)
        console.log(Admincheck)
   
        if(createpassword == confirmpassword){
            console.log("new user registered");

            var usernameC = createfirstname+"@"+createclocknumber

           await axios
                .post('http://192.168.2.223:9071/newUser', {
                    user_type: usertype,
                    first_name: createfirstname,
                    last_name: createlastname,
                    clock_number: createclocknumber,
                    user_name: usernameC,
                    cpassword: createpassword,
                    Data_Capture: Data_Capturecheck,
                    Production: Productioncheck,
                    Operator: Operatorcheck,
                    Quality_Inspector: Quality_Inspectorcheck,
                    COC_Quality: COC_Qualitycheck,
                    Management: Managementcheck,
                    Admin: Admincheck,
                    createdby: sessionName,
            })
                .then(res =>{ 
                    console.log(res)
                    console.log(res.status)
                   
                    swal.fire({
                        title: "SUCCESS",
                        text: createfirstname+"__"+createlastname + " has been registered\n_____Username:"+createfirstname+"@"+createclocknumber+" _____\nPassword:"+createpassword,
                        icon: "success",
                        confirmButtonText: "Continue",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            document.getElementById('usertype').value = "";
                            document.getElementById('createfirstname').value = "";
                            document.getElementById('createlastname').value = "";
                            document.getElementById('createclocknumber').value = "";
                            document.getElementById('createpassword').value = "";
                            document.getElementById('confirmpassword').value = "";

                            document.getElementById("Data_Capture").checked = false;
                            document.getElementById("Production").checked = false;
                            document.getElementById("Operator").checked = false;
                            document.getElementById("Quality_Inspector").checked = false;
                            document.getElementById("COC_Quality").checked = false;
                            document.getElementById("Management").checked = false;
                            document.getElementById("Admin").checked = false;
                            $("#message").html("");
                        }
                    });
                })
                .catch(err =>{
                    if(err=="Error: Request failed with status code 400"){
                        swal.fire({
                            title: "User already exist",
                            text: "contact admin for assistence",
                            icon: "warning",
                            confirmButtonText: "Retry",
                        });
                    }
                })

        }else{
            $("<div id=messagebox </div>").text("x --- Password not matching").appendTo("#messageboxArea");// display error message
        }
    }
   
}
/****************************************************************************************************************************************************************************/
function privilegeOptions(){

    var sessionValue = localStorage.getItem("mysessionData");
    privilegeList=[];
    var splitLine = 3;

    sessionValue=JSON.parse(sessionValue)
    console.log(sessionValue);

    for(var i =0; i<sessionValue.privilege_data.length; i++){
        if(sessionValue.privilege_data[i].privilege == null || sessionValue.privilege_data[i].privilege == 'null'){
            console.log("not added")
        }else{
            privilegeList.push(sessionValue.privilege_data[i].privilege)
        }
       
    }

    console.log(privilegeList);

    $("<select id=usertypeDropdown></select>").appendTo("#usertype")

    for(var y=0;y<privilegeList.length; y++){

        if(y>splitLine){
            $("<br>").appendTo("#prvlg")
            splitLine+=4;
        }
        $("<option value="+privilegeList[y]+" >"+privilegeList[y]+"</option>").appendTo("#usertypeDropdown")
        $(" <input type=checkbox id="+privilegeList[y]+" class=checkBck value="+privilegeList[y]+">"+privilegeList[y]+"</input>").appendTo("#prvlg")
       
    }
}