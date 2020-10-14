Vue.component('v-select', VueSelect.VueSelect);

new Vue({
    el: '#app',
    data() {
        return{
            options: [],
            room: [],
            selectedRoom: "",
            hotelsList: [],
            namesOfHotels: [],
            namesOfCountries: [],
            descriptions: [],
            countries: [],
            selectCountry: '',
            numberOfStars: [],
            numberOfReviews: 0,
            prices: [],
            rangeValue: 0,
            filteredHotels: [],
            noHotels: "Записей не найдено",
            areThereHotels: true,
            onlyThreeItems: [],
        }

    },
    mounted() {
        fetch('./hotels/hotels.json')
            .then(response => response.json())
            .then((response)=>{

                var hotels = response.hotels;
                var prices = [];
                this.hotelsList = hotels;
                this.filteredHotels = hotels;
                this.onlyThreeItems = this.filteredHotels.slice(0, 3);
                var countryList = [];
                for(var i = 0; i < hotels.length; i++){
                    if(!this.room.includes(hotels[i].type)){
                        this.room.push(hotels[i].type);
                    }
                    if(!this.options.includes(hotels[i].country)){
                        this.options.push(hotels[i].country);
                    }
                    if(!this.countries.includes(hotels[i].country)){
                        this.countries.push(hotels[i].country);
                    }
                    if(!prices.includes(hotels[i].min_price)){
                        prices.push(hotels[i].min_price);
                    }
                }
                prices.sort();
                if(!this.prices.includes(prices[0]) && !this.prices.includes(prices[prices.length - 1])) {
                    this.prices.push(prices[0]);
                    this.prices.push(prices[prices.length - 1]);
                    this.rangeValue = this.prices[0];
                }
            }).catch(error => console.log("Error while getting base" + error));


    },
    methods:{
        filterByCountries: function() {
            var filtered = [];
            for(var i = 0; i < this.hotelsList.length; i++){
                if(this.hotelsList[i].country.includes(this.selectCountry)){
                    filtered.push(this.hotelsList[i]);
                }
            }
            return (filtered.length) ? filtered : this.hotelsList;
        },
        filterByRooms: function() {
            var filtered = [];
            for(var i = 0; i < this.hotelsList.length; i++){
                if(this.hotelsList[i].type.includes(this.selectedRoom)){
                    filtered.push(this.hotelsList[i]);
                }
            }
            return (filtered.length) ? filtered : this.hotelsList;
        },
        filterByStars: function() {
            var filtered = [];
            var stars = this.numberOfStars.sort();
            for(var i = 0; i < this.hotelsList.length; i++){
                for(var j = 0; j < stars.length; j++){
                    if(this.hotelsList[i].stars === Number(stars[j])){
                        filtered.push(this.hotelsList[i]);
                    }
                }
            }
            return (stars.length) ? filtered : this.hotelsList;
        },
        filterByPrice: function() {
            var filtered = [];
            var price = this.rangeValue;
            for(var i = 0; i < this.hotelsList.length; i++){
                if(this.hotelsList[i].min_price < price){
                    filtered.push(this.hotelsList[i]);
                }
            }
            return (filtered.length) ? filtered : this.hotelsList;
        },
        filterByReviewNumber: function() {
            var filtered = [];
            var reviewNumber = this.numberOfReviews;
            for(var i = 0; i < this.hotelsList.length; i++){
                if(this.hotelsList[i].reviews_amount >= reviewNumber){
                    filtered.push(this.hotelsList[i]);
                }
            }
            return (filtered.length) ? filtered : this.hotelsList;
        },
        totalFilter: function(){
            this.areThereHotels = true;
            var filteredByCountries = this.filterByCountries();
            var filteredByRooms = this.filterByRooms();
            var filteredByStars = this.filterByStars();
            var filteredByReviewNumber = this.filterByReviewNumber();
            var filteredByPrice = this.filterByPrice();
            var arrayOfFilteredResults = [filteredByCountries, filteredByRooms, filteredByStars, filteredByReviewNumber, filteredByPrice];
            var result = [];
            checkResultInAllFilters: for(var i = 0; i < this.hotelsList.length; i++){
                for(var j = 0; j < arrayOfFilteredResults.length; j++){
                    if(!arrayOfFilteredResults[j].includes(this.hotelsList[i])){
                        continue checkResultInAllFilters;
                    }
                }
                if(!result.includes(this.hotelsList[i])){
                    result.push(this.hotelsList[i]);
                }

            }
            this.filteredHotels = [];
            result.length ? this.filteredHotels = result : this.areThereHotels = false;
            this.firstPage();
        },
        firstPage: function(){
            this.onlyThreeItems = this.filteredHotels.slice(0, 3);
        },
        nextPage: function(){
            this.onlyThreeItems = this.filteredHotels.slice(3, 6);
        },
        clearAll:  function(){
            this.selectedRoom = "";
            this.selectCountry = '';
            this.numberOfStars = [];
            this.numberOfReviews = 0;
            this.rangeValue = this.prices[0];
            this.filteredHotels = this.hotelsList;
            this.areThereHotels = true;
            this.firstPage();
        }
    }
}).$mount('#app');