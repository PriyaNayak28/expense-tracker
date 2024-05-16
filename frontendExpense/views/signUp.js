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
        // console.log(signUpinfo);

        const response = await axios.post('http://localhost:3000/users/signUp', signUpinfo);
        //console.log(response);
        if (response.status === 201) {
            window.location.href = './login.html';
        }
    } catch (err) {
        console.error('Error during sign up:', err);
    }
}

// TOKEN_SECRET = '#@focus28ABCDabcd';
// RAZORPAY_KEY_ID = 'rzp_test_z62yGE79KvVln8';
// RAZORPAY_KEY_SECRET = 'Z9sVpXOIUjD9ZJIWB7nZrcyZ';