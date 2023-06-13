var sessionStatus = "false";
var sessionName;
var logStatus;
/******************************************************************************************************************************************************************************/
function startup(){
    sessionData = JSON.parse(localStorage.getItem("mysessionData"));
    sessionStatus = localStorage.getItem("mysessionStat");
    sessionName = localStorage.getItem("mysessionName");
    
        if (sessionStatus == "true"){
            sessionUserType = sessionData.userType
            console.log(sessionData)
            console.log(sessionUserType)
            $("#userInfo").html("");
            if(sessionUserType=="Admin" || sessionUserType=="Management"){

                $("<div class=userName>"+sessionName+"</div>").appendTo("#userInfo");// display username on html
                $("<button class=bbt onclick=adminView()> Admin</button></div>").addClass("fa-solid fa-screwdriver-wrench").appendTo("#userInfo");// display logout button on html
                $("<button class=bbt onclick=logout()> SignOut</button></div>").addClass("fas fa-sign-out-alt").appendTo("#userInfo");// display logout button on html

            }else{
                $("<div class=userName>"+sessionName+"</div>").appendTo("#userInfo");// display username on html
                $("<button class=bbt onclick=logout()> SignOut</button></div>").addClass("fas fa-sign-out-alt").appendTo("#userInfo");// display logout button on html
            }
            
        } else{
            console.log(sessionData)
            $("#userInfo").html("");
            // $("<button class=bbt onclick=registerPage()> Register</button>").addClass("fas fa-user-plus").appendTo("#userInfo");// display register button on html
            $("<button class=bbt onclick=signInPage()> Sign-in</button>").addClass("fas fa-sign-in").appendTo("#userInfo");// display signin button on html 
        }
        
}
function indexpage(){

    window.location="./index.html";
  
}//redirect to another page
/****************************************************************************************************************************************************************************/
//--------------------------------------------------------------------COC---------------------------------------------------------------
function cocPage(){
    if (sessionStatus == "true"){
        window.location="./pages/CofCs/cocs_ui.html";
    }else{
        window.location="./pages/login/signIn_ui.html";
    }
    
}//redirect to another page
//------------------------------------------------------------------QUALITY---------------------------------------------------------------
function quality(){
    if (sessionStatus == "true"){
        window.location="./pages/quality/quality_ui.html";
    }else{
        window.location="./pages/login/signIn_ui.html";
    }
    
}//redirect to another page
//------------------------------------------------------------------PRODUCTION---------------------------------------------------------------
function production(){
    if (sessionStatus == "true"){
        window.location="./pages/production/production_ui.html";
    }else{
        window.location="./pages/login/signIn_ui.html";
    }
    
}//redirect to another page
//------------------------------------------------------------------ADMIN---------------------------------------------------------------
function adminView(){
    if (sessionStatus == "true"){
        window.location="/pages/Admin/admin.html";
    }else{
        window.location="./pages/login/signIn_ui.html";
    }
    
}//redirect to another page
/****************************************************************************************************************************************************************************/
function homePage(){ 
    window.location="/index.html";
}//redirect to another page
/***************************************************************logins*************************************************************************************************************/
function signInPage(){
    window.location="./pages/login/signIn_ui.html";
}//redirect to another page
/****************************************************************************************************************************************************************************/
/****************************************************************************************************************************************************************************/
/****************************************************************************************************************************************************************************/
/****************************************************************************************************************************************************************************/
/****************************************************************************************************************************************************************************/
/***********************************************************sign-in and out *************************************************************************************************/
function signIn(){
    var sessionValue;
    var usernameDC;
    var usernameid = document.getElementById("username").value;
    var passwordid = document.getElementById("password").value;

    if(usernameid!="" && passwordid!=""){

        document.getElementById("reqUser").innerHTML="";//initialize pop-up message 
        document.getElementById("username").style.border = "none";//initialize pop-up border color
        document.getElementById("reqPass").innerHTML="";//initialize pop-up message
        document.getElementById("password").style.border = "none";//initialize pop-up border color

    axios
        .post('http://192.168.2.223:9071/login', {
            username: usernameid,
            password: passwordid
        })
        .then(res => {
            
            sessionValue ={
                loggedin: res.data.loggedin,
                userId: res.data.user_id,
                userType: res.data.user_type,
                username: res.data.username,
                privilege_data:[
                    {privilege: res.data.privilege_1},
                    {privilege: res.data.privilege_2},
                    {privilege: res.data.privilege_3},
                    {privilege: res.data.privilege_4},
                    {privilege: res.data.privilege_5},
                    {privilege: res.data.privilege_6},
                    {privilege: res.data.privilege_7}
                ],
                
            } ;
            console.log(sessionValue);
            localStorage.setItem("mysessionStat",sessionValue.loggedin);//store session status on
            localStorage.setItem("mysessionName",sessionValue.username);
            localStorage.setItem("mysessionData",JSON.stringify(sessionValue));
            usernameDC = sessionValue.username
       
            swal.fire({
                title: "SUCCESS",
                text: "welcome "+usernameDC,
                icon: "success",
                confirmButtonText: "Continue",
            }).then((result) => {
                if (result.isConfirmed) {
                    homePage();
                }
                });
        })

        .catch(err => {
            if (err == "Error: Network Error") {

                swal.fire({
                    title: "NO NETWORK",
                    text: "server is down",
                    icon: "error",
                    confirmButtonText: "Retry",
                });

            } else {
                
                swal.fire({
                    title: "wrong Username or Password",
                    text: "login is case sensetive",
                    icon: "error",
                    confirmButtonText: "Retry",
                });
        
            }
        });
    }else{
        document.getElementById("reqUser").innerHTML="";//initialize pop-up message 
        document.getElementById("username").style.border = "none";//initialize pop-up border color
        document.getElementById("reqPass").innerHTML="";//initialize pop-up message
        document.getElementById("password").style.border = "none";//initialize pop-up border color

        if(passwordid==""&& usernameid==""){
            document.getElementById("reqUser").innerHTML=" field cannot be left blank"
            document.getElementById("reqUser").style.color = "red"
            document.getElementById("username").style.border = "2px solid red"

            document.getElementById("reqPass").innerHTML=" field cannot be left blank"
            document.getElementById("reqPass").style.color = "red"
            document.getElementById("password").style.border = "2px solid red"
        }else if(usernameid==""){
            document.getElementById("reqUser").innerHTML=" field cannot be left blank"
            document.getElementById("reqUser").style.color = "red"
            document.getElementById("username").style.border = "2px solid red"
        }else if(passwordid==""){
            document.getElementById("reqPass").innerHTML=" field cannot be left blank"
            document.getElementById("reqPass").style.color = "red"
            document.getElementById("password").style.border = "2px solid red"
        }
    }
}

/*************************************************************************************************************************************/
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
