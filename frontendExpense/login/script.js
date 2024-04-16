async function signIn(event) {
    try {
        event.preventDefault();

        const email = event.target.email.value;
        const password = event.target.password.value;
        const loginInfo = { email, password };

        const response = await axios.post('http://localhost:3000/users/login', loginInfo);

        if (response.status == 200) {
            alert("User successfully logged in");
            window.location.href = '../expensePage/expense.html'
        }
    } catch (err) {
        console.error('Error during login:', err);

    }
}
