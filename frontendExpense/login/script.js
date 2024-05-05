async function signIn(event) {
    try {
        event.preventDefault();

        const email = event.target.email.value;
        const password = event.target.password.value;
        const loginInfo = { email, password };

        const response = await axios.post('http://localhost:4000/users/login', loginInfo);
        //  console.log("id", response.data);
        if (response.status == 200) {
            alert(response.data.message);
            //  console.log("id", response.data.message);
            // console.log(response.data.token)
            localStorage.setItem('token', response.data.token)
            window.location.href = '../expensePage/expense.html'
        }
    } catch (err) {
        console.log(JSON.stringify(err))
        document.body.innerHTML += `<div style="color:red;">${err.message}</div>   `

    }
}
