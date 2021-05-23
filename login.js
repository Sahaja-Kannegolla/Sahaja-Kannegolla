if (sessionStorage.getItem('userData')) {
    window.location.href = './allocation.html'
    // console.log('Session' + JSON.parse(sessionStorage.getItem('userData')).role);
}
function login(e) {
    e.preventDefault()
    var name = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    if (name && password) {
        makeLoginCall(name, password)
    }
    else {
        alert("Employee ID or Password cannot be empty.");
    }
}


function makeLoginCall(username, password) {
    var data = JSON.stringify({
        username, password
    })

    var req = new XMLHttpRequest();
    req.open('POST', "http://localhost:4000/login");
    req.setRequestHeader("Content-Type", "application/json");
    req.send(data);
    req.onload = () => {
        var loginResponse = JSON.parse(req.responseText)
        if (req.status === 200) {
            document.getElementById("login-error").innerText = ''
            sessionStorage.setItem('userData', JSON.stringify(loginResponse))
            window.location.href = './allocation.html'
        } else if (req.status === 400) {
            document.getElementById("login-error").innerText = loginResponse.errorMessage
            sessionStorage.setItem('userData', false)

        } else {
            document.getElementById("login-error").innerText = 'Failed to login, Please try after some time.'
            sessionStorage.setItem('userData', false)
        }
        return true;
    }

}