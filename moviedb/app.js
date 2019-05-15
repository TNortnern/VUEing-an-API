
    $(document).ready(function () {
        var app = new Vue({
            el: "#app"
            , data: {
               // holds movies
                movies: [

                ]
                // cart items
                , items: [

                ],
                amountOf:0
            , }
            , 

            mounted(){
              this.movieCall();
            },
            methods: {
                 updateQuanity: function(item, l, type) {
                    let updater = document.querySelectorAll(".updater")[l];
                     let val = $(updater).val();
                     console.log(val)
                    if(type == "child"){
                this.items[l].childQuanity = val;
                    }else{
                        this.items[l].adultQuanity = val;
                    }
                },
            
                increase: function(item, l, type) {
                    if(type == "child"){
                this.items[l].childQuanity++;
                    }else{
                        this.items[l].adultQuanity++;
                    }
                },
               decrease: function(item, l, type) {
                    if(type == "child"){
                    this.items[l].childQuanity--;
                    }else{
                        this.items[l].adultQuanity--;
                    }
                   
                   if(this.items[l].adultQuanity == 0 && this.items[l].childQuanity == 0){
                       this.items.splice(l, 1);
                       this.amountOf--;
                   }
                },
                addNums:function(num1, num2){
                    return Number(num1 + num2).toFixed(2);
                },
                
                removeMovie: function (item) {
                   this.items.splice(item, 1);
                    this.amountOf--;
                }
                , calculateTotal: function (price, quanity) {
                    return (price * quanity).toFixed(2);
                }
                , movieCall: function () {
                    $.getJSON("https://api.themoviedb.org/3/movie/now_playing?api_key=9d9f46b8451885697e5cf7d1927da80f", function (movie) {
                        for (let i = 0; i < 12; i++) {
                            app.movies.push({
                                title: movie.results[i].title
                                , description: movie.results[i].overview
                                , image: "http://image.tmdb.org/t/p/w200/" + movie.results[i].poster_path
                                , adultTicket: parseFloat((movie.results[i].popularity / 10)).toFixed(2)
                                , childTicket: parseFloat(movie.results[i].popularity / 20).toFixed(2)
                                , adultQuanity: 0
                                , childQuanity: 0
                            });
                        }
                    })
                }
                , addTicket: function (index, movie, ticketType) {
                     $( "#cartButton" ).addClass('shaker');
                     setTimeout(function() {
                      $("#cartButton").removeClass('shaker')
                      }, 500);
                     
                    let x = 0;
                    let contains = false;
                    for (let i = 0; i < this.movies.length; i++) {
                        if (this.movies[i].title == movie) {
                            x = i;
                        }
                    }
        
                    if (this.items.length != 0) {
                        for (let z = 0; z < this.items.length; z++) {
                            if (this.items[z].title.includes(movie) == true) {
                                contains = true;
                            }
                        }
                    }
                    let movieIndex = (this.items.map((el) => el.title).indexOf(movie));
                    if (ticketType == "adult") {
                        if (contains != true) {
                            this.items.push({
                                title: this.movies[x].title
                                , adultQuanity: this.movies[x].adultQuanity += 1
                                , childQuanity: this.movies[x].childQuanity
                                , adultPrice: this.movies[x].adultTicket
                                , childPrice: this.movies[x].childTicket,
                                image: this.movies[x].image
                            });
                            this.amountOf++;
                            $("#cartMessage").slideDown("100").delay(800).slideUp("150");
                            $('#cartAmt').slideUp(300).delay(10).slideDown(300);
                        }
                        else {
                            this.items[movieIndex].adultQuanity++
                        }
                    }
                    else if (ticketType == "child") {
                        if (contains != true) {
                            this.items.push({
                                title: this.movies[x].title
                                , childQuanity: this.movies[x].childQuanity += 1
                                , adultQuanity: this.movies[x].adultQuanity
                                , adultPrice: this.movies[x].adultTicket
                                , childPrice: this.movies[x].childTicket,
                                image: this.movies[x].image
                            , });
                            this.amountOf++;
                            $("#cartMessage").slideDown("100").delay(800).slideUp("150");
                            $('#cartAmt').slideUp(300).delay(10).slideDown(300);
                        }
                        else {
                            this.items[movieIndex].childQuanity++
                        }
                    }
                    
                }
            }
            , computed: {
                totalItem: function () {
                    let sum = 0;
                    this.items.forEach(function (item) {
                        sum += Number(item.adultPrice * item.adultQuanity) + Number(item.childPrice * item.childQuanity);
                    });
                    return sum.toFixed(2);
                },
                
                
                childTotal: function () {
                    let sum = 0;
                    this.items.forEach(function (item) {
                        sum += Number(item.childPrice * item.childQuanity);
                    });
                    return sum.toFixed(2);
                },
                adultTotal: function () {
                    let sum = 0;
                    this.items.forEach(function (item) {
                        sum += Number(item.adultPrice * item.adultQuanity);
                    });
                    return sum.toFixed(2);
                }
            }
        })
    })
