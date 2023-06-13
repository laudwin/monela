/****************************************************************************************************************************************************************/
/************************************************************Data Capture Report*********************************************************************************/
/****************************************************************************************************************************************************************/
var pgsh8=1;//page search for reportDC
var dict8 = [];//dictionary array for storing data
var dict8INC = [];//dictionary array for storing data
var dateDict=[]; // array for storing dates
var dateT;//To date
var datecount = 0;//date array count for auto changing date search
var element; 
var date_interval;
var width;
var identity;

//----------------------------------------------------------------------------------------------------------------------------------------------------------------
 function ReportDC(dateDict,userC,totalCMS,userCntarray,totalCMSINC,userCntarrayINC){
    
    console.log("Data Capture Report")
    document.getElementById("batchEdit").innerHTML = ""  
    $("#tableView").html("");
    $('.dropbtn').hide();
    $("#direction_nav").html("");

      pgsh8=1;

      Mainbut.style.backgroundColor=null;
      INCbut.style.backgroundColor=null;
      fltbut.style.backgroundColor=null;
      Reportid.style.backgroundColor='orange';
      document.getElementById("dataDetails").innerHTML = "";

    var container =  $("<div class=content></div>").appendTo("#tableView");//calender drop down
    $("<label class=lbl>From:</label>").appendTo(container);//calender drop down
    $("<input type=date class=Fdate id=Filterdate></input>").appendTo(container);//calender drop down
    $("<label class=lbl>To:</label>").appendTo(container);//calender drop down
    $("<input type=date class=Fdate id=Filterdate2></input>").appendTo(container);//calender drop down
    $("<button class=filtdatebutn onclick=datecollect()>filter by date</button><br><br>").appendTo(container);//filter by date button

    // console.log(dateC)
    $("<div class=userHeader style= font-weight:bold></div>").text(dateDict[0] +" - "+dateT).appendTo("#tableView");
    var userScore = $("<div id=userScore></div>").appendTo("#tableView");//Finish time

      for (var j=0; j< userC.length ; j++ ){
          
         
          var userTile= $("<div class=userTile onclick=datadetails(this) id="+userC[j]+"></div>").appendTo(userScore);//Finish time
          $("<div class=userHeader></div>").text(userC[j]).appendTo(userTile);//user
          $("<div style= font-weight:bold ></div>").text("Captured Count\t : "+userCntarray[j]).appendTo(userTile);//Captured count
          $("<hr>").appendTo(userTile);//horizontal line
          $("<div style= font-weight:bold ></div>").text("On Incidents\t  : "+userCntarrayINC[j]).appendTo(userTile);//On Incidents
          var totalCap = userCntarray[j] + userCntarrayINC[j]
          $("<div class=userHeader></div>").text("Total Captured\t : "+totalCap).appendTo(userTile);//total captured
          $("<div class=ftime"+userC[j]+" ></div>").appendTo(userTile);
           
      }
      var grandTot = totalCMS + totalCMSINC;
      $("<div id=totCMS style= font-weight:bold></div>").text("Total Captured on main Sheet\t : "+totalCMS).appendTo("#tableView");//Total Captured on main Sheet
      $("<div id=totCMS style= font-weight:bold></div>").text("Total Captured on incidents\t : "+totalCMSINC).appendTo("#tableView");//Total Captured on incidents
      $("<div id=totCMS style= font-weight:bold></div>").text("Grand Total Captured\t : "+grandTot).appendTo("#tableView");//Grand Total Captured	


      $('.loader').hide(); 
 }
//----------------------------------------------------for date collection------------------------------------------------------------------------------

function datecollect(){
  var dateC = document.getElementById("Filterdate").value;//get date from date input
     dateT = document.getElementById("Filterdate2").value;//get date from date input
     document.getElementById("batchEdit").innerHTML = ""  //remove batch edit button
     dateDict=[]; //create array for storing dates
     dict8 = [];//create array for storing traceability data
     dict8INC = [];
     var myDate;
     var ignorelastdate;
     

    if(dateT=="" && dateC==""){//no date entered
      console.log("no date")
      alert("please select a valid date")
      return 0;
    }else if(dateT==""){//only from date entered
      dateT=dateC;
    }else if(dateC==""){//only to date entered
      dateC=dateT
    }
    dateDict[0]=dateC;//1st value on array

  var daycount=1;

  var dateC_new = new Date(dateC);//create new date from existing one so that the porgram can recognise it as date not text
  var dN=dateC_new.getDate()//get day value
  
  var dateT_new = new Date(dateT);//create new date from existing one so that the porgram can recognise it as date not text
  var dNT = dateT_new.getDate()//get day value
    
console .log(dateC_new+"_______"+dateT_new)

    //if the dates are the same add 1 day to date and add to array
  if(dateC == dateT){
    console.log("dates equal")
    var dateOffset = (24*60*60*1000) * 1; //1 days
    myDate = new Date(dateDict[0]);
    myDate.setTime(myDate.getTime() + dateOffset);
    date_end =myDate.toJSON().substring(0,10);
    dateDict[1]=date_end;
    ignorelastdate = 1;//true
  }else{ignorelastdate = 0}//false

  while(dN!=dNT){
    dateC_new.setDate(dateC_new.getDate() + 1);
    console.log(dateC_new.toISOString().substring(0,10))
    dN=dateC_new.getDate()//get the day from the date
    dateDict[daycount]=dateC_new.toISOString().substring(0,10);
    daycount++;

      if (daycount >= 32){
        alert("Date search is LIMITED to 31 days") 
        $('#preloader').hide(); 
        return 0;
      }
    }

    console.log(dateDict)

    $("<center><div id=preloader><div id=loader></div></div></center>").appendTo("#tableView");
  
    datecount = 0;
    reportdata(dateDict,ignorelastdate,myDate)

}
//----------------------------------------------------for data collection-------------------------------------------------------------------------------
async function reportdata(dateDict,ignorelastdate,myDate){

  // var dateC = document.getElementById("Filterdate").value;
  // var dateT = document.getElementById("Filterdate2").value;
  // console.log(dateC)
      if(ignorelastdate == 0){
        var lastday = (dateDict.length)-1;
        var dateOffset = (24*60*60*1000) * 1; //1 days
        myDate = new Date(dateDict[lastday]);
        myDate.setTime(myDate.getTime() + dateOffset);
        date_end =myDate.toJSON().substring(0,10);
      }
     

        console.log(dateDict[0])
        console.log(date_end)
        
            url_search = "http://192.168.2.223:9100/traceability/createdAt?Tablename=trace_plant.shell_traceability&StartDate="+dateDict[0]+"&EndDate="+date_end+"";
            await axios
                .get(url_search, {
            // timeout: 5000
                })
                .then(res => {
                  console.log(res)
                        for(var c=0; c< dateDict.length ; c++ ){
                            for (var j=0; j< res.data.length ; j++ ){
                              
                                var dateupdate = res.data[j].created_at;
                                var dateWord = dateupdate.substring(0,10);
                                console.log(dateWord+" :COMP: "+dateDict[c])

                                  if(dateWord == dateDict[c]){
      
                                      dict8.push(res.data[j]);
                                  
                                  } 
                            }
                        }
              }); 
      
        //-------------------------------
        reportdataincident(dateDict,date_end);
        //sortReportdata(dict8)
      }

    //--------------------------------------------------incident data collection---------------------------------------------------------
async function reportdataincident(dateDict,date_end){
  
            url_search = "http://192.168.2.223:9100/traceability/createdAt?Tablename=trace_plant.shell_traceability_incident&StartDate="+dateDict[0]+"&EndDate="+date_end+"";
            await axios
                .get(url_search, {
            // timeout: 5000
                })
                .then(res => {
                  
                          for(var c=0; c< dateDict.length ; c++ ){
                            for (var j=0; j< res.data.length ; j++ ){
                              
                              var dateupdate = res.data[j].created_at;
                              var dateWord = dateupdate.substring(0,10);
                              //console.log(dateWord)
  
                                 if(dateWord == dateDict[c]){
    
                                  dict8INC.push(res.data[j]);
                                
                                 } 
                            }
                          }

                            sortReportdata(dateDict)
                                
                }); 
}
    //------------------------------------------------------sort Report data-------------------------------------------------------------
    function sortReportdata(dateDict){
      console.log(dict8);
      console.log(dict8INC);

      var dictUsers = [];
      var dictUsers1 = [];
      var totalCMS = dict8.length
      var userCnt;
      var userCntarray = [];
     
      //-----------------------------
      var dictUsersINC = [];
      var dictUsers1INC = [];
      var totalCMSINC = dict8INC.length;
      var userCntINC;
      var userCntarrayINC = [];
      
      //---------------------------------------------------------------------------------------------------------------------------------------


     //for user identification array
     for (var j=0; j< dict8.length ; j++ ){
      var usersidDC= dict8[j].userName
      dictUsers.push(usersidDC); //add to array                   
   }
   dictUsers1 = Array.from(new Set(dictUsers));//remove duplicates in the array

    //for user identification array in incidents
    for (var j=0; j< dict8INC.length ; j++ ){
      var usersidDCINC= dict8INC[j].userName
      dictUsersINC.push(usersidDCINC); //add to array                   
    }
    dictUsers1INC = Array.from(new Set(dictUsersINC));//remove duplicates in the array

    var userscombined = dictUsers1.concat(dictUsers1INC);
    var userC =  Array.from(new Set(userscombined));


  //for user count array
   for (var k=0; k< userC.length ; k++ ){
    userCnt=0;
    
    for (var h=0; h< dict8.length ; h++ ){
      if(dict8[h].userName == userC[k]){
        userCnt++;
        
      } 
    }
    
    userCntarray[k] = userCnt;
   }
 
            //------------------on incidents---------------------------------

    
    //for user count array
    for (var k=0; k< userC.length ; k++ ){
      userCntINC=0;
      
      for (var h=0; h< dict8INC.length ; h++ ){
        if(dict8INC[h].userName == userC[k]){
          userCntINC++;
         
        } 
      }
      
      userCntarrayINC[k] = userCntINC;
    }

//------------------------------------------------------------------------------------------------------------------------------------------------------------------   
   console.log(userC);
   console.log(dictUsers1);
   console.log(userCntarray);
   console.log("");
   console.log(dictUsers1INC);
   console.log(userCntarrayINC);

   ReportDC(dateDict,userC,totalCMS,userCntarray,totalCMSINC,userCntarrayINC)
      
}
//--------------------------------------------data display for date captured----------------------------------------------------------------------------------------
var ChangeO;
var dateData = 0;

function datadetails(userDF){
  if(dateData == 0){
    console.log(userDF.id);

    var userYD = userDF.id;
    var prodate = [];
    var productiondate;
    var prodateINC = [];
    var productiondateINC;

    for (var h=0; h< dict8.length ; h++ ){
      if(dict8[h].userName == userYD){
        prodate.push(dict8[h].traceabilityDate);
      }
    }
    productiondate = Array.from(new Set(prodate));

    for (var h=0; h< dict8INC.length ; h++ ){
      if(dict8INC[h].userName == userYD){
        prodateINC.push(dict8INC[h].traceabilityDate);
      }
    }
    productiondateINC = Array.from(new Set(prodateINC));
    var datedatacmb = productiondate.concat(productiondateINC);
    var capturedPD = Array.from(new Set(datedatacmb));
    console.log(productiondate)
    console.log(productiondateINC)
    console.log(capturedPD)
//----------------------------layout----------------------------------------------------------------------

    $('.formlayout').hide();
    $('.formlayout').show();
    
    ChangeO = userDF;
    userDF.style.backgroundColor='orange'

    var formlayout = $("<div class=formlayout2"+userDF.id+"></div>").appendTo(".ftime"+userDF.id);

    $("<center><div class=viewShellD>\n\nPRODUCTION DATE CAPTURED \n</div></center>").appendTo(formlayout);

    var edform = $("<center><table class=ViewStable border=1></table></center>").appendTo(formlayout);

    var row100 = $("<tr id=headS></tr>").appendTo(edform);
        $("<th colspan=1 class=viewShell></th>").text("ID").appendTo(row100);
        $("<th colspan=4 class=viewShell></th>").text("Captured date").appendTo(row100);

        var Co = 0;
        for(var p=0; p<capturedPD.length ; p++ ){
          Co++;
          var row1_1 = $("<tr class=viewShellD id=heading></tr>").appendTo(edform);
          $("<td colspan=1></td>").text(Co).appendTo(row1_1);//serial number
          $("<td colspan=4></td>").text(capturedPD[p].substring(0,10)).appendTo(row1_1);//serial number
          
      }
      dateData = 1;
  }else{
    $('.formlayout2'+userDF.id+'').hide(); 
    dateData = 0;
    //ChangeO.style.backgroundColor=null;
  }//end if
    
}

