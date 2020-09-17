function getJobs() {
    if (app.description) {
        let url = `https://cors-anywhere.herokuapp.com/https://jobs.github.com/positions.json?description=${app.description}`;
        let citiesToSearch = []

        document.getElementsByName('city').forEach((element) => {
            if(element.checked){
                citiesToSearch.push(element.value)
            }
        })
        if(app.cityToSearch){
            citiesToSearch.push(app.cityToSearch)
        }

        app.avaibleJobs = []

        console.log('Entrou no getJobs')
        if(citiesToSearch.length == 0){
            console.log('Entrou para pegar os salos')
            fetch(url).then(response => response).then(data => {
                for(let i = 0; i < data.length; i++){
                    app.avaibleJobs.push(data[i]);
                }
                console.log(data)
                console.log(app.avaibleJobs)
                app.setNumberOfPages()
            })
        } else {
            citiesToSearch.forEach((element) => {
                element = element.replaceAll(',', '+')
    
                fetch(url + '&location=' + element).then(response => response).then(data => {
                    for(let i = 0; i < data.length; i++){
                        app.avaibleJobs.push(data[i]);
                    }
                    app.setNumberOfPages()
                })
            })
        }
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
        <p class="p-full-time"><input type="checkbox" name="full-time" id="full-time-work"><span>Full time</span></p>
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
    methods:{
        searchCity(){
            this.$emit('search-city', document.querySelector('.input-conteiner-location input').value.trim())
        }
    }

})

Vue.component('header-component', {
    template: `
    <div class="header-conteiner">
      <div class="input-conteiner">
        <i class="fas fa-briefcase"></i>
        <input type="text" placeholder="Title, companies, expertise or benefits" @change="updateDescription">
        <button @click="searchForJobs">Search</button>
      </div>
    </div>
    `,
    data() {
        return {
            description: ''
        }
    },
    methods: {
        updateDescription() {
            this.description = document.querySelector('.input-conteiner input').value.trim();
            this.$emit(`new-description`, this.description)
        },
        searchForJobs(){
            this.$emit('search-for-jobs')
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
    },
    methods: {
        newDescription(description) {
            app.description = description;
        },
        newCityToSearch(city){
            app.cityToSearch = city;
        },
        searchForJobs(){
            getJobs()
        },
        setNumberOfPages(){
            app.numbersOfPages = app.avaibleJobs.length % 5 == 0 ? parseInt(app.avaibleJobs.length / 5) : parseInt(app.avaibleJobs.length / 5) + 1;

            app.actualPage = 0;
            app.selectPage(0)
        },
        selectPage(index){
            app.actualPage = index;
            app.jobs = app.avaibleJobs.slice(app.actualPage * 5, app.actualPage * 5 + 5);
        }
    },
})

/*
app.description="developer"
getJobs()*/