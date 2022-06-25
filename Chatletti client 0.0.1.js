
//Call uFffed when application is started.
function OnStart()
{
    //Create a main layout with objects vertically centered.
    lay = app.CreateLayout( "linear", "VCenter,FillXY" )
    //lay.SetBackColor("#ECD9A6")
    lay.SetBackGradient( "#dceca7", "#d1a267", "#d6b27a","#dceca7")

    //Load datetime module
    app.LoadPlugin( "Moment" )
    
    var scroll = app.CreateScroller( 0.9, 0.65, "FillY", "Vertical", "NoScrollBar" );
    scroll.SetBackColor( "#f2ebd7" );
 //   scroll.SetBackColor("#ECD9A6")
    lay.AddChild( scroll );

    layScroll = app.CreateLayout( "Linear", "Left, FillX/Y" );
    layScroll.SetBackColor( "#f2ebd7" );
   // layScroll.SetBackColor("#ECD9A6")
    scroll.AddChild( layScroll );
    
    //Create an text edit box for postcode entry. 
  	edt = app.CreateTextEdit( "Nickname", 0.8 ) 
  	edt.SetTextColor( "#120C13" )
  	lay.AddChild( edt ) 
	
	  //Create an text edit box for postcode entry. 
	  edt2 = app.CreateTextEdit( "Text", 0.8 ) 
  	edt2.SetTextColor( "#120C13" )
  	lay.AddChild( edt2 )
	
	  //Create an text edit box for postcode entry. 
  	edt3 = app.CreateTextEdit( "Recipient", 0.8 ) 
  	edt3.SetTextColor( "#120C13" )
  	lay.AddChild( edt3 )

    //Create a sub layout (horizontal) for buttons
    layHoriz = app.CreateLayout( "Linear", "Horizontal" );
    lay.AddChild( layHoriz );
    
    //Create a button to send request.
  	btn = app.CreateButton( "Send", 0.9, 0.08 ) 
  	btn.SetMargins( 0, 0.02, 0, 0 ) 
	  btn.SetBackColor( "#3C150B" )
  	//btn.SetPosition( 1, 0.8 )
    btn.SetOnTouch( btn_OnTouch ) 
  	layHoriz.AddChild( btn ) 
	
  	//Create a button to get messages.
  	//btn2 = app.CreateButton( "Get", 0.2, 0.1 ) 
  //	btn2.SetMargins( 0.1, 0.02, 0, 0 ) 
  //	btn2.SetBackColor( "#3C150B" )
  //	btn2.SetOnTouch( btn2_OnTouch ) 
  //	layHoriz.AddChild( btn2 ) 
  	
  	setTimer()
    
    //Add layout to app.    
    app.AddLayout( lay )

}   

//Handle button press.
function btn_OnTouch() 
{ 
    //Get user entered Name and Text.
    var user_name = edt.GetText()
    var message_text = edt2.GetText()
    var recipient = edt3.GetText()
    
    //Now datetime
    var send_time = moment().format("YYYY:MM:DD HH:mm:ss.ms")
    
    //Send request to remote server.
    var url = "https://chatletti.ru/api/messenger";
    //var path = "/api/messenger/";
    var params = {"Username": user_name, "Timestamp": send_time, "Messagetext": message_text, "Recipient": recipient} ;
    var jsonStr1 = JSON.stringify(params);
    app.HttpRequest( "json", url, null, jsonStr1, HandleReplyPost  )
    app.ShowProgress( )   
}

//Handle the serversreply (post).
function HandleReplyPost( error, response, status )
{
    //app.ShowPopup( response )
    if (response === "Success! Received messages: 1."){
    var txt = app.CreateText( edt.GetText() + " (" + moment().format("YYYY:MM:DD HH:mm:ss.ms") + "): " + edt2.GetText(), "Right, Multiline" )
    txt.SetTextColor( "#6D680A" )
   // txt.SetBackColor( "#6D680A" )
    txt.SetMargins( 0, 0.01, 0, 0 )
    txt.SetTextSize( 16 )
    layScroll.AddChild( txt )
        }
    //txt.SetText( response )
    app.HideProgress()
}

var counter = 0

//Handle the servers reply (Get).
function HandleReplyGet( error, response, status )
{
    
    app.HideProgress()
    if (response === 'Not found') 
    {var abracadabra = 0} 
    else if (response === 'Not found user') {
    var cadabrababra = 1} 
    else {counter += 1;
    const obj = JSON.parse(response);
    var user_name = edt.GetText()
    var arr = obj[user_name]
    var len = arr.length
    for ( var i = 0; i < len; i++) {
    var txt = app.CreateText( arr[i]["Username"] + " " +"(" + arr[i]["Timestamp"] + "):" + " " + arr[i]["Messagetext"], "Left", "Multiline" )
    txt.SetTextColor( "#67312A" )
    txt.SetMargins( 0.01, 0.01, 0.01, 0.01 )
    txt.SetTextSize( 16 )
    layScroll.AddChild( txt ) }
    }
}

//Get messages
function btn2_OnTouch()
{
    var recipient = edt.GetText();
    if (recipient.length > 0){
    var url_get = "https://chatletti.ru";
    var path_get = "/api/messenger/"+recipient;
    app.HttpRequest( "get", url_get, path_get, null, HandleReplyGet)
    }
}

function setTimer(){
  var seconds = 5
  endTime = Date.now()+1000 * seconds;
  showTime();
  intvl = setInterval(showTime, 300);
  }
  
function showTime()
{
  var tim = Date.now();
  var diff = Math.round((endTime - tim)/1000);
  if(diff < 1)
  {
    diff = 0;
    btn2_OnTouch()
    setTimer()
    clearInterval(intvl);
  }
}