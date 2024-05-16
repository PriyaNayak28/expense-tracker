
function parseJwt(token) {
    if (!token) {
        return;
    }
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    return JSON.parse(window.atob(base64));
}
async function expense(event) {
    try {
        event.preventDefault();

        let amount = event.target.amount.value;
        let description = event.target.description.value;
        let category = event.target.category.value;

        let post = {
            amount,
            description,
            category,
        };

        const token = localStorage.getItem('token');
        const response = await axios.post("http://localhost:3000/usersExpenses/addExpense", post, { headers: { 'Authorization': token } });

        uploadPost(response.data);

        event.target.amount.value = '';
        event.target.description.value = '';
        event.target.category.value = '';

        console.log("response", response);
    } catch (err) {
        console.error('Error:', err.message);
    }
};

window.addEventListener("DOMContentLoaded", async () => {
    try {
        const token = localStorage.getItem('token');
        console.log("token", token);
        const response = await axios.get("http://localhost:3000/usersExpenses/getExpense", { headers: { 'Authorization': token } });
        console.log("expense response", response)
        const decode = parseJwt(token);
        console.log("decode", decode);
        const adminIs = decode.ispremiumuser
        console.log(adminIs);
        if (adminIs) {
            showuserIspremiumOrNot();
            showLeaderboard()
        }

        for (let i = 0; i < response.data.length; i++) {
            uploadPost(response.data[i]);
        }

    } catch (error) {
        console.log('Error:', error.message);
    }
});


async function uploadPost(expense) {
    const parentElement = document.getElementById('userExpenses');
    const childElement = document.createElement('li');
    childElement.classList.add('expense');
    childElement.id = `expense-${expense.id}`;

    childElement.innerHTML = `amount: ${expense.amount} | Description: ${expense.description} | category: ${expense.category} 
     <form onsubmit="deleteExpense(event, '${expense.id}')"><button type="submit">Delete</button></form> `;
    parentElement.appendChild(childElement);
}

async function deleteExpense(event, expenseId) {
    try {
        event.preventDefault(); // Prevent form submission

        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3000/usersExpenses/expenseDelete/${expenseId}`, { headers: { 'Authorization': token } });

        removeExpense(expenseId);
    }
    catch (error) {
        console.error('Error deleting expense:', error.message);
    }
}

function removeExpense(expenseId) {
    const childElement = document.getElementById(`expense-${expenseId}`);
    if (childElement) {
        childElement.remove();
    } else {
        console.error(`Expense element with ID expense-${expenseId} not found.`);
    }
}

function showuserIspremiumOrNot() {
    document.getElementById('rzp-button1').style.visibility = 'hidden';
    document.getElementById('message').innerHTML = 'you are premium user'
}

async function showLeaderboard() {
    const inputElement = document.createElement("input")
    inputElement.className = "leaderboardbtn"
    inputElement.type = "button"
    inputElement.value = 'Show Leaderboard'
    inputElement.onclick = async () => {
        const token = localStorage.getItem('token')
        console.log("hh,token", token);
        const userLeaderBoardArray = await axios.get('http://localhost:3000/premium/showLeaderBoard', { headers: { "Authorization": token } })
        console.log("hh,userLeaderBoardArray", userLeaderBoardArray);

        var leaderboardElem = document.getElementById('leaderboard')
        // leaderboardElem.innerHTML += '<h1> Leader Board </<h1>'
        userLeaderBoardArray.data.forEach((userDetails) => {
            leaderboardElem.innerHTML += `<li>Name - ${userDetails.userName} Total Expense - ${userDetails.total_cost} </li>`
        })
    }
    document.getElementById("message").appendChild(inputElement);

}

document.getElementById('rzp-button1').onclick = async function (e) {
    try {
        console.log("@premiumuser");
        e.preventDefault();

        const token = localStorage.getItem('token');
        const decode = parseJwt(token);
        console.log("decode", decode);
        const adminIs = decode.ispremiumuser
        console.log(adminIs);
        if (adminIs) {
            showuserIspremiumOrNot();
            showLeaderboard()
        }
        console.log("@Etoken", token);
        const response = await axios.get('http://localhost:3000/purchase/premiummembership', { headers: { 'Authorization': token } });
        console.log("@Eresponse", response);
        console.log("@Eresponse", response.data);
        // localStorage.setItem('token', response.data.token);
        let options = {
            "key": response.data.key_id,
            "order_id": response.data.order.id,
            "amount": response.data.order.amount,
            "handler": async function (response) {
                const responseS = await axios.post('http://localhost:3000/purchase/updatetransactionstatus', {
                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id,
                }, { headers: { "Authorization": token } });
                alert('You are a premium user now');
                console.log(responseS);
                // Block the button
                document.getElementById('rzp-button1').style.visibility = 'hidden';
                document.getElementById('message').innerHTML = 'you are premium user'
                showLeaderboard()
                localStorage.setItem('token', responseS.data.token);
            },
        };


        console.log("@Eoptions", options);

        const rzp1 = new Razorpay(options);
        rzp1.open();

        rzp1.on('payment.failed', function (response) {
            console.log(response);
            alert('Something went wrong');
        });
    }
    catch (err) {
        console.log(err);
        document.body.innerHTML = `<div>${err}</div>`;
    }
}


