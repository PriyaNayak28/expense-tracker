async function signIn(event) {
    try {
        event.preventDefault();

        const email = event.target.email.value;
        const password = event.target.password.value;
        const loginInfo = { email, password };

        const response = await axios.post('http://localhost:3000/users/login', loginInfo);

        if (response.status == 200) {
            alert(response.data.message);
            console.log(response.data.message);
            localStorage.setItem('token', response.data.token)
            window.location.href = '../expensePage/expense.html'
        }
    } catch (err) {
        console.log(JSON.stringify(err))
        document.body.innerHTML += `<div style="color:red;">${err.message}</div>`

    }
}
