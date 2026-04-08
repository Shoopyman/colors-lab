const urlBase = 'http://asdfjalkjsdbf.com/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
    userId = 0;
    firstName = "";
    lastName = "";
    
    // Updated to kebab-case
    let login = document.getElementById("login-name").value;
    let password = document.getElementById("login-password").value;
    
    // Using the MD5 function from the bottom of your file
    let hash = md5(password);
    
    document.getElementById("login-result").innerHTML = "";

    // Using the hashed password for the payload
    let tmp = {login:login, password:hash};
    let jsonPayload = JSON.stringify(tmp);
    
    let url = urlBase + '/Login.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function() 
        {
            if (this.readyState == 4 && this.status == 200) 
            {
                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;
        
                if(userId < 1)
                {       
                    document.getElementById("login-result").innerHTML = "User/Password combination incorrect";
                    return;
                }
        
                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                saveCookie();
    
                window.location.href = "color.html";
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("login-result").innerHTML = err.message;
    }
}

function saveCookie()
{
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000)); 
    document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
    userId = -1;
    let data = document.cookie;
    let splits = data.split(",");
    for(var i = 0; i < splits.length; i++) 
    {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if(tokens[0] == "firstName")
        {
            firstName = tokens[1];
        }
        else if(tokens[0] == "lastName")
        {
            lastName = tokens[1];
        }
        else if(tokens[0] == "userId")
        {
            userId = parseInt(tokens[1].trim());
        }
    }
    
    if(userId < 0)
    {
        window.location.href = "index.html";
    }
    else
    {
        // Updated to kebab-case
        let userDisplay = document.getElementById("user-name");
        if (userDisplay) {
            userDisplay.innerHTML = "Logged in as " + firstName + " " + lastName;
        }
    }
}

function doLogout()
{
    userId = 0;
    firstName = "";
    lastName = "";
    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
}

function addColor()
{
    // Updated to kebab-case
    let newColor = document.getElementById("color-text").value;
    document.getElementById("color-add-result").innerHTML = "";

    // Fixed the duplicate userId:userId bug
    let tmp = {color:newColor, userId:userId};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/AddColor.' + extension;
    
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function() 
        {
            if (this.readyState == 4 && this.status == 200) 
            {
                document.getElementById("color-add-result").innerHTML = "Color has been added";
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("color-add-result").innerHTML = err.message;
    }
}

function searchColor()
{
    // Updated to kebab-case
    let srch = document.getElementById("search-text").value;
    document.getElementById("color-search-result").innerHTML = "";
    
    let colorList = "";

    let tmp = {search:srch, userId:userId};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchColors.' + extension;
    
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function() 
        {
            if (this.readyState == 4 && this.status == 200) 
            {
                document.getElementById("color-search-result").innerHTML = "Color(s) has been retrieved";
                let jsonObject = JSON.parse(xhr.responseText);
                
                for(let i=0; i<jsonObject.results.length; i++)
                {
                    colorList += jsonObject.results[i];
                    if(i < jsonObject.results.length - 1)
                    {
                        colorList += "<br />\r\n";
                    }
                }
                
                // Targeting the color-list ID we created instead of just "p"
                document.getElementById("color-list").innerHTML = colorList;
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("color-search-result").innerHTML = err.message;
    }
}