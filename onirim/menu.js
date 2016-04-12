

function menu_init(container)
{  
  var w = document.getElementById(container).clientWidth;
  var h = document.getElementById(container).clientHeight;
  
  var div;

  div = document.createElement("div");
  div.id="menu";
  div.style.top="0px";
  div.style.left="0px";
  div.style.width=w+"px";  
  div.style.height=h+"px";  
  div.style.position="absolute";    
  div.style.borderWidth="0px";    
  div.style.zIndex=2;    
  div.style.overflow="hidden";     
  document.getElementById(container).appendChild(div);
  
  div = document.createElement("div");
  div.id="menuLpane";
  div.style.transitionProperty="left";
  div.style.transitionDuration="1s";
  div.style.top="0px";
  div.style.left="0px";
  div.style.width=w/2+"px";  
  div.style.height=h+"px";  
  div.style.position="absolute";    
  div.style.borderWidth="0px";    
  document.getElementById("menu").appendChild(div);
    
  div = document.createElement("div");
  div.id="menuRpane";
  div.style.transitionProperty="left";
  div.style.transitionDuration="1s";
  div.style.top=0+"px";
  div.style.left=w/2+"px";
  div.style.width=w/2+"px";  
  div.style.height=h+"px";  
  div.style.position="absolute";    
  div.style.borderWidth="0px";    
  document.getElementById("menu").appendChild(div); 
}

function menu_show()
{
  console.log("Clicked Menu button");
  var w = document.getElementById("menuLpane").clientWidth;
  
  document.getElementById("menuLpane").style.left=0+"px";
  document.getElementById("menuRpane").style.left=w+"px";
  
  document.getElementById("menu").style.visibility="visible";
}


function menu_hide()
{
  var w = document.getElementById("menuLpane").clientWidth;
  
  document.getElementById("menuLpane").style.left=-w+"px";
  document.getElementById("menuRpane").style.left=2*w+"px";
  
  window.setTimeout(function(){document.getElementById("menu").style.visibility="hidden";}, 1002);
}
                                                                                                                                                                          
function menu_initChoice(n, f, t)
{
  div = document.createElement("div");
  div.id="menuChoice"+n;
  div.onmousedown = f;   
  div.innerHTML = t;               
  document.getElementById("menuLpane").appendChild(div);   
}

        
                          
                                                                                                                                                                            