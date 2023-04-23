fetch('http://localhost:3000/quotes?_embed=likes')
    .then(resp => resp.json())
    .then(data => displayQuotes(data));
function displayQuotes(quoteList) {
    for(const eachQuote of quoteList) {
        const ul = document.querySelector('#quote-list');
        createOneCard(eachQuote, ul);
    }
}
const form = document.querySelector('#new-quote-form');
form.addEventListener('submit', createNewQuote);
function createNewQuote(e) {
    e.preventDefault();
    fetch('http://localhost:3000/quotes?_embed=likes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            'quote': e.target.quote.value,
            'author': e.target.author.value,
            'likes': []
        })
    })
        .then(resp => resp.json())
        .then((data) => {
            const ul = e.target.parentNode.parentNode.querySelector('ul');
            createOneCard(data, ul);
            form.reset();            
        });
}
function createOneCard(dataBlock, parent) {
    const ul = parent;
    const li = document.createElement('li');
    const bq = document.createElement('blockquote');
    const p = document.createElement('p');
    const f = document.createElement('footer');
    const br = document.createElement('br');
    const btn1 = document.createElement('button');
    const span = document.createElement('span');
    const btn2 = document.createElement('button');
    const btn3 = document.createElement('button');
    li.classList.add('quote-card', `${dataBlock.id}`);
    bq.className = 'blockquote';
    p.className = 'mb=0';
    p.textContent = dataBlock.quote;
    f.className = 'blockquote-footer';
    f.textContent = dataBlock.author;
    btn1.className = 'btn-success';
    span.textContent = `${dataBlock.likes.length}`;
    btn1.textContent = 'Likes: ';
    btn2.className = 'btn-danger';
    btn2.textContent = 'Delete';
    btn2.id = dataBlock.id;
    btn3.className = 'btn-light';
    btn3.textContent = 'Edit';
    btn1.appendChild(span);
    bq.appendChild(p);
    bq.appendChild(f);
    bq.appendChild(br);
    bq.appendChild(btn1);
    bq.appendChild(btn2);
    bq.appendChild(btn3);
    li.appendChild(bq);
    ul.appendChild(li);
    btn1.addEventListener('click', likeQuote);
    btn2.addEventListener('click', deleteQuote);
    btn3.addEventListener('click', openQuoteFormEditor);
}
function deleteQuote(e) {
    fetch(`http://localhost:3000/quotes/${e.target.id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then(resp => resp.json())
        .then(data => {
            document.getElementsByClassName(`${e.target.id}`)[0].remove();
        });
}
function likeQuote(e) {
    let date = Math.floor(Date.now()/1000);
    fetch(`http://localhost:3000/likes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            'quoteId': Number(e.target.nextSibling.id),
            'createdAt': date
        })
    })
        .then(resp => resp.json())
        .then(() => {
            document.getElementById(`${e.target.nextSibling.id}`).parentNode.querySelector('span').textContent = `${parseInt(e.target.querySelector('span').textContent) + 1}`;
        });
}
let editForm = null;
function openQuoteFormEditor(e) {
    const card = document.getElementsByClassName(`${e.target.previousSibling.id}`)[0].firstChild;
    editForm = document.createElement('form');
    editForm.innerHTML = `
    <div class="form-group">
        <label for="new-quote">Edit Quote</label>
        <input name="quote" type="text" class="form-control" id="edit-quote" placeholder="${e.target.parentNode.getElementsByClassName('mb=0')[0].textContent}">
    </div>
    <div class="form-group">
        <label for="Author">Edit Author</label>
        <input name="author" type="text" class="form-control" id="edit-author" placeholder="${e.target.parentNode.getElementsByClassName('blockquote-footer')[0].textContent}">
    </div>
    <button type="submit" class="btn btn-primary">Submit</button>`;
    card.appendChild(editForm);
    editForm.addEventListener('submit', editQuote)
}
function editQuote(e) {
    e.preventDefault();
    fetch(`http://localhost:3000/quotes/${e.target.parentNode.querySelectorAll('button')[1].id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            'quote': editForm.quote.value,
            'author': editForm.author.value
        })
    })
        .then(resp => resp.json())
        .then(() => {
            e.target.parentNode.querySelector('p').textContent = editForm.quote.value;
            e.target.parentNode.querySelector('footer').textContent = editForm.author.value;
            editForm.remove();
        });
}
const toggle = document.querySelector('#toggle');
toggle.addEventListener('click', sortQuotes)
function sortQuotes(e) {
    if (toggle.checked == true) {
        document.querySelector('#quote-list').innerHTML = '';
        fetch('http://localhost:3000/quotes?_sort=author&_embed=likes')
            .then(resp => resp.json())
            .then(data => displayQuotes(data));
    } else {
        document.querySelector('#quote-list').innerHTML = '';
        fetch('http://localhost:3000/quotes?_embed=likes')
            .then(resp => resp.json())
            .then(data => displayQuotes(data));
    }
    
}
