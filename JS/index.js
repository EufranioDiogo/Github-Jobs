function generalSearch(url, isCities = false, city, callback) {
    let xhttp = new XMLHttpRequest();

    if (!isCities) {
        xhttp.open("GET", url, true)
    } else {
        url += '&location=' + encodeURIComponent(city)
        xhttp.open("GET", url, true)
    }

    console.log(url, 'location')
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            data = JSON.parse(xhttp.responseText)

            callback(undefined, data)
        }
    }

    xhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhttp.send()
}

const generateDate = function(data) {
    data = data.split(' ')
    return `${data[1]} ${data[2]} ${data[0]} ${data[5]}`
}



function selectedPage() {
    items = document.querySelectorAll('.pages-list li');

    if (items.length) {
        for (let i = 0; i < items.length; i++) {
            items[i].classList.remove('active')
        }
        items[app.actualPage].classList.add('active')
    }
}

function getJobs() {
    if (app.description) {
        app.avaibleJobs = []
        let url = `https://cors-anywhere.herokuapp.com/https://jobs.github.com/positions.json?description=${app.description}`;
        let citiesToSearch = []

        if (app.fullTime == true) {
            url += '&full_time=true'
        }

        document.getElementsByName('city').forEach((element) => {
            if (element.checked) {
                citiesToSearch.push(element.value)
            }
        })
        if (app.cityToSearch) {
            citiesToSearch.push(app.cityToSearch)
        }

        if (citiesToSearch.length == 0) {
            generalSearch(url, false, undefined, (error, data) => {
                if (!error) {
                    for (let i = 0; i < data.length; i++) {
                        app.avaibleJobs.push({
                            id: data[i].id,
                            company_logo: data[i].company_logo,
                            company: data[i].company,
                            title: data[i].title,
                            type: data[i].type,
                            location: data[i].location,
                            created_at: generateDate(data[i].created_at)
                        });
                    }
                    app.setNumberOfPages()
                } else {
                    console.log('Error while fecth data')
                }
            })
        } else {
            for (let i = 0; i < citiesToSearch.length; i++) {
                generalSearch(url, true, citiesToSearch[i], (error, data) => {
                    if (!error) {
                        for (let i = 0; i < data.length; i++) {
                            app.avaibleJobs.push({
                                id: data[i].id,
                                company_logo: data[i].company_logo,
                                company: data[i].company,
                                title: data[i].title,
                                type: data[i].type,
                                location: data[i].location,
                                created_at: generateDate(data[i].created_at)
                            });
                        }
                        app.setNumberOfPages()
                    } else {
                        console.log('Error while fecth data')
                    }
                })
            }

        }
    } else {
        alert('Fill up the type main field: Title, companies, expertise or benefits')
    }
}

Vue.component('search-parameters', {
    props: {
        'citiestosearch': {
            type: Array,
            required: false,
        }
    },
    template: `
    <aside class="search-parameters">
        <p class="p-full-time"><input type="checkbox" name="full-time" id="full-time-work" @click="fullTime"><span>Only Full time</span></p>
        <div class="location">
          <h2>Location</h2>
          <div class="input-conteiner-location">
            <i class="fas fa-globe-africa"></i>
            <input type="text" placeholder="City, state zip code or country" @change="searchCity">
          </div>
          <div class="possible-cities-to-search">
            <p v-if="citiestosearch.length" v-for="city in citiestosearch"><input type="checkbox" :value="city" name="city" :id="city"><span>{{ city }}</span></p>
            <p v-else>There is no default cities to search</p>
          </div>
        </div>
      </aside>
    `,
    methods: {
        searchCity() {
            this.$emit('search-city', document.querySelector('.input-conteiner-location input').value.trim())
        },
        fullTime() {
            this.$emit('is-full-time-checked')
        }
    }

})

Vue.component('header-component', {
    template: `
    <div class="header-conteiner">
      <div class="input-conteiner">
        <i class="fas fa-briefcase"></i>
        <input type="text" placeholder="Title, companies, expertise or benefits" @change="updateDescription()">
        <button @click="searchForJobs">Search</button>
      </div>
    </div>
    `,
    data() {
        return {
            description: '',
        }
    },
    methods: {
        updateDescription() {
            this.description = document.querySelector('.input-conteiner input').value.trim();
            this.$emit(`new-description`, this.description)
        },
        searchForJobs() {
            this.$emit('search-for-jobs')
        },
    }
})

Vue.component('job-component', {
    props: {
        job: {
            type: Object,
            required: true,
        }
    },
    template: `
    <li class="job-result" @click="viewMore(job.id)">
        <img :src="job.company_logo" :alt="job.company" class="company-logo">
        <div class="job-brief-desc">
            <h3 class="company-name"> {{ job.company }}</h3>
            <h2 class="title">{{ job.title }}</h2>
            <div class="full-time-city-days">
            <p>{{ job.type }}</p>
            <div class="city-days">
                <p><i class="fas fa-globe-africa"></i>{{ job.location }}</p>
                <p><i class="far fa-clock"></i>{{ job.created_at }}</p>
            </div>
            </div>
        </div>
    </li>
    `,
    methods: {
        viewMore(id){
            this.$emit('view-more', id)
        }
    }
})

let app = new Vue({
    el: '#main-app',
    data: {
        description: '',
        citiesToSearch: ['london', 'amsterdam', 'new york', 'berlin'],
        cityToSearch: '',
        avaibleJobs: [],
        jobs: [],
        numbersOfPages: 0,
        actualPage: 0,
        fullTime: false,
    },
    methods: {
        newDescription(description) {
            app.description = description;
        },
        newCityToSearch(city) {
            app.cityToSearch = city;
        },
        searchForJobs() {
            getJobs()
        },
        setNumberOfPages() {
            app.numbersOfPages = app.avaibleJobs.length % 5 == 0 ? parseInt(app.avaibleJobs.length / 5) : parseInt(app.avaibleJobs.length / 5) + 1;

            app.actualPage = 0;
            app.selectPage(0)
        },
        selectPage(index) {
            app.actualPage = index;
            app.jobs = app.avaibleJobs.slice(app.actualPage * 5, app.actualPage * 5 + 5);
            selectedPage()
        },
        viewMore(id) {
            window.location.assign('HTML/view-more.html?id=' + id)
        },
        fullTimeSet() {
            app.fullTime = document.getElementsByName('full-time')[0].checked
        }
    },
})

app.description = "javascript"
getJobs()
app.setNumberOfPages()
app.description = ''