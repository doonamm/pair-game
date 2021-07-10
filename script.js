//currentTarget la element ma event listener dinh kem theo
//target la element kich hoat su kien tu user (khong phu thuoc nhu currentTarget)
var card_list = document.getElementsByClassName('card-list')[0];
var time = document.querySelector('.count-down');
var level = 10;
var card_amount = 4;
var random_index_list = [];
var last_item = undefined;
var stop_flip = false;
var is_start = false;
var is_stop = true;
var count_down = 10;
var count_loop;
var correct_couple = 0;
//main

updateViewCount();

document.querySelector('body').addEventListener("click", clickEvent);
window.addEventListener("load", ()=>{
    resetGame();
});

//function
function clickEvent(e = window.event){
    e.preventDefault();
    e.stopPropagation();
    //event title click
    if(is_stop && e.target.classList.contains('container')){
        startGame();
        is_stop = false;
        return;
    }
    if(e.target.classList.contains('title')){
        e.target.classList.toggle('shake');
        return;
    }
    if(stop_flip===true)
        return;
    if(e.target.classList.contains('card')){
        //start count down
        if(is_start === false){
            is_start = true;
            time.innerHTML = count_down;
            count_loop = setInterval(()=>{
                count_down--;
                if (count_down === 5){
                    time.classList.toggle('shake');
                }
                if(count_down <= 0){
                    endGame();
                    resetGame();
                }
                else
                    time.innerHTML = count_down;
            }, 1000);
        }
        //event flip
        e.target.classList.toggle('flip');;
        if(last_item === undefined){
            last_item = e.target;
            stop_flip = false;
        } 
        else {
            stop_flip = true;
            //trung element
            if(last_item === e.target){
                last_item = undefined;
                stop_flip = false;
            }
            //khop hinh
            else if(last_item.getAttribute('data') === e.target.getAttribute('data')){
                correct_couple++;
                setTimeout(()=>{
                    last_item.firstChild.style.filter = "brightness(40%)";
                    e.target.firstChild.style.filter = "brightness(40%)";
                    last_item.style.pointerEvents = "none";
                    e.target.style.pointerEvents = "none";
                    last_item = undefined;
                    stop_flip = false;
                    if(correct_couple * 2 === card_amount){
                        time.innerHTML = "Finished!"
                        resetGame();
                        level++;
                        if(level > 10)
                            level = 1;
                    }
                }, 250);
            }
            //sai hinh
            else {
                setTimeout(()=>{
                    last_item.classList.toggle('flip');
                    e.target.classList.toggle('flip');
                    last_item = undefined;
                    stop_flip = false;
                }, 500);
            }   
        }
    }
}
function endGame(){
    time.classList.toggle('shake');
    time.innerHTML = "Game Over!"
    card_list.style.pointerEvents = "none";
    level = 1;
    setTimeout(()=>{
        const cards = [...document.getElementsByClassName('card')];
        cards.filter(item => !item.classList.contains('flip')).forEach(item => item.classList.toggle('flip'));
    }, 400);
}
function resetGame(){
    clearInterval(count_loop);
    is_start = false;
    count_down = 30;    
    card_amount = 4;
    correct_couple = 0;
    stop_flip = false;
    last_item = undefined;
    is_start = false;
    is_stop = true;
    time.classList.toggle('shake', false);
    card_list.style.pointerEvents = "none";
}
function startGame(){
    initRandomIndex();
    updateWidth();
    document.getElementById('level-value').innerHTML = level;
    card_list.textContent = '';
    count_down = level * 8;
    time.innerHTML = count_down;
    for(let i = 0; i < card_amount; i++){
        initCard();
    }
    review();
    setTimeout(()=>{
        let cards = document.getElementsByClassName('card');
        for(let card of cards){
            card.classList.toggle('flip');
        }
        card_list.style.pointerEvents = "all";
    }, level * 1000);
}
function review(){
    let review_time = level * 1;
    time.style.color = '#0f0';
    time.innerHTML = review_time;
    let review_time_loop = setInterval(()=>{
        review_time--;
        if(review_time > 0)
            time.innerHTML = review_time;
        else{
            time.innerHTML = level*8 + "s to play";
            time.style.color = '#ff0';
            clearInterval(review_time_loop);
        }
    }, 1000);
}
function initRandomIndex(){
    // image co chi so tu 1 -> 50
    let image_index_list = [];
    random_index_list.length = 0;
    card_amount = level * 4;
    for(let i = 1; i <= 50; i++){
        image_index_list.push(i);
    }
    const image_amount = card_amount / 2;
    let index;
    for(let i = 0; i < image_amount; i++){
        index = randomNumber(0, image_index_list.length - 1);
        random_index_list.push(image_index_list[index]);
        image_index_list.splice(index, 1);
    }
    //duplicate
    for(let i = 0; i < image_amount; i++){
        random_index_list.push(random_index_list[i]);
    }
}
function initCard(){
    if(random_index_list.length < 0)
        return;
    let img_tag = document.createElement('img');
    let div_tag = document.createElement('div');
    let li_tag = document.createElement('li');

    const random_index = randomNumber(0, random_index_list.length - 1);
    img_tag.src = `images/art (${random_index_list[random_index]}).png`;

    div_tag.appendChild(img_tag);
    div_tag.classList.add('card', 'flip');
    div_tag.setAttribute('data', random_index_list[random_index]);
    li_tag.appendChild(div_tag);
    li_tag.classList.add('scene');

    //add to list
    card_list.appendChild(li_tag);
    // setTimeout(()=>div_tag.classList.toggle('flip'), 3000);

    //clear index from list
    random_index_list.splice(random_index, 1);
}
function updateWidth(){
    let card = document.querySelector('.scene');
    let per_card_width = parseInt(window.getComputedStyle(card).margin)*2 + card.offsetWidth;
    if(card.offsetWidth < 90){
        switch(level){
            case 1:
                per_card_width = per_card_width * 2;
                break;
            case 2:
            case 3:
            case 4:
                per_card_width = per_card_width * 4;
                break;
            case 5:
                per_card_width = per_card_width * 5;
                break;
            case 6:
                per_card_width = per_card_width * 6;
                break;
            case 7:
                per_card_width = per_card_width * 7;
                break;
            case 8:
            case 9:
            case 10:
                per_card_width = per_card_width * 8;
                break;
        }
    }
    else{
        switch(level){
            case 1:
                per_card_width = per_card_width * 2;
                break;
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                per_card_width = per_card_width * 4;
                break;
            case 8:
                per_card_width = per_card_width * 4;
                break;
            case 9:
                per_card_width = per_card_width * 6;
                break;
            case 10:
                per_card_width = per_card_width * 5;
                break;
        }
    }
    per_card_width += 10;
    card_list.style.width = per_card_width +'px';
}
function randomNumber(min, max){
    return Math.round(Math.random()*(max - min) + min);
}
function updateViewCount(){
    fetch('https://api.countapi.xyz/update/doonamm/pairgame/?amount=1')
	.then(res => res.json())
	.then(res => {
		console.log(res.value);
	});
}
