let currentUser = null;
function login(showhide){
if(showhide == "show"){
    document.getElementById('popupbox').style.visibility="visible";
}else if(showhide == "hide"){
    document.getElementById('popupbox').style.visibility="hidden"; 
}
}


async function  firebase_start()
{           var firebaseConfig = {
            apiKey: "AIzaSyAnFDj_6PvX3qUDw9ntpadzddNNs36frGs",
            authDomain: "consumererode.firebaseapp.com",
            projectId: "consumererode",
            storageBucket: "consumererode.appspot.com",
            messagingSenderId: "217016354732",
            appId: "1:217016354732:web:021bdd84ebe67c8ca39c09",
            measurementId: "G-KZXZ3G0K9H"
            };
            // Initialize Firebase
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }else {
                firebase.app(); // if already initialized, use that one
            }
            
            firebase.analytics();
            auth = firebase.auth();
            auth.signOut().then( () => {console.log("signed out at start");});
            
            storage = firebase.storage();
            document.getElementById('login_form').addEventListener('submit', login_submit);
            firebase_update_file_list()
}

async function firebase_update_file_list()
{
    console.log(auth.currentUser );  
    listref = storage.ref();
    updates_done = listref.listAll().then(
        (res) => {
            console.log(res);
            selection = document.getElementById("select_file");
            selection.innerHTML = "";
            if (currentUser == null) {
                selection.options[0] = new Option("Sample: நுகர்வோர் காவலன் மாத இதழ்(January 2021)", "https://consumererode.org/NKJan21.pdf");
                selection.selectedIndex = 0;
            }
            res.items.forEach(function (itemRef) {
                console.log(itemRef);
                console.log("fullPath - ", itemRef.fullPath);


                console.log("toString - ", itemRef.toString());
                console.log("itemRef link", itemRef.getDownloadURL())
                const CONFIG = {
                    action: 'read',
                    expires: Date.now() + 1000 * 60 * 10,
                };
                downloadURL = itemRef.getDownloadURL().then((url) => {
                    selection.options[selection.options.length] = new Option(itemRef.fullPath, url);
                    if (currentUser != null) selection.selectionIndex = selection.options.length;
                    if (selection.options.length == 1) selectionChange(null);
                }, (err) => { console.log("error firebase URL"); }
                )
            });


            
        }, (res) => { console.log('listAll returned failure', res); });
}


async function login_submit(e)
{
    e.preventDefault();
    
    console.log("login_submit user trying to login");
    auth.signInWithEmailAndPassword(document.getElementById('email').value, document.getElementById('password').value ).then(
        ((res)=>
        {
            console.log("logged in - user", res);
            document.getElementById("Loading").style.visibility = "visible";
            document.getElementById('ask_login').innerHTML="<strong> " + res['user']['email'] +" has logged in </strong>";         
            firebase_update_file_list();
            currentUser = res['user'];
        }
        ), (user)=> {
            console.log("failure - ", user); 
            document.getElementById('ask_login').innerHTML="<a href=\"javascript:login('show');\"> <strong>சந்தாதாரர் Login</strong></a>";
            firebase_update_file_list();
            }
    )
    login('hide');

}
