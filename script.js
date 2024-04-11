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

        const response = await axios.post('http://localhost:3000/signUp/add-users', signUpinfo);
        console.log(response);
        if (response.status === 200) {
            window.location.href = './login.html';
        }
    } catch (err) {
        if (err) {
            document.body.innerHTML = `sorry buddy ${err}`;
        }
    }
}

async function signIn(event) {

}