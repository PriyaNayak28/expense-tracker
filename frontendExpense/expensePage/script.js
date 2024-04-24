

async function expense(event) {
    try {
        event.preventDefault();

        let amount = event.target.amount.value;
        let description = event.target.description.value;
        let category = event.target.category.value;
        let id = event.target.id;
        console.log(id);


        let post = {
            amount,
            description,
            category,
            id
        };

        console.log("post", post)

        // Correct endpoint for adding a new post
        const response = await axios.post("http://localhost:3000/usersExpenses/add", post);
        console.log(response)
        uploadPost(response.data);

        // Clear input fields after successful submission
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
        const response = await axios.get("http://localhost:3000/usersExpenses/expense", { headers: { 'Authorization': token } });
        console.log("expense response", response);

        for (var i = 0; i < response.data.length; i++) {
            uploadPost(response.data[i]);
        }
    } catch (error) {
        console.log('Error:', error.message);
    }
});

async function uploadPost(post) {
    const parentElement = document.getElementById('posts');
    const childElement = document.createElement('li');
    childElement.classList.add('post'); // Added class for styling

    childElement.innerHTML = `amount: ${post.amount} |Description: ${post.description} | category: ${post.category} <button id="delete">Delete</button>`;
    parentElement.appendChild(childElement);
}