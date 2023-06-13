/*******************************************************************************************************************************************************************************/
//initialize global variables
let traceDictionary = [];
let incidentDictionary = [];
var pgsh=1;
var pgshI=1;
var traceableData = localStorage.getItem("traceData");
var incibleData = localStorage.getItem("incData");

/*******************************************************************************************************************************************************************************/
function startSystem(){
    console.log("filter by date")
    traceDictionary = [];
    incidentDictionary = [];
  $("#filter_by_Date").html("");
  $("<h3 class=tabContHead>filter by date</h3>").appendTo("#filter_by_Date");
  $("<p>Select <b>Date</b> and click <b>NEXT</b> to show report for one day </p><br>").appendTo("#filter_by_Date");
  $("<label class=filter>Date : </label><input type=date class=placeH id=startDate><br><br>").appendTo("#filter_by_Date");
  $("<button class=placeHbtn id=filterbtn onclick=selectedDate()>NEXT</button>").appendTo("#filter_by_Date");        
  $('#percentage').hide();
  $('#preloader').hide();
}
/*************************************************full screen****************************************************************** */
function fullscreen(){
    var elem = document.getElementById("filter_by_Date");
    //$("<button class=filtdatebutn1 onclick=exitfullSc()>Exit Full Screen</button>").appendTo("#filter_by_Date");
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }
  }
  function exitfullSc(){
    document.exitFullscreen()
    $('.filtdatebutn1').hide(); 
  }
  /********************************************export to excel*********************************************************************** */
  function XporttoExcel(){
  
    console.log("exporting to excel in a second");//daytable1
  
    if (confirm("are you sure you want to export data to excel?")) {
      $("#filter_by_Date").table2excel({
          filename: "DailyReport.xls"
        });
    }else {
      console.log("You pressed Cancel!") ;
    }
  }
  /******************************************print data************************************************************* */
  function printtable(){
    var divContents = document.getElementById("filter_by_Date").innerHTML;
    var a = window.open('', '', 'height=700, width=1000');
    a.document.write('<html>');
    //a.document.write('<body > <h1>Daily Report for 2022-02-18<br>');
    a.document.write(divContents);
    a.document.write('</body></html>');
    a.document.close();
    a.print();
  }
/*******************************************************************************************************************************************************************************/
/*******************************************************************************************************************************************************************************/
//initialize global variables
var mc1numarr = [];
var mc2numarr = [];
var mc3numarr = [];

var mc1numarrinc = [];
var mc2numarrinc = [];
var mc3numarrinc = [];
/*******************************************************************************************************************************************************************************/
/********************************************************************search by date*********************************************************************************************/
/*******************************************************************************************************************************************************************************/

async function selectedDate(){
    $("<center><div id=preloader><div id=loader></div></div><div</div></center>").appendTo("#filter_by_Date"); 

    var dateF = document.getElementById("startDate").value;
    

    if(dateF !=""){
        
        var datefix = dateF+" 00:00:00";//load date value
        console.log(dateF);
        console.log(datefix);


        await axios.
            get("http://192.168.2.223:9101/tracecollect?Tablename=trace_plant.shell_traceability&StartDate="+dateF+"")
            .then(res => {
                for (var k=0; k< res.data.length ; k++ ){
                    traceDictionary.push(res.data[k]);
                }
            });
       await axios.
            get("http://192.168.2.223:9101/tracecollect?Tablename=trace_plant.shell_traceability_incident&StartDate="+dateF+"")
            .then(res => {
                for (var mi=0; mi< res.data.length ; mi++ ){
                    incidentDictionary.push(res.data[mi]);
                }
            });
            console.log(traceDictionary)
            console.log(incidentDictionary)

            MCcollection(datefix);

    }else{alert("Enter a valid date!!!")}
}
/***********************************************************************************machine collection********************************************************************************************/
var McTotname;
function MCcollection(datefix){
    mc1numarr = [];
    mc2numarr = [];
    mc3numarr = [];

  var Mc1name;
  var Mc2name;
  var Mc3name;

  var count1days=0;
  var count2days=0;
  var count3days=0;


      /*--------------------------------Machines for morning shift----------------------------------------------------------------------------------------------------------*/      
      for (var i=0; i< traceDictionary.length ; i++ ){
        var mc1num = traceDictionary[i].machineNo;
            if(traceDictionary[i].traceabilityDate ==datefix && traceDictionary[i].shift == "Morning"){
                count1days++;
                mc1numarr.push(mc1num);
            }
        }
      /*--------------------------------Machines for Afternoon shift--------------------------------------------------------------------------------------------------------*/
        for (var i=0; i< traceDictionary.length ; i++ ){
          var mc2num = traceDictionary[i].machineNo;
              if(traceDictionary[i].traceabilityDate ==datefix && traceDictionary[i].shift == "Afternoon"){
                  count2days++;
                  mc2numarr.push(mc2num);
              }
          }
      /*--------------------------------Machines for Night shift------------------------------------------------------------------------------------------------------------*/
          for (var i=0; i< traceDictionary.length ; i++ ){
              var mc3num = traceDictionary[i].machineNo;
                  if(traceDictionary[i].traceabilityDate ==datefix && traceDictionary[i].shift == "Night"){
                      count3days++;
                      mc3numarr.push(mc3num);
                  }
              }
      //-----------------------------------------------------------------------------------------------------------------------------
        Mc1name = Array.from(new Set(mc1numarr));
        Mc2name = Array.from(new Set(mc2numarr));
        Mc3name = Array.from(new Set(mc3numarr));
      //--------------------------------------------------------------------------------------------------------------------------------------------
      
        const mcTOTnumarr = Mc1name.concat(Mc2name,Mc3name);  
        McTotname = Array.from(new Set(mcTOTnumarr));
      //-----------------------------------------------------------------------------------------------------------------------------
console.log(McTotname) 
MCIcollection(McTotname,datefix)
  
}

/****************************************************************************machine collection on incidents**********************************************************************************************/
var McTotnameinc;
var collect = 1;
function MCIcollection(McTotname,datefix){
  //initialize variables
 
if(collect == 1){


    mc1numarrinc = [];
    mc2numarrinc = [];
    mc3numarrinc = [];
    collect = 1;

    var Mc1nameinc;
    var Mc2nameinc;
    var Mc3nameinc;
    
    var count1daysinc=0;
    var count2daysinc=0;
    var count3daysinc=0;
    //   incibleData = JSON.parse(localStorage.getItem("incData"));
    
    console.log(incidentDictionary.length)
    

            /*--------------------------------Machines for morning shift----------------------------------------------------------------------------------------------------------*/      
            for (var i=0; i< incidentDictionary.length ; i++ ){
                var mc1num = incidentDictionary[i].machineNo;
                    if(incidentDictionary[i].traceabilityDate == datefix && incidentDictionary[i].shift == "Morning"){
                        count1daysinc++;
                        mc1numarrinc.push(mc1num);
                    }
                }
                
            /*--------------------------------Machines for Afternoon shift--------------------------------------------------------------------------------------------------------*/
                for (var i=0; i< incidentDictionary.length ; i++ ){
                var mc2num = incidentDictionary[i].machineNo;
                    if(incidentDictionary[i].traceabilityDate == datefix && incidentDictionary[i].shift == "Afternoon"){
                        count2daysinc++;
                        mc2numarrinc.push(mc2num);
                    }
                }
            /*--------------------------------Machines for Night shift------------------------------------------------------------------------------------------------------------*/
                for (var i=0; i< incidentDictionary.length ; i++ ){
                    var mc3num = incidentDictionary[i].machineNo;
                        if(incidentDictionary[i].traceabilityDate == datefix && incidentDictionary[i].shift == "Night"){
                            count3daysinc++;
                            mc3numarrinc.push(mc3num);
                        }
                    }
            //-----------------------------------------------------------------------------------------------------------------------------
                Mc1nameinc = Array.from(new Set(mc1numarrinc));
                Mc2nameinc = Array.from(new Set(mc2numarrinc));
                Mc3nameinc = Array.from(new Set(mc3numarrinc));
            //--------------------------------------------------------------------------------------------------------------------------------------------
            console.log(Mc1nameinc)
            console.log(Mc2nameinc)
            console.log(Mc3nameinc)

                const mcTOTnumarrinc = Mc1nameinc.concat(Mc2nameinc,Mc3nameinc);  
                McTotnameinc = Array.from(new Set(mcTOTnumarrinc));
            
                console.log(McTotnameinc)
                collect++;
                MCIcollection(McTotname,datefix)
    }else{
        collect = 1;
        MCsort(McTotname,datefix,McTotnameinc)
    }
     
  }
  //-----------------------------------------------------------------------------------------------------------------------------
  //Sort both arrays for MC numbers to remove duplicates
  function MCsort(McTotname,datefix,McTotnameinc){
      const mcSortTOT = McTotname.concat(McTotnameinc);
      var McSortTname = Array.from(new Set(mcSortTOT));
      
      DailyN_nav(McSortTname,datefix);
  }
/********************************************************************************************************************************/
var dict = [];

function DailyN_nav(McSortTname,datefix){

 
  dict = [];

  for (var j=0; j< traceDictionary.length ; j++ ){
                                
    if(traceDictionary[j].traceabilityDate == datefix){

        dict.push(traceDictionary[j]);
    
    } 
  }                          
            
  incident_nav(McSortTname,datefix,dict)
}

/*************************************************************************************************************************************************************************** */
var  dictI = [];
var dictionary=[];

function incident_nav(McSortTname,datefix,dict){

    if(collect == 1){

        dictI = [];
        //   incibleData = JSON.parse(localStorage.getItem("incData"));

        for (var k=0; k< incidentDictionary.length ; k++ ){
                                    
            //console.log(data.results[k])

            if(incidentDictionary[k].traceabilityDate === datefix){

                dictI.push(incidentDictionary[k]);
            
            } 
        }  
            // dictionary = dict;
            console.log(dictI)
            collect++;
            incident_nav(McSortTname,datefix,dict)
    }else{
        collect = 1;
        tableDisplay(McSortTname,datefix,dict,dictI)
    }
    
    
}
/***************************************************************************************************************************************************************************/
/***************************************************************************************************************************************************************************/
/***************************************************************************************************************************************************************************/
/***************************************************************************************************************************************************************************/
/***************************************************************************************************************************************************************************/
/***************************************************************************************************************************************************************************/
/***************************************************************************************************************************************************************************/
/***************************************************************************************************************************************************************************/
function tableDisplay(McSortTname,datefix,dict,dictI){

  //initialization
  const sumTPP=[]

  //-------morning init-------------------
  var numbe1rs = [];

  var product1push = [];
  const product1pushF = [];
  var product1name;
  
  var OP1arr;
  const OP1arrF = [];;

  var TPP1arr=[];
  var count1TPP=0;

  var pass1count=0;
  var pass1arr=[];
  

  var rework1count=0;
  var rework1arr=[];

  var scrap1count=0;
  var scrap1arr=[];

  var operatorpush1 = [];
  var operatorname1;
  const operatorname1F = [];

  var supervisorpush1 = [];
  var supervisorname1;
  const supervisorname1F = [];

  var teamleaderpush1 = [];
  var teamleadername1;
  const teamleadername1F = [];

  //--------afternoon init-----------------
  var numbe2rs = [];

  var product2push = [];
  const product2pushF = [];
  var product2name;
  
  var OP2arr;
  const OP2arrF = [];;

  var TPP2arr=[];
  var count2TPP=0;

  var pass2count=0;
  var pass2arr=[];
  

  var rework2count=0;
  var rework2arr=[];

  var scrap2count=0;
  var scrap2arr=[];

  var operatorpush2 = [];
  var operatorname2;
  const operatorname2F = [];

  var supervisorpush2 = [];
  var supervisorname2;
  const supervisorname2F = [];

  var teamleaderpush2 = [];
  var teamleadername2;
  const teamleadername2F = [];

  //---------night init--------------------
  var numbe3rs = [];

  var product3push = [];
  const product3pushF = [];
  var product3name;
  
  var OP3arr;
  const OP3arrF = [];;

  var TPP3arr=[];
  var count3TPP=0;

  var pass3count=0;
  var pass3arr=[];
  

  var rework3count=0;
  var rework3arr=[];

  var scrap3count=0;
  var scrap3arr=[];

  var operatorpush3 = [];
  var operatorname3;
  const operatorname3F = [];

  var supervisorpush3 = [];
  var supervisorname3;
  const supervisorname3F = [];

  var teamleaderpush3 = [];
  var teamleadername3;
  const teamleadername3F = [];
//--------------------------------------
  const pass1arrF=[];
  const pass2arrF=[];
  const pass3arrF=[];

  const rework1arrF=[];
  const rework2arrF=[];
  const rework3arrF=[];

  const scrap1arrF=[];
  const scrap2arrF=[];
  const scrap3arrF=[];

  console.log(McSortTname);
  //------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //--------------------------------------------------------HTML GRAPHICS---------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------------------------------------------------------------------------------
  $("#filter_by_Date").html("");
  //*----------------------------------------------data for morning-------------------------------------------------------------------------- */
      for (var l=0; l< McSortTname.length ; l++ ){//for Mc1name array 
          count1TPP=0;
          pass1count=0;
          rework1count=0;
          scrap1count=0;
          product1push = [];
          numbe1rs = [];
          operatorpush1 = [];
          teamleaderpush1 = [];
          supervisorpush1 = [];
  
              for (var k=0; k< dict.length ; k++ ){
                  if(dict[k].shift == "Morning" && dict[k].machineNo == McSortTname[l]){
                      count1TPP++;
                      TPP1arr[l]=count1TPP;
                      
      
                      var OP_1name = dict[k].operationNo;
                      numbe1rs.push(OP_1name); //for creating an array store the OP numbers
                      OP1arr = Array.from(new Set(numbe1rs));
      
                      var prod1uct = dict[k].product;
                      product1push.push(prod1uct);
                      product1name = Array.from(new Set(product1push));
      
                      var operator1 = dict[k].operator;
                      operatorpush1.push(operator1);
                      operatorname1 = Array.from(new Set(operatorpush1));
      
                      var teamleader1 = dict[k].teamleader;
                      teamleaderpush1.push(teamleader1);
                      teamleadername1 = Array.from(new Set(teamleaderpush1));
      
                      var supervisor1 = dict[k].supervisor;
                      supervisorpush1.push(supervisor1);
                      supervisorname1 = Array.from(new Set(supervisorpush1));
      
                      if(dict[k].determination == "Pass"){
                          pass1count++;
                          pass1arr[l]=pass1count;
                      }
                      if(dict[k].determination == "Rework"){
                          rework1count++;
                          rework1arr[l]=rework1count;
                      }
                      if(dict[k].determination == "Scrap"){
                          scrap1count++;
                          scrap1arr[l]=scrap1count;
                      }
                      
                  }
              }    
      
          if(TPP1arr[l]!= undefined ){
          
              /********************oparation number array************************ */  
                  if(OP1arr.length==l){
                      OP1arr[l]=OP1arr[l-1];}
                  if(OP1arr.length>l){
                      OP1arr[l]=OP1arr[l];}
                  if(TPP1arr[l]== 0){
                      OP1arr[l]="-";}
                  else{
                      OP1arr[l]=OP1arr[OP1arr.length -1 ];}
              /********************product array********************************* */
                  if( product1name.length==l){
                      product1name[l]= product1name[l-1];}
                  if( product1name.length>l){
                      product1name[l]= product1name[l];}
                      if(TPP1arr[l]== 0){
                          product1name[l]="-";}
                  else{
                      product1name[l]= product1name[ product1name.length -1 ];}
                    
              /**********************operator array****************************** */
                  if(operatorname1.length==l){
                      operatorname1[l]=operatorname1[l-1];}
                  if(operatorname1.length>l){
                      operatorname1[l]=operatorname1[l];}
                      if(TPP1arr[l]== 0){
                      operatorname1[l]="-";}
                  else{
                      operatorname1[l]=operatorname1[operatorname1.length -1 ];}
              /**********************team_leader array*************************** */
                  if( teamleadername1.length==l){
                      teamleadername1[l]=teamleadername1[l-1];}
                  if( teamleadername1.length>l){
                      teamleadername1[l]= teamleadername1[l];}
                      if(TPP1arr[l]== 0){
                      teamleadername1[l]="-";}
                  else{
                      teamleadername1[l]= teamleadername1[ teamleadername1.length -1 ];}
              /**********************supervisor array*************************** */
                  if( supervisorname1.length==l){
                      supervisorname1[l]= supervisorname1[l-1];}
                  if( supervisorname1.length>l){
                      supervisorname1[l]= supervisorname1[l];}
                      if(TPP1arr[l]== 0){
                      supervisorname1[l]="-";}
                  else{
                      supervisorname1[l]= supervisorname1[ supervisorname1.length -1 ];}
              /**********************determination array***************************/
                  if(pass1arr[l]== undefined ){
                      pass1arr[l]=0;}
                  if(rework1arr[l]== undefined ){
                      rework1arr[l]=0;}
                  if(scrap1arr[l]== undefined ){
                      scrap1arr[l]=0;}
              /****************************************************************** */
              pass1arrF.push(pass1arr[l]);
              rework1arrF.push(rework1arr[l]);
              scrap1arrF.push(scrap1arr[l]);  
                  
              OP1arrF.push(OP1arr[l]);
              product1pushF.push(product1name[l]);
              operatorname1F.push(operatorname1[l]);
              teamleadername1F.push(teamleadername1[l]);
              supervisorname1F.push(supervisorname1[l]);
         
          }else{
              TPP1arr[l]=0;
              OP1arrF[l]="-";
              product1pushF[l]="-";
              operatorname1F[l]="-";
              teamleadername1F[l]="-";
              supervisorname1F[l]="-";

              pass1arrF[l]=0;
              rework1arrF[l]=0;
              scrap1arrF[l]=0; 
          }
  
      }
      console.log("\nMORNING")
      console.log("operation number ("+ OP1arrF.length+") : "+OP1arrF)
      console.log("product name ("+ product1pushF.length+") : "+product1pushF)
      console.log("operator name ("+ operatorname1F.length+") : "+operatorname1F)
      console.log("teamleader name ("+ teamleadername1F.length+") : "+teamleadername1F)
      console.log("supervisor name ("+ supervisorname1F.length+") : "+supervisorname1F)
      console.log("T.P.P ("+ TPP1arr.length+") : "+TPP1arr)
      console.log("passed products ("+ pass1arr.length+") : "+pass1arrF)
      console.log("reworked products ("+ rework1arr.length+") : "+rework1arrF)
      console.log("scrap products ("+ scrap1arr.length+") : "+scrap1arrF)
  
      /*-------------------------------------data for afternoon--------------------------------------------------------------*/ 
  
      
      for (var l=0; l< McSortTname.length ; l++ ){//for Mc2name array 
          count2TPP=0;
          pass2count=0;
          rework2count=0;
          scrap2count=0;
          product2push = [];
          numbe2rs = [];
          operatorpush2 = [];
          teamleaderpush2 = [];
          supervisorpush2 = [];
      
              for (var k=0; k< dict.length ; k++ ){
                  if(dict[k].shift == "Afternoon" && dict[k].machineNo == McSortTname[l]){
                      count2TPP++;
                      TPP2arr[l]=count2TPP;
                      
      
                      var OP_2name = dict[k].operationNo;
                      numbe2rs.push(OP_2name); //for creating an array store the OP numbers
                      OP2arr = Array.from(new Set(numbe2rs));
      
                      var prod2uct = dict[k].product;
                      product2push.push(prod2uct);
                      product2name = Array.from(new Set(product2push));
      
                      var operator2 = dict[k].operator;
                      operatorpush2.push(operator2);
                      operatorname2 = Array.from(new Set(operatorpush2));
      
                      var teamleader2 = dict[k].teamleader;
                      teamleaderpush2.push(teamleader2);
                      teamleadername2 = Array.from(new Set(teamleaderpush2));
      
                      var supervisor2 = dict[k].supervisor;
                      supervisorpush2.push(supervisor2);
                      supervisorname2 = Array.from(new Set(supervisorpush2));
      
                      if(dict[k].determination == "Pass"){
                          pass2count++;
                          pass2arr[l]=pass2count;
                      }
                      if(dict[k].determination == "Rework"){
                          rework2count++;
                          rework2arr[l]=rework2count;
                      }
                      if(dict[k].determination == "Scrap"){
                          scrap2count++;
                          scrap2arr[l]=scrap2count;
                      }
                      
                  }
              }    
      
          if(TPP2arr[l]!= undefined ){
          
              /********************oparation number array************************ */  
                  if(OP2arr.length==l){
                      OP2arr[l]=OP2arr[l-1];}
                  if(OP2arr.length>l){
                      OP2arr[l]=OP2arr[l];}
                  if(TPP2arr[l]== 0){
                      OP2arr[l]="-";}
                  else{
                      OP2arr[l]=OP2arr[OP2arr.length -1 ];}
              /********************product array********************************* */
                  if( product2name.length==l){
                      product2name[l]= product2name[l-1];}
                  if( product2name.length>l){
                      product2name[l]= product2name[l];}
                      if(TPP2arr[l]== 0){
                          product2name[l]="-";}
                  else{
                      product2name[l]= product2name[ product2name.length -1 ];}
                      
              /**********************operator array****************************** */
                  if(operatorname2.length==l){
                      operatorname2[l]=operatorname2[l-1];}
                  if(operatorname2.length>l){
                      operatorname2[l]=operatorname2[l];}
                      if(TPP2arr[l]== 0){
                      operatorname2[l]="-";}
                  else{
                      operatorname2[l]=operatorname2[operatorname2.length -1 ];}
              /**********************team_leader array*************************** */
                  if( teamleadername2.length==l){
                      teamleadername2[l]=teamleadername2[l-1];}
                  if( teamleadername2.length>l){
                      teamleadername2[l]= teamleadername2[l];}
                      if(TPP2arr[l]== 0){
                      teamleadername2[l]="-";}
                  else{
                      teamleadername2[l]= teamleadername2[ teamleadername2.length -1 ];}
              /**********************supervisor array*************************** */
                  if( supervisorname2.length==l){
                      supervisorname2[l]= supervisorname2[l-1];}
                  if( supervisorname2.length>l){
                      supervisorname2[l]= supervisorname2[l];}
                      if(TPP2arr[l]== 0){
                      supervisorname2[l]="-";}
                  else{
                      supervisorname2[l]= supervisorname2[ supervisorname2.length -1 ];}
              /**********************determination array***************************/
                  if(pass2arr[l]== undefined ){
                      pass2arr[l]=0;}
                  if(rework2arr[l]== undefined ){
                      rework2arr[l]=0;}
                  if(scrap2arr[l]== undefined ){
                      scrap2arr[l]=0;}
              /****************************************************************** */
              pass2arrF.push(pass2arr[l]);
              rework2arrF.push(rework2arr[l]);
              scrap2arrF.push(scrap2arr[l]);  
                  
              OP2arrF.push(OP2arr[l]);
              product2pushF.push(product2name[l]);
              operatorname2F.push(operatorname2[l]);
              teamleadername2F.push(teamleadername2[l]);
              supervisorname2F.push(supervisorname2[l]);
         
          }else{
              TPP2arr[l]=0;
              OP2arrF[l]="-";
              product2pushF[l]="-";
              operatorname2F[l]="-";
              teamleadername2F[l]="-";
              supervisorname2F[l]="-";
      
              pass2arrF[l]=0;
              rework2arrF[l]=0;
              scrap2arrF[l]=0; 
          }
      
      }
      console.log("\nAfternoon")
      console.log("operation number ("+ OP2arrF.length+") : "+OP2arrF)
      console.log("product name ("+ product2pushF.length+") : "+product2pushF)
      console.log("operator name ("+ operatorname2F.length+") : "+operatorname2F)
      console.log("teamleader name ("+ teamleadername2F.length+") : "+teamleadername2F)
      console.log("supervisor name ("+ supervisorname2F.length+") : "+supervisorname2F)
      console.log("T.P.P ("+ TPP2arr.length+") : "+TPP2arr)
      console.log("passed products ("+ pass2arr.length+") : "+pass2arrF)
      console.log("reworked products ("+ rework2arr.length+") : "+rework2arrF)
      console.log("scrap products ("+ scrap2arr.length+") : "+scrap2arrF)
      /*-------------------------------------data for night--------------------------------------------------------------*/ 
  
      for (var l=0; l< McSortTname.length ; l++ ){//for Mc3name array 
          count3TPP=0;
          pass3count=0;
          rework3count=0;
          scrap3count=0;
          product3push = [];
          numbe3rs = [];
          operatorpush3 = [];
          teamleaderpush3 = [];
          supervisorpush3 = [];
      
              for (var k=0; k< dict.length ; k++ ){
                  if(dict[k].shift == "Night" && dict[k].machineNo == McSortTname[l]){
                      count3TPP++;
                      TPP3arr[l]=count3TPP;
                      
      
                      var OP_3name = dict[k].operationNo;
                      numbe3rs.push(OP_3name); //for creating an array store the OP numbers
                      OP3arr = Array.from(new Set(numbe3rs));
      
                      var prod3uct = dict[k].product;
                      product3push.push(prod3uct);
                      product3name = Array.from(new Set(product3push));
      
                      var operator3 = dict[k].operator;
                      operatorpush3.push(operator3);
                      operatorname3 = Array.from(new Set(operatorpush3));
      
                      var teamleader3 = dict[k].teamleader;
                      teamleaderpush3.push(teamleader3);
                      teamleadername3 = Array.from(new Set(teamleaderpush3));
      
                      var supervisor3 = dict[k].supervisor;
                      supervisorpush3.push(supervisor3);
                      supervisorname3 = Array.from(new Set(supervisorpush3));
      
                      if(dict[k].determination == "Pass"){
                          pass3count++;
                          pass3arr[l]=pass3count;
                      }
                      if(dict[k].determination == "Rework"){
                          rework3count++;
                          rework3arr[l]=rework3count;
                      }
                      if(dict[k].determination == "Scrap"){
                          scrap3count++;
                          scrap3arr[l]=scrap3count;
                      }
                      
                  }
              }    
      
          if(TPP3arr[l]!= undefined ){
          
              /********************oparation number array************************ */  
                  if(OP3arr.length==l){
                      OP3arr[l]=OP3arr[l-1];}
                  if(OP3arr.length>l){
                      OP3arr[l]=OP3arr[l];}
                  if(TPP3arr[l]== 0){
                      OP3arr[l]="-";}
                  else{
                      OP3arr[l]=OP3arr[OP3arr.length -1 ];}
              /********************product array********************************* */
                  if( product3name.length==l){
                      product3name[l]= product3name[l-1];}
                  if( product3name.length>l){
                      product3name[l]= product3name[l];}
                      if(TPP3arr[l]== 0){
                          product3name[l]="-";}
                  else{
                      product3name[l]= product3name[ product3name.length -1 ];}
                      
              /**********************operator array****************************** */
                  if(operatorname3.length==l){
                      operatorname3[l]=operatorname3[l-1];}
                  if(operatorname3.length>l){
                      operatorname3[l]=operatorname3[l];}
                      if(TPP3arr[l]== 0){
                      operatorname3[l]="-";}
                  else{
                      operatorname3[l]=operatorname3[operatorname3.length -1 ];}
              /**********************team_leader array*************************** */
                  if( teamleadername3.length==l){
                      teamleadername3[l]=teamleadername3[l-1];}
                  if( teamleadername3.length>l){
                      teamleadername3[l]= teamleadername3[l];}
                      if(TPP3arr[l]== 0){
                      teamleadername3[l]="-";}
                  else{
                      teamleadername3[l]= teamleadername3[ teamleadername3.length -1 ];}
              /**********************supervisor array*************************** */
                  if( supervisorname3.length==l){
                      supervisorname3[l]= supervisorname3[l-1];}
                  if( supervisorname3.length>l){
                      supervisorname3[l]= supervisorname3[l];}
                      if(TPP3arr[l]== 0){
                      supervisorname3[l]="-";}
                  else{
                      supervisorname3[l]= supervisorname3[ supervisorname3.length -1 ];}
              /**********************determination array***************************/
                  if(pass3arr[l]== undefined ){
                      pass3arr[l]=0;}
                  if(rework3arr[l]== undefined ){
                      rework3arr[l]=0;}
                  if(scrap3arr[l]== undefined ){
                      scrap3arr[l]=0;}
              /****************************************************************** */
              pass3arrF.push(pass3arr[l]);
              rework3arrF.push(rework3arr[l]);
              scrap3arrF.push(scrap3arr[l]);  
                  
              OP3arrF.push(OP3arr[l]);
              product3pushF.push(product3name[l]);
              operatorname3F.push(operatorname3[l]);
              teamleadername3F.push(teamleadername3[l]);
              supervisorname3F.push(supervisorname3[l]);
         
          }else{
              TPP3arr[l]=0;
              OP3arrF[l]="-";
              product3pushF[l]="-";
              operatorname3F[l]="-";
              teamleadername3F[l]="-";
              supervisorname3F[l]="-";
      
              pass3arrF[l]=0;
              rework3arrF[l]=0;
              scrap3arrF[l]=0; 
          }
      
      }
      console.log("\nNight")
      console.log("operation number ("+ OP3arrF.length+") : "+OP3arrF)
      console.log("product name ("+ product3pushF.length+") : "+product3pushF)
      console.log("operator name ("+ operatorname3F.length+") : "+operatorname3F)
      console.log("teamleader name ("+ teamleadername3F.length+") : "+teamleadername3F)
      console.log("supervisor name ("+ supervisorname3F.length+") : "+supervisorname3F)
      console.log("T.P.P ("+ TPP3arr.length+") : "+TPP3arr)
      console.log("passed products ("+ pass3arr.length+") : "+pass3arrF)
      console.log("reworked products ("+ rework3arr.length+") : "+rework3arrF)
      console.log("scrap products ("+ scrap3arr.length+") : "+scrap3arrF)
      /***************************************************************************************************************/
      /*********************************************INCIDENTS*********************************************************/
      /***************************************************************************************************************/
      const sumTPPNIC=[]
      const sumTPPGTI=[]
 
//--------------------Morning on Incidents------------------------- 
var numbe1rsNIC = [];

 
var product1pushNIC = [];
const product1pushFNIC = [];
var product1nameNIC;

var OP1arrNIC;
const OP1arrFNIC = [];;

var TPP1arrNIC=[];

pass1countNIC=0;
pass1arrNIC=[];

rework1countNIC=0;
rework1arrNIC=[];

scrap1countNIC=0;
scrap1arrNIC=[];

var operatorpush1NIC = [];
var operatorname1NIC;
const operatorname1FNIC = [];

var supervisorpush1NIC = [];
var supervisorname1NIC;
const supervisorname1FNIC = [];

var teamleaderpush1NIC = [];
var teamleadername1NIC;
const teamleadername1FNIC = [];

//--------------------Afternoon on Incidents-------------------------
var numbe2rsNIC = [];

 
var product2pushNIC = [];
const product2pushFNIC = [];
var product2nameNIC;

var OP2arrNIC;
const OP2arrFNIC = [];;

var TPP2arrNIC=[];

pass2countNIC=0;
pass2arrNIC=[];

rework2countNIC=0;
rework2arrNIC=[];

scrap2countNIC=0;
scrap2arrNIC=[];

var operatorpush2NIC = [];
var operatorname2NIC;
const operatorname2FNIC = [];

var supervisorpush2NIC = [];
var supervisorname2NIC;
const supervisorname2FNIC = [];

var teamleaderpush2NIC = [];
var teamleadername2NIC;
const teamleadername2FNIC = [];

//--------------------Night on Incidents-----------------------------
var numbe3rsNIC = [];

 
var product3pushNIC = [];
const product3pushFNIC = [];
var product3nameNIC;

var OP3arrNIC;
const OP3arrFNIC = [];;

var TPP3arrNIC=[];

pass3countNIC=0;
pass3arrNIC=[];

rework3countNIC=0;
rework3arrNIC=[];

scrap3countNIC=0;
scrap3arrNIC=[];

var operatorpush3NIC = [];
var operatorname3NIC;
const operatorname3FNIC = [];

var supervisorpush3NIC = [];
var supervisorname3NIC;
const supervisorname3FNIC = [];

var teamleaderpush3NIC = [];
var teamleadername3NIC;
const teamleadername3FNIC = [];

 const pass1arrFNIC=[];
  const pass2arrFNIC=[];
  const pass3arrFNIC=[];

  const rework1arrFNIC=[];
  const rework2arrFNIC=[];
  const rework3arrFNIC=[];

  const scrap1arrFNIC=[];
  const scrap2arrFNIC=[];
  const scrap3arrFNIC=[];

  var count1TPPNIC=0;
  var count2TPPNIC=0;
  var count3TPPNIC=0;

  const TPP1arrFNIC=[];
  const TPP2arrFNIC=[];
  const TPP3arrFNIC=[];

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            console.log("on incidents sort")
            console.log(McSortTname)
           // console.log(dictI)
//----------------------------------------------Morning-----------------------------------------------------------------------------------------------------
for (var l=0; l<  McSortTname.length ; l++ ){//for Mc1name array 
count1TPPNIC=0;
pass1countNIC=0;
rework1countNIC=0;
scrap1countNIC=0;
numbe1rsNIC = [];
product1pushNIC = [];
operatorpush1NIC = [];
supervisorpush1NIC = [];
teamleaderpush1NIC = [];


for (var k=0; k< dictI.length ; k++ ){
    if(dictI[k].shift == "Morning"&& dictI[k].machineNo == McSortTname[l]){
        count1TPPNIC++;
        TPP1arrNIC[l]=count1TPPNIC;
     

        var OP_1nameNIC = dictI[k].operationNo;
        numbe1rsNIC.push(OP_1nameNIC); //for creating an array store the OP numbers
        OP1arrNIC = Array.from(new Set(numbe1rsNIC));

        var prod1uctNIC = dictI[k].product;
        product1pushNIC.push(prod1uctNIC);
        product1nameNIC = Array.from(new Set(product1pushNIC));

        var operator1NIC = dictI[k].operator;
        operatorpush1NIC.push(operator1NIC);
        operatorname1NIC = Array.from(new Set(operatorpush1NIC));

        var teamleader1NIC = dictI[k].teamleader;
        teamleaderpush1NIC.push(teamleader1NIC);
        teamleadername1NIC = Array.from(new Set(teamleaderpush1NIC));

        var supervisor1NIC = dictI[k].supervisor;
        supervisorpush1NIC.push(supervisor1NIC);
        supervisorname1NIC = Array.from(new Set(supervisorpush1NIC));

        if(dictI[k].determination == "Pass"){
            pass1countNIC++;
            pass1arrNIC[l]=pass1countNIC;
        }
        if(dictI[k].determination == "Rework"){
            rework1countNIC++;
            rework1arrNIC[l]=rework1countNIC;
        }
        if(dictI[k].determination == "Scrap"){
            scrap1countNIC++;
            scrap1arrNIC[l]=scrap1countNIC;
        }
       
    }

 
}
if(TPP1arrNIC[l]!= undefined){

  
/********************oparation number array************************ */  

if(OP1arrNIC.length==l){
OP1arrNIC[l]=OP1arrNIC[l-1];}
if(OP1arrNIC.length>l){
OP1arrNIC[l]=OP1arrNIC[l];}
if(TPP1arrNIC[l]== 0){
    OP1arrNIC[l]="-";}
else{
OP1arrNIC[l]=OP1arrNIC[OP1arrNIC.length -1 ];}

/********************product array********************************* */
if( product1nameNIC.length==l){
    product1nameNIC[l]= product1nameNIC[l-1];}
if( product1nameNIC.length>l){
    product1nameNIC[l]= product1nameNIC[l];}
    if(TPP1arrNIC[l]== 0){
        product1nameNIC[l]="-";}
else{
    product1nameNIC[l]= product1nameNIC[ product1nameNIC.length -1 ];}
/**********************operator array****************************** */
if(operatorname1NIC.length==l){
    operatorname1NIC[l]=operatorname1NIC[l-1];}
if(operatorname1NIC.length>l){
    operatorname1NIC[l]=operatorname1NIC[l];}
    if(TPP1arrNIC[l]== 0){
        operatorname1NIC[l]="-";}
else{
    operatorname1NIC[l]=operatorname1NIC[operatorname1NIC.length -1 ];}
/**********************team_leader array*************************** */
if( teamleadername1NIC.length==l){
    teamleadername1NIC[l]= teamleadername1NIC[l-1];}
if( teamleadername1NIC.length>l){
    teamleadername1NIC[l]= teamleadername1NIC[l];}
    if(TPP1arrNIC[l]== 0){
        teamleadername1NIC[l]="-";}
else{
    teamleadername1NIC[l]= teamleadername1NIC[ teamleadername1NIC.length -1 ];}
/**********************supervisor array*************************** */
if( supervisorname1NIC.length==l){
    supervisorname1NIC[l]= supervisorname1NIC[l-1];}
if( supervisorname1NIC.length>l){
    supervisorname1NIC[l]= supervisorname1NIC[l];}
    if(TPP1arrNIC[l]== 0){
        supervisorname1NIC[l]="-";}
else{
    supervisorname1NIC[l]= supervisorname1NIC[ supervisorname1NIC.length -1 ];}
/**********************determination array***************************/
if(pass1arrNIC[l]== undefined ){
    pass1arrNIC[l]=0;}
if(rework1arrNIC[l]== undefined ){
    rework1arrNIC[l]=0;}
if(scrap1arrNIC[l]== undefined ){
    scrap1arrNIC[l]=0;}
/****************************************************************** */
  pass1arrFNIC.push(pass1arrNIC[l]);
  rework1arrFNIC.push(rework1arrNIC[l]);
  scrap1arrFNIC.push(scrap1arrNIC[l]);      
                  

  OP1arrFNIC.push(OP1arrNIC[l]);
  product1pushFNIC.push(product1nameNIC[l]);
  operatorname1FNIC.push(operatorname1NIC[l]);
  teamleadername1FNIC.push(teamleadername1NIC[l]);
  supervisorname1FNIC.push(supervisorname1NIC[l]);

}else{TPP1arrNIC[l]=0;
    OP1arrFNIC[l]="-";
    product1pushFNIC[l]="-";
    operatorname1FNIC[l]="-";
    teamleadername1FNIC[l]="-";
    supervisorname1FNIC[l]="-";

    pass1arrFNIC[l]=0;
    rework1arrFNIC[l]=0;
    scrap1arrFNIC[l]=0;}

TPP1arrFNIC.push(TPP1arr[l] +TPP1arrNIC[l]);//Grand Total(GT) 
}




console.log("\nMorning on Incidents")
console.log("operation number ("+ OP1arrFNIC.length+") : "+OP1arrFNIC)
console.log("product name ("+ product1pushFNIC.length+") : "+product1pushFNIC)
console.log("operator name ("+ operatorname1FNIC.length+") : "+operatorname1FNIC)
console.log("teamleader name ("+ teamleadername1FNIC.length+") : "+teamleadername1FNIC)
console.log("supervisor name ("+ supervisorname1FNIC.length+") : "+supervisorname1FNIC)
console.log("T.P.P ("+ TPP1arrNIC.length+") : "+TPP1arrNIC)
console.log("passed products ("+ pass1arrNIC.length+") : "+pass1arrFNIC)
console.log("reworked products ("+ rework1arrNIC.length+") : "+rework1arrFNIC)
console.log("scrap products ("+ scrap1arrNIC.length+") : "+scrap1arrFNIC)


//----------------------------------------------Afternoon-----------------------------------------------------------------------------------------------------
for (var l=0; l<  McSortTname.length ; l++ ){//for Mc2name array 
  count2TPPNIC=0;
  pass2countNIC=0;
  rework2countNIC=0;
  scrap2countNIC=0;
  numbe2rsNIC = [];
  product2pushNIC = [];
  operatorpush2NIC = [];
  supervisorpush2NIC = [];
  teamleaderpush2NIC = [];
  

  for (var k=0; k< dictI.length ; k++ ){
      if(dictI[k].shift == "Afternoon"&& dictI[k].machineNo == McSortTname[l]){
          count2TPPNIC++;
          TPP2arrNIC[l]=count2TPPNIC;
       

          var OP_2nameNIC = dictI[k].operationNo;
          numbe2rsNIC.push(OP_2nameNIC); //for creating an array store the OP numbers
          OP2arrNIC = Array.from(new Set(numbe2rsNIC));

          var prod2uctNIC = dictI[k].product;
          product2pushNIC.push(prod2uctNIC);
          product2nameNIC = Array.from(new Set(product2pushNIC));

          var operator2NIC = dictI[k].operator;
          operatorpush2NIC.push(operator2NIC);
          operatorname2NIC = Array.from(new Set(operatorpush2NIC));

          var teamleader2NIC = dictI[k].teamleader;
          teamleaderpush2NIC.push(teamleader2NIC);
          teamleadername2NIC = Array.from(new Set(teamleaderpush2NIC));

          var supervisor2NIC = dictI[k].supervisor;
          supervisorpush2NIC.push(supervisor2NIC);
          supervisorname2NIC = Array.from(new Set(supervisorpush2NIC));

          if(dictI[k].determination == "Pass"){
              pass2countNIC++;
              pass2arrNIC[l]=pass2countNIC;
          }
          if(dictI[k].determination == "Rework"){
              rework2countNIC++;
              rework2arrNIC[l]=rework2countNIC;
          }
          if(dictI[k].determination == "Scrap"){
              scrap2countNIC++;
              scrap2arrNIC[l]=scrap2countNIC;
          }
         
      }
 
   
  }
  if(TPP2arrNIC[l]!= undefined){

    
  /********************oparation number array************************ */  

if(OP2arrNIC.length==l){
  OP2arrNIC[l]=OP2arrNIC[l-1];}
if(OP2arrNIC.length>l){
  OP2arrNIC[l]=OP2arrNIC[l];}
  if(TPP2arrNIC[l]== 0){
      OP2arrNIC[l]="-";}
else{
  OP2arrNIC[l]=OP2arrNIC[OP2arrNIC.length -1 ];}

  /********************product array********************************* */
  if( product2nameNIC.length==l){
      product2nameNIC[l]= product2nameNIC[l-1];}
  if( product2nameNIC.length>l){
      product2nameNIC[l]= product2nameNIC[l];}
      if(TPP2arrNIC[l]== 0){
          product2nameNIC[l]="-";}
  else{
      product2nameNIC[l]= product2nameNIC[ product2nameNIC.length -1 ];}
  /**********************operator array****************************** */
  if(operatorname2NIC.length==l){
      operatorname2NIC[l]=operatorname2NIC[l-1];}
  if(operatorname2NIC.length>l){
      operatorname2NIC[l]=operatorname2NIC[l];}
      if(TPP2arrNIC[l]== 0){
          operatorname2NIC[l]="-";}
  else{
      operatorname2NIC[l]=operatorname2NIC[operatorname2NIC.length -1 ];}
  /**********************team_leader array*************************** */
  if( teamleadername2NIC.length==l){
      teamleadername2NIC[l]= teamleadername2NIC[l-1];}
  if( teamleadername2NIC.length>l){
      teamleadername2NIC[l]= teamleadername2NIC[l];}
      if(TPP2arrNIC[l]== 0){
          teamleadername2NIC[l]="-";}
  else{
      teamleadername2NIC[l]= teamleadername2NIC[ teamleadername2NIC.length -1 ];}
  /**********************supervisor array*************************** */
  if( supervisorname2NIC.length==l){
      supervisorname2NIC[l]= supervisorname2NIC[l-1];}
  if( supervisorname2NIC.length>l){
      supervisorname2NIC[l]= supervisorname2NIC[l];}
      if(TPP2arrNIC[l]== 0){
          supervisorname2NIC[l]="-";}
  else{
      supervisorname2NIC[l]= supervisorname2NIC[ supervisorname2NIC.length -1 ];}
  /**********************determination array***************************/
  if(pass2arrNIC[l]== undefined ){
      pass2arrNIC[l]=0;}
  if(rework2arrNIC[l]== undefined ){
      rework2arrNIC[l]=0;}
  if(scrap2arrNIC[l]== undefined ){
      scrap2arrNIC[l]=0;}
  /****************************************************************** */
    pass2arrFNIC.push(pass2arrNIC[l]);
    rework2arrFNIC.push(rework2arrNIC[l]);
    scrap2arrFNIC.push(scrap2arrNIC[l]);      
                    

    OP2arrFNIC.push(OP2arrNIC[l]);
    product2pushFNIC.push(product2nameNIC[l]);
    operatorname2FNIC.push(operatorname2NIC[l]);
    teamleadername2FNIC.push(teamleadername2NIC[l]);
    supervisorname2FNIC.push(supervisorname2NIC[l]);
  
  }else{TPP2arrNIC[l]=0;
      OP2arrFNIC[l]="-";
      product2pushFNIC[l]="-";
      operatorname2FNIC[l]="-";
      teamleadername2FNIC[l]="-";
      supervisorname2FNIC[l]="-";

      pass2arrFNIC[l]=0;
      rework2arrFNIC[l]=0;
      scrap2arrFNIC[l]=0;}

TPP2arrFNIC.push(TPP2arr[l] +TPP2arrNIC[l]);//Grand Total(GT) 
}




console.log("\nAfternoon on Incidents")
console.log("operation number ("+ OP2arrFNIC.length+") : "+OP2arrFNIC)
console.log("product name ("+ product2pushFNIC.length+") : "+product2pushFNIC)
console.log("operator name ("+ operatorname2FNIC.length+") : "+operatorname2FNIC)
console.log("teamleader name ("+ teamleadername2FNIC.length+") : "+teamleadername2FNIC)
console.log("supervisor name ("+ supervisorname2FNIC.length+") : "+supervisorname2FNIC)
console.log("T.P.P ("+ TPP2arrNIC.length+") : "+TPP2arrNIC)
console.log("passed products ("+ pass2arrNIC.length+") : "+pass2arrFNIC)
console.log("reworked products ("+ rework2arrNIC.length+") : "+rework2arrFNIC)
console.log("scrap products ("+ scrap2arrNIC.length+") : "+scrap2arrFNIC)


//------------------------------------------------night-------------------------------------------------------------------------------------------------------

          

for (var l=0; l<  McSortTname.length ; l++ ){//for Mc3name array 
  count3TPPNIC=0;
  pass3countNIC=0;
  rework3countNIC=0;
  scrap3countNIC=0;
  numbe3rsNIC = [];
  product3pushNIC = [];
  operatorpush3NIC = [];
  supervisorpush3NIC = [];
  teamleaderpush3NIC = [];
  

  for (var k=0; k< dictI.length ; k++ ){
      if(dictI[k].shift == "Night"&& dictI[k].machineNo == McSortTname[l]){
          count3TPPNIC++;
          TPP3arrNIC[l]=count3TPPNIC;
       

          var OP_3nameNIC = dictI[k].operationNo;
          numbe3rsNIC.push(OP_3nameNIC); //for creating an array store the OP numbers
          OP3arrNIC = Array.from(new Set(numbe3rsNIC));

          var prod3uctNIC = dictI[k].product;
          product3pushNIC.push(prod3uctNIC);
          product3nameNIC = Array.from(new Set(product3pushNIC));

          var operator3NIC = dictI[k].operator;
          operatorpush3NIC.push(operator3NIC);
          operatorname3NIC = Array.from(new Set(operatorpush3NIC));

          var teamleader3NIC = dictI[k].teamleader;
          teamleaderpush3NIC.push(teamleader3NIC);
          teamleadername3NIC = Array.from(new Set(teamleaderpush3NIC));

          var supervisor3NIC = dictI[k].supervisor;
          supervisorpush3NIC.push(supervisor3NIC);
          supervisorname3NIC = Array.from(new Set(supervisorpush3NIC));

          if(dictI[k].determination == "Pass"){
              pass3countNIC++;
              pass3arrNIC[l]=pass3countNIC;
          }
          if(dictI[k].determination == "Rework"){
              rework3countNIC++;
              rework3arrNIC[l]=rework3countNIC;
          }
          if(dictI[k].determination == "Scrap"){
              scrap3countNIC++;
              scrap3arrNIC[l]=scrap3countNIC;
          }
         
      }
 
   
  }
  if(TPP3arrNIC[l]!= undefined){

    
  /********************oparation number array************************ */  

if(OP3arrNIC.length==l){
  OP3arrNIC[l]=OP3arrNIC[l-1];}
if(OP3arrNIC.length>l){
  OP3arrNIC[l]=OP3arrNIC[l];}
  if(TPP3arrNIC[l]== 0){
      OP3arrNIC[l]="-";}
else{
  OP3arrNIC[l]=OP3arrNIC[OP3arrNIC.length -1 ];}

  /********************product array********************************* */
  if( product3nameNIC.length==l){
      product3nameNIC[l]= product3nameNIC[l-1];}
  if( product3nameNIC.length>l){
      product3nameNIC[l]= product3nameNIC[l];}
      if(TPP3arrNIC[l]== 0){
          product3nameNIC[l]="-";}
  else{
      product3nameNIC[l]= product3nameNIC[ product3nameNIC.length -1 ];}
  /**********************operator array****************************** */
  if(operatorname3NIC.length==l){
      operatorname3NIC[l]=operatorname3NIC[l-1];}
  if(operatorname3NIC.length>l){
      operatorname3NIC[l]=operatorname3NIC[l];}
      if(TPP3arrNIC[l]== 0){
          operatorname3NIC[l]="-";}
  else{
      operatorname3NIC[l]=operatorname3NIC[operatorname3NIC.length -1 ];}
  /**********************team_leader array*************************** */
  if( teamleadername3NIC.length==l){
      teamleadername3NIC[l]= teamleadername3NIC[l-1];}
  if( teamleadername3NIC.length>l){
      teamleadername3NIC[l]= teamleadername3NIC[l];}
      if(TPP3arrNIC[l]== 0){
          teamleadername3NIC[l]="-";}
  else{
      teamleadername3NIC[l]= teamleadername3NIC[ teamleadername3NIC.length -1 ];}
  /**********************supervisor array*************************** */
  if( supervisorname3NIC.length==l){
      supervisorname3NIC[l]= supervisorname3NIC[l-1];}
  if( supervisorname3NIC.length>l){
      supervisorname3NIC[l]= supervisorname3NIC[l];}
      if(TPP3arrNIC[l]== 0){
          supervisorname3NIC[l]="-";}
  else{
      supervisorname3NIC[l]= supervisorname3NIC[ supervisorname3NIC.length -1 ];}
  /**********************determination array***************************/
  if(pass3arrNIC[l]== undefined ){
      pass3arrNIC[l]=0;}
  if(rework3arrNIC[l]== undefined ){
      rework3arrNIC[l]=0;}
  if(scrap3arrNIC[l]== undefined ){
      scrap3arrNIC[l]=0;}
  /****************************************************************** */
    pass3arrFNIC.push(pass3arrNIC[l]);
    rework3arrFNIC.push(rework3arrNIC[l]);
    scrap3arrFNIC.push(scrap3arrNIC[l]);      
                    

    OP3arrFNIC.push(OP3arrNIC[l]);
    product3pushFNIC.push(product3nameNIC[l]);
    operatorname3FNIC.push(operatorname3NIC[l]);
    teamleadername3FNIC.push(teamleadername3NIC[l]);
    supervisorname3FNIC.push(supervisorname3NIC[l]);
  
  }else{TPP3arrNIC[l]=0;
      OP3arrFNIC[l]="-";
      product3pushFNIC[l]="-";
      operatorname3FNIC[l]="-";
      teamleadername3FNIC[l]="-";
      supervisorname3FNIC[l]="-";

      pass3arrFNIC[l]=0;
      rework3arrFNIC[l]=0;
      scrap3arrFNIC[l]=0;}

      TPP3arrFNIC.push(TPP3arr[l] +TPP3arrNIC[l]);//Grand Total(GT) 

      sumTPP.push(TPP1arr[l] + TPP2arr[l] + TPP3arr[l]);//Grand Total(GT)
      sumTPPNIC.push(TPP1arrNIC[l] + TPP2arrNIC[l] + TPP3arrNIC[l]);//Grand Total(GT) 
      sumTPPGTI.push( sumTPPNIC[l] + sumTPP[l]);//Grand Total including Incidents(GT) 
    }
    
    
    
    
    console.log("\nNight on Incidents")
    console.log("operation number ("+ OP3arrFNIC.length+") : "+OP3arrFNIC)
    console.log("product name ("+ product3pushFNIC.length+") : "+product3pushFNIC)
    console.log("operator name ("+ operatorname3FNIC.length+") : "+operatorname3FNIC)
    console.log("teamleader name ("+ teamleadername3FNIC.length+") : "+teamleadername3FNIC)
    console.log("supervisor name ("+ supervisorname3FNIC.length+") : "+supervisorname3FNIC)
    console.log("T.P.P ("+ TPP3arrNIC.length+") : "+TPP3arrNIC)
    console.log("passed products ("+ pass3arrNIC.length+") : "+pass3arrFNIC)
    console.log("reworked products ("+ rework3arrNIC.length+") : "+rework3arrFNIC)
    console.log("scrap products ("+ scrap3arrNIC.length+") : "+scrap3arrFNIC)
    
  
              sumTPP.push(TPP1arr[l] + TPP2arr[l] + TPP3arr[l]);//Grand Total(GT)
              sumTPPNIC.push(TPP1arrNIC[l] + TPP2arrNIC[l] + TPP3arrNIC[l]);//Grand Total(GT) 
              sumTPPGTI.push( sumTPPNIC[l] + sumTPP[l]);//Grand Total including Incidents(GT) 

  //------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------------------------------------------------------------------------------
  
  var description1 = [];
  var description2 = [];
  var description3 = [];
  var descript;
  var descriptionChanger; 
  var partNoStore1 = [];
  var partNoStore2 = [];
  var partNoStore3 = [];
  var partNo;
  var partNoChanger; 

  var ProductChanger;
  var OPChanger;

  for(var g=0; g<=2 ; g++ ){

      if(g==0){descriptionChanger=description1; OPChanger=OP1arrF; ProductChanger=product1pushF; partNoChanger=partNoStore1}
      if(g==1){descriptionChanger=description2; OPChanger=OP2arrF; ProductChanger=product2pushF; partNoChanger=partNoStore2}
      if(g==2){descriptionChanger=description3; OPChanger=OP3arrF; ProductChanger=product3pushF; partNoChanger=partNoStore3}

      for(var q1=0; q1<McSortTname.length ; q1++ ){
      
          
      if(ProductChanger[q1]=="V31" || ProductChanger[q1]=="M0121"|| ProductChanger[q1]=="-"){  
          if(OPChanger[q1]==280){
              if(ProductChanger[q1]=="M0121"){
                  descript="Final_Machine_Ogive";
                  descriptionChanger.push(descript)
                  partNo="BB/5836/A/C3B";
                  partNoChanger.push(partNo)}else{descriptionChanger.push("N/A");partNoChanger.push("N/A")}
          }

          if(OPChanger[q1]==290){
              if(ProductChanger[q1]=="M0121"){
                  descript="Ultrasonic_Test";
                  descriptionChanger.push(descript)
                  partNo="BB/5836/A/C3B";
                  partNoChanger.push(partNo)}else{descriptionChanger.push("N/A");partNoChanger.push("N/A")}
              }
          
          if(OPChanger[q1]==300){
              if(ProductChanger[q1]=="M0121"){
              descript="Stamping";
              descriptionChanger.push(descript)
              partNo="BB/5836/A/C3B";
              partNoChanger.push(partNo)}
              else if(ProductChanger[q1]=="V31"){
                  descript="Cavity_control_&_spooning";
                  descriptionChanger.push(descript)
                  partNo="BB/084737S/AC4";
                  partNoChanger.push(partNo)}
              else{descriptionChanger.push("N/A");partNoChanger.push("N/A")}
       }

          if(OPChanger[q1]==305){
              if(ProductChanger[q1]=="M0121"){
              descript="Drill_Base_&_RM_Bore";
              descriptionChanger.push(descript)
              partNo="BB/5836/A/C4";
              partNoChanger.push(partNo)}else{descriptionChanger.push("N/A");partNoChanger.push("N/A")}
      }

          if(OPChanger[q1]==310){
              if(ProductChanger[q1]=="M0121"){
              descript="Machine_Driving_Band_Groove";
              descriptionChanger.push(descript)
              partNo="BB/5836/A/C4";
              partNoChanger.push(partNo)}
              else if(ProductChanger[q1]=="V31"){
                  descript="Pre_Machine_Base_Recess";
                  descriptionChanger.push(descript)
                  partNo="BB/084737S/AC4";
                  partNoChanger.push(partNo)}
              else{descriptionChanger.push("N/A");partNoChanger.push("N/A")}
      }
          
          if(OPChanger[q1]==320){
              if(ProductChanger[q1]=="M0121"){
              descript="Knurling";
              descriptionChanger.push(descript)
              partNo="BB/5836/A/C4";
              partNoChanger.push(partNo)}else{descriptionChanger.push("N/A");partNoChanger.push("N/A")}
      }
          
          if(OPChanger[q1]==340){
                  if(ProductChanger[q1]=="M0121"){
                  descript="Press_On_Driving_Band";
                  descriptionChanger.push(descript)
                  partNo="BB/5836/A/C4";
                  partNoChanger.push(partNo)}else{descriptionChanger.push("N/A");partNoChanger.push("N/A")}
          }

          if(OPChanger[q1]=="350/380"){
              if(ProductChanger[q1]=="V31"){
              descript="machine_Driving_Band_Groove_1&2";
              descriptionChanger.push(descript)
              partNo="BB/084737S/AC4";
              partNoChanger.push(partNo)}else{descriptionChanger.push("N/A");partNoChanger.push("N/A")}
      }

          if(OPChanger[q1]==380){
                  if(ProductChanger[q1]=="M0121"){
                  descript="Final_Machine_Cavity";
                  descriptionChanger.push(descript)
                  partNo="BB/5836/A/C5";
                  partNoChanger.push(partNo)}else{descriptionChanger.push("N/A");partNoChanger.push("N/A")}
          }
                  
          if(OPChanger[q1]==390){
                  if(ProductChanger[q1]=="M0121"){
                  descript="Final_Spooning";
                  descriptionChanger.push(descript)
                  partNo="BB/5836/A/C5";
                  partNoChanger.push(partNo)}
                  else if(ProductChanger[q1]=="V31"){
                      descript="knurling_2";
                      descriptionChanger.push(descript)
                      partNo="BB/084737S/AC4";
                      partNoChanger.push(partNo)}
                  else{descriptionChanger.push("N/A");partNoChanger.push("N/A")}
          }
          if(OPChanger[q1]==396){
              if(ProductChanger[q1]=="M0121"){
              descript="Balancing_Correction";
              descriptionChanger.push(descript)
              partNo="BB/5836/A/C5";
              partNoChanger.push(partNo)}else{descriptionChanger.push("N/A");partNoChanger.push("N/A")}
      }

          if(OPChanger[q1]=="400/410"){
              if(ProductChanger[q1]=="V31"){
              descript="Press_Soft_Iron_band_&_Seal_Brass_Band";
              descriptionChanger.push(descript)
              partNo="BB/084737S/AC4";
              partNoChanger.push(partNo)}else{descriptionChanger.push("N/A");partNoChanger.push("N/A")}
      }

          if(OPChanger[q1]==400){
              if(ProductChanger[q1]=="M0121"){
              descript="Shot_blast_cavity";
              descriptionChanger.push(descript)
              partNo="BB/5836/A/C5";
              partNoChanger.push(partNo)}else{descriptionChanger.push("N/A");partNoChanger.push("N/A")}
      }
                 
          if(OPChanger[q1]==410){
                  if(ProductChanger[q1]=="M0121"){
                  descript="Final_Machine_nose_threads";
                  descriptionChanger.push(descript)
                  partNo="BB/5836/A/C5";
                  partNoChanger.push(partNo)}else{descriptionChanger.push("N/A");partNoChanger.push("N/A")}
          }
                 
          if(OPChanger[q1]==420){
                  if(ProductChanger[q1]=="M0121"){
                  descript="Final_Machine_DB_&_Base_Threads";
                  descriptionChanger.push(descript)
                  partNo="BB/5836/A/C5";
                  partNoChanger.push(partNo)}else{descriptionChanger.push("N/A");partNoChanger.push("N/A")}
          }

          if(OPChanger[q1]==460){
              if(ProductChanger[q1]=="V31"){
              descript="Machine_Nose_Thread";
              descriptionChanger.push(descript)
              partNo="BB/084737S/AC5";
              partNoChanger.push(partNo)}else{descriptionChanger.push("N/A");partNoChanger.push("N/A")}
          }

          if(OPChanger[q1]=="-"){
                  descriptionChanger.push("N/A")
                  partNoChanger.push("N/A")}
                  
          }else{descriptionChanger.push("N/A");partNoChanger.push("N/A")} 
                   
      }
      
  }

  
  //------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------------------------------------------------------------------------------
  var dateSS = new Date(datefix);//load date value


          console.log("Table-Display activated")
          $("<label id=dateUI style= font-weight:bold>Daily Report : "+dateSS.toDateString()+"</label><div id=adminArea></div>").appendTo("#filter_by_Date");
          $("<button class=export2E onclick=XporttoExcel() >Export to excel</button>").appendTo("#adminArea");
          $("<button class= printhtml onclick=printtable() >Print</button>").appendTo("#adminArea");
//------------------------morning html--------------------------------------------------------------------------
        var box1 = $("<div id=box12 style=border: 2px;></div>").appendTo("#filter_by_Date");
  //$("<p id=cont style= font-weight:bold></p>").text("Shift : Morning").appendTo(box1);
  var daytable1 = $("<table id=daytable1 border=0></table>").appendTo(box1);
  var row0 = $("<tr id=heading></tr>").appendTo(daytable1);
      $("<th id=sero colspan=8 ></th>").text("Morning").appendTo(row0);
      $("<th id=sero colspan=7 ></th>").text("Afternoon").appendTo(row0);
      $("<th id=sero colspan=7 ></th>").text("Night").appendTo(row0);

//-----------------------------morning-------------------------------------------------------
  var row1 = $("<tr id=heading></tr>").appendTo(daytable1);
      $("<th id=sero ></th>").text("MC").appendTo(row1);
      $("<th id=sero ></th>").text("Product").appendTo(row1);
      $("<th id=sero ></th>").text("OP").appendTo(row1);
      $("<th id=sero ></th>").text("Total").appendTo(row1);
      $("<th id=sero ></th>").text("").appendTo(row1);
    //   $("<th id=sero ></th>").text("Part.no").appendTo(row1);
      $("<th id=serolong ></th>").text("Operator").appendTo(row1);
      $("<th id=serolong ></th>").text("Team-Leader").appendTo(row1);
      $("<th id=serolong ></th>").text("Supervisor").appendTo(row1);
//-----------------------------afternoon-------------------------------------------------------
      $("<th id=sero ></th>").text("Product").appendTo(row1);
      $("<th id=sero ></th>").text("OP").appendTo(row1);
      $("<th id=sero ></th>").text("Total").appendTo(row1);
      $("<th id=sero ></th>").text("").appendTo(row1);
      $("<th id=serolong ></th>").text("Operator").appendTo(row1);
      $("<th id=serolong ></th>").text("Team-Leader").appendTo(row1);
      $("<th id=serolong ></th>").text("Supervisor").appendTo(row1);
//-----------------------------night-------------------------------------------------------
      $("<th id=sero ></th>").text("Product").appendTo(row1);
      $("<th id=sero ></th>").text("OP").appendTo(row1);       
      $("<th id=sero ></th>").text("Total").appendTo(row1);
      $("<th id=sero ></th>").text("").appendTo(row1);
      $("<th id=serolong ></th>").text("Operator").appendTo(row1);
      $("<th id=serolong ></th>").text("Team-Leader").appendTo(row1);
      $("<th id=serolong ></th>").text("Supervisor").appendTo(row1);
//-----------------------------grand total-------------------------------------------------------
      $("<th id=sero ></th>").text("GT").appendTo(row1);
      $("<th id=sero ></th>").text("GTI").appendTo(row1);


    for(var p1=0; p1<McTotname.length ; p1++ ){

        if(TPP1arrNIC[p1]==0){
          TPP1arrNIC[p1]="";
        }else{TPP1arrNIC[p1]="+"+TPP1arrNIC[p1]}

        if(TPP2arrNIC[p1]==0){
          TPP2arrNIC[p1]="";
        }else{TPP2arrNIC[p1]="+"+TPP2arrNIC[p1]}

        if(TPP3arrNIC[p1]==0){
          TPP3arrNIC[p1]="";
        }else{TPP3arrNIC[p1]="+"+TPP3arrNIC[p1]}

      var row1_1 = $("<tr id=heading></tr>").appendTo(daytable1);
      $("<td style= font-weight:bold></td>").text(McTotname[p1]).appendTo(row1_1);//machine number
      $("<td title="+description1[p1]+" style= font-weight:bold></td>").text(product1pushF[p1]).appendTo(row1_1);//product name
      $("<td title="+description1[p1]+"></td>").text(OP1arrF[p1]).appendTo(row1_1);//operation
      $("<td title="+description1[p1]+" style= font-weight:bold></td>").text(TPP1arr[p1]).appendTo(row1_1);//total product produced
      $("<td title="+description1[p1]+" class=IncS style= font-weight:bold></td>").text(TPP1arrNIC[p1]).appendTo(row1_1);//incident total
    //   $("<td title="+description1[p1]+"></td>").text("N/A").appendTo(row1_1);//part number
      $("<td title="+description1[p1]+"></td>").text(operatorname1F[p1]).appendTo(row1_1);//operator
      $("<td title="+description1[p1]+"></td>").text(teamleadername1F[p1]).appendTo(row1_1);//teamleader
      $("<td title="+description1[p1]+"></td>").text(supervisorname1F[p1]).appendTo(row1_1);//supervisor

      $("<td title="+description2[p1]+" style= font-weight:bold></td>").text(product2pushF[p1]).appendTo(row1_1);//product name
      $("<td title="+description2[p1]+"></td>").text(OP2arrF[p1]).appendTo(row1_1);//operation
      $("<td title="+description2[p1]+" style= font-weight:bold></td>").text(TPP2arr[p1]).appendTo(row1_1);//total product produced
      $("<td title="+description2[p1]+" class=IncS style= font-weight:bold></td>").text(TPP2arrNIC[p1]).appendTo(row1_1);//incident total
      $("<td title="+description2[p1]+"></td>").text(operatorname2F[p1]).appendTo(row1_1);//operator
      $("<td title="+description2[p1]+"></td>").text(teamleadername2F[p1]).appendTo(row1_1);//teamleader
      $("<td title="+description2[p1]+"></td>").text(supervisorname2F[p1]).appendTo(row1_1);//supervisor

      $("<td title="+description3[p1]+" style= font-weight:bold></td>").text(product3pushF[p1]).appendTo(row1_1);//product name
      $("<td title="+description3[p1]+"></td>").text(OP3arrF[p1]).appendTo(row1_1);//operation
      $("<td title="+description3[p1]+" style= font-weight:bold></td>").text(TPP3arr[p1]).appendTo(row1_1);//total product produced
      $("<td title="+description3[p1]+" class=IncS style= font-weight:bold></td>").text(TPP3arrNIC[p1]).appendTo(row1_1);//incident total
      $("<td title="+description3[p1]+"></td>").text(operatorname3F[p1]).appendTo(row1_1);//operator
      $("<td title="+description3[p1]+"></td>").text(teamleadername3F[p1]).appendTo(row1_1);//teamleader
      $("<td title="+description3[p1]+"></td>").text(supervisorname3F[p1]).appendTo(row1_1);//supervisor

             
      $("<td style= font-weight:bold></td>").text(sumTPP[p1]).appendTo(row1_1);//supervisor
      $("<td class=IncS style= font-weight:bold></td>").text(sumTPPGTI[p1]).appendTo(row1_1);//incident total

    }
   
      $('.loader').hide();   
}
/*******************************************************************************************************************************************************************/
/*******************************************************************************************************************************************************************/
/*******************************************************************************************************************************************************************/
