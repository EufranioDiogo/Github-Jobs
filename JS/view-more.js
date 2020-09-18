const generateDate = function(data) {
    data = data.split(' ')
    return `${data[1]} ${data[2]} ${data[0]} ${data[5]}`
}

let id = window.location.href.split('?')[1].split('=')[1]
let url = `https://cors-anywhere.herokuapp.com/https://jobs.github.com/positions/${id}.json`

console.log(id)
let xhttp = new XMLHttpRequest()

xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        console.log(xhttp.responseText)
        console.log('Passou')
        data = JSON.parse(xhttp.responseText)

        app.job = {
            id: data.id,
            company_logo: data.company_logo,
            company: data.company,
            title: data.title,
            type: data.type == 'Full Time' ? true:false,
            location: data.location,
            created_at: generateDate(data.created_at),
            description: data.description.replaceAll('\\n', '\n'),
            how_to_apply: data.how_to_apply.replaceAll('\\n', '\n'),
            company_url: data.company_url
        }
    }
}

xhttp.open("GET", url, true)
xhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
xhttp.send()

let app = new Vue({
    el: '#main-app',
    data: {
        job: {
            id: '',
            company_logo: '',
            company: 'Loading...',
            title: 'Loading...',
            type: 'Loading..',
            location: 'Loading...',
            created_at: 'Loading...',
            description: 'Loading...',
            how_to_apply: 'Loading...',
            company_url: 'Loading...',
        }
    }
})

document.getElementById('go-back').addEventListener('click', ()=>{
    window.history.back()
})