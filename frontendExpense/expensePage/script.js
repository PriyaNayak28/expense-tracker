
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
        const response = await axios.post("http://localhost:4000/usersExpenses/add", post, { headers: { 'Authorization': token } });

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
        const response = await axios.get("http://localhost:4000/usersExpenses/expense", { headers: { 'Authorization': token } });
        console.log("expense response", response)

        for (let i = 0; i < response.data.length; i++) {
            uploadPost(response.data[i]);
        }

    } catch (error) {
        console.log('Error:', error.message);
    }
});

async function uploadPost(post) {
    const parentElement = document.getElementById('posts');
    const childElement = document.createElement('li');
    childElement.classList.add('post');
    childElement.id = `expense-${post.id}`;


    childElement.innerHTML = `amount: ${post.amount} | Description: ${post.description} | category: ${post.category} 
     <form onsubmit="deleteExpense(event, '${post.id}')"><button type="submit">Delete</button></form> `;
    parentElement.appendChild(childElement);
}
//<button class='delete' onclick=deleteExpense(event,'${post.id}')>Delete</button>
async function deleteExpense(event, expenseId) {
    try {
        event.preventDefault(); // Prevent form submission

        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:4000/usersExpenses/expenseDelete/${expenseId}`, { headers: { 'Authorization': token } });

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

document.getElementById('rzp-button1').onclick = async function (e) {
    try {
        e.preventDefault();

        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4000/purchase/premiummembership', { headers: { 'Authorization': token } });
        console.log("response", response.data);

        let options = {
            "key": response.data.key_id,
            "order_id": response.data.order_id,
            "amount": response.data.order.amount,
            "handler": async function (response) {
                await axios.post('http://localhost:4000/purchase/updatetransactionstatus', {
                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id,
                }, { headers: { "Authorization": token } });
                alert('You are a premium user now');
            },
        };

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
