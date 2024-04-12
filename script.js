async function signUp(event) {
    try {
        event.preventDefault(event);

        const userName = event.target.userName.value;
        const email = event.target.email.value;
        const password = event.target.password.value;

        const signUpinfo = {
            userName,
            email,
            password
        }

        const response = await axios.post('http://localhost:4000/signUp/add-users', signUpinfo);
        console.log(response);
        if (response.status === 201) {
            window.location.href = './login.html';
        }
    } catch (err) {
        if (err) {
            document.body.innerHTML = `sorry buddy ${err}`;
        }
    }
}

async function signIn(event) {
    try {
        event.preventDefault();

        const email = event.target.email.value;
        const password = event.target.password.value;
        const loginInfo = { email, password };

        const response = await axios.post('http://localhost:4000/login', loginInfo);

        console.log(response);

        if (response.status === 200) { // Assuming 200 for successful login
            alert("User successfully logged in");
            // Redirect or do something else after successful login
        }
    } catch (err) {
        console.error('Error during login:', err);
        // Handle error
    }
}
